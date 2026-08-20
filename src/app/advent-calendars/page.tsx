import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog, type CategoryProduct } from "@/lib/pim";
import { AdventVideoCarousel } from "@/components/advent/video-carousel";
import { AdventShop, type CalendarCard } from "@/components/advent/advent-shop";

export const revalidate = 3600;

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
                All Calendars
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a
                href="https://www.dickssportinggoods.com/f/fan-shop-advent-calendars"
                target="_blank"
                rel="noopener noreferrer"
                className="label-athletic inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Shop at Dick&apos;s Sporting Goods
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
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

      <AdventShop teeny={teeny} squeezy={squeezy} />

    </div>
  );
}
