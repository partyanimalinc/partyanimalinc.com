import type { MetadataRoute } from "next";

const SITE_URL = "https://www.partyanimalinc.com";

// Query params that fan out into the faceted catalog. Every listing route
// renders on demand per unique URL, so a crawler walking facet permutations is
// a function invocation per combination. Well-behaved crawlers (Google, Bing,
// the verified AI crawlers) honour these rules; the ones that do not are
// handled at Cloudflare (Bot Fight Mode + a rate limit on the listing routes)
// and in proxy.ts (unknown params are stripped with a 308).
//
// Deliberately NOT listed: `page`. Pagination stays crawlable so the catalog is
// reachable past the first 48 items; paged URLs carry noindex,follow and a
// canonical to page one.
//
// History: this file used to be `Disallow: /*?`, added 2026-09-13 as a cost
// fix. That also blocked /_next/image (every product photo, for Google Images),
// the SearchAction target, and every noindex directive on filtered URLs, and it
// did not reduce cost, because the expensive traffic ignores robots.txt.
const FACET_PARAMS = ["collection", "league", "team", "q", "series", "line", "edition", "sort"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          // Longer than any disallow below, so it wins the longest-match rule
          // even though optimised image URLs carry `&q=75`.
          "/_next/image?url=",
        ],
        disallow: [
          "/api/",
          ...FACET_PARAMS.map((p) => `/*?*${p}=`),
          // React Server Component payloads (client-side navigation fetches).
          "/*?*_rsc=",
        ],
      },
      // Bytespider (ByteDance) ignores crawl-delay, fetches at very high rates,
      // and drives no discovery we care about. Verified AI crawlers (GPTBot,
      // ClaudeBot, PerplexityBot, Amazonbot, CCBot) are allowed on purpose:
      // being cited by assistants is part of the SEO plan.
      { userAgent: "Bytespider", disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
