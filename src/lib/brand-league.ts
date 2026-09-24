import type { Metadata } from "next";
import { getLicenses, resolveLicense, type LicenseLeague } from "@/lib/pim";
import { pageMetadata } from "@/lib/seo";

// Shared by the clean /{brand}/[league] landings and their /_f twins. Lives
// outside the page files because a page module may only export Next's own
// fields.
export const BRAND_LEAGUE_PAGES = {
  teenymates: { name: "TeenyMates", base: "/teenymates/all" },
  squeezymates: { name: "SqueezyMates", base: "/squeezymates/all" },
} as const;

export type BrandLeagueKey = keyof typeof BRAND_LEAGUE_PAGES;

// A league slug only; team slugs fall through to notFound in the page.
export async function resolveLeague(slug: string): Promise<LicenseLeague | null> {
  const r = resolveLicense(await getLicenses(), slug);
  return r && r.type === "league" ? r.league : null;
}

export function brandLeagueMetadata(brand: BrandLeagueKey, league: LicenseLeague): Metadata {
  const { name } = BRAND_LEAGUE_PAGES[brand];
  return pageMetadata({
    title: `${name} ${league.name} Figures`,
    description: `Shop ${name} ${league.name}: officially licensed ${league.name} collectible figures, blind packs, team sets, collector tins, gift sets, and more.`,
    path: `/${brand}/${league.slug}`,
  });
}
