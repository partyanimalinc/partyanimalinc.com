import type { Metadata } from "next";
import { BrandLanding } from "@/components/brand-landing";

export const metadata: Metadata = {
  title: "Team Gear",
  description: "Team Gear: flags, bottles, signs and more to rep your team everywhere.",
};

export default function TeamGearPage() {
  return (
    <BrandLanding
      name="Team Gear"
      base="/team-gear"
      heroSrc="/lineup/team-gear-hero.png"
      heroWidth={1672}
      heroHeight={940}
      description="From flags and banners to drinkware, signs and homegating décor, Team Gear has everything you need to rep your team, everywhere."
    />
  );
}
