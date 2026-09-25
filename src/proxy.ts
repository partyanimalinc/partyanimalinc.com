import { NextResponse, type NextRequest } from "next/server";
import { slugify } from "@/lib/slug";
import legacyCats from "@/lib/legacy-product-categories.json";
import slugRedirects from "@/lib/product-slug-redirects.json";

// Legacy NetSuite URL routing. Lives in proxy (not next.config
// `redirects()`) because config sources match case-INSENSITIVELY and would
// swallow the new lowercase pages; proxy sees exact case and acts only on
// the capital-letter legacy namespaces.
//
// Products:
//   /Products/{Name}.html         -> /products/{slug}   (slugify the filename;
//        no lookup table needed here)
//
//        NOTE: web_slug USED to be built from this exact filename, which is
//        what made the mapping 1:1. That is no longer true — slugs derived
//        from the legacy NetSuite URL were wrong whenever a NetSuite item was
//        created by copying an older one, and ~1,570 have been rebuilt from
//        the product's own name. The old value is kept in apphub's
//        product_slug_history, and /products/[slug] 308s a retired slug to the
//        current one, so this rule still lands correctly — it just takes two
//        hops now (here, then the page). Do not "optimise" it into a single
//        hop by reintroducing a filename->slug assumption.
//   /Products/{Category}/         -> /products/{slug}   when that category still
//        exists, else a curated fallback for merged/discontinued categories
//        (legacy-product-categories.json)
//   /Products  or  /Products/     -> /products
//
// Licenses:
//   /Licenses  or  /Licenses/     -> /licenses
//   /Licenses/{Team-Or-League}/   -> /licenses/{slug}   (landing)
//   /Licenses/{Team}/{item}.html  -> /licenses/{slug}   (team page; the canonical
//        per-product equity is preserved by the /Products/*.html rule above)
const CURATED: Record<string, string> = legacyCats as Record<string, string>;

// Retired product slug -> current one. Product URLs get rebuilt when the
// original slug was inherited from a different product (apphub keeps every
// retired value in product_slug_history). Handled HERE, not in the page,
// because permanentRedirect() inside a streaming page emits a client-side
// redirect with NO Location header — fine for a browser, useless to a crawler,
// which is exactly the equity these redirects exist to preserve.
//
// Snapshotted at build time (node scripts/build-slug-redirects.mjs) so the
// lookup is an O(1) map at the edge with no per-request fetch. Re-run that
// script after any slug change; the page keeps a movedTo fallback for renames
// made since the last build.
const SLUG_REDIRECTS: Record<string, string> = slugRedirects as Record<string, string>;

// Exact legacy paths whose new target is a lowercase page a case-INSENSITIVE
// config redirect would shadow (e.g. `/Become-A-Reseller` -> `/become-a-reseller`
// would also catch the real page and loop). Handled here, case-sensitively.
const EXACT: Record<string, string> = {
  "/Become-A-Reseller": "/become-a-reseller",
  "/Become-A-Reseller.html": "/become-a-reseller",
  "/Reseller-Specials": "/become-a-reseller",
};

// Query params the listing pages read (catalog-url.ts, license-url.ts). A
// listing URL that carries any of these is a filtered / sorted / paged view.
const FACET_PARAMS = new Set([
  "collection", "league", "team", "q", "series", "line", "edition", "sort", "page",
]);

// Query params a page on this site actually reads, plus the tracking params
// analytics needs to see on arrival. Anything else is stripped with a 308.
//
// Why: legacy NetSuite links still in the index and in scraper lists carry
// SuiteCommerce session params (vid, ck, cktime, sj, chrole, promocode, gc,
// nxtPslug …), so every visit was a never-before-seen URL and a cache miss.
// Folding them onto the canonical URL makes one URL per page again.
const KNOWN_PARAMS = new Set([
  ...FACET_PARAMS,
  // Next.js RSC fetches
  "_rsc",
  // attribution — read client-side by Umami on first paint
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "gclid", "fbclid", "msclkid", "ttclid", "ref",
]);

