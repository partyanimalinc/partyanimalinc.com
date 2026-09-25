import { BrandCatalog, brandCatalogMetadata } from "@/components/brand-catalog";

// Clean brand catalog. ISR: never reads searchParams; filtered variants are
// rewritten by src/proxy.ts to the /_f twin (src/app/%5Ff/team-gear/all).
export const revalidate = 3600;

export const metadata = brandCatalogMetadata(
  "All Team Gear",
  "Browse all Team Gear — flags and banners, drinkware, and homegating décor to rep your team.",
  "/team-gear/all",
);

export default function TeamGearAllPage() {
  return <BrandCatalog name="Team Gear" brandSlug="team-gear" base="/team-gear/all" search={{}} />;
}
