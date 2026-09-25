import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { LicenseCatalog, licenseMetadata } from "@/components/license-catalog";
import { getLicenses, resolveLicense } from "@/lib/pim";

// The clean league / team landing (/licenses/nfl, /licenses/dallas-cowboys).
// ISR: it never reads searchParams. A request that carries a facet, sort or
// page param is rewritten by src/proxy.ts to the on-demand twin under
// src/app/%5Ff/licenses/[slug] (served at /_f/...), which renders the same
// LicenseCatalog with the parsed query.
export const revalidate = 3600;
export const dynamicParams = true;

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
}): Promise<Metadata> {
  const { slug } = await props.params;
  const resolved = resolveLicense(await getLicenses(), slug);
  if (!resolved) return { title: "Licenses & Partners" };
  return licenseMetadata(slug, resolved);
}

export default async function LicensePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const resolved = resolveLicense(await getLicenses(), slug);
  // Legacy player-association segments (nflpa, mlbpa, ...) have no landing page.
  if (!resolved) permanentRedirect("/licenses");
  return <LicenseCatalog slug={slug} resolved={resolved} search={{}} />;
}
