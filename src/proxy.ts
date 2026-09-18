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

export function proxy(req: NextRequest) {
  const p = req.nextUrl.pathname;
  const url = req.nextUrl.clone();

  // Retired product slug -> current URL. Checked first and case-sensitively:
  // slugs are lowercase by construction, so a non-matching case is not ours.
  if (p.startsWith("/products/")) {
    const slug = p.slice("/products/".length).replace(/\/+$/, "");
    const moved = slug && SLUG_REDIRECTS[slug];
    if (moved) {
      url.pathname = `/products/${moved}`;
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.next();
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/products/:path*",
    "/Products",
    "/Products/:path*",
    "/Licenses",
    "/Licenses/:path*",
    "/Become-A-Reseller",
    "/Become-A-Reseller.html",
    "/Reseller-Specials",
  ],
};
