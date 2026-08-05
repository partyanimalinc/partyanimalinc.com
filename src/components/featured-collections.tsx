// "Featured Collections" row — a light band of TeenyMates product categories
// (Figma "featured collections" mockup). Each tile shows the primary image of a
// recent product in that category and links to the catalog filtered by line.

type Category = { name: string; code: string; img: string };

// code = PIM line code (parent_code) -> /teenymates?line=<code>
const CATEGORIES: Category[] = [
  { name: "Team Sets", code: "TMX", img: "team-sets" },
  { name: "Collector Tins", code: "TMC", img: "collector-tins" },
  { name: "Locker Room Sets", code: "TML", img: "locker-room-sets" },
  { name: "Gift Sets", code: "TMS", img: "gift-sets" },
  { name: "Advent Calendars", code: "TMA", img: "advent-calendars" },
];

export function FeaturedCollections() {
  return (
    <section className="bg-white py-14 text-ink lg:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <h2 className="font-heading text-center text-3xl uppercase tracking-tight text-ink sm:text-4xl lg:text-5xl">
          Featured Collections
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:mt-12 lg:grid-cols-5 lg:gap-6">
          {CATEGORIES.map((c) => (
            <a
              key={c.code}
              href={`/teenymates/all?line=${c.code}`}
              aria-label={`Shop TeenyMates ${c.name}`}
              className="fc-card flex flex-col items-center text-center"
            >
              <div className="fc-tile w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/lineup/featured/${c.img}.png`}
                  alt={`TeenyMates ${c.name}`}
                  width={640}
                  height={640}
                  loading="lazy"
                  className="fc-img"
                />
              </div>
              <span className="font-heading mt-4 text-sm uppercase leading-tight tracking-wide text-ink sm:text-base">
                {c.name}
              </span>
            </a>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="/teenymates/all"
            className="label-athletic rounded-full bg-brand-red px-9 py-4 text-sm text-white shadow-sm transition-colors hover:bg-brand-red-dark"
          >
            View All Collections
          </a>
        </div>
      </div>
    </section>
  );
}
