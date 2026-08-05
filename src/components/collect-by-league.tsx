"use client";

import { useEffect, useRef } from "react";

// "Collect by League" carousel (Figma "collect-by-league" / "TM-by-League").
// The card supplies a dynamic per-league accent gradient + border + hover glow;
// the designed figure/logo/label ride on top as a transparent content image
// (composited from the Figma tile so sizing stays exactly as designed).
// Endless loop in both directions: the list is tripled and the scroll position
// is normalized back into the middle copy while idle (seamless, since copies
// match). Desktop gets arrow controls; mobile is swipe/scroll.

type League = { name: string; id: string; content: string; accent: string };

// league_id values are the PIM catalog facet ids (verified against the public API).
const LEAGUES: League[] = [
  { name: "NFL", id: "81873da9-c31e-4936-a1cc-f7c3eeca1405", content: "content-nfl", accent: "#2b6fe0" },
  { name: "MLB", id: "9fbe856f-3a9d-4bd5-83e5-354f423e9a31", content: "content-mlb", accent: "#e0263b" },
  { name: "NBA", id: "6ce9faef-2394-45f7-82b3-7419513e6631", content: "content-nba", accent: "#e0263b" },
  { name: "NHL", id: "c9b5d975-451d-4077-b7c2-e6447fd8e591", content: "content-nhl", accent: "#9aa4ad" },
  { name: "WNBA", id: "7306bee7-47bb-49dc-9ab3-b5d779253657", content: "content-wnba", accent: "#ff7a1a" },
  { name: "NFL Legends", id: "678f240f-9f96-4ab6-8c0e-75adfc68386d", content: "content-nfl-legends", accent: "#d4a017" },
  { name: "NBA Legends", id: "8b40af39-eb24-4853-ae77-28a82b6747e1", content: "content-nba-legends", accent: "#d4a017" },
  { name: "USA Soccer", id: "98b86f9d-1b74-4992-b589-12b7fefa3a54", content: "content-ussf", accent: "#2b6fe0" },
  { name: "College", id: "e5e7e2ad-889f-4d66-9879-af418c26082e", content: "content-college", accent: "#c0392b" },
];

// three copies so the loop has room to wrap in either direction
const LOOP = [...LEAGUES, ...LEAGUES, ...LEAGUES];

function LeagueCard({ l, real }: { l: League; real: boolean }) {
  return (
    <a
      href={`/teenymates/all?league=${l.id}`}
      aria-label={real ? `Browse TeenyMates ${l.name}` : undefined}
      aria-hidden={real ? undefined : true}
      tabIndex={real ? undefined : -1}
      className="cbl-card relative block w-56 shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:w-64"
      style={{
        background: `radial-gradient(120% 90% at 26% 18%, ${l.accent}2b, transparent 60%), linear-gradient(150deg, #1c1c22 0%, #111114 58%, #0b0b0d 100%)`,
      }}
    >
      {/* top gloss */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      {/* accent glow, fades in on hover */}
      <span
        aria-hidden
        className="cbl-glow pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(115% 85% at 28% 22%, ${l.accent}45, transparent 58%)` }}
      />
      {/* designed content: figure + logo + label (transparent) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/lineup/leagues/content/${l.content}.png`}
        alt={`${l.name} TeenyMates`}
        width={560}
        height={560}
        loading="lazy"
        className="cbl-content relative block h-auto w-full"
      />
    </a>
  );
}

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

export function CollectByLeague() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const copyW = () => el.scrollWidth / 3;
    const center = () => {
      el.scrollLeft = copyW();
    };
    const raf = requestAnimationFrame(center);

    // Normalize back into the middle copy only when the scroll is IDLE, so an
    // in-progress smooth scroll or swipe momentum is never interrupted.
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
    // Re-center into the middle copy first (instant, seamless) so the smooth
    // scroll always has a full copy of runway and never hits a physical edge.
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
            {LOOP.map((l, i) => (
              <LeagueCard key={i} l={l} real={i >= LEAGUES.length && i < LEAGUES.length * 2} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
