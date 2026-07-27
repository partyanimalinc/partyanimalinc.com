import structural from "./redirects.data.json";

// Legacy NetSuite SuiteCommerce -> new-site redirect map.
//
// Built from a full crawl of the old www.partyanimalinc.com store (9,209 live
// public URLs). The complete, resolved source of truth lives in
// /migration/old-url-redirects.csv (every old URL -> type, SKU, proposed target).
//
// What's wired up:
//   - This file: corp / exact legacy redirects (e.g. /Shop -> /products).
//   - src/proxy.ts: ALL `/Products/*` and `/Licenses/*` routing, including
//     per-product `/Products/{Name}.html` -> `/products/{slug}`.
//
// Two reasons `/Products/*` and `/Licenses/*` are NOT in this config:
//   1. Config sources match case-INSENSITIVELY, so `/Products/Big-Shot-Ballers`
//      would also swallow the real lowercase `/products/big-shot-ballers` page.
//   2. Next normalizes an incoming `/Shop/` to `/Shop` BEFORE matching
//      redirects, so any source that still ends in `/` never matches. So we
//      strip trailing slashes from the sources we keep (all 173 were 404ing).

export type LegacyRedirect = { source: string; destination: string; permanent: boolean };

export const legacyRedirects: LegacyRedirect[] = (structural as LegacyRedirect[])
  // `/Products/*`, `/Licenses/*`, and the reseller paths are handled in
  // src/proxy.ts (case-sensitive) so they don't shadow the new lowercase
  // pages under case-insensitive config matching.
  .filter(
    (r) =>
      !/^\/(Products|Licenses)(\/|$)/i.test(r.source) &&
      !/^\/(Become-A-Reseller|Reseller-Specials)/i.test(r.source),
  )
  .map((r) => ({
    ...r,
    source: r.source.length > 1 ? r.source.replace(/\/+$/, "") : r.source,
  }));
