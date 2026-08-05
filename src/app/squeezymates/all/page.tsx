import type { Metadata } from "next";
import { BrandCatalog } from "@/components/brand-catalog";

type SP = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: "All SqueezyMates",
  description: "Browse the full SqueezyMates collection, filterable by league, team, and series.",
};

export default function SqueezyMatesAllPage({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <BrandCatalog name="SqueezyMates" brandSlug="squeezymates" base="/squeezymates/all" searchParams={searchParams} />
  );
}
