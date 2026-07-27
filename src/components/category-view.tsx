import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ProductCard } from "@/components/product-card";
import { categoryHref, type CategoryDetail } from "@/lib/pim";

// The category / collection page body (grunge header, subcategory chips,
// aggregated product grid). Rendered by /products/[slug] when the slug resolves
// to a category.
export function CategoryView({ data }: { data: CategoryDetail }) {
  const { category: cat, subcategories, products, total } = data;

  return (
    <>
      <PageHeader
        title={cat.name}
        eyebrow={cat.breadcrumb.slice(0, -1).join(" / ") || "Products"}
        subtitle={cat.description ?? undefined}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {subcategories.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading mb-5 text-2xl uppercase text-white">
              Shop {cat.name}
            </h2>
            <div className="flex flex-wrap gap-3">
              {subcategories.map((s) => (
                <Link
                  key={s.slug}
                  href={categoryHref(s)}
                  className="label-athletic rounded-full border border-ink-line bg-ink-soft px-5 py-2.5 text-sm text-white/85 transition-colors hover:border-brand-red hover:text-white"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-heading text-2xl uppercase text-white">Items</h2>
          <span className="text-sm text-white/50">{total} products</span>
        </div>

        {products.length === 0 ? (
          <p className="text-white/60">Products are on the way for this collection.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.sku} p={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
