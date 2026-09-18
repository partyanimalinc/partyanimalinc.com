// Dick's Sporting Goods link attribution.
//
// Dick's has no affiliate/attribution programme wired up for us, so the only
// measurement available is the UTM string they pass through to their own
// analytics and share back in vendor reporting. Standard Google-style UTMs are
// what their merchandising team asks brands for.
//
// Applied at RENDER time, never stored on the product: campaign and placement
// change far more often than the product URL does, and baking them into the
// PIM would mean a data migration every time marketing wants a new campaign.
//
// Non-Dick's URLs pass through untouched, so it is safe to wrap every retailer
// link with this (same contract as amazonAttributed).
const DSG_HOST = /(?:^|\.)dickssportinggoods\.com$/i;

export type DsgAttribution = {
  /** Campaign bucket, e.g. "advent-2026". Defaults to the evergreen brand site. */
  campaign?: string;
  /** Placement within the page, e.g. a SKU or "landing-hero". */
  content?: string;
};

export function dsgAttributed(url: string, attr: DsgAttribution = {}): string {
  try {
    const u = new URL(url);
    if (!DSG_HOST.test(u.hostname)) return url;
    u.searchParams.set("utm_source", "partyanimalinc.com");
    u.searchParams.set("utm_medium", "referral");
    u.searchParams.set("utm_campaign", attr.campaign ?? "brand-site");
    if (attr.content) u.searchParams.set("utm_content", attr.content);
    return u.toString();
  } catch {
    // Relative or malformed URL — leave it alone.
    return url;
  }
}

/** The Party Animal brand landing page Dick's built for us. */
export const DSG_BRAND_PAGE = "https://www.dickssportinggoods.com/f/party-animal";
