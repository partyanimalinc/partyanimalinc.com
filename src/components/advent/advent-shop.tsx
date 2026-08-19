"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { amazonAttributed } from "@/lib/amazon";

export type CalendarCard = {
  sku: string;
  slug: string | null;
  name: string;
  league: string;
  image: string | null;
};

function Star() {
  return <span className="text-brand-gold">★</span>;
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
          <Image
            src={c.image}
            alt={c.name}
            width={500}
            height={500}
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

// TeenyMates: sold at Amazon + Dick's (Dick's has the exclusive rare figures).
function TeenyRetailers() {
  return (
    <section className="relative overflow-hidden border-t border-ink-line">
      {/* mobile bg: portrait, no divider (the columns stack) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/advent/shop-at-bg-mobile.png" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover md:hidden" />
      {/* desktop bg: red brush divider baked into the center */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/advent/shop-at-bg.png" alt="" aria-hidden className="absolute inset-0 hidden h-full w-full object-cover md:block" />
      <div aria-hidden className="absolute inset-0" style={{ background: "rgba(6,7,9,0.32)" }} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:gap-0 lg:px-8">
        {/* Amazon (left of the red divider) */}
        <div className="flex flex-col items-center text-center md:pr-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/advent/amazon-available.png" alt="Available at Amazon" width={1500} height={723} className="h-20 w-auto sm:h-24" />
          <p className="mt-3 text-sm text-white/60">Fast, easy, and reliable.</p>
          <a
            href={amazonAttributed("https://www.amazon.com/stores/page/6A6BA724-BD28-4888-868B-B57287C3DFCB/search?terms=Advent%20Calendar")}
            target="_blank"
            rel="noopener noreferrer"
            className="label-athletic mt-6 inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-sm text-white shadow-lg shadow-brand-red/30 transition-colors hover:bg-brand-red-dark"
          >
            Shop on Amazon
            <Arrow />
          </a>
        </div>
        {/* Dick's (right of the red divider) */}
        <div className="flex flex-col items-center text-center md:pl-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/advent/dsg-primary.svg" alt="Dick's Sporting Goods" width={946} height={388} className="h-14 w-auto sm:h-16" />
          <p className="mt-4 font-heading text-xl uppercase text-white">Exclusive Rare Figures</p>
          <p className="font-heading text-lg uppercase text-brand-gold">Only at Dick&apos;s</p>
          {/* the 4 exclusive rare chase figures */}
          <div className="mt-5 flex items-end justify-center gap-1.5 sm:gap-3">
            {[1, 2, 3, 4].map((i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={`/advent/dsg-rarefig${i}.png`}
                alt=""
                aria-hidden
                className="h-24 w-auto sm:h-28 lg:h-32"
                style={{ filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.5))" }}
              />
            ))}
          </div>
          <p className="mt-4 max-w-xs text-sm text-white/70">
            Find ultra rare chase figures in select TeenyMates Advent Calendars.
          </p>
          <a
            href="https://www.dickssportinggoods.com/f/fan-shop-advent-calendars"
            target="_blank"
            rel="noopener noreferrer"
            className="label-athletic mt-5 inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm text-white transition-colors hover:border-brand-red hover:bg-brand-red"
          >
            Shop at Dick&apos;s
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

// SqueezyMates Helmet Advent Calendars: Fanatics.com exclusive. Single centered
// column on the no-divider background (mobile art), so there's no red split line.
function FanaticsRetailers() {
  return (
    <section className="relative overflow-hidden border-t border-ink-line">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/advent/shop-at-bg-mobile.png" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <div aria-hidden className="absolute inset-0" style={{ background: "rgba(6,7,9,0.42)" }} />
      <div className="relative mx-auto flex max-w-xl flex-col items-center px-6 py-20 text-center lg:px-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/advent/fanatics-white.png" alt="Fanatics" width={969} height={433} className="w-64 h-auto sm:w-72" />
        <p className="mt-6 font-heading text-xl uppercase leading-tight text-white sm:text-2xl">
          SqueezyMates Helmet Advent Calendars
        </p>
        <p className="mt-1 font-heading text-lg uppercase text-brand-gold">Exclusively at Fanatics.com</p>
        <p className="mt-4 max-w-md text-sm text-white/70">
          The SqueezyMates Helmet Advent Calendar is available only at Fanatics.com.
        </p>
        <a
          href="https://www.fanatics.com"
          target="_blank"
          rel="noopener noreferrer"
          className="label-athletic mt-6 inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-sm text-white shadow-lg shadow-brand-red/30 transition-colors hover:bg-brand-red-dark"
        >
          Shop at Fanatics
          <Arrow />
        </a>
      </div>
    </section>
  );
}

export function AdventShop({
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
    <>
      {/* ===================== SHOP ALL CALENDARS ===================== */}
      <section id="calendars" className="border-t border-ink-line" style={{ scrollMarginTop: "5rem" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8" style={{ paddingTop: "4.5rem", paddingBottom: "4.5rem" }}>
          <div className="mb-10 flex items-center justify-center gap-4">
            <Star />
            <h2 className="font-heading text-center text-2xl uppercase text-white sm:text-3xl">
              Shop All Advent Calendars
            </h2>
            <Star />
          </div>
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
      </section>

      {/* ===================== RETAILERS (swaps with the tab) ===================== */}
      {tab === "teeny" ? <TeenyRetailers /> : <FanaticsRetailers />}
    </>
  );
}
