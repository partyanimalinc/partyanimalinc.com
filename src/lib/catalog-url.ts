// Pure helpers for building /products/all filter URLs. Filters live entirely in
// the query string so pages are shareable, crawlable, and back-button correct.

export const CATALOG_BASE = "/products/all";

export type CatalogSearch = {
  collection?: string;
  league?: string;
  team?: string;
  q?: string;
  series?: string;
  line?: string;
  edition?: string;
  sort?: string;
  page?: string;
};

// Read Next's searchParams (string | string[] | undefined) into a flat shape.
export function parseCatalogSearch(
  sp: Record<string, string | string[] | undefined>,
): CatalogSearch {
  const one = (v: string | string[] | undefined) =>
    (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
  return {
    collection: one(sp.collection),
    league: one(sp.league),
    team: one(sp.team),
    q: one(sp.q),
    series: one(sp.series),
    line: one(sp.line),
    edition: one(sp.edition),
    sort: one(sp.sort),
    page: one(sp.page),
  };
}

// Build a catalog href by patching the current filter state. `null` clears a
// key. Changing any facet resets pagination to page 1.
export function catalogHref(
  current: CatalogSearch,
  patch: Partial<Record<keyof CatalogSearch, string | null>>,
  base: string = CATALOG_BASE,
): string {
  const next: CatalogSearch = { ...current, ...patch } as CatalogSearch;
  // clearing a league also clears its team (a team belongs to one league)
  if (patch.league === null || (patch.league && patch.league !== current.league)) {
    next.team = patch.team ?? undefined;
  }
  for (const k of Object.keys(patch) as (keyof CatalogSearch)[]) {
    if (patch[k] === null) next[k] = undefined;
  }
  // any change other than paging itself resets to page 1
  if (!("page" in patch)) next.page = undefined;

  const p = new URLSearchParams();
  if (next.collection) p.set("collection", next.collection);
  if (next.league) p.set("league", next.league);
  if (next.team) p.set("team", next.team);
  if (next.q) p.set("q", next.q);
  if (next.series) p.set("series", next.series);
  if (next.line) p.set("line", next.line);
  if (next.edition) p.set("edition", next.edition);
  if (next.sort && next.sort !== "featured") p.set("sort", next.sort);
  if (next.page && next.page !== "1") p.set("page", next.page);
  const qs = p.toString();
  return qs ? `${base}?${qs}` : base;
}

// Display labels for the `edition` facet slugs (themed one-off releases). The
// PIM stores slugs; labels live here so the DB/API stay label-free.
export const EDITION_LABELS: Record<string, string> = {
  "90s-pop": "90's Pop",
  rookies: "Rookies",
};
export const editionLabel = (slug: string) =>
  EDITION_LABELS[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "az", label: "Name: A to Z" },
  { value: "za", label: "Name: Z to A" },
];

// Is any real filter active (used for noindex + "Clear all" visibility)?
export function hasActiveFilters(s: CatalogSearch): boolean {
  return Boolean(s.collection || s.league || s.team || s.q || s.series || s.line || s.edition);
}
