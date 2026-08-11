import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getLicenses } from "@/lib/pim";
import { TeamFinder } from "@/components/team-finder";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Team Gear",
  description:
    "Team Gear: flags and banners, drinkware, signs and homegating décor to rep your team everywhere. Officially licensed across the NFL, NBA, MLB, NHL, College and more.",
};

const IMG =
  "https://prgnshkxyyxygdpowdnu.supabase.co/storage/v1/object/public/product-images";

// Leagues to surface as "Find Your Team" tabs and "Browse by League" tiles, in
// this order. Resolved against getLicenses() by slug; any that have no
// web-visible teams/products are dropped.
const LEAGUE_ORDER = ["nfl", "nba", "mlb", "nhl", "wnba", "college"];

// "Popular Teams" — the marquee six. Logos + ids are resolved from the licenses
// feed at render so they always match the PIM.
const POPULAR = [
  "Dallas Cowboys",
  "Kansas City Chiefs",
  "Los Angeles Lakers",
  "New York Yankees",
  "San Francisco 49ers",
  "Boston Bruins",
];

// Browse by Category — the three real Team Gear categories padded with three
// marquee product lines, so the row reads like the mockup's product-type shelf.
const CATEGORY_TILES = [
  { name: "Flags & Banners", href: "/products/flags-banners", img: `${IMG}/TTBU/primary-1781885184401-b440c71b-9f87-441a-a7ae-fc7e3b763da1.png` },
  { name: "Drinkware", href: "/products/drinkware", img: `${IMG}/TSBRU/TSBRU_art.jpg` },
  { name: "Signs & Décor", href: "/products/homegating-decor", img: `${IMG}/NLGB/hero-c79112ff-70b7-4ffe-8036-8a81509b7a83.jpg` },
  { name: "Garden Flags", href: "/team-gear/all?line=GM", img: `${IMG}/GMBAL/hero-dd422497-677c-4471-bcb4-ac68fb978599.jpg` },
  { name: "Metal Signs", href: "/team-gear/all?line=VS", img: `${IMG}/VSAT/VSAT.jpg` },
  { name: "Party Cups", href: "/team-gear/all?line=PC", img: `${IMG}/PCBA/primary-1783013441779-fe87fd87-0771-4cb4-a812-9d092cace2a7.jpg` },
];

// Featured Gear — top team product lines (per PIM parent_code counts).
const FEATURED_LINES = [
  { name: "Applique Banner Flags", href: "/team-gear/all?line=AF", img: `${IMG}/AFATU/legacy-ea972bd94e88.jpg` },
  { name: "Giant 8ft Banners", href: "/team-gear/all?line=B", img: `${IMG}/BCEL/hero-5a5815d8-b36c-41e6-bb78-8c2b7a9eacdc.jpg` },
  { name: "Water Cooler Mugs", href: "/team-gear/all?line=WM", img: `${IMG}/WMCUB/std-primary-1781286652458-3f842e6d-79f7-4578-a80e-67d19e2e6f41.jpg` },
  { name: "Squeezy Water Bottles", href: "/team-gear/all?line=SW", img: `${IMG}/SWAU/primary-1782864577024-3b222d7e-e3e6-4786-9e50-84ba08f420c1.jpg` },
  { name: "Frosted Night Lights", href: "/team-gear/all?line=TL", img: `${IMG}/TLDA/legacy-c48f75a65068.jpg` },
];

