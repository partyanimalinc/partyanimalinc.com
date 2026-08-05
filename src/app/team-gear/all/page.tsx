import { BrandCatalog, brandCatalogMetadata } from "@/components/brand-catalog";

type SP = Record<string, string | string[] | undefined>;

export function generateMetadata({ searchParams }: { searchParams: Promise<SP> }) {
  return brandCatalogMetadata(
    "All Team Gear",
    "Browse all Team Gear — flags and banners, drinkware, and homegating décor to rep your team.",
    searchParams,
  );
}

export default function TeamGearAllPage({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <BrandCatalog name="Team Gear" brandSlug="team-gear" base="/team-gear/all" searchParams={searchParams} />
  );
}
