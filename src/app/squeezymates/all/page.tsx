import { BrandCatalog, brandCatalogMetadata } from "@/components/brand-catalog";

// Clean brand catalog. ISR: never reads searchParams; filtered variants are
// rewritten by src/proxy.ts to the /_f twin (src/app/%5Ff/squeezymates/all).
export const revalidate = 3600;

export const metadata = brandCatalogMetadata(
  "All SqueezyMates",
  "Browse the full SqueezyMates collection, filterable by league, team, and series.",
  "/squeezymates/all",
);

export default function SqueezyMatesAllPage() {
  return <BrandCatalog name="SqueezyMates" brandSlug="squeezymates" base="/squeezymates/all" search={{}} />;
}
