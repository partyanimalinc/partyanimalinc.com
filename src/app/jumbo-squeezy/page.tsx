import type { Metadata } from "next";
import { BrandLanding } from "@/components/brand-landing";

export const metadata: Metadata = {
  title: "Jumbo Squeezy",
  description: "Jumbo Squeezy: go big and squeezy with oversized helmeted figures.",
};

export default function JumboSqueezyPage() {
  return (
    <BrandLanding
      name="Jumbo Squeezy"
      base="/jumbo-squeezy"
      heroSrc="/lineup/jumbo-squeezy-hero.png"
      heroWidth={1672}
      heroHeight={953}
      description="Jumbo Squeezy takes the squeezable fun and sizes it up. Big, bold, and built to show off your team pride."
    />
  );
}
