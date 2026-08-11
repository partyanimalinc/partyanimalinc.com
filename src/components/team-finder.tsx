"use client";

import { useMemo, useState } from "react";

// "Find Your Team" — league tabs + a searchable grid of team logos. Each logo
// links into the catalog filtered to that team's Team Gear
// (/team-gear/all?team=<id>). Data comes from getLicenses() (teams.primary_image_url).
type Team = { id: string; name: string; slug: string; image: string | null; count: number };
type League = { id: string; name: string; slug: string; image: string | null; teams: Team[] };

export function TeamFinder({ leagues }: { leagues: League[] }) {
  const [active, setActive] = useState(leagues[0]?.slug ?? "");
  const [q, setQ] = useState("");

  const league = leagues.find((l) => l.slug === active) ?? leagues[0];

  const teams = useMemo(() => {
    const list = league?.teams ?? [];
    const s = q.trim().toLowerCase();
    return s ? list.filter((t) => t.name.toLowerCase().includes(s)) : list;
  }, [league, q]);

  if (!league) return null;

  return (
    <section id="find-your-team" className="scroll-mt-24 bg-ink-soft py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-3xl uppercase tracking-tight text-white sm:text-4xl">
            Find Your Team
          </h2>
          <p className="text-white/55">Rep your colors. We&rsquo;ve got your team.</p>
        </div>

        {/* League tabs + search */}
        <div className="mt-8 flex flex-col gap-4 border-b border-ink-line pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {leagues.map((l) => (
              <button
                key={l.slug}
                type="button"
                onClick={() => {
                  setActive(l.slug);
                  setQ("");
                }}
                className={`label-athletic pb-1 text-sm transition-colors ${
                  l.slug === active
                    ? "border-b-2 border-brand-red text-white"
                    : "border-b-2 border-transparent text-white/55 hover:text-white"
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search teams…"
            aria-label="Search teams"
            className="w-full rounded-full border border-ink-line bg-ink px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-brand-red focus:outline-none lg:w-64"
          />
        </div>

        {/* Team logo grid */}
        <div className="mt-8 grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
          {teams.map((t) => (
            <a
              key={t.id}
              href={`/team-gear/all?team=${t.id}`}
              aria-label={`Browse ${t.name} Team Gear`}
              className="tg-card group flex flex-col items-center"
            >
              <div className="tg-tile grid aspect-square w-full place-items-center rounded-xl border border-ink-line bg-ink p-3">
                {t.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.image}
                    alt={t.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="font-heading text-lg uppercase text-white/70">
                    {t.name.slice(0, 3)}
                  </span>
                )}
              </div>
            </a>
          ))}
          {teams.length === 0 && (
            <p className="col-span-full py-8 text-center text-white/50">
              No teams match &ldquo;{q}&rdquo;.
            </p>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={`/team-gear/all?league=${league.id}`}
            className="label-athletic rounded-full border border-ink-line px-8 py-3 text-sm text-white transition-colors hover:border-brand-red hover:text-white"
          >
            View All {league.name} Teams
          </a>
        </div>
      </div>
    </section>
  );
}
