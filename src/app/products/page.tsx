import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { getCategories, getCategory, type CategoryProduct } from "@/lib/pim";
import { EXTERNAL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Products",
  description:
    "Explore every Party Animal collection: TeenyMates, SqueezyMates, Jumbo Squeezy, flags, drinkware, homegating décor and more.",
};

// Curated featured collections. `heroSlug` overrides where the hero image is
// sourced (e.g. SqueezyMates aggregates its Jumbo Squeezy children, so pull the
// hero from the pure SqueezyMates single-figures subcategory).
const FEATURED: {
  slug: string;
  label: string;
  tagline: string;
  color: string;
  color2: string;
  heroSlug?: string;
}[] = [
  { slug: "teenymates", label: "TeenyMates", tagline: '1" collectible figures', color: "#e11826", color2: "#7f0a12" },
  { slug: "squeezymates", heroSlug: "squeezymates-single-figures", label: "SqueezyMates", tagline: "Squeeze into the action", color: "#f26a21", color2: "#9c3a0e" },
  { slug: "jumbo-squeezy", label: "Jumbo Squeezy", tagline: "Go big and squeezy", color: "#f9b115", color2: "#b9760a" },
  { slug: "speed-cube", label: "Speed Cubes", tagline: "Twist, solve, repeat", color: "#7c3aed", color2: "#4c1d95" },
  { slug: "big-shot-ballers", label: "Big Shot Ballers", tagline: "Ball out", color: "#16a34a", color2: "#14532d" },
  { slug: "magnetic-standings-boards", label: "Magnetic Standings", tagline: "Track the race", color: "#2563eb", color2: "#1e3a8a" },
  { slug: "premium-banner-flags", label: "Flags", tagline: "Fly your colors", color: "#0d9488", color2: "#134e4a" },
  { slug: "helmet-bottle-openers", label: "Bottle Openers", tagline: "Crack one open", color: "#475569", color2: "#1e293b" },
  { slug: "squeezy-water-bottles", label: "Squeezy Water Bottles", tagline: "Hydrate loud", color: "#0891b2", color2: "#0e5063" },
];

// Popular teams get first pick for the hero image on each card (no repeats).
const POPULAR = [
  "Dallas Cowboys", "Green Bay Packers", "Kansas City Chiefs", "Philadelphia Eagles",
  "San Francisco 49ers", "Pittsburgh Steelers", "Buffalo Bills", "Chicago Bears",
  "New England Patriots", "Las Vegas Raiders", "Detroit Lions", "New York Giants",
  "New York Yankees", "Los Angeles Dodgers", "Boston Red Sox", "Chicago Cubs", "Atlanta Braves",
  "Los Angeles Lakers", "Boston Celtics", "Golden State Warriors", "Chicago Bulls",
  "Chicago Blackhawks", "Boston Bruins", "New York Rangers",
  "Alabama", "Ohio State", "Michigan", "Notre Dame", "Georgia", "Texas",
];
const RANK = new Map(POPULAR.map((t, i) => [t, i]));

// Brands with a bespoke top-level landing; everything else uses the category template.
const HAS_LANDING = new Set(["teenymates", "squeezymates", "jumbo-squeezy"]);
const hrefFor = (slug: string) =>
  HAS_LANDING.has(slug) ? `/${slug}` : `/products/${slug}`;

// `displaySlug` is the category the tile represents (where a hand-picked
// Featured image lives); `productSlug` is where to pull products from for the
// auto-pick fallback (usually the same, but e.g. SqueezyMates sources from its
// single-figures child). A category thumbnail set in the PIM always wins.
async function pickHero(
  displaySlug: string,
  productSlug: string,
  used: Set<string>,
): Promise<{ image: string | null }> {
  const same = displaySlug === productSlug;
  const disp = await getCategory(displaySlug, { limit: same ? 60 : 1 });
  if (disp?.category.thumbnailUrl) return { image: disp.category.thumbnailUrl };

  const d = same ? disp : await getCategory(productSlug, { limit: 60 });
  const imgs = (d?.products ?? []).filter((p): p is CategoryProduct & { image: string } => Boolean(p.image));
  if (!imgs.length) return { image: null };

  const unusedTeam = imgs.filter((p) => p.teamName && !used.has(p.teamName));
  const popular = unusedTeam
    .filter((p) => RANK.has(p.teamName!))
    .sort((a, b) => RANK.get(a.teamName!)! - RANK.get(b.teamName!)!);

  const pick =
    popular[0] ||
    unusedTeam[0] ||
    imgs.find((p) => !p.teamName) ||
    imgs[0];

  if (pick.teamName) used.add(pick.teamName);
  return { image: pick.image };
}

