import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog, type CategoryProduct } from "@/lib/pim";
import { AdventVideoCarousel } from "@/components/advent/video-carousel";
import { AdventCalendarGrid, type CalendarCard } from "@/components/advent/calendar-grid";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Advent Calendars",
  description:
    "Countdown to gameday with officially licensed TeenyMates and SqueezyMates Advent Calendars. 24 daily reveal doors, one exclusive figure per day, across NFL, NBA, MLB, NHL, WNBA and College.",
  openGraph: {
    title: "Countdown to Gameday: Advent Calendars",
    description: "24 days. 24 surprises. Officially licensed TeenyMates & SqueezyMates Advent Calendars.",
    type: "website",
  },
};

// Curated grid: one card per league (base 2026 retail SKU), in display order.
// Channel-exclusive (DSG/Amazon) and older variants are intentionally hidden.
const TEENY: [string, string][] = [
  ["TMANF26", "NFL"],
  ["TMANL26", "NFL Legends"],
  ["TMANB26", "NBA"],
  ["TMAML26", "MLB"],
  ["TMANH26", "NHL"],
  ["TMANW26", "WNBA"],
  ["TMACO26", "College Football"],
];
const SQUEEZY: [string, string][] = [
  ["SHANF26", "NFL Helmet"],
  ["SHAML26", "MLB Cap"],
];

function toCards(order: [string, string][], bySku: Map<string, CategoryProduct>): CalendarCard[] {
  return order
    .map(([sku, league]) => {
      const p = bySku.get(sku);
      if (!p) return null;
      return { sku, league, slug: p.slug, name: p.name, image: p.image };
    })
    .filter((c): c is CalendarCard => c !== null);
}

function Star() {
  return <span className="text-brand-gold">★</span>;
}

