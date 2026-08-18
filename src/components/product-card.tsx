import Link from "next/link";
import type { CategoryProduct } from "@/lib/pim";
import { ProductImagePlaceholder } from "@/components/product-image-placeholder";
import { amazonAttributed } from "@/lib/amazon";
import Image from "next/image";

// Shared product tile: white cutout, name, "Available at" retailer buttons (or
// "Available in stores"). Used on category, catalog, and license pages.
// The image + name link to the product detail page (when a slug exists); the
// retailer buttons stay OUTSIDE that link (no nested anchors).
export function ProductCard({ p, hideTeam }: { p: CategoryProduct; hideTeam?: boolean }) {
  const href = p.slug ? `/products/${p.slug}` : null;

  const media = (
    <>
      {p.teamName && !hideTeam && (
        <span className="absolute left-2 top-2 z-10 rounded-full bg-ink/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          {p.teamName}
        </span>
      )}
      {p.series != null && (
        <span className="label-athletic absolute right-2 top-2 z-10 rounded-full bg-brand-red px-2 py-0.5 text-[10px] text-white">
          Series {p.series}
        </span>
      )}
      {p.image ? (
        <Image
          src={p.image}
          alt={p.name}
          width={500}
          height={500}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
        />
      ) : (
        <ProductImagePlaceholder caption={false} />
      )}
    </>
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition-shadow hover:shadow-lg">
      {href ? (
        <Link href={href} className="relative aspect-square bg-white p-3">
          {media}
        </Link>
      ) : (
        <div className="relative aspect-square bg-white p-3">{media}</div>
      )}
      <div className="flex flex-1 flex-col gap-2 border-t border-black/5 p-3">
        {href ? (
          <Link href={href}>
            <h3 className="line-clamp-2 text-sm font-semibold text-ink transition-colors group-hover:text-brand-red">
              {p.name}
            </h3>
          </Link>
        ) : (
          <h3 className="line-clamp-2 text-sm font-semibold text-ink">{p.name}</h3>
        )}
        <div className="mt-auto">
          {p.retailers.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {p.retailers.map((r) => (
                <a
                  key={r.retailer}
                  href={amazonAttributed(r.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-athletic rounded-full bg-brand-red px-3 py-1 text-[11px] text-white transition-colors hover:bg-brand-red-dark"
                >
                  {r.retailer}
                </a>
              ))}
            </div>
          ) : (
            <span className="text-[11px] font-medium uppercase tracking-wide text-ink/45">
              Available in stores
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
