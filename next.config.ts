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
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "(.*\\.vercel\\.app)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
