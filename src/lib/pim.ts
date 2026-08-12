// Client for apphub's read-only public PIM API. Server-side fetch (ISR-cached).
// Dev: http://localhost:3002 ; Prod: https://hq.partyanimalinc.com
const BASE = process.env.PIM_API_BASE || "http://localhost:3002";
const KEY = process.env.PIM_API_KEY;

function headers(): HeadersInit {
  return KEY ? { "x-api-key": KEY } : {};
}

export type CategoryNode = {
  id: string;
  cat_code: string;
  name: string;
  slug: string;
  parent_id: string | null;
  hierarchy_path: string;
  sort_order: number;
  web_template: "standard" | "brand";
  banner_image_url: string | null;
  thumbnail_url: string | null;
  description: string | null;
};

export type Retailer = { retailer: string; url: string; wholesale?: boolean };

export type CategoryProduct = {
  sku: string;
  slug: string | null;
  name: string;
  image: string | null;
  msrp: number | null;
  leagueId: string | null;
  teamId: string | null;
  teamName: string | null;
  series: number | null;
  retailers: Retailer[];
};

export type CategoryDetail = {
  category: {
    code: string;
    name: string;
    slug: string;
    template: "standard" | "brand";
    bannerImageUrl: string | null;
    thumbnailUrl: string | null;
    description: string | null;
    breadcrumb: string[];
    seoTitle: string | null;
    seoDescription: string | null;
    seoBody: string | null;
  };
  subcategories: {
    name: string;
    slug: string;
    template: "standard" | "brand";
    thumbnailUrl: string | null;
  }[];
  products: CategoryProduct[];
  total: number;
  limit: number;
  offset: number;
};

export async function getCategories(): Promise<CategoryNode[]> {
  try {
    const r = await fetch(`${BASE}/api/public/categories`, {
      headers: headers(),
      next: { revalidate: 300 },
    });
    if (!r.ok) return [];
    return (await r.json()).categories ?? [];
  } catch {
    return [];
  }
}

