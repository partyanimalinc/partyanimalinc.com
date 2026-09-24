import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { CategoryView } from "@/components/category-view";
import { ProductView } from "@/components/product-view";
import { getCategories, getCategory, getProduct } from "@/lib/pim";
import { htmlToText } from "@/lib/html";
import { BRAND_LANDINGS } from "@/lib/site";
import { pageMetadata, productCanonical, productTitle, trimDescription } from "@/lib/seo";

export const revalidate = 86400;
export const dynamicParams = true;

// Pre-render the (few) category pages at build; the ~2,000 product pages render
// on-demand and cache (ISR).
export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.filter((c) => c.web_template !== "brand").map((c) => ({ slug: c.slug }));
}

// A brand-template category that has its own landing (/teenymates) is a
// duplicate of it at /products/teenymates. The page 308s; see below.
const isBrandHub = (template: string, slug: string) =>
  template === "brand" && BRAND_LANDINGS.has(slug);

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;

  const cat = await getCategory(slug, { limit: 1 });
  if (cat) {
    // Redirected in the page; metadata for a redirect is never emitted.
    if (isBrandHub(cat.category.template, slug)) return {};
    return pageMetadata({
      title: cat.category.seoTitle || cat.category.name,
      description:
        cat.category.seoDescription ||
        cat.category.description ||
        `Shop ${cat.category.name} from Party Animal.`,
      path: `/products/${slug}`,
    });
  }

  const product = await getProduct(slug);
  if (product) {
    // Canonical is the product's CURRENT address: the Shopify PDP when the SKU
    // is live direct-to-consumer, else its own page here. For a retired slug
    // the page 308s anyway, but metadata is generated first and must not
    // advertise the old one.
    const canonical = productCanonical({ ...product, slug });
    const qualifier = product.teamName ?? product.leagueName ?? product.collection?.name ?? null;
    const title = productTitle(product.name, qualifier);
    const desc =
      trimDescription(htmlToText(product.storeDescription)) ||
      `${product.name} from Party Animal.${product.teamName ? ` Officially licensed ${product.teamName} fan gear.` : ""}`;
    const image = product.gallery[0];

    return {
      title,
      description: desc,
      alternates: { canonical },
      ...(product.excludeFromSitemap ? { robots: { index: false, follow: true } } : {}),
      // Next's Metadata type has no "product" OG type; "website" with the
      // product image is the portable choice.
      openGraph: {
        type: "website",
        siteName: "Party Animal",
        url: canonical,
        title: product.name,
        description: desc,
        ...(image ? { images: [{ url: image, alt: product.name }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: desc,
        ...(image ? { images: [image] } : {}),
      },
    };
  }

  return { title: "Products" };
}

export default async function ProductsSlugPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  // A slug is either a category (collection) or a product. Category wins.
  const cat = await getCategory(slug, { limit: 60 });
  if (cat) {
    // /products/teenymates duplicates /teenymates. Thrown before anything
    // streams, on an ISR route with no loading boundary, so this is a real
    // 308 with a Location header (and it is cached like the page would be).
    if (isBrandHub(cat.category.template, slug)) permanentRedirect(`/${slug}`);
    return <CategoryView data={cat} />;
  }

  const product = await getProduct(slug);
  if (product) {
    // The slug was retired and the API resolved it to the product's current
    // one. 308 so the old URL keeps working and search engines consolidate on
    // the new address instead of indexing both.
    if (product.movedTo && product.movedTo !== slug) {
      permanentRedirect(`/products/${product.movedTo}`);
    }
    return <ProductView p={product} />;
  }

  notFound();
}
