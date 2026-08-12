// Amazon Attribution — append our channel-level Attribution tag to any amazon.com
// link so off-Amazon clicks from this site are measured in the Attribution console
// and qualify for the Brand Referral Bonus (~10% credit against referral fees).
//
// One tag ("PAI Website – Product Pages") is applied catalog-wide. To rotate it,
// regenerate the tag in the Amazon Attribution console and replace the values in
// ATTRIBUTION_PARAMS below. Non-Amazon URLs (Dick's, Target, Walmart, …) pass
// through untouched, so it is safe to wrap every retailer link with this.
const ATTRIBUTION_PARAMS: Record<string, string> = {
  maas: "maas_adg_C2B5E69DA85A321D1C69AA9881965500_afap_abs",
  ref_: "aa_maas",
  tag: "maas",
};

export function amazonAttributed(url: string): string {
  try {
    const u = new URL(url);
    if (!/(?:^|\.)amazon\.com$/i.test(u.hostname)) return url;
    for (const [k, v] of Object.entries(ATTRIBUTION_PARAMS)) u.searchParams.set(k, v);
    return u.toString();
  } catch {
    // Relative or malformed URL — leave it alone.
    return url;
  }
}