export async function getCategory(
  slug: string,
  opts?: { league?: string; limit?: number; offset?: number },
): Promise<CategoryDetail | null> {
  const p = new URLSearchParams();
  if (opts?.league) p.set("league", opts.league);
  if (opts?.limit) p.set("limit", String(opts.limit));
  if (opts?.offset) p.set("offset", String(opts.offset));
  try {
    const r = await fetch(`${BASE}/api/public/categories/${slug}?${p}`, {
      headers: headers(),
      next: { revalidate: 300 },
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Catalog (/products/all): filtered, paginated, faceted product list.
// ---------------------------------------------------------------------------
export type FacetValue = { id: string; name: string; count: number };
export type CollectionFacet = { slug: string; name: string; count: number };
export type SeriesFacet = { num: number; count: number };
export type LineFacet = { code: string; name: string; count: number };
export type EditionFacet = { slug: string; count: number };

export type CatalogResponse = {
  products: CategoryProduct[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  sort: string;
  applied: { collection?: string; league?: string; team?: string; edition?: string };
  facets: {
    total: number;
    collections: CollectionFacet[];
    leagues: FacetValue[];
    teams: FacetValue[];
    series: SeriesFacet[];
    lines: LineFacet[];
    editions: EditionFacet[];
  };
};

export type CatalogParams = {
  collection?: string;
  league?: string;
  team?: string;
  q?: string;
  series?: number;
  line?: string;
  edition?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

const EMPTY_CATALOG: CatalogResponse = {
  products: [],
  total: 0,
  page: 1,
  pageSize: 48,
  pageCount: 1,
  sort: "featured",
  applied: {},
  facets: { total: 0, collections: [], leagues: [], teams: [], series: [], lines: [], editions: [] },
};

export async function getCatalog(params: CatalogParams): Promise<CatalogResponse> {
  const p = new URLSearchParams();
  if (params.collection) p.set("collection", params.collection);
  if (params.league) p.set("league", params.league);
  if (params.team) p.set("team", params.team);
  if (params.q) p.set("q", params.q);
  if (params.series) p.set("series", String(params.series));
  if (params.line) p.set("line", params.line);
  if (params.edition) p.set("edition", params.edition);
  if (params.sort) p.set("sort", params.sort);
  if (params.page) p.set("page", String(params.page));
  if (params.pageSize) p.set("pageSize", String(params.pageSize));
  try {
    const r = await fetch(`${BASE}/api/public/products?${p}`, {
      headers: headers(),
      next: { revalidate: 300 },
    });
    if (!r.ok) return EMPTY_CATALOG;
    return await r.json();
  } catch {
    return EMPTY_CATALOG;
  }
}

// ---------------------------------------------------------------------------
// Product detail (/products/[slug]).
// ---------------------------------------------------------------------------
export type RelatedProduct = {
  sku: string;
  slug: string | null;
  name: string;
  image: string | null;
  teamName: string | null;
  retailers: Retailer[];
};

export type ProductDetail = {
  sku: string;
  slug: string;
  name: string;
  gallery: string[];
  msrp: number | null;
  seriesYear: number | null;
  series: number | null;
  dimensions: string | null;
  upc: string | null;
  materialContent: string | null;
  contentsSummary: string | null;
  storeDescription: string | null;
  detailedDescription: string | null;
  featuredDescription: string | null;
  leagueName: string | null;
  teamName: string | null;
  teamId: string | null;
  collection: { name: string; slug: string; template: string; breadcrumb: string[] } | null;
  retailers: Retailer[];
  related: RelatedProduct[];
};

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const r = await fetch(`${BASE}/api/public/products/${slug}`, {
      headers: headers(),
      next: { revalidate: 300 },
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Nav typeahead: lightweight product search (SKU / name), exact + fuzzy.
// ---------------------------------------------------------------------------
export type SearchProduct = {
  sku: string;
  slug: string | null;
  name: string;
  image: string | null;
  series: number | null;
};

// All web-visible product slugs (+ last-modified) for the sitemap.
export async function getProductSlugs(): Promise<{ slug: string; updatedAt: string | null }[]> {
  try {
    const r = await fetch(`${BASE}/api/public/product-slugs`, {
      headers: headers(),
      next: { revalidate: 3600 },
    });
    if (!r.ok) return [];
    return (await r.json()).slugs ?? [];
  } catch {
    return [];
  }
}

export async function searchProducts(
  q: string,
  limit = 8,
): Promise<{ products: SearchProduct[]; fuzzy: boolean }> {
  const p = new URLSearchParams({ q, limit: String(limit) });
  try {
    const r = await fetch(`${BASE}/api/public/search?${p}`, {
      headers: headers(),
      next: { revalidate: 60 },
    });
    if (!r.ok) return { products: [], fuzzy: false };
    return await r.json();
  } catch {
    return { products: [], fuzzy: false };
  }
}

// ---------------------------------------------------------------------------
// Licenses (leagues + teams) taxonomy for /licenses hub + landing pages.
// ---------------------------------------------------------------------------
export type LicenseTeam = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  count: number;
};
export type LicenseLeague = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  count: number;
  teams: LicenseTeam[];
};

export async function getLicenses(): Promise<LicenseLeague[]> {
  try {
    const r = await fetch(`${BASE}/api/public/licenses`, {
      headers: headers(),
      next: { revalidate: 300 },
    });
    if (!r.ok) return [];
    return (await r.json()).leagues ?? [];
  } catch {
    return [];
  }
}

// Resolve a /licenses/[slug] to either a league or one of its teams.
export type LicenseResolved =
  | { type: "league"; league: LicenseLeague }
  | { type: "team"; team: LicenseTeam; league: LicenseLeague };

export function resolveLicense(
  leagues: LicenseLeague[],
  slug: string,
): LicenseResolved | null {
  const league = leagues.find((l) => l.slug === slug);
  if (league) return { type: "league", league };
  for (const l of leagues) {
    const team = l.teams.find((t) => t.slug === slug);
    if (team) return { type: "team", team, league: l };
  }
  return null;
}

// Where a category links on the site: brand nodes get their top-level landing
// (/teenymates), standard categories use the category template (/products/slug).
export function categoryHref(c: {
  slug: string;
  web_template?: string;
  template?: string;
}): string {
  const t = c.web_template ?? c.template;
  return t === "brand" ? `/${c.slug}` : `/products/${c.slug}`;
}
