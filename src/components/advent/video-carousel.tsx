"use client";

import { useRef } from "react";

// PLACEHOLDER video gallery (stub). Thumbnails are placeholder graphics and the
// tiles are inert until real video assets + URLs are supplied. Horizontal
// scroller: arrow buttons on desktop, swipe on touch.
type Clip = { title: string; sub: string; locked?: boolean };

const CLIPS: Clip[] = [
  { title: "Intro", sub: "The Countdown Begins" },
  { title: "TeenyMates", sub: "Opening Day Surprises" },
  { title: "SqueezyMates", sub: "Helmet Collection" },
  { title: "Behind the Scenes", sub: "Outtakes & Fun" },
  { title: "Coming Soon", sub: "More Clips Dropping Soon", locked: true },
];

function PlayBadge({ locked }: { locked?: boolean }) {
  return (
    <span
      aria-hidden
      className="grid h-14 w-14 place-items-center rounded-full shadow-lg"
      style={{ background: locked ? "rgba(255,255,255,0.14)" : "var(--color-brand-red)", color: "#fff" }}
    >
      {locked ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5.5v13l11-6.5-11-6.5Z" />
        </svg>
      )}
    </span>
  );
}

function Arrow({ dir, onClick }: { dir: "l" | "r"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "l" ? "Previous videos" : "Next videos"}
      className="hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-brand-red hover:text-brand-red md:grid"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d={dir === "l" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function AdventVideoCarousel() {
  const scroller = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  return (
    <div className="flex items-center gap-3">
      <Arrow dir="l" onClick={() => scrollBy(-1)} />
      <div
        ref={scroller}
        className="flex flex-1 gap-4 overflow-x-auto pb-2"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        {CLIPS.map((clip) => (
          <button
            key={clip.title}
            type="button"
            aria-label={`Play ${clip.title}`}
            className="group flex w-[70%] shrink-0 flex-col text-left sm:w-[46%] lg:w-[calc(20%-0.8rem)]"
            style={{ scrollSnapAlign: "start" }}
          >
            <span
              className="relative grid aspect-video w-full place-items-center overflow-hidden rounded-xl border border-white/10"
              style={{
                background:
                  "radial-gradient(120% 120% at 30% 20%, #2a2a2e 0%, #121214 60%, #0a0a0a 100%)",
              }}
            >
              <PlayBadge locked={clip.locked} />
              <span
                aria-hidden
                className="absolute bottom-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white/60"
              >
                Placeholder
              </span>
            </span>
            <span className="mt-3 block font-heading text-sm uppercase leading-tight text-white group-hover:text-brand-red">
              {clip.locked ? <span className="text-brand-red">{clip.title}</span> : clip.title}
            </span>
            <span className="mt-0.5 block text-xs text-white/50">{clip.sub}</span>
          </button>
        ))}
      </div>
      <Arrow dir="r" onClick={() => scrollBy(1)} />
    </div>
  );
}
