import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/pim";
import { parseCatalogSearch } from "@/lib/catalog-url";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { FEATURED_COLLECTIONS } from "@/lib/featured-collections";

const PER = 48;
type SP = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: "All TeenyMates",
  description:
    "Browse the full TeenyMates collection — team sets, collector tins, locker room sets, gift sets, advent calendars, and more, filterable by league, team, and series.",
};

export default async function TeenyMatesAllPage({ searchParams }: { searchParams: Promise<SP> }) {
  const current = parseCatalogSearch(await searchParams);
  const page = Math.min(Math.max(Number(current.page) || 1, 1), 10);

  const data = await getCatalog({
    collection: "teenymates",
    league: current.league,
    team: current.team,
    series: current.series ? Number(current.series) : undefined,
    line: current.line,
    q: current.q,
    sort: current.sort,
    page: 1,
    pageSize: PER * page,
  });

  // Heading reflects the active filter (line name already includes "TeenyMates").
  const lineName = current.line ? data.facets.lines.find((l) => l.code === current.line)?.name : undefined;
  const teamName = current.team ? data.facets.teams.find((t) => t.id === current.team)?.name : undefined;
  const leagueName = current.league ? data.facets.leagues.find((l) => l.id === current.league)?.name : undefined;
  const heading =
    lineName ??
    (teamName ? `TeenyMates — ${teamName}` : leagueName ? `TeenyMates — ${leagueName}` : "All TeenyMates");

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-5 text-xs uppercase tracking-wide text-white/45">
        <Link href="/" className="transition-colors hover:text-white">
          Home
        </Link>
        <span className="px-2">/</span>
        <Link href="/teenymates" className="transition-colors hover:text-white">
          TeenyMates
        </Link>
        <span className="px-2">/</span>
        <span className="text-white/70">All</span>
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
        base="/teenymates/all"
        current={current}
        data={data}
        page={page}
        featured={FEATURED_COLLECTIONS}
      />
    </section>
  );
}