export default async function AdventCalendarsPage() {
  const [teenyCat, squeezyCat] = await Promise.all([
    getCatalog({ line: "TMA", pageSize: 50 }),
    getCatalog({ line: "SHA", pageSize: 50 }),
  ]);
  const bySku = new Map<string, CategoryProduct>();
  for (const p of [...teenyCat.products, ...squeezyCat.products]) bySku.set(p.sku, p);

  const teeny = toCards(TEENY, bySku);
  const squeezy = toCards(SQUEEZY, bySku);

  return (
    <div className="bg-ink text-white">
      {/* ===================== HERO ===================== */}
      <section className="relative flex items-center overflow-hidden" style={{ minHeight: "min(64vh, 560px)" }}>
        {/* full-bleed festive product background (product is baked into the art) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/advent/advent-bg3.png"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center 42%" }}
        />
        {/* legibility scrim: darkest at left (behind the copy), clearing to the right */}
        {/* mobile scrim: the crop shows the busy product center, so darken the
            whole hero heavily for text legibility */}
        <div
          aria-hidden
          className="absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,7,9,.62) 0%, rgba(6,7,9,.8) 50%, rgba(6,7,9,.92) 100%)",
          }}
        />
        {/* bottom fade into the next section */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-28"
          style={{ background: "linear-gradient(to top, #070709, transparent)" }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-xl text-center lg:text-left">
            <h1>
              {/* transparent brush cutout, rendered at full opacity */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/advent/countdown-text.png"
                alt="Countdown to Gameday"
                width={1192}
                height={408}
                className="mx-auto w-full max-w-[540px] lg:mx-0"
              />
            </h1>
            <p className="label-athletic mt-5 text-xl uppercase tracking-wide text-white sm:text-2xl">
              24 Days. 24 Surprises.
              <br />
              Unlimited Excitement.
            </p>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/75 lg:mx-0">
              The officially licensed TeenyMates and SqueezyMates Advent Calendars are back and
              better than ever.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="#calendars"
                className="label-athletic inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-sm text-white shadow-xl shadow-brand-red/30 transition-colors hover:bg-brand-red-dark"
              >
                Shop All Calendars
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="#videos"
                className="label-athletic inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm text-white transition-colors hover:border-white hover:bg-white/10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                </svg>
                Watch Video
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== VIDEO (placeholder stub) ===================== */}
      <section
        id="videos"
        className="relative border-t border-ink-line bg-ink-soft"
        style={{ scrollMarginTop: "5rem" }}
      >
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-8">
          {/* Bijan bleeds UP into the hero (negative top) and DOWN behind the
              carousel (carousel gets a higher z-index below). Centered group. */}
          <div className="relative z-10 mx-auto mb-8 flex max-w-5xl flex-col items-center gap-2 text-center sm:-mb-12 sm:flex-row sm:items-end sm:gap-8 sm:text-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/advent/bijan-santa.png"
              alt="Bijan Robinson holding a TeenyMates figure"
              width={695}
              height={580}
              className="w-64 shrink-0 sm:-mt-16 sm:w-80 lg:-mt-24 lg:w-96"
              style={{ filter: "drop-shadow(0 18px 34px rgba(0,0,0,0.55))" }}
            />
            <div className="sm:pb-16">
              <p className="font-brush text-2xl text-brand-red sm:text-3xl">Collect Like a Pro</p>
              <h2 className="font-heading text-3xl uppercase leading-none text-white sm:text-4xl">
                Bijan Robinson
              </h2>
              <p className="mt-3 max-w-md text-sm text-white/60">
                See how NFL star Bijan Robinson counts down to gameday with TeenyMates and
                SqueezyMates.
              </p>
            </div>
          </div>

          <div className="relative z-20">
            <AdventVideoCarousel />
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className="label-athletic inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-xs uppercase tracking-wide text-white transition-colors hover:border-brand-red hover:bg-brand-red"
            >
              View Full Video Gallery
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ===================== SHOP ALL CALENDARS ===================== */}
      <section id="calendars" className="border-t border-ink-line" style={{ scrollMarginTop: "5rem" }}>
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-8" style={{ paddingTop: "4.5rem", paddingBottom: "4.5rem" }}>
          <div className="mb-10 flex items-center justify-center gap-4">
            <Star />
            <h2 className="font-heading text-center text-2xl uppercase text-white sm:text-3xl">
              Shop All Advent Calendars
            </h2>
            <Star />
          </div>
          <AdventCalendarGrid teeny={teeny} squeezy={squeezy} />
        </div>
      </section>

      {/* ===================== RETAILERS ===================== */}
      <section className="relative overflow-hidden border-t border-ink-line">
        {/* festive bg with a red brush divider baked into the center */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/advent/shop-at-bg.png"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0" style={{ background: "rgba(6,7,9,0.32)" }} />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:gap-0 lg:px-8">
          {/* Amazon (left of the red divider) */}
          <div className="flex flex-col items-center text-center md:pr-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/advent/amazon-available.png" alt="Available at Amazon" width={1500} height={723} className="h-20 w-auto sm:h-24" />
            <p className="mt-3 text-sm text-white/60">Fast, easy, and reliable.</p>
            <a
              href="https://www.amazon.com/stores/PartyAnimalInc/page/6A6BA724-BD28-4888-868B-B57287C3DFCB"
              target="_blank"
              rel="noopener noreferrer"
              className="label-athletic mt-6 inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-sm text-white shadow-lg shadow-brand-red/30 transition-colors hover:bg-brand-red-dark"
            >
              Shop on Amazon
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          {/* Dick's (right of the red divider) */}
          <div className="flex flex-col items-center text-center md:pl-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/advent/dsg-primary.svg" alt="Dick's Sporting Goods" width={946} height={388} className="h-14 w-auto sm:h-16" />
            <p className="mt-4 font-heading text-xl uppercase text-white">Exclusive Rare Figures</p>
            <p className="font-heading text-lg uppercase text-brand-gold">Only at Dick&apos;s</p>
            <p className="mt-2 max-w-xs text-sm text-white/70">
              Find ultra rare, exclusive figures in select TeenyMates Advent Calendars.
            </p>
            <a
              href="#"
              className="label-athletic mt-6 inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
