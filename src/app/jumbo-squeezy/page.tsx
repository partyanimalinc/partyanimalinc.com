import type { Metadata } from "next";
import { BrandLanding } from "@/components/brand-landing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Jumbo Squeezy",
  description:
    "Jumbo Squeezy: go big and squeezy with oversized, officially licensed squeezable helmet figures. Big, bold, and built to show off your team pride.",
  path: "/jumbo-squeezy",
});

export default function JumboSqueezyPage() {
  return (
    <BrandLanding
      name="Jumbo Squeezy"
      heading="Jumbo Squeezy: Oversized Squeezable Helmet Figures"
      base="/jumbo-squeezy"
      heroSrc="/lineup/jumbo-squeezy-hero.png"
      heroWidth={1672}
      heroHeight={953}
      description="Jumbo Squeezy takes the squeezable fun and sizes it up. Big, bold, and built to show off your team pride."
    />
  );
}
