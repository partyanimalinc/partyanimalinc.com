import { BrandCatalog, brandCatalogMetadata } from "@/components/brand-catalog";

type SP = Record<string, string | string[] | undefined>;

export function generateMetadata({ searchParams }: { searchParams: Promise<SP> }) {
  return brandCatalogMetadata(
    "All TeenyMates",
    "Browse the full TeenyMates collection — team sets, collector tins, locker room sets, gift sets, advent calendars, and more, filterable by league, team, and series.",
    searchParams,
  );
}

export default function TeenyMatesAllPage({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <BrandCatalog name="TeenyMates" brandSlug="teenymates" base="/teenymates/all" searchParams={searchParams} />
  );
}
