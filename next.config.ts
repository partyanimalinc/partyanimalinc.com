import type { NextConfig } from "next";
import { legacyRedirects } from "./src/lib/redirects";

const nextConfig: NextConfig = {
  images: {
    // Cache optimized images at the edge for 30 days. PIM art is versioned by
    // URL (new uploads get a new path), so a long TTL is safe and keeps LCP fast
    // / origin load low in production.
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: "https", hostname: "prgnshkxyyxygdpowdnu.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  // Legacy NetSuite store -> new-site 301s. See src/lib/redirects.ts.
  async redirects() {
    return legacyRedirects;
  },
  // Keep pre-launch preview hosts (*.vercel.app) out of the search index. The
  // real partyanimalinc.com host doesn't match, so it indexes normally at cutover.
  async headers() {
    // Long-cache the static art in /public so browsers + Cloudflare cache it
    // instead of re-fetching every hit (Vercel defaults /public to max-age=0).
    // These aren't content-hashed, so purge the Cloudflare cache when art changes.
    const STATIC_CACHE = "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800";
    const ART_DIRS = ["hero", "headers", "lineup", "advent", "brand", "partners", "retailers", "footer"];
    return [
      ...ART_DIRS.map((dir) => ({
        source: `/${dir}/:path*`,
        headers: [{ key: "Cache-Control", value: STATIC_CACHE }],
      })),
      {
        source: "/:path*",
        has: [{ type: "host", value: "(.*\\.vercel\\.app)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
