import type { Metadata } from "next";
import { CollectionCatalogPage } from "@/components/collection-catalog-page";

export const metadata: Metadata = {
  title: "Team Gear",
  description: "Team Gear: flags, bottles, signs and more to rep your team everywhere.",
};

type SP = Record<string, string | string[] | undefined>;

export default function TeamGearPage({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <CollectionCatalogPage
      name="Team Gear"
      brandSlug="team-gear"
      base="/team-gear"
      heroSrc="/lineup/team-gear-hero.png"
      heroWidth={1672}
      heroHeight={940}
      description="From flags and banners to drinkware, signs and homegating décor, Team Gear has everything you need to rep your team, everywhere."
      searchParams={searchParams}
    />
  );
}
