import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import {
  FilterGroups,
  type FeaturedCollection,
  type SubCategory,
} from "@/components/catalog/filter-groups";
import { FilterDrawer } from "@/components/catalog/filter-drawer";
import { SortMenu } from "@/components/catalog/sort-menu";
import {
  catalogHref,
  editionLabel,
  hasActiveFilters,
  SORT_OPTIONS,
  type CatalogSearch,
} from "@/lib/catalog-url";
import type { CatalogResponse } from "@/lib/pim";

// ---- server-rendered search form (works without JS), base-aware ----
function SearchForm({ base, current }: { base: string; current: CatalogSearch }) {
  return (
    <form action={base} method="get" className="relative w-full sm:w-64">
      {current.collection && <input type="hidden" name="collection" value={current.collection} />}
      {current.league && <input type="hidden" name="league" value={current.league} />}
      {current.team && <input type="hidden" name="team" value={current.team} />}
      {current.series && <input type="hidden" name="series" value={current.series} />}
      {current.line && <input type="hidden" name="line" value={current.line} />}
      {current.edition && <input type="hidden" name="edition" value={current.edition} />}
      {current.sort && <input type="hidden" name="sort" value={current.sort} />}
      <input
        type="search"
        name="q"
        defaultValue={current.q || ""}
        placeholder="Search products"
        aria-label="Search products"
        className="w-full rounded-lg border border-ink-line bg-ink-soft py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-brand-red"
      />
      <svg
        width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </form>
  );
}

function ActiveChips({
  base,
  current,
  applied,
}: {
  base: string;
  current: CatalogSearch;
  applied: CatalogResponse["applied"];
}) {
  const chips: { label: string; href: string }[] = [];
  // On a brand page the collection IS the page — only show it as a removable
  // chip when it names a drilled-in sub-category (i.e. current.collection set).
  if (current.collection && applied.collection)
    chips.push({ label: applied.collection, href: catalogHref(current, { collection: null }, base) });
  if (applied.league)
    chips.push({ label: applied.league, href: catalogHref(current, { league: null }, base) });
  if (applied.team)
    chips.push({ label: applied.team, href: catalogHref(current, { team: null }, base) });
  if (current.series)
    chips.push({ label: `Series ${current.series}`, href: catalogHref(current, { series: null }, base) });
  if (current.edition)
    chips.push({ label: editionLabel(current.edition), href: catalogHref(current, { edition: null }, base) });
  if (current.q) chips.push({ label: `“${current.q}”`, href: catalogHref(current, { q: null }, base) });

  if (chips.length === 0) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <Link
          key={c.label}
          href={c.href}
          scroll={false}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-red-dark"
        >
          {c.label}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </Link>
      ))}
      <Link
        href={base}
        scroll={false}
        className="text-xs font-medium uppercase tracking-wide text-white/50 underline-offset-2 hover:text-white hover:underline"
      >
        Clear all
      </Link>
    </div>
  );
}

// The one catalog list template: filter sidebar + toolbar + grid + load more.
// Reused by /products/all and each brand landing (via `base` + `featured` +
// `subcategories`). `page` accumulates results (SSR renders 1..page*perPage).
export function CatalogBrowser({
  base,
  current,
  data,
  page,
  perPage = 48,
  featured,
  subcategories,
  subcategoryLabel,
}: {
  base: string;
  current: CatalogSearch;
  data: CatalogResponse;
  page: number;
  perPage?: number;
  featured?: FeaturedCollection[];
  subcategories?: SubCategory[];
  subcategoryLabel?: string;
}) {
  const { products, total, facets, applied } = data;
  const activeCount = [
    current.collection,
    current.league,
    current.team,
    current.series,
    current.q,
  ].filter(Boolean).length;
  const hasMore = products.length < total && page < 10;

  const sidebar = (
    <FilterGroups
      facets={facets}
      current={current}
      base={base}
      featured={featured}
      subcategories={subcategories}
      subcategoryLabel={subcategoryLabel}
    />
  );

  return (
    <div className="lg:grid lg:grid-cols-[248px_1fr] lg:gap-10">
      <aside className="hidden lg:block">
        <div className="sticky top-24">{sidebar}</div>
      </aside>

      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <FilterDrawer activeCount={activeCount}>{sidebar}</FilterDrawer>
          <div className="order-3 w-full sm:order-none sm:w-auto sm:flex-1">
            <SearchForm base={base} current={current} />
          </div>
          <SortMenu
            value={current.sort || "featured"}
            options={SORT_OPTIONS.map((o) => ({
              ...o,
              href: catalogHref(current, { sort: o.value }, base),
            }))}
          />
        </div>

        <ActiveChips base={base} current={current} applied={applied} />

        <p className="mb-5 text-sm text-white/50" aria-live="polite">
          {total === 0
            ? "No products found"
            : `Showing ${products.length} of ${total} product${total === 1 ? "" : "s"}`}
        </p>

        {products.length === 0 ? (
          <div className="rounded-xl border border-ink-line bg-ink-soft px-6 py-16 text-center">
            <p className="text-white/70">No products match these filters.</p>
            {hasActiveFilters(current) && (
              <Link
                href={base}
                className="label-athletic mt-4 inline-block text-sm text-brand-red hover:text-brand-red-dark"
              >
                Clear filters
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.sku} p={p} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <Link
                  href={catalogHref(current, { page: String(page + 1) }, base)}
                  scroll={false}
                  prefetch={false}
                  className="label-athletic inline-flex items-center gap-2 rounded-full border border-ink-line bg-ink-soft px-8 py-3.5 text-sm text-white transition-colors hover:border-brand-red hover:bg-brand-red"
                >
                  Load more
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
