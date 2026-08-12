import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "About Us" };

const DIFFERENCE: { label: string; body: string }[] = [
  { label: "Fan-First Approach", body: "Every product starts with the fan experience." },
  { label: "Nostalgic Design, Modern Execution", body: "Blending throwback joy with sharp merchandising." },
  { label: "Retail-Ready and Digital-Enabled", body: "Built for shelves, eComm, and what's next." },
  { label: "Licensor Trusted", body: "Proud partners of the NFL, NBA, NHL, MLB, WNBA, and more." },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-heading mt-12 text-lg uppercase tracking-wide text-brand-red sm:text-xl">
      {children}
    </h3>
  );
}

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
        </div>

        <SectionHeading>We Bring the Party</SectionHeading>
        <div className="mt-4 space-y-6 text-lg leading-relaxed text-white/80">
          <p>
            Licensed sports collectibles, toys, drinkware, and gifts that
            celebrate team spirit in every form. From mini-figures to
            impulse-ready merch, we design to spark joy across all ages, whether
            it is a kid&rsquo;s first favorite player or a die-hard fan&rsquo;s
            gameday ritual.
          </p>
          <p>
            We build fun collectibles with a simple way in, a real thrill in the
            chase, and plenty of reasons to come back for the next pull. Find a
            favorite, build your lineup, complete the set. Our lineup includes
            TeenyMates, SqueezyMates, Jumbo Squeezy, and Team Gear, built in
            partnership with the NFL, MLB, NBA, NHL, WNBA, MLS, College, and
            more.
          </p>
        </div>

        <SectionHeading>Where We&rsquo;re Headed</SectionHeading>
        <div className="mt-4 space-y-6 text-lg leading-relaxed text-white/80">
          <p>
            We are building toward the most beloved fan-first brand in licensed
            sports, one that unites generations through play, celebration, and
            digital innovation. That means meeting fans wherever they are,
            whether they are cheering from the couch, the stadium, or halfway
            across the world, and growing into a modern platform that is
            data-driven, media-powered, and culturally relevant.
          </p>
          <p>
            The fun does not stop at the shelf. Scan to unlock rewards, chase new
            drops, and show off your pulls, because the best part of fandom is
            sharing it.
          </p>
        </div>

        <SectionHeading>Our Difference</SectionHeading>
        <ul className="mt-5 space-y-4">
          {DIFFERENCE.map((d) => (
            <li key={d.label} className="flex gap-3 text-lg leading-relaxed text-white/80">
              <span aria-hidden className="mt-1 shrink-0 text-brand-red">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>
                <strong className="text-white">{d.label}:</strong> {d.body}
              </span>
            </li>
          ))}
        </ul>

        <p className="font-heading mt-14 text-center text-2xl uppercase italic leading-tight text-white sm:text-3xl">
          &ldquo;For Fans. <span className="text-brand-red">Wherever They Cheer.</span>&rdquo;
        </p>
      </section>
    </>
  );
}
