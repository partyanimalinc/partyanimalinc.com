// "Fan Favorites" row — a light band of standout series, each shown by its
// blind-pack (foil bag) art from Master Images and linking to the catalog
// filtered by league (+ series). "View All Series" opens the full catalog.

type Fav = { league: string; series: string; img: string; href: string };

// league_id values are the PIM catalog facet ids (verified against the public API).
const L = {
  nflLegends: "678f240f-9f96-4ab6-8c0e-75adfc68386d",
  nbaLegends: "8b40af39-eb24-4853-ae77-28a82b6747e1",
  nhl: "c9b5d975-451d-4077-b7c2-e6447fd8e591",
  ussf: "98b86f9d-1b74-4992-b589-12b7fefa3a54",
  mlb: "9fbe856f-3a9d-4bd5-83e5-354f423e9a31",
  wnba: "7306bee7-47bb-49dc-9ab3-b5d779253657",
};

const FAVORITES: Fav[] = [
  { league: "NFL Legends", series: "90's Pop", img: "nfl-legends", href: `/teenymates/all?league=${L.nflLegends}` },
  { league: "NBA Legends", series: "90's Pop", img: "nba-legends", href: `/teenymates/all?league=${L.nbaLegends}` },
  { league: "NHL", series: "Series 12 · Silver", img: "nhl-silver", href: `/teenymates/all?league=${L.nhl}&series=12` },
  { league: "USSF", series: "Series 1", img: "ussf", href: `/teenymates/all?league=${L.ussf}&series=1` },
  { league: "MLB", series: "Series X (10)", img: "mlb-x", href: `/teenymates/all?league=${L.mlb}&series=10` },
  { league: "WNBA", series: "Series 2", img: "wnba", href: `/teenymates/all?league=${L.wnba}&series=2` },
];

export function FanFavorites() {
  return (
    <section className="bg-white py-14 text-ink lg:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <h2 className="font-heading text-center text-3xl uppercase tracking-tight text-ink sm:text-4xl lg:text-5xl">
          Fan Favorites
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:mt-12 lg:grid-cols-6 lg:gap-5">
          {FAVORITES.map((f) => (
            <a
              key={f.img}
              href={f.href}
              aria-label={`Shop ${f.league} ${f.series} TeenyMates`}
              className="ff-card flex flex-col items-center text-center"
            >
              <div className="ff-tile w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/lineup/fan-favorites/${f.img}.png`}
                  alt={`${f.league} ${f.series} TeenyMates blind pack`}
                  width={620}
                  height={780}
                  loading="lazy"
                  className="ff-img"
                />
              </div>
              <span className="font-heading mt-3 text-sm uppercase leading-tight text-ink">
                {f.league}
              </span>
              <span className="mt-0.5 text-xs uppercase tracking-wide text-ink/55">{f.series}</span>
            </a>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="/teenymates/all"
            className="label-athletic rounded-full bg-brand-red px-9 py-4 text-sm text-white shadow-sm transition-colors hover:bg-brand-red-dark"
          >
            View All Series
          </a>
        </div>
      </div>
    </section>
  );
}
