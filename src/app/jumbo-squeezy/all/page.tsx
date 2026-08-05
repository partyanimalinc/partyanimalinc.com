import type { Metadata } from "next";
import { BrandCatalog } from "@/components/brand-catalog";

type SP = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: "All Jumbo Squeezy",
  description: "Browse the full Jumbo Squeezy collection, filterable by league, team, and series.",
};

export default function JumboSqueezyAllPage({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <BrandCatalog name="Jumbo Squeezy" brandSlug="jumbo-squeezy" base="/jumbo-squeezy/all" searchParams={searchParams} />
  );
}
