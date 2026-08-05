import Link from "next/link";
import { catalogHref, CATALOG_BASE, editionLabel, type CatalogSearch } from "@/lib/catalog-url";
import type { CatalogResponse } from "@/lib/pim";

export type FeaturedCollection = { slug: string; name: string; href: string };
export type SubCategory = { slug: string; name: string };

function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="label-athletic mb-3 text-xs tracking-wider text-white/45">{children}</h3>
  );
}

function FacetRow({
  href,
  label,
  count,
  active,
  replace = true,
}: {
  href: string;
  label: string;
  count?: number;
  active: boolean;
  replace?: boolean;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      prefetch={replace ? undefined : false}
      aria-pressed={active}
      className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-brand-red font-semibold text-white"
          : "text-white/75 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="flex items-center gap-2 truncate">
        {active && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        <span className="truncate">{label}</span>
      </span>
      {typeof count === "number" && (
        <span className={active ? "text-white/80" : "text-white/35"}>{count}</span>
      )}
    </Link>
  );
}

// The reconfigurable filter panel. On the shop-all page it shows the featured
// collections; on a brand landing it swaps in that brand's sub-categories and
// keeps the featured list as cross-collection navigation.
export function FilterGroups({
  facets,
  current,
  base = CATALOG_BASE,
  featured,
  subcategories,
  subcategoryLabel = "Category",
}: {
  facets: CatalogResponse["facets"];
  current: CatalogSearch;
  base?: string;
  // The 4 featured collections (replaces the raw top-level collection facet).
  featured?: FeaturedCollection[];
  // Sub-categories of the current collection, shown as their own filter group.
  subcategories?: SubCategory[];
  subcategoryLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-7">
      {featured && featured.length > 0 && (
        <div>
          <GroupHeading>Collections</GroupHeading>
          <div className="flex flex-col gap-0.5">
            {featured.map((f) => (
              // Selecting a collection navigates to that collection's page.
              <FacetRow
                key={f.slug}
                label={f.name}
                active={base === f.href}
                href={f.href}
              />
            ))}
          </div>
        </div>
      )}

      {/* Team Gear-style sub-categories (real category nodes, via collection param) */}
      {subcategories && subcategories.length > 0 && (
        <div>
          <GroupHeading>{subcategoryLabel}</GroupHeading>
          <div className="flex max-h-72 flex-col gap-0.5 overflow-y-auto pr-1">
            {subcategories.map((s) => {
              const active = current.collection === s.slug;
              return (
                <FacetRow
                  key={s.slug}
                  label={s.name}
                  active={active}
                  href={catalogHref(current, { collection: active ? null : s.slug }, base)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Product-line sub-categories (the real partition — products live on the
          brand node, not sub-category nodes — so we facet by product line). */}
      {!subcategories && (facets.lines ?? []).length > 0 && (
        <div>
          <GroupHeading>{subcategoryLabel}</GroupHeading>
          <div className="flex max-h-72 flex-col gap-0.5 overflow-y-auto pr-1">
            {(facets.lines ?? []).map((l) => {
              const active = current.line === l.code;
              return (
                <FacetRow
                  key={l.code}
                  label={l.name}
                  count={l.count}
                  active={active}
                  href={catalogHref(current, { line: active ? null : l.code }, base)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Raw collection facet — only when no featured list is provided (shop-all default) */}
      {!featured && facets.collections.length > 0 && (
        <div>
          <GroupHeading>Collection</GroupHeading>
          <div className="flex flex-col gap-0.5">
            {facets.collections.map((c) => {
              const active = current.collection === c.slug;
              return (
                <FacetRow
                  key={c.slug}
                  label={c.name}
                  count={c.count}
                  active={active}
                  href={catalogHref(current, { collection: active ? null : c.slug }, base)}
                />
              );
            })}
          </div>
        </div>
      )}

      {(facets.series ?? []).length > 0 && (
        <div>
          <GroupHeading>Series</GroupHeading>
          <div className="flex flex-wrap gap-2">
            {(facets.series ?? []).map((s) => {
              const active = current.series === String(s.num);
              return (
                <Link
                  key={s.num}
                  href={catalogHref(current, { series: active ? null : String(s.num) }, base)}
                  scroll={false}
                  aria-label={`Series ${s.num}`}
                  aria-pressed={active}
                  className={`grid h-9 w-9 place-items-center rounded-full border text-sm font-semibold transition-colors ${
                    active
                      ? "border-brand-red bg-brand-red text-white"
                      : "border-ink-line text-white/75 hover:border-brand-red hover:text-white"
                  }`}
                >
                  {s.num}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {facets.leagues.length > 0 && (
        <div>
          <GroupHeading>League</GroupHeading>
          <div className="flex flex-col gap-0.5">
            {facets.leagues.map((l) => {
              const active = current.league === l.id;
              return (
                <FacetRow
                  key={l.id}
                  label={l.name}
                  count={l.count}
                  active={active}
                  href={catalogHref(current, { league: active ? null : l.id }, base)}
                />
              );
            })}
          </div>
        </div>
      )}

      {facets.teams.length > 0 ? (
        <div>
          <GroupHeading>Team</GroupHeading>
          <div className="flex max-h-80 flex-col gap-0.5 overflow-y-auto pr-1">
            {facets.teams.map((t) => {
              const active = current.team === t.id;
              return (
                <FacetRow
                  key={t.id}
                  label={t.name}
                  count={t.count}
                  active={active}
                  href={catalogHref(current, { team: active ? null : t.id }, base)}
                />
              );
            })}
          </div>
        </div>
      ) : (
        facets.leagues.length > 0 &&
        !current.league && (
          <div>
            <GroupHeading>Team</GroupHeading>
            <p className="px-3 text-xs leading-relaxed text-white/40">
              Pick a league above to filter by team.
            </p>
          </div>
        )
      )}

      {/* Editions: themed one-off releases (90's Pop, Rookies) — a separate axis
          from the numbered series, pinned to the bottom of the filter list. */}
      {(facets.editions ?? []).length > 0 && (
        <div>
          <GroupHeading>Editions</GroupHeading>
          <div className="flex flex-col gap-0.5">
            {(facets.editions ?? []).map((e) => {
              const active = current.edition === e.slug;
              return (
                <FacetRow
                  key={e.slug}
                  label={editionLabel(e.slug)}
                  count={e.count}
                  active={active}
                  href={catalogHref(current, { edition: active ? null : e.slug }, base)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
