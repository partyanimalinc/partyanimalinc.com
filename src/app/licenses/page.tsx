import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { getLicenses } from "@/lib/pim";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Licenses & Partners",
  description:
    "Party Animal is officially licensed across the NFL, MLB, NBA, NHL, WNBA, MLS and NCAA. Browse collectibles and fan gear by league and team.",
};

function LeagueCard({
  slug,
  name,
  image,
  count,
  teams,
}: {
  slug: string;
  name: string;
  image: string | null;
  count: number;
  teams: number;
}) {
  return (
    <Link
      href={`/licenses/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-ink-line bg-ink-soft p-6 transition-all duration-200 hover:-translate-y-1 hover:border-brand-red/50 hover:shadow-2xl"
    >
      {/* grunge texture wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "url(/headers/header-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative flex items-center gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="max-h-16 max-w-16 object-contain" />
          ) : (
            <span className="font-heading text-2xl uppercase text-white/80">
              {name.slice(0, 3)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-heading text-xl uppercase text-white">{name}</h3>
          <p className="mt-0.5 text-sm text-white/50">
            {count} product{count === 1 ? "" : "s"}
            {teams > 0 ? ` · ${teams} teams` : ""}
          </p>
        </div>
      </div>
      <span className="label-athletic relative mt-5 inline-flex items-center gap-1.5 text-xs text-brand-red">
        Shop {name}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="transition-transform group-hover:translate-x-1">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}

export default async function LicensesPage() {
  const leagues = await getLicenses();

  return (
    <>
      <PageHeader
        title="Licenses & Partners"
        eyebrow="Proud Partners. Iconic Brands."
        subtitle="We partner with the most recognized names in sports."
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="text-brand-gold">★</span>
          <h2 className="font-heading text-2xl uppercase text-white sm:text-3xl">
            Shop by League
          </h2>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {leagues.length === 0 ? (
          <p className="text-white/60">Leagues are loading. Check back shortly.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {leagues.map((l) => (
              <LeagueCard
                key={l.slug}
                slug={l.slug}
                name={l.name}
                image={l.image}
                count={l.count}
                teams={l.teams.length}
              />
            ))}
          </div>
        )}

        <p className="mx-auto mt-14 max-w-3xl text-center text-white/60">
          Party Animal products are officially licensed through the NFL, NFLPA,
          MLB, NHL, NBA, WNBA, NCAA and US Soccer, among others. Interested in a
          licensing or retail partnership?{" "}
          <Link href="/contact" className="text-brand-red hover:text-brand-red-dark">
            Get in touch
          </Link>
          .
        </p>
      </section>
    </>
  );
}
