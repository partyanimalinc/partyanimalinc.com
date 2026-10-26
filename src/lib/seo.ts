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

// ---------------------------------------------------------------------------
// Brand hubs and collection pages
// ---------------------------------------------------------------------------

// The four product lines as schema.org Brands. One definition, referenced by
// the Organization on the home page (`brand`), by each hub's CollectionPage
// (`about`) and by the league landings under it, so answer engines resolve
// "TeenyMates" to one entity that belongs to Party Animal rather than to four
// unrelated mentions.
export const BRAND_HUBS = {
  teenymates: {
    name: "TeenyMates",
    path: "/teenymates",
    description:
      "TeenyMates are one-inch collectible figures of real players and teams, sold in blind packs, team sets, gift sets, collector tins, advent calendars and gravity feed displays. Officially licensed NFL, MLB, NBA, NHL, WNBA, MLS and College.",
  },
  squeezymates: {
    name: "SqueezyMates",
    path: "/squeezymates",
    description:
      "SqueezyMates are soft, squeezable foam collectible figures of players, helmets and mascots, sold in blind bags, 3-packs, 6-figure sets and gravity feed displays. Officially licensed NFL, MLB, NBA, NHL, WNBA and College.",
  },
  "jumbo-squeezy": {
    name: "Jumbo Squeezy",
    path: "/jumbo-squeezy",
    description:
      "Jumbo Squeezy are oversized squeezable foam helmet figures, sold as team combo packs and capsule displays. Officially licensed across the NFL, MLB, NBA, NHL, WNBA and College.",
  },
  "team-gear": {
    name: "Team Gear",
    path: "/team-gear",
    description:
      "Team Gear is Party Animal's officially licensed fan gear: flags and banners, garden flags, drinkware, metal signs, lights and homegating decor for NFL, MLB, NBA, NHL, MLS and College fans.",
  },
} as const;

export type BrandHubKey = keyof typeof BRAND_HUBS;

const WEBSITE_REF = { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL };

// A Brand node. `@id` is the hub URL plus #brand so every page that mentions
// the brand points at the same node.
export function brandJsonLd(key: BrandHubKey) {
  const b = BRAND_HUBS[key];
  return {
    "@type": "Brand",
    "@id": `${absoluteUrl(b.path)}#brand`,
    name: b.name,
    url: absoluteUrl(b.path),
    description: b.description,
    logo: `${SITE_URL}/brand/pa-logo.png`,
  };
}

export type ListEntry = { name: string; path: string };

// CollectionPage + BreadcrumbList (+ Brand and ItemList when given), as one
// @graph. Used by the brand hubs, the league landings and the advent page.
// `items` are the page's own child pages (league hubs, calendars), which is
// what tells a crawler this page is the parent of those.
export function collectionPageJsonLd(opts: {
  name: string;
  path: string;
  description: string;
  crumbs: Crumb[];
  brand?: BrandHubKey;
  items?: ListEntry[];
  itemListName?: string;
}) {
  const url = absoluteUrl(opts.path);
  const brand = opts.brand ? brandJsonLd(opts.brand) : null;
  const graph: object[] = [
    {
      "@type": "CollectionPage",
      "@id": `${url}#page`,
      name: opts.name,
      url,
      description: opts.description,
      isPartOf: WEBSITE_REF,
      ...(brand ? { about: { "@id": brand["@id"] } } : {}),
      ...(opts.items?.length ? { mainEntity: { "@id": `${url}#list` } } : {}),
    },
    ...(brand ? [brand] : []),
    { ...breadcrumbJsonLd(opts.crumbs), "@context": undefined },
  ];
  if (opts.items?.length) {
    graph.push({
      "@type": "ItemList",
      "@id": `${url}#list`,
      name: opts.itemListName ?? opts.name,
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: absoluteUrl(it.path),
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph.map((n) => JSON.parse(JSON.stringify(n))) };
}
