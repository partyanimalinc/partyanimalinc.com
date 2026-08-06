import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BrandCatalog } from "@/components/brand-catalog";
import { getLicenses, resolveLicense, type LicenseLeague } from "@/lib/pim";
import { hasActiveFilters, parseCatalogSearch } from "@/lib/catalog-url";

type SP = Record<string, string | string[] | undefined>;

// Clean, indexable per-league landing pages (e.g. /squeezymates/nba). The static
// /squeezymates/all route takes precedence, so this only catches league slugs.
export async function generateStaticParams() {
  const leagues = await getLicenses();
  return leagues.map((l) => ({ league: l.slug }));
}

async function resolveLeague(slug: string): Promise<LicenseLeague | null> {
  const r = resolveLicense(await getLicenses(), slug);
  return r && r.type === "league" ? r.league : null;
}

export async function generateMetadata(props: {
  params: Promise<{ league: string }>;
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const { league: slug } = await props.params;
  const league = await resolveLeague(slug);
  if (!league) return {};
  const filtered = hasActiveFilters(parseCatalogSearch(await props.searchParams));
  return {
    title: `SqueezyMates ${league.name} Figures`,
    description: `Shop SqueezyMates ${league.name}: officially licensed ${league.name} collectible figures, blind packs, team sets, collector tins, gift sets, and more.`,
    alternates: { canonical: `/squeezymates/${league.slug}` },
    robots: filtered ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function SqueezyMatesLeaguePage(props: {
  params: Promise<{ league: string }>;
  searchParams: Promise<SP>;
}) {
  const { league: slug } = await props.params;
  const league = await resolveLeague(slug);
  if (!league) notFound();
  return (
    <BrandCatalog
      name="SqueezyMates"
      brandSlug="squeezymates"
      base="/squeezymates/all"
      searchParams={props.searchParams}
      league={{ id: league.id, name: league.name }}
    />
  );
}
