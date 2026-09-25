// rel="" for outbound links, by destination.
//
// - Amazon (carries our Attribution tag) and Dick's (carries our UTMs) are paid
//   / commercial relationships: `sponsored`, and no `noreferrer` so the retailer
//   sees where the click came from.
// - Our own consumer sites (partyanimaltoys.com, play.partyanimaltoys.com) get
//   plain `noopener`: we WANT the referrer to arrive, Umami attributes on it.
// - Everything else keeps the conservative default.
const SPONSORED_HOST = /(?:^|\.)(?:amazon\.[a-z.]+|amzn\.to|dickssportinggoods\.com)$/i;
const OWN_HOST = /(?:^|\.)partyanimaltoys\.com$/i;

export function relFor(url: string): string {
  try {
    const host = new URL(url).hostname;
    if (SPONSORED_HOST.test(host)) return "sponsored noopener";
    if (OWN_HOST.test(host)) return "noopener";
  } catch {
    // relative / malformed: fall through
  }
  return "noopener noreferrer";
}
