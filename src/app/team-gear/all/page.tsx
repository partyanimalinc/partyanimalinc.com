import type { Metadata } from "next";
import { BrandCatalog } from "@/components/brand-catalog";

type SP = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: "All Team Gear",
  description: "Browse all Team Gear — flags and banners, drinkware, and homegating décor to rep your team.",
};

export default function TeamGearAllPage({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <BrandCatalog name="Team Gear" brandSlug="team-gear" base="/team-gear/all" searchParams={searchParams} />
  );
}
