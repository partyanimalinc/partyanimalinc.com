import { BrandCatalog, brandCatalogMetadata } from "@/components/brand-catalog";

// Clean brand catalog. ISR: never reads searchParams; filtered variants are
// rewritten by src/proxy.ts to the /_f twin (src/app/%5Ff/teenymates/all).
export const revalidate = 3600;

export const metadata = brandCatalogMetadata(
  "All TeenyMates",
  "Browse the full TeenyMates collection — team sets, collector tins, locker room sets, gift sets, advent calendars, and more, filterable by league, team, and series.",
  "/teenymates/all",
);

export default function TeenyMatesAllPage() {
  return <BrandCatalog name="TeenyMates" brandSlug="teenymates" base="/teenymates/all" search={{}} />;
}