function CollectionCard({
  href,
  label,
  tagline,
  image,
  color,
  color2,
}: {
  href: string;
  label: string;
  tagline?: string;
  image: string | null;
  color: string;
  color2: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden shadow-lg ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:ring-brand-red/40"
    >
      <div
        className="relative aspect-[5/4] overflow-hidden"
        style={{ background: `linear-gradient(145deg, ${color}, ${color2})` }}
      >
        {/* grunge texture, desaturated + multiplied so it takes the card color */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/headers/header-bg.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(1) contrast(1.15)",
            mixBlendMode: "multiply",
            opacity: 0.5,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5" />
        {image ? (
          <div className="relative z-10 flex h-full items-center justify-center p-6">
            <Image
              src={image}
              alt={label}
              width={600}
              height={600}
              className="max-h-full w-[74%] object-contain shadow-[0_14px_34px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-[1.05]"
            />
          </div>
        ) : (
          <span className="relative z-10 grid h-full place-items-center px-4 text-center font-heading text-3xl uppercase text-white drop-shadow-lg">
            {label}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 bg-white px-5 py-4">
        <div className="min-w-0">
          <h3 className="font-heading text-lg uppercase leading-tight text-ink">
            {label}
          </h3>
          {tagline && <p className="mt-1 text-sm text-ink/55">{tagline}</p>}
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white transition-all group-hover:bg-brand-red">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

const CATEGORY_STYLE: Record<string, { color: string; color2: string }> = {
  toys: { color: "#b91c1c", color2: "#601010" },
  "flags-banners": { color: "#1d4ed8", color2: "#152c73" },
  drinkware: { color: "#0e7490", color2: "#0a4657" },
  "homegating-decor": { color: "#c2410c", color2: "#6e2507" },
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-7 flex items-center gap-4">
      <span className="text-brand-gold">★</span>
      <h2 className="font-heading text-2xl uppercase text-white sm:text-3xl">
        {children}
      </h2>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

export default async function ProductsPage() {
  const tree = await getCategories();
  const topLevels = tree
    .filter((c) => (c.hierarchy_path || "").split(">").length === 2)
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));

  // sequential so hero teams don't repeat across cards
  const used = new Set<string>();
  const featuredCards: { def: (typeof FEATURED)[number]; image: string | null }[] = [];
  for (const def of FEATURED) featuredCards.push({ def, image: (await pickHero(def.slug, def.heroSlug ?? def.slug, used)).image });
  const categoryCards: { cat: (typeof topLevels)[number]; image: string | null }[] = [];
  for (const cat of topLevels) {
    const image = cat.thumbnail_url ?? (await pickHero(cat.slug, cat.slug, used)).image;
    categoryCards.push({ cat, image });
  }

  const childCount = (id: string) => tree.filter((c) => c.parent_id === id).length;

  return (
    <>
      <PageHeader
        title="Our Products"
        eyebrow="Choose Your Lineup"
        subtitle="From collectible figures to fan gear, we bring the energy, the passion, and the fun."
      />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionTitle>Featured Collections</SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCards.map(({ def, image }) => (
            <CollectionCard
              key={def.slug}
              href={hrefFor(def.slug)}
              label={def.label}
              tagline={def.tagline}
              image={image}
              color={def.color}
              color2={def.color2}
            />
          ))}
        </div>

        <div className="mt-16">
          <SectionTitle>Shop by Category</SectionTitle>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map(({ cat, image }) => {
              const style = CATEGORY_STYLE[cat.slug] ?? { color: "#334155", color2: "#1e293b" };
              return (
                <CollectionCard
                  key={cat.slug}
                  href={`/products/${cat.slug}`}
                  label={cat.name}
                  tagline={`${childCount(cat.id)} collections`}
                  image={image}
                  color={style.color}
                  color2={style.color2}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Ready to Rip CTA band */}
      <section className="relative overflow-hidden border-t border-ink-line">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/headers/header-bg.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-ink/80" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 sm:px-6 md:flex-row md:justify-between lg:px-8">
          <div className="flex items-center gap-5">
            <Image
              src="/brand/pa-mascot.png"
              alt=""
              width={843}
              height={954}
              className="h-20 w-auto drop-shadow-lg"
            />
            <div>
              <h2 className="font-heading text-3xl uppercase text-white">
                Ready to Rip?
              </h2>
              <p className="mt-1 text-white/70">
                Explore the full catalog and bring the energy home.
              </p>
            </div>
          </div>
          <Link
            href="/products/all"
            className="label-athletic inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-sm text-white shadow-xl shadow-brand-red/30 transition-colors hover:bg-brand-red-dark"
          >
            View All Products
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
