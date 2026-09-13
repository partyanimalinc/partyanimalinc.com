import type { MetadataRoute } from "next";

const SITE_URL = "https://www.partyanimalinc.com";

// Bots we don't want crawling at all: AI-training / bulk-scraper agents that add
// crawl cost without driving customer discovery. Remove one to let it back in.
const BLOCKED_BOTS = [
  "GPTBot",
  "ClaudeBot",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "PerplexityBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Do NOT crawl the faceted catalog: /products/all and the /*/all pages
        // filter through 9 stackable query params (league, team, series, sort,
        // page, ...), an effectively unlimited URL space. Letting bots walk it
        // rendered every combination on the server (function + CPU + origin
        // fetch + ISR write) and drove a large Vercel cost spike. Blocking any
        // URL with a query string, plus internal APIs, keeps crawlers on the
        // canonical pages (product detail, category roots) we actually want indexed.
        disallow: ["/*?", "/api/"],
      },
      // Full block for the scraper / AI-training agents above.
      { userAgent: BLOCKED_BOTS, disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
