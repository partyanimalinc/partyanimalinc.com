import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { ProductCard } from "@/components/product-card";
import { SortMenu } from "@/components/catalog/sort-menu";
import { getLicenses, getCatalog, resolveLicense } from "@/lib/pim";
import {
  parseLicenseSearch,
  licenseHref,
  licenseHasFilters,
} from "@/lib/license-url";
import { SORT_OPTIONS } from "@/lib/catalog-url";

export const revalidate = 300;
export const dynamicParams = true;

const PER = 48;
const SORTS = SORT_OPTIONS;

type SP = Record<string, string | string[] | undefined>;

export async function generateStaticParams() {
  const leagues = await getLicenses();
  const params: { slug: string }[] = [];
  for (const l of leagues) {
    params.push({ slug: l.slug });
    for (const t of l.teams) params.push({ slug: t.slug });
  }
  return params;
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const search = parseLicenseSearch(await props.searchParams);
  const resolved = resolveLicense(await getLicenses(), slug);
  if (!resolved) return { title: "Licenses & Partners" };

  const name = resolved.type === "team" ? resolved.team.name : resolved.league.name;
  const filtered = licenseHasFilters(search) || (search.page && search.page !== "1") || search.sort;

  return {
    title: `${name} Merchandise & Collectibles`,
    description:
      resolved.type === "team"
        ? `Shop ${name} collectibles and fan gear from Party Animal: TeenyMates, SqueezyMates, flags, drinkware and more.`
        : `Shop ${name} collectibles and fan gear from Party Animal across every team.`,
    alternates: { canonical: `/licenses/${slug}` },
    robots: filtered ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function LicensePage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SP>;
}) {
  const { slug } = await props.params;
  const current = parseLicenseSearch(await props.searchParams);
  const resolved = resolveLicense(await getLicenses(), slug);
  // Legacy player-association segments (nflpa, mlbpa, ...) have no landing page.
  if (!resolved) redirect("/licenses");

  const pageNum = Math.min(Math.max(Number(current.page) || 1, 1), 10);

  const catalogFilter =
    resolved.type === "team"
      ? { team: resolved.team.id }
      : { league: resolved.league.id };

  const data = await getCatalog({
    ...catalogFilter,
    collection: current.collection,
    sort: current.sort,
    page: 1,
    pageSize: PER * pageNum,
  });

  const { products, total, facets } = data;
  const hasMore = products.length < total && pageNum < 10;

  const name = resolved.type === "team" ? resolved.team.name : resolved.league.name;
  const image = resolved.type === "team" ? resolved.team.image : resolved.league.image;
  const eyebrow =
    resolved.type === "team" ? resolved.league.name : "Officially Licensed";

  return (
    <>
      <PageHeader
        title={name}
        eyebrow={eyebrow}
        subtitle={`${total} product${total === 1 ? "" : "s"} to rep your ${
          resolved.type === "team" ? "team" : "league"
        }.`}
        logo={image}
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* League pages: jump to a specific team */}
        {resolved.type === "league" && resolved.league.teams.length > 0 && (
          <div className="mb-8">
            <h2 className="label-athletic mb-3 text-xs tracking-wider text-white/45">
              Shop by Team
            </h2>
            <div className="flex flex-wrap gap-2">
              {resolved.league.teams.map((t) => (
                <Link
                  key={t.slug}
                  href={`/licenses/${t.slug}`}
                  className="rounded-full border border-ink-line bg-ink-soft px-4 py-2 text-sm text-white/80 transition-colors hover:border-brand-red hover:text-white"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar: collection sub-filter + sort */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          {facets.collections.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              <Link
                href={licenseHref(slug, current, { collection: null })}
                scroll={false}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  !current.collection
                    ? "bg-brand-red font-semibold text-white"
                    : "border border-ink-line bg-ink-soft text-white/75 hover:text-white"
                }`}
              >
                All
              </Link>
              {facets.collections.map((c) => {
                const active = current.collection === c.slug;
                return (
                  <Link
                    key={c.slug}
                    href={licenseHref(slug, current, { collection: active ? null : c.slug })}
                    scroll={false}
                    className={`rounded-full px-4 py-2 text-sm transition-colors ${
                      active
                        ? "bg-brand-red font-semibold text-white"
                        : "border border-ink-line bg-ink-soft text-white/75 hover:text-white"
                    }`}
                  >
                    {c.name}
                    <span className={`ml-1.5 ${active ? "text-white/80" : "text-white/35"}`}>
                      {c.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <span />
          )}

          <SortMenu
            value={current.sort || "featured"}
            options={SORTS.map((o) => ({
              ...o,
              href: licenseHref(slug, current, { sort: o.value }),
            }))}
          />
        </div>

        <p className="mb-5 text-sm text-white/50" aria-live="polite">
          {total === 0
            ? "No products found"
            : `Showing ${products.length} of ${total} product${total === 1 ? "" : "s"}`}
        </p>

        {products.length === 0 ? (
          <div className="rounded-xl border border-ink-line bg-ink-soft px-6 py-16 text-center">
            <p className="text-white/70">No products here yet.</p>
            <Link
              href="/licenses"
              className="label-athletic mt-4 inline-block text-sm text-brand-red hover:text-brand-red-dark"
            >
              Back to Licenses
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((p) => (
                <ProductCard key={p.sku} p={p} hideTeam={resolved.type === "team"} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <Link
                  href={licenseHref(slug, current, { page: String(pageNum + 1) })}
                  scroll={false}
                  prefetch={false}
                  className="label-athletic inline-flex items-center gap-2 rounded-full border border-ink-line bg-ink-soft px-8 py-3.5 text-sm text-white transition-colors hover:border-brand-red hover:bg-brand-red"
                >
                  Load more
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
