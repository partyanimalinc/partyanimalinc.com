# Catalog — notebook

Read before touching product data, URLs, or redirects. Append to **Learned**
when something costs effort.

## Data flow
AppHub PIM → `PIM_API_BASE` + `PIM_API_KEY` → `src/lib/pim.ts` → pages.
AppHub calls `/api/revalidate` (header `x-revalidate-secret`) after product
edits with tags `catalog`, `product:<web_slug>` and paths `/products/<slug>`.

## Key files
- `src/lib/pim.ts`, `collections.ts`, `featured-collections.ts`
- `src/lib/catalog-url.ts`, `license-url.ts`, `slug.ts`
- `src/lib/redirects.ts`, `redirects.data.json`, `product-slug-redirects.json`,
  `legacy-product-categories.json`
- `src/lib/dsg.ts` (Dick's Sporting Goods buy links), `amazon.ts`
- `src/app/products/`, `src/app/licenses/`, `sitemap.ts`, `robots.ts`
- `src/proxy.ts` — old-URL redirects (`/Licenses/` → `/licenses`)

## Rules & gotchas
- 7,011 old NetSuite product URLs map to SKUs in the migration CSV; product
  detail redirects wire in `proxy.ts` once detail pages exist.
- `/licenses/[team]` collapses to `/licenses` until team pages are built.
- Open PIM decisions (`PRODUCT-CATALOG-PLAN.md`): `public_catalog_visible`
  vs reusing `display_in_web_site`; `web_sort_order`, `is_new`, `is_featured`.
  These are AppHub `pim` decisions, not this repo's.
- ISR: product pages 24 h, listings 1 h.
- Listing routes (`/licenses/[slug]`, `/{brand}/[league]`, `/products/all`,
  `/{brand}/all`) never read `searchParams`; the clean URL is ISR. Filtered /
  sorted / paged requests are rewritten by `src/proxy.ts` to an on-demand twin
  under `src/app/%5Ff/` (served at `/_f/...`, never linked, 308s back when hit
  directly). Adding a query param a listing reads means adding it to
  `FACET_PARAMS` in `proxy.ts`, or the ISR page will silently ignore it.
- Brand hubs: `/products/teenymates` (and the other `BRAND_LANDINGS` in
  `src/lib/site.ts`) 308 to `/teenymates`. Other `brand`-template PIM nodes
  (speed-cube, big-sip, motiglow, big-shot-ballers) have no landing and stay
  on the category template.

## Learned (newest first)
- 2026-09-19 — seeded from `PRODUCT-CATALOG-PLAN.md`, `SITEMAP.md`, and AppHub's `revalidate-site.ts`.
