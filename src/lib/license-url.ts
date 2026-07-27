// Query-string helpers for a /licenses/[slug] landing page. The league/team is
// fixed by the path; only collection, sort, and page vary in the query.

export type LicenseSearch = {
  collection?: string;
  sort?: string;
  page?: string;
};

export function parseLicenseSearch(
  sp: Record<string, string | string[] | undefined>,
): LicenseSearch {
  const one = (v: string | string[] | undefined) =>
    (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
  return { collection: one(sp.collection), sort: one(sp.sort), page: one(sp.page) };
}

export function licenseHref(
  slug: string,
  current: LicenseSearch,
  patch: Partial<Record<keyof LicenseSearch, string | null>>,
): string {
  const next: LicenseSearch = { ...current, ...patch } as LicenseSearch;
  for (const k of Object.keys(patch) as (keyof LicenseSearch)[]) {
    if (patch[k] === null) next[k] = undefined;
  }
  // any change other than paging resets to page 1
  if (!("page" in patch)) next.page = undefined;

  const p = new URLSearchParams();
  if (next.collection) p.set("collection", next.collection);
  if (next.sort && next.sort !== "featured") p.set("sort", next.sort);
  if (next.page && next.page !== "1") p.set("page", next.page);
  const qs = p.toString();
  const base = `/licenses/${slug}`;
  return qs ? `${base}?${qs}` : base;
}

export function licenseHasFilters(s: LicenseSearch): boolean {
  return Boolean(s.collection);
}
