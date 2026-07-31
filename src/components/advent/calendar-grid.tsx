"use client";

import { useState } from "react";
import Link from "next/link";

export type CalendarCard = {
  sku: string;
  slug: string | null;
  name: string;
  league: string;
  image: string | null;
};

function Card({ c }: { c: CalendarCard }) {
  const href = c.slug ? `/products/${c.slug}` : "/products";
  return (
    <Link
      href={href}
      className="group flex flex-col items-center text-center"
      aria-label={`Shop the ${c.league} advent calendar`}
    >
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-brand-red/50 group-hover:bg-white/[0.06]">
        {c.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.image}
            alt={c.name}
            loading="lazy"
            className="max-h-full w-full object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <span className="font-heading text-lg uppercase text-white/40">{c.league}</span>
        )}
      </div>
      <span className="mt-4 font-heading text-lg uppercase leading-tight text-white">{c.league}</span>
      <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 px-5 py-2 text-xs uppercase tracking-wide text-white transition-colors group-hover:border-brand-red group-hover:bg-brand-red">
        Shop Now
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}

export function AdventCalendarGrid({
  teeny,
  squeezy,
}: {
  teeny: CalendarCard[];
  squeezy: CalendarCard[];
}) {
  const [tab, setTab] = useState<"teeny" | "squeezy">("teeny");
  const cards = tab === "teeny" ? teeny : squeezy;

  const TabBtn = ({ id, label }: { id: "teeny" | "squeezy"; label: string }) => {
    const active = tab === id;
    return (
      <button
        type="button"
        onClick={() => setTab(id)}
        aria-pressed={active}
        className="rounded-full px-6 py-2.5 font-heading text-sm uppercase tracking-wide transition-colors"
        style={{
          background: active ? "var(--color-brand-red)" : "transparent",
          color: active ? "#fff" : "rgba(255,255,255,0.6)",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div>
      <div className="mb-10 flex justify-center">
        <div className="inline-flex gap-1 rounded-full border border-white/15 bg-white/5 p-1">
          <TabBtn id="teeny" label="TeenyMates" />
          <TabBtn id="squeezy" label="SqueezyMates" />
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.sku} c={c} />
        ))}
      </div>
    </div>
  );
}
