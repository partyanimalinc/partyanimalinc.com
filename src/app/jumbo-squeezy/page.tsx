import type { Metadata } from "next";
import { CollectionCatalogPage } from "@/components/collection-catalog-page";

export const metadata: Metadata = {
  title: "Jumbo Squeezy",
  description: "Jumbo Squeezy: go big and squeezy with oversized helmeted figures.",
};

type SP = Record<string, string | string[] | undefined>;

export default function JumboSqueezyPage({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <CollectionCatalogPage
      name="Jumbo Squeezy"
      brandSlug="jumbo-squeezy"
      base="/jumbo-squeezy"
      heroSrc="/lineup/jumbo-squeezy-hero.png"
      heroWidth={1672}
      heroHeight={953}
      description="Jumbo Squeezy takes the squeezable fun and sizes it up. Big, bold, and built to show off your team pride."
      searchParams={searchParams}
    />
  );
}
