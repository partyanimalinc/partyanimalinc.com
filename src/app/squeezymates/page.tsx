import type { Metadata } from "next";
import { BrandLanding } from "@/components/brand-landing";

export const metadata: Metadata = {
  title: "SqueezyMates",
  description:
    "SqueezyMates are squeezable collectible sports figures. Squeeze into action.",
};

export default function SqueezyMatesPage() {
  return (
    <BrandLanding
      name="SqueezyMates"
      base="/squeezymates"
      heroSrc="/lineup/squeezymates-hero.png"
      heroWidth={1672}
      heroHeight={940}
      description="SqueezyMates are soft, squeezable collectible sports figures fans can’t put down. Squeeze into action with your favorite teams and players."
    />
  );
}
