import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BrandCatalog } from "@/components/brand-catalog";
import { getLicenses } from "@/lib/pim";
import { brandLeagueMetadata, resolveLeague } from "@/lib/brand-league";

// Clean, indexable per-league landing pages (e.g. /teenymates/nba). The static
// /teenymates/all route takes precedence, so this only catches league slugs.
// ISR: never reads searchParams; a filtered variant is rewritten by
// src/proxy.ts to the /_f twin (src/app/%5Ff/teenymates/[league]).
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const leagues = await getLicenses();
  return leagues.map((l) => ({ league: l.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ league: string }>;
}): Promise<Metadata> {
  const { league: slug } = await props.params;
  const league = await resolveLeague(slug);
  if (!league) return {};
  return brandLeagueMetadata("teenymates", league);
}

export default async function TeenyMatesLeaguePage(props: { params: Promise<{ league: string }> }) {
  const { league: slug } = await props.params;
  const league = await resolveLeague(slug);
  if (!league) notFound();
  return (
    <BrandCatalog
      name="TeenyMates"
      brandSlug="teenymates"
      base="/teenymates/all"
      search={{}}
      league={{ id: league.id, name: league.name }}
    />
  );
}
