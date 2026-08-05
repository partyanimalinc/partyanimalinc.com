import type { MetadataRoute } from "next";
import { getCategories, getLicenses } from "@/lib/pim";

// Canonical host (matches metadataBase in layout.tsx).
const SITE_URL = "https://partyanimalinc.com";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

// Static routes that always exist.
const STATIC: { path: string; priority: number; changeFrequency: Freq }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" },
  { path: "/products/all", priority: 0.8, changeFrequency: "weekly" },
  { path: "/teenymates", priority: 0.9, changeFrequency: "weekly" },
  { path: "/teenymates/all", priority: 0.7, changeFrequency: "weekly" },
  { path: "/squeezymates", priority: 0.9, changeFrequency: "weekly" },
  { path: "/squeezymates/all", priority: 0.7, changeFrequency: "weekly" },
  { path: "/jumbo-squeezy", priority: 0.9, changeFrequency: "weekly" },
  { path: "/jumbo-squeezy/all", priority: 0.7, changeFrequency: "weekly" },
  { path: "/team-gear", priority: 0.9, changeFrequency: "weekly" },
  { path: "/team-gear/all", priority: 0.7, changeFrequency: "weekly" },
  { path: "/licenses", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/where-to-buy", priority: 0.7, changeFrequency: "monthly" },
  { path: "/become-a-reseller", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export const revalidate = 3600; // rebuild the sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entry = (path: string, priority: number, changeFrequency: Freq) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  const urls: MetadataRoute.Sitemap = STATIC.map((r) =>
    entry(r.path, r.priority, r.changeFrequency),
  );

  const [categories, leagues] = await Promise.all([getCategories(), getLicenses()]);

  // Standard category pages (brand nodes have their own top-level landing,
  // already in STATIC, so skip them here to avoid 404s/dupes).
  for (const c of categories) {
    if (c.web_template === "brand") continue;
    urls.push(entry(`/products/${c.slug}`, 0.7, "weekly"));
  }

  // League + team landing pages (cross-brand) + per-league TeenyMates landings.
  for (const l of leagues) {
    urls.push(entry(`/licenses/${l.slug}`, 0.7, "weekly"));
    urls.push(entry(`/teenymates/${l.slug}`, 0.7, "weekly"));
    for (const t of l.teams) urls.push(entry(`/licenses/${t.slug}`, 0.6, "weekly"));
  }

  return urls;
}
