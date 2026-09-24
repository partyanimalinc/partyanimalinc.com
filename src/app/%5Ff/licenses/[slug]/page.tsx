import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { LicenseCatalog, licenseMetadata } from "@/components/license-catalog";
import { getLicenses, resolveLicense } from "@/lib/pim";
import { parseLicenseSearch } from "@/lib/license-url";
import { filteredVariantMetadata } from "@/lib/seo";

// On-demand twin of /licenses/[slug] for filtered / sorted / paged requests.
// Reached only through the src/proxy.ts rewrite (see LISTING_ROUTE there).
export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const resolved = resolveLicense(await getLicenses(), slug);
  const base = resolved ? licenseMetadata(slug, resolved) : { title: "Licenses & Partners" };
  return filteredVariantMetadata(base, `/licenses/${slug}`);
}

export default async function LicenseFilteredPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SP>;
}) {
  const { slug } = await props.params;
  const search = parseLicenseSearch(await props.searchParams);
  const resolved = resolveLicense(await getLicenses(), slug);
  if (!resolved) permanentRedirect("/licenses");
  return <LicenseCatalog slug={slug} resolved={resolved} search={search} />;
}
