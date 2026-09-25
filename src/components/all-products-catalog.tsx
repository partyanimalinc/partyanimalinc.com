import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { getCatalog } from "@/lib/pim";
import { CATALOG_BASE, type CatalogSearch } from "@/lib/catalog-url";
import { FEATURED_COLLECTIONS } from "@/lib/featured-collections";
import { pageMetadata } from "@/lib/seo";

const PER = 48;

// Metadata for the clean, indexable /products/all page. The filtered variants
// (rendered by the /_f twin) wrap this with filteredVariantMetadata().
export function allProductsMetadata(): Metadata {
  return pageMetadata({
    title: "All Products",
    description:
      "Browse the full Party Animal catalog: TeenyMates, SqueezyMates, flags, drinkware, homegating décor and more. Filter by collection, series, league, and team.",
    path: CATALOG_BASE,
  });
}

// Full-catalog body (/products/all). `search` is the parsed query: the public
// route passes {} (it never reads searchParams, which is what keeps it ISR);
// the /_f twin passes the real one.
export async function AllProductsCatalog({ search }: { search: CatalogSearch }) {
  const current = search;
  const page = Math.min(Math.max(Number(current.page) || 1, 1), 10);

  const data = await getCatalog({
    collection: current.collection,
    league: current.league,
    team: current.team,
    series: current.series ? Number(current.series) : undefined,
    line: current.line,
    edition: current.edition,
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