// The listing routes. Their clean URL is an ISR page that never reads the
// query; when the query still carries a FACET_PARAM after the scrub, the
// request is rewritten to the on-demand twin at /_f<path>. Attribution params
// and `_rsc` alone do not trigger the rewrite, so those requests hit the
// cached page (an `_rsc`-only URL is a client navigation to the base page).
//
// The twins live in src/app/%5Ff/** — an `_f` folder would be a Next PRIVATE
// folder (excluded from routing); `%5F` is the URL-encoded underscore, which
// is Next's documented way to get a URL segment that starts with one. Each
// twin renders the SAME shared component as its public route, reads
// searchParams, exports dynamic = "force-dynamic", and emits noindex,follow
// with a canonical back to the clean URL. A direct hit on /_f/... is 308'd to
// the public path below, so the twin is never a public address. Never link to
// /_f/... : facet links stay /licenses/nfl?collection=toys.
const LISTING_ROUTE =
  /^\/(?:licenses\/[^/]+|teenymates\/[^/]+|squeezymates\/[^/]+|jumbo-squeezy\/all|team-gear\/all|products\/all)$/;
const TWIN_PREFIX = "/_f";
// A direct request may arrive with the underscore still percent-encoded.
const TWIN_PATH = /^\/(?:_|%5[Ff])f(?=\/|$)/;

// Mutates url.searchParams; returns true when something was removed.
function stripUnknownParams(url: URL): boolean {
  let changed = false;
  for (const key of Array.from(url.searchParams.keys())) {
    if (!KNOWN_PARAMS.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  return changed;
}

function hasFacetParams(url: URL): boolean {
  for (const key of url.searchParams.keys()) {
    if (FACET_PARAMS.has(key)) return true;
  }
  return false;
}

function listingResponse(req: NextRequest, url: URL, pathname: string) {
  if (LISTING_ROUTE.test(pathname) && hasFacetParams(url)) {
    return NextResponse.rewrite(new URL(`${TWIN_PREFIX}${pathname}${url.search}`, req.url));
  }
  return NextResponse.next();
}

export function proxy(req: NextRequest) {
  const p = req.nextUrl.pathname;
  const url = req.nextUrl.clone();

  // The twin is never a public address: a direct hit goes back to the public
  // path (query intact, so a filtered view still renders there via the rewrite).
  if (TWIN_PATH.test(p)) {
    url.pathname = p.replace(TWIN_PATH, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  // Scrub first so a legacy path with legacy params fixes both in one hop.
  const scrubbed = stripUnknownParams(url);

  // Retired product slug -> current URL. Checked first and case-sensitively:
  // slugs are lowercase by construction, so a non-matching case is not ours.
  if (p.startsWith("/products/")) {
    const slug = p.slice("/products/".length).replace(/\/+$/, "");
    const moved = slug && SLUG_REDIRECTS[slug];
    if (moved) {
      url.pathname = `/products/${moved}`;
      return NextResponse.redirect(url, 308);
    }
    if (scrubbed) return NextResponse.redirect(url, 308);
    return listingResponse(req, url, p);
  }

  if (EXACT[p]) {
    url.pathname = EXACT[p];
    return NextResponse.redirect(url, 308);
  }

  if (p === "/Products" || p.startsWith("/Products/")) {
    if (/\.html?$/i.test(p)) {
      const base = p.replace(/\.html?$/i, "").split("/").filter(Boolean).pop() || "";
      url.pathname = `/products/${slugify(base)}`;
    } else {
      const rest = p.slice("/Products".length).replace(/^\/+|\/+$/g, "");
      const seg = rest ? rest.split("/")[0] : "";
      if (!seg) url.pathname = "/products";
      else {
        const slug = slugify(seg);
        url.pathname = CURATED[slug] ?? `/products/${slug}`;
      }
    }
    return NextResponse.redirect(url, 308);
  }

  if (p === "/Licenses" || p.startsWith("/Licenses/")) {
    const rest = p.slice("/Licenses".length).replace(/^\/+|\/+$/g, "");
    const segs = rest ? rest.split("/") : [];
    url.pathname = segs.length === 0 ? "/licenses" : `/licenses/${slugify(segs[0])}`;
    return NextResponse.redirect(url, 308);
  }

  if (scrubbed) return NextResponse.redirect(url, 308);
  return listingResponse(req, url, p);
}

export const config = {
  matcher: [
    "/products/:path*",
    // Listing routes: scrub unknown query params (KNOWN_PARAMS) and rewrite
    // filtered views to the /_f twin (LISTING_ROUTE).
    "/licenses/:path*",
    "/teenymates/:path*",
    "/squeezymates/:path*",
    "/jumbo-squeezy/all",
    "/team-gear/all",
    // The twin itself: never served directly.
    "/_f",
    "/_f/:path*",
    "/%5Ff",
    "/%5Ff/:path*",
    "/Products",
    "/Products/:path*",
    "/Licenses",
    "/Licenses/:path*",
    "/Become-A-Reseller",
    "/Become-A-Reseller.html",
    "/Reseller-Specials",
  ],
};
