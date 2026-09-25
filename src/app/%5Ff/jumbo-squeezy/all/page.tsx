import type { Metadata } from "next";
import { BrandCatalog, brandCatalogMetadata } from "@/components/brand-catalog";
import { parseCatalogSearch } from "@/lib/catalog-url";
import { filteredVariantMetadata } from "@/lib/seo";

// On-demand twin of /jumbo-squeezy/all for filtered / sorted / paged requests.
// Reached only through the src/proxy.ts rewrite (see LISTING_ROUTE there).
export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

export const metadata: Metadata = filteredVariantMetadata(
  brandCatalogMetadata(
    "All Jumbo Squeezy",
    "Browse the full Jumbo Squeezy collection, filterable by league, team, and series.",
    "/jumbo-squeezy/all",
  ),
  "/jumbo-squeezy/all",
);

export default async function JumboSqueezyAllFilteredPage(props: { searchParams: Promise<SP> }) {
  const search = parseCatalogSearch(await props.searchParams);
  return <BrandCatalog name="Jumbo Squeezy" brandSlug="jumbo-squeezy" base="/jumbo-squeezy/all" search={search} />;
}
