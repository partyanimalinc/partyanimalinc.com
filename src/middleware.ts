import { NextResponse, type NextRequest } from "next/server";
import { slugify } from "@/lib/slug";
import legacyCats from "@/lib/legacy-product-categories.json";

// Legacy NetSuite URL routing. Lives in middleware (not next.config
// `redirects()`) because config sources match case-INSENSITIVELY and would
// swallow the new lowercase pages; middleware sees exact case and acts only on
// the capital-letter legacy namespaces.
//
// Products:
//   /Products/{Name}.html         -> /products/{slug}   (deterministic: web_slug
//        was built from this exact filename, so no lookup table needed)
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

// Exact legacy paths whose new target is a lowercase page a case-INSENSITIVE
// config redirect would shadow (e.g. `/Become-A-Reseller` -> `/become-a-reseller`
// would also catch the real page and loop). Handled here, case-sensitively.
const EXACT: Record<string, string> = {
  "/Become-A-Reseller": "/become-a-reseller",
  "/Become-A-Reseller.html": "/become-a-reseller",
  "/Reseller-Specials": "/become-a-reseller",
};

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  const url = req.nextUrl.clone();

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
    "/Products",
    "/Products/:path*",
    "/Licenses",
    "/Licenses/:path*",
    "/Become-A-Reseller",
    "/Become-A-Reseller.html",
    "/Reseller-Specials",
  ],
};
