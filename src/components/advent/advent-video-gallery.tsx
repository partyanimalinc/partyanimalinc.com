"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Stream, type StreamPlayerApi } from "@cloudflare/stream-react";
import { ADVENT_VIDEOS, posterUrl, CF_CUSTOMER_CODE } from "@/lib/advent-videos";

const COUNT = ADVENT_VIDEOS.length;

function Arrow({ dir, onClick }: { dir: "l" | "r"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "l" ? "Scroll left" : "Scroll right"}
      className="hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-brand-red hover:text-brand-red md:grid"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d={dir === "l" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function AdventVideoGallery() {
  const [index, setIndex] = useState<number | null>(null); // null = closed
  const player = useRef<StreamPlayerApi | undefined>(undefined);
  const scroller = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const open = index !== null;
  const active = open ? ADVENT_VIDEOS[index] : null;

  const openAt = (i: number) => {
    setProgress(0);
    setPlaying(true);
    setIndex(i);
  };
  const close = useCallback(() => setIndex(null), []);
  const go = useCallback((dir: number) => {
    setProgress(0);
    setPlaying(true);
    setIndex((i) => (i === null ? i : (i + dir + COUNT) % COUNT));
  }, []);

  const scrollStrip = (dir: number) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 560), behavior: "smooth" });
  };

  // Keyboard + scroll lock while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight" || e.key === "ArrowUp") go(1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, go]);

  const togglePlay = () => {
    const p = player.current;
    if (!p) return;
    if (playing) p.pause();
    else p.play();
  };
  const toggleMute = () => {
    const p = player.current;
    const next = !muted;
    if (p) p.muted = next;
    setMuted(next);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 45) return; // tap → handled by play/pause layer
    if (Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    else go(dy < 0 ? 1 : -1);
  };

  return (
    <>
      {/* Warm the connection to Cloudflare Stream so the player + first bytes
          fetch fast when a visitor opens a clip. */}
      <link rel="preconnect" href={`https://${CF_CUSTOMER_CODE}.cloudflarestream.com`} crossOrigin="" />
      <link rel="preconnect" href="https://embed.cloudflarestream.com" crossOrigin="" />

      {/* ---------- Horizontal poster strip ---------- */}
      <div className="flex items-center gap-3">
        <Arrow dir="l" onClick={() => scrollStrip(-1)} />
        <div
          ref={scroller}
          className="flex flex-1 gap-3 overflow-x-auto pb-2 sm:gap-4"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
        >
          {ADVENT_VIDEOS.map((v, i) => (
            <button
              key={v.key}
              type="button"
              onClick={() => openAt(i)}
              aria-label={`Play ${v.title}`}
              className="group flex w-36 shrink-0 flex-col text-left sm:w-40"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="relative aspect-[9/16] overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:border-brand-red/50 group-hover:shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={posterUrl(v.uid, v.t)}
                  alt={v.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-red/90 text-white shadow-xl transition-transform duration-200 group-hover:scale-110">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                  </svg>
                </span>
                <span className="absolute inset-x-0 bottom-0 p-2.5 font-heading text-xs uppercase leading-tight text-white drop-shadow">
                  {v.title}
                </span>
              </div>
            </button>
          ))}
        </div>
        <Arrow dir="r" onClick={() => scrollStrip(1)} />
      </div>

      {/* ---------- Overlay ---------- */}
      {open && active && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-sm">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous"
            className="absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:grid lg:left-10"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next"
            className="absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:grid lg:right-10"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* phone silhouette (desktop) / full-bleed (mobile) */}
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="relative h-[100dvh] w-full overflow-hidden bg-black sm:h-[88vh] sm:w-auto sm:rounded-[2rem] sm:ring-1 sm:ring-white/15 sm:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
            style={{ aspectRatio: "9 / 16" }}
          >
            {/* Poster paints instantly (already cached from the strip) while the
                player boots + buffers, so it never opens on a black frame. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterUrl(active.uid, active.t)}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Cloudflare player, forced to fill via .videoframe (globals.css) */}
            <div className="videoframe absolute inset-0">
              <Stream
                key={active.uid}
                streamRef={player}
                src={active.uid}
                poster={posterUrl(active.uid, active.t)}
                preload="auto"
                autoplay
                muted={muted}
                controls={false}
                responsive={false}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => go(1)}
                onTimeUpdate={() => {
                  const p = player.current;
                  if (p && p.duration) setProgress(p.currentTime / p.duration);
                }}
              />
            </div>

            {/* tap layer: play / pause */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="absolute inset-0 z-10"
            >
              {!playing && (
                <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                  </svg>
                </span>
              )}
            </button>

            {/* top progress bar */}
            <div className="absolute inset-x-0 top-0 z-20 h-1 bg-white/20">
              <div className="h-full bg-brand-red transition-[width] duration-150" style={{ width: `${Math.min(progress * 100, 100)}%` }} />
            </div>

            {/* mute toggle */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="absolute left-3 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
            >
              {muted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
                  <path d="M17 9l4 6M21 9l-4 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
                  <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>

            {/* title caption */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/70 to-transparent p-5 pb-7">
              <p className="font-heading text-lg uppercase leading-tight text-white drop-shadow sm:text-xl">{active.title}</p>
              <p className="mt-0.5 text-xs uppercase tracking-wide text-white/60">
                {index + 1} / {COUNT} · Life with a Mini-Me
              </p>
            </div>
          </div>

          {/* progress dots */}
          <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-1.5">
            {ADVENT_VIDEOS.map((v, i) => (
              <button
                key={v.key}
                type="button"
                onClick={() => openAt(i)}
                aria-label={`Go to ${v.title}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-brand-red" : "w-1.5 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
