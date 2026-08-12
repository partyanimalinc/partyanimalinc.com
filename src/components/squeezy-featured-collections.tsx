// "Featured Collections" band for the SqueezyMates landing page, styled to match
// the TeenyMates FeaturedCollections band. Leads with the squeezy object variety
// by sport (the line's hook: helmets / basketballs / pucks / batting helmets),
// then the two shoppable collections (Gift Sets, seasonal Santa Squeezy). Object
// tiles link to that league's Squeezy Helmets line only (line=SH), so the target
// is just that object; collection tiles link to their category page. Images are
// representative product photos (Supabase-hosted).

const IMG = "https://prgnshkxyyxygdpowdnu.supabase.co/storage/v1/object/public/product-images";

type Collection = { name: string; href: string; img: string };

const COLLECTIONS: Collection[] = [
  { name: "Helmets", href: "/squeezymates/nfl?line=SH", img: `${IMG}/SHGNF1/SHGNF1_2up.jpg` },
  { name: "Basketballs", href: "/squeezymates/nba?line=SH", img: `${IMG}/SHCEL/master-restore-1784168983820.jpg` },
  { name: "Pucks", href: "/squeezymates/nhl?line=SH", img: `${IMG}/SHGOL/master-restore-1784168987063.jpg` },
  { name: "Baseball Caps", href: "/squeezymates/mlb?line=SH", img: `${IMG}/SHLAD/1784170097043-a7f347ca-0e0d-4e11-abe9-ec55dc2d09bf.jpg` },
  { name: "Gift Sets", href: "/products/squeezymates-gift-sets", img: `${IMG}/SMSML6/SMSML6_Combo.jpg` },
  { name: "Santa Squeezy", href: "/products/santa-squeezy", img: `${IMG}/SSAC/SSAC.jpg` },
];

export function SqueezyFeaturedCollections() {
  return (
    <section className="bg-white py-14 text-ink lg:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <h2 className="font-heading text-center text-3xl uppercase tracking-tight text-ink sm:text-4xl lg:text-5xl">
          Featured Collections
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:mt-12 lg:grid-cols-6 lg:gap-6">
          {COLLECTIONS.map((c) => (
            <a
              key={c.name}
              href={c.href}
              aria-label={`Shop SqueezyMates ${c.name}`}
              className="fc-card flex flex-col items-center text-center"
            >
              <div className="fc-tile w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={`SqueezyMates ${c.name}`}
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
            href="/squeezymates/all"
            className="label-athletic rounded-full bg-brand-red px-9 py-4 text-sm text-white shadow-sm transition-colors hover:bg-brand-red-dark"
          >
            View All Collections
          </a>
        </div>
      </div>
    </section>
  );
}
