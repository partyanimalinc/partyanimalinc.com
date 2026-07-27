import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import type { LandingListing } from "@/lib/collections";

// Product listing shown on a brand landing page (below the hero): quick-filter
// chips (subcategories / collections) + a product grid + a link into the full
// filterable catalog.
export function CollectionProducts({
  name,
  listing,
}: {
  name: string;
  listing: LandingListing;
}) {
  if (listing.products.length === 0) return null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-heading text-2xl uppercase text-white">Shop {name}</h2>
        <span className="text-sm text-white/50">{listing.total} products</span>
      </div>

      {listing.chips.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2.5">
          {listing.chips.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="label-athletic rounded-full border border-ink-line bg-ink-soft px-4 py-2 text-xs text-white/80 transition-colors hover:border-brand-red hover:text-white"
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {listing.products.map((p) => (
          <ProductCard key={p.sku} p={p} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href={listing.browseHref}
          className="label-athletic inline-flex items-center gap-2 rounded-full border border-ink-line bg-ink-soft px-8 py-3.5 text-sm text-white transition-colors hover:border-brand-red hover:bg-brand-red"
        >
          Browse all {name}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
