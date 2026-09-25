import type { Metadata } from "next";
import { BrandCatalog, brandCatalogMetadata } from "@/components/brand-catalog";
import { parseCatalogSearch } from "@/lib/catalog-url";
import { filteredVariantMetadata } from "@/lib/seo";

// On-demand twin of /teenymates/all for filtered / sorted / paged requests.
// Reached only through the src/proxy.ts rewrite (see LISTING_ROUTE there).
export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

export const metadata: Metadata = filteredVariantMetadata(
  brandCatalogMetadata(
    "All TeenyMates",
    "Browse the full TeenyMates collection — team sets, collector tins, locker room sets, gift sets, advent calendars, and more, filterable by league, team, and series.",
    "/teenymates/all",
  ),
  "/teenymates/all",
);

export default async function TeenyMatesAllFilteredPage(props: { searchParams: Promise<SP> }) {
  const search = parseCatalogSearch(await props.searchParams);
  return <BrandCatalog name="TeenyMates" brandSlug="teenymates" base="/teenymates/all" search={search} />;
}
