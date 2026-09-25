import type { Metadata } from "next";
import { BrandCatalog, brandCatalogMetadata } from "@/components/brand-catalog";
import { parseCatalogSearch } from "@/lib/catalog-url";
import { filteredVariantMetadata } from "@/lib/seo";

// On-demand twin of /squeezymates/all for filtered / sorted / paged requests.
// Reached only through the src/proxy.ts rewrite (see LISTING_ROUTE there).
export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

export const metadata: Metadata = filteredVariantMetadata(
  brandCatalogMetadata(
    "All SqueezyMates",
    "Browse the full SqueezyMates collection, filterable by league, team, and series.",
    "/squeezymates/all",
  ),
  "/squeezymates/all",
);

export default async function SqueezyMatesAllFilteredPage(props: { searchParams: Promise<SP> }) {
  const search = parseCatalogSearch(await props.searchParams);
  return <BrandCatalog name="SqueezyMates" brandSlug="squeezymates" base="/squeezymates/all" search={search} />;
}
