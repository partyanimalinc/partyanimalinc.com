import type { Metadata } from "next";
import { CollectionCatalogPage } from "@/components/collection-catalog-page";

export const metadata: Metadata = {
  title: "SqueezyMates",
  description:
    "SqueezyMates are squeezable collectible sports figures. Squeeze into action.",
};

type SP = Record<string, string | string[] | undefined>;

export default function SqueezyMatesPage({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <CollectionCatalogPage
      name="SqueezyMates"
      brandSlug="squeezymates"
      base="/squeezymates"
      heroSrc="/lineup/squeezymates-hero.png"
      heroWidth={1672}
      heroHeight={940}
      description="SqueezyMates are soft, squeezable collectible sports figures fans can’t put down. Squeeze into action with your favorite teams and players."
      searchParams={searchParams}
    />
  );
}
