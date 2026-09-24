import type { Metadata } from "next";
import type { ProductDetail } from "@/lib/pim";

// Canonical host. Matches metadataBase in app/layout.tsx; the sitemap and the
// JSON-LD helpers below all build absolute URLs from it.
export const SITE_URL = "https://www.partyanimalinc.com";
export const SITE_NAME = "Party Animal";

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl === "/" ? "" : pathOrUrl}`;
}

// ---------------------------------------------------------------------------
// Page metadata
// ---------------------------------------------------------------------------

// Per-page metadata for a hub / landing / listing page: title (the root layout
// appends " | Party Animal"), description, a self canonical, and per-page Open
// Graph + Twitter copy. Without the openGraph block every non-product page
// inherits the root's "Party Animal: Ready to Rip" card.
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  // Override the social card title (defaults to "<title> | Party Animal").
  ogTitle?: string;
}): Metadata {
  const ogTitle = opts.ogTitle ?? `${opts.title} | ${SITE_NAME}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: opts.path,
      title: ogTitle,
      description: opts.description,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: opts.description,
    },
  };
}

// Metadata for a filtered / sorted / paged variant of a listing page: same
// copy as the clean page, but noindex,follow and canonical back to the clean
// URL so the combinatorial ?league=&series= views never enter the index.
export function filteredVariantMetadata(base: Metadata, canonicalPath: string): Metadata {
  return {
    ...base,
    alternates: { canonical: canonicalPath },
    robots: { index: false, follow: true },
  };
}

// "<name> | <qualifier>" when the qualifier adds information (it is not already
// in the name) and the result stays inside a search snippet; otherwise the
// bare name. The root layout still appends " | Party Animal".
export function productTitle(name: string, qualifier: string | null | undefined, max = 60): string {
  const q = qualifier?.trim();
  if (!q) return name;
  if (name.toLowerCase().includes(q.toLowerCase())) return name;
  const enriched = `${name} | ${q}`;
  return enriched.length <= max ? enriched : name;
}

// Trim plain text to a meta-description length at a word boundary. Returns ""
// for empty input so callers can `||` a fallback.
export function trimDescription(text: string | null | undefined, max = 160): string {
  const t = (text ?? "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const at = cut.lastIndexOf(" ");
  const head = at > max * 0.5 ? cut.slice(0, at) : cut;
  return `${head.replace(/[\s,;:.\-–—(]+$/, "")}…`;
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

export type Crumb = { name: string; path?: string | null };

// BreadcrumbList. Every item with a path gets an absolute URL; the last item
// may omit it (Google allows the current page to be URL-less).
export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: absoluteUrl(c.path) } : {}),
    })),
  };
}

// The product's canonical address: the DTC (Shopify) PDP when the SKU is live
// on partyanimaltoys.com, else its own page here.
export function productCanonical(p: Pick<ProductDetail, "slug" | "movedTo" | "canonicalUrl">): string {
  return p.canonicalUrl ?? `/products/${p.movedTo || p.slug}`;
}

// Product structured data. `offers` only when the SKU is buyable direct and we
// know the price; the corporate catalog otherwise shows no price, and Google
// treats an Offer without one as an error.
export function productJsonLd(p: ProductDetail, description: string) {
  const dtc = p.dtc;
  const offer =
    dtc && dtc.available && dtc.price
      ? {
          "@type": "Offer",
          price: dtc.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          ...(dtc.url ? { url: dtc.url } : {}),
          seller: {
            "@type": "Organization",
            name: "Party Animal Toys",
            url: "https://partyanimaltoys.com",
          },
        }
      : null;

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    url: absoluteUrl(productCanonical(p)),
    ...(p.gallery.length ? { image: p.gallery } : {}),
    ...(description ? { description } : {}),
    // Plain "Party Animal": "Party Animal NFL" is a license, not a brand.
    brand: { "@type": "Brand", name: SITE_NAME },
    ...(p.upc ? { gtin12: p.upc } : {}),
    ...(offer ? { offers: offer } : {}),
  };
}
