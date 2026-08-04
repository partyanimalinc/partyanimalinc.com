import type { Metadata } from "next";
import { CollectionCatalogPage } from "@/components/collection-catalog-page";
import { WhatAreTeenymates } from "@/components/what-are-teenymates";

export const metadata: Metadata = {
  title: "TeenyMates",
  description:
    "TeenyMates are small-format collectible figures designed around the sports, teams, and players fans love most.",
};

type SP = Record<string, string | string[] | undefined>;

export default function TeenyMatesPage({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <CollectionCatalogPage
      name="TeenyMates"
      brandSlug="teenymates"
      base="/teenymates"
      heroSrc="/lineup/teenymates-hero.png"
      heroWidth={1672}
      heroHeight={941}
      afterHero={<WhatAreTeenymates />}
      description="Tiny figures. Serious collectibles. Incredible detail, officially licensed teams, star players, and rare chase figures. Built for fans who never stop collecting."
      searchParams={searchParams}
    />
  );
}
