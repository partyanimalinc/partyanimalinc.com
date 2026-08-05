import { BrandCatalog, brandCatalogMetadata } from "@/components/brand-catalog";

type SP = Record<string, string | string[] | undefined>;

export function generateMetadata({ searchParams }: { searchParams: Promise<SP> }) {
  return brandCatalogMetadata(
    "All Jumbo Squeezy",
    "Browse the full Jumbo Squeezy collection, filterable by league, team, and series.",
    searchParams,
  );
}

export default function JumboSqueezyAllPage({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <BrandCatalog name="Jumbo Squeezy" brandSlug="jumbo-squeezy" base="/jumbo-squeezy/all" searchParams={searchParams} />
  );
}
