import Image from "next/image";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { getCatalog } from "@/lib/pim";
import { parseCatalogSearch } from "@/lib/catalog-url";
import { FEATURED_COLLECTIONS, TEAM_GEAR_SUBCATEGORIES } from "@/lib/featured-collections";
import type { SubCategory } from "@/components/catalog/filter-groups";

const PER = 48;
type SP = Record<string, string | string[] | undefined>;

// One template for the brand landings (TeenyMates / SqueezyMates / Jumbo Squeezy
// / Team Gear): the designed hero + the shared filterable catalog, scoped to the
// brand and reconfigured (featured collections + this brand's sub-categories +
// series filter). `brandSlug` is the catalog collection key (team-gear is virtual).
export async function CollectionCatalogPage({
  name,
  brandSlug,
  base,
  heroSrc,
  heroWidth,
  heroHeight,
  heroTextPos,
  afterHero,
  description,
  searchParams,
}: {
  name: string;
  brandSlug: string;
  base: string;
  heroSrc: string;
  heroWidth: number;
  heroHeight: number;
  // Desktop overlay position of the description within the hero art. Per-brand
  // tunable since the four hero layouts differ.
  heroTextPos?: { top?: string; left?: string; width?: string };
  // Optional band rendered between the hero and the catalog (e.g. TeenyMates
  // "What Are TeenyMates?" explainer). Omitted brands render nothing here.
  afterHero?: React.ReactNode;
  description: string;
  searchParams: Promise<SP>;
}) {
  const current = parseCatalogSearch(await searchParams);
  const page = Math.min(Math.max(Number(current.page) || 1, 1), 10);
  const effectiveCollection = current.collection || brandSlug;

  const isTeamGear = brandSlug === "team-gear";
  const data = await getCatalog({
    collection: effectiveCollection,
    league: current.league,
    team: current.team,
    series: current.series ? Number(current.series) : undefined,
    line: current.line,
    sort: current.sort,
    page: 1,
    pageSize: PER * page,
  });

  // Team Gear splits by its fan-gear collections (real category nodes); the toy
  // brands split by product line (the `lines` facet, handled in FilterGroups).
  const subcategories: SubCategory[] | undefined = isTeamGear
    ? TEAM_GEAR_SUBCATEGORIES
    : undefined;

  return (
    <>
      <section className="relative bg-ink">
        <Image
          src={heroSrc}
          alt={name}
          width={heroWidth}
          height={heroHeight}
          priority
          className="h-auto w-full"
        />
        {/* Opt-in desktop overlay: only for heroes with an open zone below their
            baked-in tagline (e.g. TeenyMates). Positioned via inline style (this
            build doesn't reliably emit Tailwind arbitrary-value utilities).
            Hidden on mobile, where it shows below the hero instead. */}
        {heroTextPos && (
          <p
            style={{
              position: "absolute",
              left: heroTextPos.left ?? "6%",
              top: heroTextPos.top ?? "60%",
              width: heroTextPos.width ?? "24%",
              maxWidth: "22rem",
            }}
            className="pointer-events-none hidden text-sm leading-relaxed text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] lg:block xl:text-base"
          >
            {description}
          </p>
        )}
      </section>

      {afterHero}

      <section id="catalog" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* When the description is overlaid on the hero (heroTextPos), show this
            copy on mobile only; otherwise show it at all sizes (default). */}
        <p
          className={`mb-10 max-w-2xl text-lg leading-relaxed text-white/75 ${
            heroTextPos ? "lg:hidden" : ""
          }`}
        >
          {description}
        </p>
        <CatalogBrowser
          base={base}
          current={current}
          data={data}
          page={page}
          featured={FEATURED_COLLECTIONS}
          subcategories={subcategories}
        />
      </section>
    </>
  );
}
