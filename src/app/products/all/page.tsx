import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { getCatalog } from "@/lib/pim";
import { parseCatalogSearch, hasActiveFilters, CATALOG_BASE } from "@/lib/catalog-url";
import { FEATURED_COLLECTIONS } from "@/lib/featured-collections";

export const revalidate = 300;

const PER = 48;
type SP = Record<string, string | string[] | undefined>;

export async function generateMetadata(props: {
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const search = parseCatalogSearch(await props.searchParams);
  const filtered = hasActiveFilters(search) || (search.page && search.page !== "1") || search.sort;
  return {
    title: "All Products",
    description:
      "Browse the full Party Animal catalog: TeenyMates, SqueezyMates, flags, drinkware, homegating décor and more. Filter by collection, series, league, and team.",
    alternates: { canonical: CATALOG_BASE },
    robots: filtered ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function AllProductsPage(props: { searchParams: Promise<SP> }) {
  const current = parseCatalogSearch(await props.searchParams);
  const page = Math.min(Math.max(Number(current.page) || 1, 1), 10);

  const data = await getCatalog({
    collection: current.collection,
    league: current.league,
    team: current.team,
    series: current.series ? Number(current.series) : undefined,
    q: current.q,
    sort: current.sort,
    page: 1,
    pageSize: PER * page, // accumulate items 1..page*PER in one SSR call
  });

  return (
    <>
      <PageHeader
        title="All Products"
        eyebrow="Full Catalog"
        subtitle="Every collection in one place. Filter by collection, series, league, and team."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <CatalogBrowser
          base={CATALOG_BASE}
          current={current}
          data={data}
          page={page}
          featured={FEATURED_COLLECTIONS}
        />
      </section>
    </>
  );
}
