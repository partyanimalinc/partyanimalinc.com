import type { Metadata } from "next";
import { AllProductsCatalog, allProductsMetadata } from "@/components/all-products-catalog";

// The clean full-catalog page. ISR: it never reads searchParams. A request that
// carries a facet, sort or page param is rewritten by src/proxy.ts to the
// on-demand twin under src/app/%5Ff/products/all (served at /_f/products/all).
export const revalidate = 3600;

export const metadata: Metadata = allProductsMetadata();

export default function AllProductsPage() {
  return <AllProductsCatalog search={{}} />;
}
