import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/pim";
import { parseCatalogSearch, hasActiveFilters, editionLabel } from "@/lib/catalog-url";

// Shared metadata for catalog pages: noindex the *filtered* permutations (the
// combinatorial ?league=/?series=/?line= views are thin + duplicative — keep
// them out of the index), while the unfiltered base list stays indexable.
export async function brandCatalogMetadata(
  title: string,
  description: string,
  searchParams: Promise<Record<string, string | string[] | undefined>>,
): Promise<Metadata> {
  const filtered = hasActiveFilters(parseCatalogSearch(await searchParams));
  return {
    title,
    description,
    ...(filtered ? { robots: { index: false, follow: true } } : {}),
  };
}
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { FEATURED_COLLECTIONS, TEAM_GEAR_SUBCATEGORIES } from "@/lib/featured-collections";
import type { SubCategory } from "@/components/catalog/filter-groups";

const PER = 48;
type SP = Record<string, string | string[] | undefined>;

// Brand catalog page (/{brand}/all): the shared filterable catalog scoped to one
// brand, with a breadcrumb + filter-aware heading. `base` must be this route so
// the COLLECTIONS switcher highlights the active brand (active = base === href).
export async function BrandCatalog({
  name,
  brandSlug,
  base,
  searchParams,
  league,
}: {
  name: string;
  brandSlug: string;
  base: string; // e.g. "/teenymates/all"
  searchParams: Promise<SP>;
  // When rendered from a clean path landing (e.g. /teenymates/nba) the league is
  // fixed by the route, not the query string — inject it so the catalog scopes
  // to it and the sidebar reflects it. Filter interactions still use `base`
  // (the query-mode /all route, which is noindexed).
  league?: { id: string; name: string };
}) {
  const parsed = parseCatalogSearch(await searchParams);
  const current = league ? { ...parsed, league: league.id } : parsed;
  const page = Math.min(Math.max(Number(current.page) || 1, 1), 10);

  const isTeamGear = brandSlug === "team-gear";
  // Team Gear splits by its fan-gear collections (real category nodes); the toy
  // brands are scoped by the brand slug and split by product line.
  const effectiveCollection = current.collection || brandSlug;

  const data = await getCatalog({
    collection: effectiveCollection,
    league: current.league,
    team: current.team,
    series: current.series ? Number(current.series) : undefined,
    line: current.line,
    edition: current.edition,
    q: current.q,
    sort: current.sort,
    page: 1,
    pageSize: PER * page,
  });

  const subcategories: SubCategory[] | undefined = isTeamGear ? TEAM_GEAR_SUBCATEGORIES : undefined;

  // Heading reflects the active filter (line names already include the brand).
  const lineName = current.line ? data.facets.lines.find((l) => l.code === current.line)?.name : undefined;
  const subName =
    isTeamGear && current.collection
      ? TEAM_GEAR_SUBCATEGORIES.find((s) => s.slug === current.collection)?.name
      : undefined;
  const teamName = current.team ? data.facets.teams.find((t) => t.id === current.team)?.name : undefined;
  const leagueName = current.league ? data.facets.leagues.find((l) => l.id === current.league)?.name : undefined;
  const editionName = current.edition ? editionLabel(current.edition) : undefined;
  const heading = league
    ? `${name} — ${league.name}`
    : editionName
      ? `${name} — ${editionName}${leagueName ? ` (${leagueName})` : ""}`
      : (lineName ??
        subName ??
        (teamName ? `${name} — ${teamName}` : leagueName ? `${name} — ${leagueName}` : `All ${name}`));

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-5 text-xs uppercase tracking-wide text-white/45">
        <Link href="/" className="transition-colors hover:text-white">
          Home
        </Link>
        <span className="px-2">/</span>
        <Link href={base.replace(/\/all$/, "")} className="transition-colors hover:text-white">
          {name}
        </Link>
        <span className="px-2">/</span>
        {league ? (
          <>
            <Link href={base.replace(/\/all$/, "/all")} className="transition-colors hover:text-white">
              All
            </Link>
            <span className="px-2">/</span>
            <span className="text-white/70">{league.name}</span>
          </>
        ) : (
          <span className="text-white/70">All</span>
        )}
      </nav>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <h1 className="font-heading text-3xl uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
          {heading}
        </h1>
        <p className="text-sm text-white/50">
          {data.total} {data.total === 1 ? "product" : "products"}
        </p>
      </div>

      <CatalogBrowser
        base={base}
        current={current}
        data={data}
        page={page}
        featured={FEATURED_COLLECTIONS}
        subcategories={subcategories}
      />
    </section>
  );
}