export default async function TeamGearPage() {
  const leagues = await getLicenses();

  // Curated, ordered league subset for the finder + league tiles.
  const bySlug = new Map(leagues.map((l) => [l.slug, l]));
  const orderedLeagues = LEAGUE_ORDER.map((s) => bySlug.get(s)).filter(
    (l): l is NonNullable<typeof l> => !!l && l.teams.length > 0,
  );

  // Resolve the popular six to {id, name, image}.
  const allTeams = leagues.flatMap((l) => l.teams);
  const popular = POPULAR.map((name) => allTeams.find((t) => t.name === name)).filter(
    (t): t is NonNullable<typeof t> => !!t,
  );

  // League tiles: the five major leagues (fixed), independent of tab order.
  const LEAGUE_TILE_SLUGS = ["nfl", "nba", "mlb", "nhl", "college"];
  const leagueTiles = LEAGUE_TILE_SLUGS.map((s) => bySlug.get(s)).filter(
    (l): l is NonNullable<typeof l> => !!l && l.teams.length > 0,
  );

  return (
    <>
      {/* Hero — designed banner (title + products baked in); intro + CTAs below */}
      <section className="bg-ink">
        <Image
          src="/lineup/team-gear-hero.png"
          alt="Team Gear — Everything for Every Fan"
          width={1672}
          height={940}
          priority
          className="h-auto w-full"
        />
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-12 text-center lg:py-14">
          <p className="max-w-2xl text-lg leading-relaxed text-white/75">
            From flags and banners to drinkware, signs and homegating décor, Team Gear
            has everything you need to rep your team, everywhere.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#find-your-team"
              className="label-athletic inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-8 py-3.5 text-sm text-white transition-colors hover:bg-brand-red-dark"
            >
              Browse by Team
            </a>
            <Link
              href="/team-gear/all"
              className="label-athletic inline-flex items-center justify-center gap-2 rounded-full border border-ink-line px-8 py-3.5 text-sm text-white transition-colors hover:border-brand-red"
            >
              Browse All Team Gear
            </Link>
          </div>
        </div>
      </section>

      {/* Find Your Team — league tabs + logo grid */}
      <TeamFinder leagues={orderedLeagues} />

      {/* Popular Teams */}
      {popular.length > 0 && (
        <section className="bg-ink py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <h2 className="font-heading text-3xl uppercase tracking-tight text-white sm:text-4xl">
                Popular Teams
              </h2>
              <Link
                href="/team-gear/all"
                className="label-athletic hidden items-center gap-1.5 text-xs text-brand-red hover:text-brand-red-dark sm:inline-flex"
              >
                View All Teams
                <Arrow />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {popular.map((t) => (
                <a
                  key={t.id}
                  href={`/team-gear/all?team=${t.id}`}
                  aria-label={`Browse ${t.name} Team Gear`}
                  className="tg-card group flex flex-col"
                >
                  <div className="tg-tile relative flex aspect-square flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-ink-line bg-ink-soft p-5">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.14]"
                      style={{
                        backgroundImage: "url(/headers/header-bg.png)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    {t.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.image}
                        alt=""
                        loading="lazy"
                        className="relative max-h-24 w-auto object-contain"
                      />
                    )}
                    <span className="relative font-heading text-center text-sm uppercase leading-tight text-white">
                      {t.name}
                    </span>
                    <span className="label-athletic relative inline-flex items-center gap-1 text-[0.7rem] text-brand-red">
                      Browse
                      <Arrow />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse by Category */}
      <TileRow
        title="Browse by Category"
        tiles={CATEGORY_TILES}
        cta={{ label: "Browse All Categories", href: "/team-gear/all" }}
      />

      {/* Browse by League */}
      <section className="bg-ink-soft py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl uppercase tracking-tight text-white sm:text-4xl">
            Browse by League
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {leagueTiles.map((l) => (
              <a
                key={l.id}
                href={`/team-gear/all?league=${l.id}`}
                aria-label={`Browse ${l.name} Team Gear`}
                className="tg-card group flex flex-col"
              >
                <div className="tg-tile relative flex aspect-[4/3] flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-ink-line bg-ink p-5">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.12]"
                    style={{
                      backgroundImage: "url(/headers/header-bg.png)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  {l.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.image} alt="" loading="lazy" className="relative max-h-16 w-auto object-contain" />
                  ) : (
                    <span className="relative font-heading text-2xl uppercase text-white/80">{l.name}</span>
                  )}
                  <span className="label-athletic relative text-xs text-white">{l.name}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gear — top team product lines */}
      <TileRow
        title="Featured Gear"
        tiles={FEATURED_LINES}
        cta={{ label: "Browse All Team Gear", href: "/team-gear/all" }}
        light
      />

      {/* Rep Your Team Everywhere — lifestyle band */}
      <section className="relative isolate overflow-hidden bg-ink">
        <Image
          src="/lineup/banner-teamgear.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/20" />
        <div className="relative mx-auto flex min-h-[340px] max-w-7xl flex-col justify-center gap-5 px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl uppercase leading-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
            Rep Your Team
            <br />
            Everywhere
          </h2>
          <p className="max-w-md text-lg text-white/85 drop-shadow">
            From the stadium to your space. Show your pride loud and proud.
          </p>
          <div>
            <Link
              href="/team-gear/all"
              className="label-athletic inline-flex items-center gap-2 rounded-full bg-brand-red px-8 py-3.5 text-sm text-white transition-colors hover:bg-brand-red-dark"
            >
              Browse Team Gear
              <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* Ready to Rip — closing CTA band */}
      <section className="bg-brand-red">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-8 text-center sm:px-6 lg:flex-row lg:text-left">
          <div>
            <h2 className="font-heading text-2xl uppercase text-white sm:text-3xl">Ready to Rip?</h2>
            <p className="mt-1 text-white/85">Explore the full catalog and bring the energy home.</p>
          </div>
          <Link
            href="/team-gear/all"
            className="label-athletic inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm text-brand-red transition-colors hover:bg-white/90"
          >
            Browse All Team Gear
            <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}

type Tile = { name: string; href: string; img: string };

// Shared light/product tile row (reuses the Featured Collections .fc-* styling).
function TileRow({
  title,
  tiles,
  cta,
  light,
}: {
  title: string;
  tiles: Tile[];
  cta: { label: string; href: string };
  light?: boolean;
}) {
  return (
    <section className={light ? "bg-white py-14 text-ink lg:py-20" : "bg-ink py-14 lg:py-20"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          className={`font-heading text-3xl uppercase tracking-tight sm:text-4xl ${
            light ? "text-center text-ink lg:text-5xl" : "text-white"
          }`}
        >
          {title}
        </h2>
        <div
          className={`mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-10 lg:gap-6 ${
            tiles.length >= 6 ? "lg:grid-cols-6" : "lg:grid-cols-5"
          }`}
        >
          {tiles.map((t) => (
            <a
              key={t.name}
              href={t.href}
              aria-label={`Browse ${t.name}`}
              className="fc-card flex flex-col items-center text-center"
            >
              <div className="fc-tile w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.img} alt={t.name} width={640} height={640} loading="lazy" className="fc-img" />
              </div>
              <span
                className={`font-heading mt-4 text-sm uppercase leading-tight tracking-wide sm:text-base ${
                  light ? "text-ink" : "text-white"
                }`}
              >
                {t.name}
              </span>
            </a>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link
            href={cta.href}
            className="label-athletic rounded-full bg-brand-red px-9 py-4 text-sm text-white shadow-sm transition-colors hover:bg-brand-red-dark"
          >
            {cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
