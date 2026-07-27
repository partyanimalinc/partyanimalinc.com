// Slugify identical to the apphub API (leagues/teams), so a product's team/
// league name maps to its /licenses/{slug} landing page.
export function slugify(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
