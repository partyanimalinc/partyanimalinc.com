// Regenerate src/lib/product-slug-redirects.json from the PIM.
//
// Product URLs are /products/{web_slug}. Slugs get rebuilt when the original
// was inherited from a different product (apphub mig 00224 records every
// retired one), and a rename without a redirect kills the inbound links. The
// proxy needs the map at the edge, so it is snapshotted into the bundle at
// build time rather than fetched per request.
//
// Re-run after any slug change in the PIM:
//   node scripts/build-slug-redirects.mjs
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PIM_API_BASE || "https://hq.partyanimalinc.com";
const KEY = process.env.PIM_API_KEY;

const res = await fetch(`${BASE}/api/public/slug-redirects`, {
  headers: KEY ? { "x-api-key": KEY } : {},
});
if (!res.ok) {
  console.error(`slug-redirects fetch failed: ${res.status}`);
  process.exit(1);
}
const { redirects } = await res.json();
if (!Array.isArray(redirects)) {
  console.error("unexpected payload");
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
const out = path.join(process.cwd(), "src/lib/product-slug-redirects.json");
fs.writeFileSync(out, JSON.stringify(map, null, 0) + "\n");
console.log(`wrote ${Object.keys(map).length} redirects -> ${out}`);
