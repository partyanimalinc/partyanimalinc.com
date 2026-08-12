import Link from "next/link";
import { ProductGallery } from "@/components/product-gallery";
import { ProductCard } from "@/components/product-card";
import { sanitizeHtml, htmlToText } from "@/lib/html";
import { slugify } from "@/lib/slug";
import { amazonAttributed } from "@/lib/amazon";
import type { ProductDetail } from "@/lib/pim";

const RETAILER_LABEL: Record<string, string> = {
  amazon: "Buy on Amazon",
  faire: "Order Wholesale on Faire",
};

function Spec({ label, value }: { label: string; value: string | number | null }) {
  if (value === null || value === "" || value === undefined) return null;
  return (
    <div className="flex justify-between gap-4 border-b border-ink/10 py-2.5 text-sm">
      <dt className="text-ink/50">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

export function ProductView({ p }: { p: ProductDetail }) {
  const teamHref = p.teamName ? `/licenses/${slugify(p.teamName)}` : null;
  const leagueHref = p.leagueName ? `/licenses/${slugify(p.leagueName)}` : null;
  const collectionHref = p.collection
    ? p.collection.template === "brand"
      ? `/${p.collection.slug}`
      : `/products/${p.collection.slug}`
    : null;

  const consumer = p.retailers.filter((r) => !r.wholesale);
  const wholesale = p.retailers.filter((r) => r.wholesale);

  // Product structured data (helps these pages read as real products, not thin).
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    ...(p.gallery.length ? { image: p.gallery } : {}),
    ...(p.storeDescription
      ? { description: htmlToText(p.storeDescription).slice(0, 500) }
      : {}),
    brand: { "@type": "Brand", name: p.leagueName ? `Party Animal ${p.leagueName}` : "Party Animal" },
    ...(p.upc ? { gtin12: p.upc } : {}),
    // MSRP intentionally not surfaced on the web catalog yet — no price in the
    // visible UI or the structured data.
  };

  return (
    <div className="bg-[#f4f4f6] text-ink">
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-ink/45">
        <Link href="/products" className="hover:text-ink">Products</Link>
        {collectionHref && (
          <>
            <span>/</span>
            <Link href={collectionHref} className="hover:text-ink">{p.collection!.name}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-ink/70">{p.name}</span>
      </nav>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
        <ProductGallery images={p.gallery} alt={p.name} />

        <div className="flex flex-col rounded-2xl border border-black/[0.07] bg-white p-6 shadow-sm sm:p-8">
          {(leagueHref || teamHref) && (
            <p className="label-athletic mb-2 flex flex-wrap items-center gap-2 text-xs text-brand-red">
              {leagueHref && <Link href={leagueHref} className="hover:underline">{p.leagueName}</Link>}
              {leagueHref && teamHref && <span className="text-ink/30">/</span>}
              {teamHref && <Link href={teamHref} className="hover:underline">{p.teamName}</Link>}
            </p>
          )}

          <h1 className="font-heading text-3xl uppercase leading-tight text-ink sm:text-4xl">
            {p.name}
          </h1>


          {/* Buy links */}
          <div className="mt-6 flex flex-col gap-3">
            {consumer.map((r) => (
              <a
                key={r.retailer}
                href={amazonAttributed(r.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="label-athletic inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-sm text-white shadow-lg shadow-brand-red/25 transition-colors hover:bg-brand-red-dark"
              >
                {RETAILER_LABEL[r.retailer] ?? r.retailer}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
            {wholesale.map((r) => (
              <a
                key={r.retailer}
                href={amazonAttributed(r.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="label-athletic inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 bg-white px-7 py-3.5 text-sm text-ink transition-colors hover:border-brand-red hover:text-brand-red"
              >
                {RETAILER_LABEL[r.retailer] ?? r.retailer}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
            <p className="text-xs text-ink/45">
              {consumer.length > 0
                ? "Also available at fine retailers everywhere."
                : "Available at fine retailers everywhere."}
            </p>
          </div>

          {/* Marketing copy */}
          {p.storeDescription && (
            <div
              className="rich-text mt-8 text-ink/75"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(p.storeDescription) }}
            />
          )}

          {/* Feature bullets */}
          {p.detailedDescription && (
            <div className="mt-8">
              <h2 className="label-athletic mb-3 text-xs tracking-wider text-ink/45">Details</h2>
              <div
                className="rich-text text-ink/75"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(p.detailedDescription) }}
              />
            </div>
          )}

          {/* Specs */}
          <div className="mt-8">
            <h2 className="label-athletic mb-2 text-xs tracking-wider text-ink/45">Specs</h2>
            <dl>
              <Spec label="Dimensions" value={p.dimensions} />
              <Spec label="Material" value={p.materialContent} />
              <Spec label="UPC" value={p.upc} />
              <Spec label="Series" value={p.series} />
              <Spec label="Item #" value={p.sku} />
            </dl>
          </div>
        </div>
      </div>

      {/* Related */}
      {p.related.length > 0 && (
        <div className="mt-16">
          <div className="mb-6 flex items-center gap-4">
            <span className="text-brand-red">★</span>
            <h2 className="font-heading text-2xl uppercase text-ink">
              You may also like
            </h2>
            <span className="h-px flex-1 bg-ink/10" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {p.related.map((r) => (
              <ProductCard
                key={r.sku}
                p={{ ...r, msrp: null, leagueId: null, teamId: null, series: null }}
                hideTeam
              />
            ))}
          </div>
        </div>
      )}
    </section>
    </div>
  );
}
