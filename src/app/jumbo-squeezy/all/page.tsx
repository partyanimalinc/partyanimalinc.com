import { BrandCatalog, brandCatalogMetadata } from "@/components/brand-catalog";

// Clean brand catalog. ISR: never reads searchParams; filtered variants are
// rewritten by src/proxy.ts to the /_f twin (src/app/%5Ff/jumbo-squeezy/all).
export const revalidate = 3600;

export const metadata = brandCatalogMetadata(
  "All Jumbo Squeezy",
  "Browse the full Jumbo Squeezy collection, filterable by league, team, and series.",
  "/jumbo-squeezy/all",
);

export default function JumboSqueezyAllPage() {
  return <BrandCatalog name="Jumbo Squeezy" brandSlug="jumbo-squeezy" base="/jumbo-squeezy/all" search={{}} />;
}
