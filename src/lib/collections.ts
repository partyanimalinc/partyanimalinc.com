import { getCategory, getCatalog, type CategoryProduct } from "@/lib/pim";

// The four brand landings don't map 1:1 to PIM nodes: TeenyMates / SqueezyMates /
// Jumbo Squeezy are clean brand categories, but "Team Gear" is a cross-category
// grouping of fan gear (flags, drinkware, signs, décor) with no single node —
// so we roll it up from the catalog's fan-gear collections.
type Chip = { label: string; href: string };
export type LandingListing = {
  products: CategoryProduct[];
  total: number;
  chips: Chip[]; // quick filters (subcategories / collections)
  browseHref: string; // "browse all" into the full filterable catalog
};

const LIMIT = 24;

type Config =
  | { kind: "category"; slug: string }
  | { kind: "collections"; collections: string[] };

export const LANDINGS: Record<string, Config> = {
  teenymates: { kind: "category", slug: "teenymates" },
  squeezymates: { kind: "category", slug: "squeezymates" },
  "jumbo-squeezy": { kind: "category", slug: "jumbo-squeezy" },
  "team-gear": {
    kind: "collections",
    collections: ["flags-banners", "drinkware", "homegating-decor"],
  },
};

export async function getLandingListing(key: string): Promise<LandingListing | null> {
  const cfg = LANDINGS[key];
  if (!cfg) return null;

  if (cfg.kind === "category") {
    const cat = await getCategory(cfg.slug, { limit: LIMIT });
    if (!cat) return null;
    return {
      products: cat.products,
      total: cat.total,
      chips: cat.subcategories.map((s) => ({
        label: s.name,
        href: `/products/${s.slug}`,
      })),
      browseHref: `/products/${cfg.slug}`,
    };
  }

  // Team Gear: merge the fan-gear collections, dedupe by sku.
  const results = await Promise.all(
    cfg.collections.map((c) => getCatalog({ collection: c, pageSize: 12, sort: "featured" })),
  );
  const seen = new Set<string>();
  const products: CategoryProduct[] = [];
  for (const r of results) {
    for (const p of r.products) {
      if (seen.has(p.sku)) continue;
      seen.add(p.sku);
      products.push(p);
    }
  }
  const total = results.reduce((n, r) => n + r.total, 0);
  const chips: Chip[] = results
    .flatMap((r) => r.facets.collections)
    .filter((c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i)
    .filter((c) => cfg.collections.includes(c.slug))
    .map((c) => ({ label: c.name, href: `/products/all?collection=${c.slug}` }));

  return { products: products.slice(0, LIMIT), total, chips, browseHref: "/products/all" };
}
