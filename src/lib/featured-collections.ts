import type { FeaturedCollection, SubCategory } from "@/components/catalog/filter-groups";

// The 4 featured collections that replace the raw top-level collection facet
// across the catalog UI. Each links to its brand CATALOG page (/{brand}/all) so
// the sidebar switches between catalogs and highlights the active one
// (FilterGroups marks a collection active when `base === href`).
export const FEATURED_COLLECTIONS: FeaturedCollection[] = [
  { slug: "teenymates", name: "TeenyMates", href: "/teenymates/all" },
  { slug: "squeezymates", name: "SqueezyMates", href: "/squeezymates/all" },
  { slug: "jumbo-squeezy", name: "Jumbo Squeezy", href: "/jumbo-squeezy/all" },
  { slug: "team-gear", name: "Team Gear", href: "/team-gear/all" },
];

// Team Gear has no single PIM node — its "sub-categories" are the fan-gear
// top-level collections it rolls up.
export const TEAM_GEAR_SUBCATEGORIES: SubCategory[] = [
  { slug: "flags-banners", name: "Flags & Banners" },
  { slug: "drinkware", name: "Drinkware" },
  { slug: "homegating-decor", name: "Homegating & Décor" },
];
