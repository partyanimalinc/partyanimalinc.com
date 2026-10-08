// Regenerate the proxy's PIM snapshots:
//   src/lib/product-slug-redirects.json  retired slug -> current slug
//   src/lib/live-product-slugs.json      every web-visible product slug
//   src/lib/license-slugs.json           league and team landing slugs
//
// Product URLs are /products/{web_slug}. Slugs get rebuilt when the original
// was inherited from a different product (apphub mig 00224 records every
// retired one), and a rename without a redirect kills the inbound links. The
// proxy needs these at the edge, so they are snapshotted into the bundle at
// build time rather than fetched per request. The live and license lists let a
// legacy NetSuite URL land on its product, or its team page, instead of a 404.
//
// Re-run after any slug change, or after publishing products to the web, in the PIM:
//   node scripts/build-slug-redirects.mjs
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PIM_API_BASE || "https://hq.partyanimalinc.com";
const KEY = process.env.PIM_API_KEY;

async function getJson(route) {
  const res = await fetch(`${BASE}${route}`, { headers: KEY ? { "x-api-key": KEY } : {} });
  if (!res.ok) {
    console.error(`${route} fetch failed: ${res.status}`);
    process.exit(1);
  }
  return res.json();
}

function write(name, data) {
  const out = path.join(process.cwd(), "src/lib", name);
  fs.writeFileSync(out, JSON.stringify(data, null, 0) + "\n");
  return out;
}

const { redirects } = await getJson("/api/public/slug-redirects");
if (!Array.isArray(redirects)) {
  console.error("unexpected slug-redirects payload");
  process.exit(1);
}

// { oldSlug: newSlug }. Drop self-redirects; they would loop.
const map = {};
for (const r of redirects) {
  if (r?.from && r?.to && r.from !== r.to) map[r.from] = r.to;
}
// A target that is itself a retired slug would chain; flatten to the end.
for (const from of Object.keys(map)) {
  const seen = new Set([from]);
  let to = map[from];
  while (map[to] && !seen.has(to)) { seen.add(to); to = map[to]; }
  map[from] = to;
}
console.log(`wrote ${Object.keys(map).length} redirects -> ${write("product-slug-redirects.json", map)}`);

// product-slugs omits products flagged exclude_from_sitemap even though their
// pages exist. None are flagged today; if that changes, a legacy URL for one of
// them would fall back to its team page rather than the product.
const { slugs } = await getJson("/api/public/product-slugs");
const live = [...new Set((slugs ?? []).map((s) => s?.slug).filter(Boolean))].sort();
if (live.length < 1000) {
  console.error(`only ${live.length} live product slugs; refusing to write a partial snapshot`);
  process.exit(1);
}
console.log(`wrote ${live.length} live product slugs -> ${write("live-product-slugs.json", live)}`);

const { leagues } = await getJson("/api/public/licenses");
const licenses = {
  leagues: [...new Set((leagues ?? []).map((l) => l.slug).filter(Boolean))].sort(),
  teams: [...new Set((leagues ?? []).flatMap((l) => (l.teams ?? []).map((t) => t.slug)).filter(Boolean))].sort(),
};
console.log(`wrote ${licenses.leagues.length} leagues, ${licenses.teams.length} teams -> ${write("license-slugs.json", licenses)}`);
