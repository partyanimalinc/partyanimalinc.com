import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Us"
        eyebrow="Built for Real Ones"
        bgImage="/headers/hq-banner.png"
        bgPosition="center"
        scrim
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Heritage emblem */}
        <div className="mb-10 flex justify-center">
          <Image
            src="/brand/heritage-logo.png"
            alt="The Party Animal"
            width={600}
            height={435}
            className="h-auto w-56 drop-shadow-[0_6px_24px_rgba(0,0,0,0.5)] sm:w-64"
            priority
          />
        </div>

        <h2 className="font-heading text-center text-xl uppercase leading-tight text-white sm:text-3xl">
          Bringing <span className="text-brand-red">the Party</span> for 37 Years
        </h2>

        <div className="mt-8 space-y-6 text-lg leading-relaxed text-white/80">
          <p>
            <strong className="text-white">Since 1989</strong>, Party Animal has
            made officially licensed products that let fans celebrate the teams
            and players they love. We turned fandom into something you can hold,
            display, and share, and every piece still comes from the same place
            it always has: a genuine love of the game and the people who live for
            it.
          </p>
          <p>
            We build fun, impulse-friendly collectibles with a simple way in, a
            real thrill in the chase, and plenty of reasons to come back for the
            next pull. Find a favorite, build your lineup, complete the set. And
            the fun does not stop at the shelf: scan to unlock rewards, chase new
            drops, and show off your pulls, because the best part of fandom is
            sharing it.
          </p>
          <p>
            Our lineup includes TeenyMates, SqueezyMates, Jumbo Squeezy, and Team
            Gear, built in partnership with the NFL, MLB, NBA, NHL, WNBA, MLS,
            College, and more. Officially licensed and made for real ones. Pick
            your team. Collect your favorites. Show your fandom anywhere.
          </p>
        </div>
      </section>
    </>
  );
}
