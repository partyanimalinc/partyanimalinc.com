import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandCatalog } from "@/components/brand-catalog";
import { brandLeagueMetadata, resolveLeague } from "@/lib/brand-league";
import { parseCatalogSearch } from "@/lib/catalog-url";
import { filteredVariantMetadata } from "@/lib/seo";

// On-demand twin of /squeezymates/[league] for filtered / sorted / paged requests.
// Reached only through the src/proxy.ts rewrite (see LISTING_ROUTE there).
export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

export async function generateMetadata(props: {
  params: Promise<{ league: string }>;
}): Promise<Metadata> {
  const { league: slug } = await props.params;
  const league = await resolveLeague(slug);
  if (!league) return {};
  return filteredVariantMetadata(brandLeagueMetadata("squeezymates", league), `/squeezymates/${league.slug}`);
}

export default async function SqueezyMatesLeagueFilteredPage(props: {
  params: Promise<{ league: string }>;
  searchParams: Promise<SP>;
}) {
  const { league: slug } = await props.params;
  const league = await resolveLeague(slug);
  if (!league) notFound();
  const search = parseCatalogSearch(await props.searchParams);
  return (
    <BrandCatalog
      name="SqueezyMates"
      brandSlug="squeezymates"
      base="/squeezymates/all"
      search={search}
      league={{ id: league.id, name: league.name }}
    />
  );
}
