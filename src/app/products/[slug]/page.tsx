import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { CategoryView } from "@/components/category-view";
import { ProductView } from "@/components/product-view";
import { getCategories, getCategory, getProduct } from "@/lib/pim";
import { htmlToText } from "@/lib/html";

export const revalidate = 86400;
export const dynamicParams = true;

// Pre-render the (few) category pages at build; the ~2,000 product pages render
// on-demand and cache (ISR).
export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.filter((c) => c.web_template !== "brand").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;

  const cat = await getCategory(slug, { limit: 1 });
  if (cat) {
    return {
      title: cat.category.seoTitle || cat.category.name,
      description:
        cat.category.seoDescription ||
        cat.category.description ||
        `Shop ${cat.category.name} from Party Animal.`,
      alternates: { canonical: `/products/${slug}` },
    };
  }

  const product = await getProduct(slug);
  if (product) {
    // Canonical is the product's CURRENT url: for a retired slug the page 308s
    // anyway, but metadata is generated first and must not advertise the old one.
    const canonicalSlug = product.movedTo || slug;
    const desc =
      htmlToText(product.storeDescription).slice(0, 160) ||
      `${product.name} from Party Animal.${product.teamName ? ` Officially licensed ${product.teamName} fan gear.` : ""}`;
    return {
      title: `${product.name}${product.teamName ? "" : ""}`,
      description: desc,
      alternates: { canonical: `/products/${canonicalSlug}` },
      openGraph: product.gallery.length
        ? { images: [{ url: product.gallery[0] }], title: product.name, description: desc }
        : undefined,
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
  if (cat) return <CategoryView data={cat} />;

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
