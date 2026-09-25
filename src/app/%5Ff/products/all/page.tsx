import type { Metadata } from "next";
import { AllProductsCatalog, allProductsMetadata } from "@/components/all-products-catalog";
import { CATALOG_BASE, parseCatalogSearch } from "@/lib/catalog-url";
import { filteredVariantMetadata } from "@/lib/seo";

// On-demand twin of /products/all for filtered / sorted / paged requests.
// Reached only through the src/proxy.ts rewrite (see LISTING_ROUTE there).
export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

export const metadata: Metadata = filteredVariantMetadata(allProductsMetadata(), CATALOG_BASE);

export default async function AllProductsFilteredPage(props: { searchParams: Promise<SP> }) {
  const search = parseCatalogSearch(await props.searchParams);
  return <AllProductsCatalog search={search} />;
}
