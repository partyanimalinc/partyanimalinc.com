import type { NextConfig } from "next";
import { legacyRedirects } from "./src/lib/redirects";

const nextConfig: NextConfig = {
  images: {
    // Next 16 defaults optimized-image cache TTL to 4 hours, which makes a
    // swapped-in-place asset (same path) look stale for hours. Keep it short
    // so updated art shows on the next refresh. Raise before production launch.
    minimumCacheTTL: 0,
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
