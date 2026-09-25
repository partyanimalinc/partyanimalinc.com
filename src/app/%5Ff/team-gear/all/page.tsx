import type { Metadata } from "next";
import { BrandCatalog, brandCatalogMetadata } from "@/components/brand-catalog";
import { parseCatalogSearch } from "@/lib/catalog-url";
import { filteredVariantMetadata } from "@/lib/seo";

// On-demand twin of /team-gear/all for filtered / sorted / paged requests.
// Reached only through the src/proxy.ts rewrite (see LISTING_ROUTE there).
export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

export const metadata: Metadata = filteredVariantMetadata(
  brandCatalogMetadata(
    "All Team Gear",
    "Browse all Team Gear — flags and banners, drinkware, and homegating décor to rep your team.",
    "/team-gear/all",
  ),
  "/team-gear/all",
);

export default async function TeamGearAllFilteredPage(props: { searchParams: Promise<SP> }) {
  const search = parseCatalogSearch(await props.searchParams);
  return <BrandCatalog name="Team Gear" brandSlug="team-gear" base="/team-gear/all" search={search} />;
}
