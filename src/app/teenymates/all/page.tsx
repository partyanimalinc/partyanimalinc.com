import type { Metadata } from "next";
import { BrandCatalog } from "@/components/brand-catalog";

type SP = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: "All TeenyMates",
  description:
    "Browse the full TeenyMates collection — team sets, collector tins, locker room sets, gift sets, advent calendars, and more, filterable by league, team, and series.",
};

export default function TeenyMatesAllPage({ searchParams }: { searchParams: Promise<SP> }) {
  return (
    <BrandCatalog name="TeenyMates" brandSlug="teenymates" base="/teenymates/all" searchParams={searchParams} />
  );
}
