import Script from "next/script";

// Umami privacy-friendly analytics (self-hosted, same instance as
// partyanimaltoys.com — just a different website UUID). Renders only when
// configured, so preview hosts stay clean (leave the env vars unset there).
//   NEXT_PUBLIC_UMAMI_HOST         e.g. https://umami.partyanimaltoys.com
//   NEXT_PUBLIC_UMAMI_WEBSITE_ID   the partyanimalinc.com website UUID
export function UmamiAnalytics() {
  const host = process.env.NEXT_PUBLIC_UMAMI_HOST;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!host || !websiteId) return null;
  return (
    <Script
      src={`${host}/script.js`}
      data-website-id={websiteId}
      strategy="afterInteractive"
      defer
    />
  );
}
