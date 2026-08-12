// "Fan Favorites" row for the SqueezyMates landing — same framing as the
// TeenyMates FanFavorites (light band, portrait blind-pack tiles). Tiles,
// images, and links are the exact set specified for SqueezyMates.

type Fav = { league: string; series: string; img: string; href: string };

const IMG = "https://prgnshkxyyxygdpowdnu.supabase.co/storage/v1/object/public/product-images";

const FAVORITES: Fav[] = [
  {
    league: "NFL Legends",
    series: "90's Pop",
    img: `${IMG}/SMTG90NF1/1782504507673-441f25ac-93ab-4b26-aa56-eaae110dddfb.jpg`,
    href: "/products/squeezymates-nfl-gravity-feed-38",
  },
  {
    league: "NBA Legends",
    series: "90's Pop",
    img: `${IMG}/SMTG90NB1/SMTG90NB1_Foilbag-2.jpg`,
    href: "/products/squeezymates-nba-2025-gravity-feed-display-5",
  },
  {
    league: "NHL",
    series: "Series 7",
    img: `${IMG}/SMBNH7/1782310065234-672a28db-5aaa-43eb-8e2c-a0b6288ce3f6.jpg`,
    href: "/squeezymates/all?league=c9b5d975-451d-4077-b7c2-e6447fd8e591&series=7",
  },
  {
    league: "NBA",
    series: "Series 6",
    img: `${IMG}/SMBNB6/SMBNB6_FoilBag.png`,
    href: "/squeezymates/all?league=6ce9faef-2394-45f7-82b3-7419513e6631&series=6",
  },
  {
    league: "MLB",
    series: "Series 8",
    img: `${IMG}/SMBML8/SMBML8_FoilBag.png`,
    href: "/squeezymates/all?league=9fbe856f-3a9d-4bd5-83e5-354f423e9a31&series=8",
  },
  {
    league: "WNBA",
    series: "Series 2",
    img: `${IMG}/SMGNW1/1779829302042-0e6f8b06-fe7e-472f-825c-f56045aa6726.jpg`,
    href: "/squeezymates/all?league=7306bee7-47bb-49dc-9ab3-b5d779253657",
  },
];

export function SqueezyFanFavorites() {
  return (
    <section className="bg-white py-14 text-ink lg:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <h2 className="font-heading text-center text-3xl uppercase tracking-tight text-ink sm:text-4xl lg:text-5xl">
          Fan Favorites
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:mt-12 lg:grid-cols-6 lg:gap-4">
          {FAVORITES.map((f) => (
            <a
              key={f.league}
              href={f.href}
              aria-label={`Shop ${f.league} ${f.series} SqueezyMates`}
              className="ff-card flex flex-col items-center text-center"
            >
              <div className="ff-tile w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.img}
                  alt={`${f.league} ${f.series} SqueezyMates blind pack`}
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
            href="/squeezymates/all"
            className="label-athletic rounded-full bg-brand-red px-9 py-4 text-sm text-white shadow-sm transition-colors hover:bg-brand-red-dark"
          >
            View All Series
          </a>
        </div>
      </div>
    </section>
  );
}
