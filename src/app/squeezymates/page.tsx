import type { Metadata } from "next";
import { BrandLanding } from "@/components/brand-landing";
import { SqueezyByLeague } from "@/components/squeezy-by-league";
import { SqueezyFeaturedCollections } from "@/components/squeezy-featured-collections";
import { ChaseFigures } from "@/components/chase-figures";
import { SqueezyFanFavorites } from "@/components/squeezy-fan-favorites";

export const metadata: Metadata = {
  title: "SqueezyMates",
  description:
    "SqueezyMates are squeezable collectible sports figures. Squeeze into action.",
};

export default function SqueezyMatesPage() {
  return (
    <>
      <BrandLanding
        name="SqueezyMates"
        base="/squeezymates"
        heroSrc="/lineup/squeezymates-hero.png"
        heroWidth={1672}
        heroHeight={940}
        description="SqueezyMates are soft, squeezable collectible sports figures fans can’t put down. Squeeze into action with your favorite teams and players."
        introImage={{ src: "/lineup/squeezymates-slofoam.png", width: 732, height: 549, alt: "SqueezyMates Slo Foam" }}
      />
      <SqueezyByLeague />
      <SqueezyFeaturedCollections />
      <ChaseFigures figClassName="chase-fig-sm" />
      <SqueezyFanFavorites />
    </>
  );
}
