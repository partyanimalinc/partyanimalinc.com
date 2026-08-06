"use client";

import { useEffect, useRef } from "react";

// "Collect by League" carousel for SqueezyMates (Figma "SM-by-League"). Same
// endless carousel as the TeenyMates version, but the tiles are tall/portrait
// with BRIGHT SOLID per-league backgrounds (from the Figma) instead of dark
// gradients; the figure + league logo ride on top as a transparent content
// image. Tiles link to the clean /squeezymates/{league} landing pages.

type League = { name: string; slug: string; content: string; bg: string };

const LEAGUES: League[] = [
  { name: "NFL", slug: "nfl", content: "content-nfl", bg: "#B72C2E" },
  { name: "MLB", slug: "mlb", content: "content-mlb", bg: "#124889" },
  { name: "NFL Legends", slug: "nfl-legends", content: "content-nfl-legends", bg: "#1B4F76" },
  { name: "NBA", slug: "nba", content: "content-nba", bg: "#46326C" },
  { name: "NBA Legends", slug: "nba-legends", content: "content-nba-legends", bg: "#EFB014" },
  { name: "NHL", slug: "nhl", content: "content-nhl", bg: "#EF6914" },
  { name: "WNBA", slug: "wnba", content: "content-wnba", bg: "#44541D" },
  { name: "College", slug: "college", content: "content-college", bg: "#142C51" },
];

const LOOP = [...LEAGUES, ...LEAGUES, ...LEAGUES];

function Arrow({ dir, onClick }: { dir: "l" | "r"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "l" ? "Previous leagues" : "Next leagues"}
      className={`absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-ink/70 text-white backdrop-blur transition-colors hover:border-brand-red hover:text-brand-red md:grid ${
        dir === "l" ? "-left-3 lg:-left-5" : "-right-3 lg:-right-5"
      }`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d={dir === "l" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function SqueezyByLeague() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const copyW = () => el.scrollWidth / 3;
    const center = () => {
      el.scrollLeft = copyW();
    };
    const raf = requestAnimationFrame(center);
    let idle: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(idle);
      idle = setTimeout(() => {
        const w = copyW();
        if (w > 0 && (el.scrollLeft < w || el.scrollLeft >= 2 * w)) {
          el.scrollLeft = (el.scrollLeft % w) + w;
        }
      }, 120);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", center);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idle);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", center);
    };
  }, []);

  const step = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const w = el.scrollWidth / 3;
    if (w > 0) el.scrollLeft = (el.scrollLeft % w) + w;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 560), behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-ink py-14 lg:py-20">
      <div className="mx-auto max-w-[96rem] px-6 sm:px-8">
        <h2 className="font-heading text-center text-3xl uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
          Collect by <span className="text-brand-red">League</span>
        </h2>

        <div className="relative mt-8 lg:mt-10">
          <Arrow dir="l" onClick={() => step(-1)} />
          <Arrow dir="r" onClick={() => step(1)} />
          <div
            ref={track}
            className="flex gap-4 overflow-x-auto pb-4 pt-3 sm:gap-5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {LOOP.map((l, i) => {
              const real = i >= LEAGUES.length && i < LEAGUES.length * 2;
              return (
                <a
                  key={i}
                  href={`/squeezymates/${l.slug}`}
                  aria-label={real ? `Browse SqueezyMates ${l.name}` : undefined}
                  aria-hidden={real ? undefined : true}
                  tabIndex={real ? undefined : -1}
                  className="cbl-card block w-44 shrink-0 overflow-hidden rounded-3xl sm:w-52"
                  style={{ background: l.bg }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/lineup/sm-leagues/${l.content}.png`}
                    alt={`${l.name} SqueezyMates`}
                    width={560}
                    height={797}
                    loading="lazy"
                    className="cbl-content block h-auto w-full"
                  />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
