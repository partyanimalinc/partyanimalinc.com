import { BrandCatalog, brandCatalogMetadata } from "@/components/brand-catalog";

type SP = Record<string, string | string[] | undefined>;

export function generateMetadata({ searchParams }: { searchParams: Promise<SP> }) {
  return brandCatalogMetadata(
    "All SqueezyMates",
    "Browse the full SqueezyMates collection, filterable by league, team, and series.",
    searchParams,
  );
}

export default function SqueezyMatesAllPage({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <BrandCatalog name="SqueezyMates" brandSlug="squeezymates" base="/squeezymates/all" searchParams={searchParams} />
  );
}
