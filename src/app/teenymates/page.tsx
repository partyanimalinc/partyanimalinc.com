import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WhatAreTeenymates } from "@/components/what-are-teenymates";
import { CollectByLeague } from "@/components/collect-by-league";
import { FeaturedCollections } from "@/components/featured-collections";
import { ChaseFigures } from "@/components/chase-figures";
import { FanFavorites } from "@/components/fan-favorites";

export const metadata: Metadata = {
  title: "TeenyMates",
  description:
    "TeenyMates are small-format collectible figures designed around the sports, teams, and players fans love most.",
};

// Landing page only. The filterable catalog lives at /teenymates/all; the
// sections below link into it (by league, by collection, or all).
export default function TeenyMatesPage() {
  return (
    <>
      <section className="relative bg-ink">
        <Image
          src="/lineup/teenymates-hero.png"
          alt="TeenyMates"
          width={1672}
          height={941}
          priority
          className="h-auto w-full"
        />
      </section>

      {/* Primary entry point into the catalog */}
      <section className="bg-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-9 text-center sm:flex-row sm:justify-center sm:gap-7">
          <p className="font-heading text-lg uppercase tracking-tight text-white sm:text-xl">
            Tiny figures. Serious collectibles.
          </p>
          <Link
            href="/teenymates/all"
            className="label-athletic inline-flex items-center gap-2 rounded-full bg-brand-red px-8 py-3.5 text-sm text-white transition-colors hover:bg-brand-red-dark"
          >
            Browse All TeenyMates
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>

      <WhatAreTeenymates />
      <CollectByLeague />
      <FeaturedCollections />
      <ChaseFigures />
      <FanFavorites />
    </>
  );
}
