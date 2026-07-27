# Product List / Catalog — Plan

The `/products/all` filtered catalog and the SEO-critical facet pages (leagues,
teams). PIM is the single source of truth. Product **detail** pages come later.

## 1. URL & SEO strategy (the crux)

Faceted catalogs create infinite URL combinations; we index the valuable ones
and canonicalize the rest.

**Indexable, clean URLs (own `<h1>`, unique copy, in sitemap):**
- `/products/[category]` — already built (category + descendants).
- `/licenses/[team]` — team-filtered catalog (e.g. `/licenses/dallas-cowboys`). High search demand; replaces old `/Licenses/[Team]/`. ~170 pages.
- `/licenses/[league]` or `/leagues/[league]` — league-filtered (NFL/MLB/…). Decide one namespace.
- `/products/all` — the master catalog entry (canonical, indexable).

**Query-param filters (NON-indexed, `rel=canonical` → the clean base URL):**
- `?sort=`, `?page=`, `?type=`, `?price=`, `?q=`, secondary combinations.
- Add `<meta name="robots" content="noindex,follow">` when 2+ facets combine or a sort/page param is present.
- One canonical per page; canonical drops sort/page/secondary params.

**Redirect mapping (old NetSuite → new):**
- `/Products/{Category}/` → `/products/{category}` (done, 301/308).
- `/Licenses/{Team}/` → `/licenses/{team}` (team catalog page). Generate from the crawl CSV + PIM team slugs. Currently these collapse to `/licenses` as a placeholder in `redirects.data.json` — regenerate to specific team pages once built.
- `/Licenses/` → `/licenses` (done via middleware).
- Product URLs (`/Products/{Cat}/{slug}.html`, 7,011 of them) → resolved to SKU in the migration CSV; wire in middleware once product detail pages exist (later phase).

## 2. PIM as source of truth (data + toggles)

**Public-catalog visibility toggle (the user's ask):**
- Reuse the existing `products.display_in_web_site` as the public gate, OR add a dedicated `products.public_catalog_visible` if internal "show in web site" must stay separate from the public site. **DECISION NEEDED.** Recommend: a new `public_catalog_visible boolean default false`, backfilled from `display_in_web_site AND is_active`, so the internal PIM flag and the public storefront gate can diverge without surprises.
- Category-level gate already exists: `categories.show_on_website`.
- Add merchandising flags for the catalog: `products.web_sort_order int`, `products.is_new bool` (or derive from series_year), maybe `products.is_featured bool`.
- Wire all new fields into apphub's product + category edit UIs (per the "new PIM column → all surfaces" rule).

**Facets come from existing PIM structure:**
- Collection/category → `product_categories` + `categories` tree.
- League/team → `products.league_id` / `team_id` (+ `leagues`, `teams` tables, which already have images).
- Product type → `categories` (top-level) or `merchandising_type`.
- Price → `msrp`. New → `series_year` / `is_new`.

## 3. Public API additions (apphub)

- **`GET /api/public/products`** — the catalog endpoint. Params: `category`, `league`, `team`, `type`, `sort`, `page`, `pageSize`, `q`. Returns: paginated products (same shape as category detail) + `total` + **facet counts** (available leagues/teams/categories with counts, for the filter sidebar). Backed by a Postgres function that filters + windows total + aggregates facet counts in one pass (extend the `web_category_products` pattern).
- **`GET /api/public/facets`** — (optional) global facet lists (leagues, teams by league, top categories) for building filter UIs without a full product scan.
- Reuse `createAdminClient`, `_shared.ts` (CORS, `PUBLIC_API_KEY`, `retailersFor`). Everything gated on the new `public_catalog_visible`.

## 4. UI / UX

**Layout (cohesive with the dark/grunge/athletic system):**
- Header: grunge `PageHeader` with the facet name (e.g. "Dallas Cowboys", "All Products").
- Desktop: left **filter sidebar** (collapsible facet groups: Collection, League, Team, Type, Price) + right product grid.
- Mobile: filters in a **bottom-sheet/drawer** triggered by a "Filters" button; sticky sort + result count bar.
- **Active-filter chips** (removable) above the grid; "Clear all".
- **Sort** dropdown (Featured, Newest, Name A–Z, Price).
- **Pagination**: SSR pages (`?page=`) for crawlability + a "Load more" enhancement; result count ("1–60 of 2,055").
- Product card: white product tile, name, league/team badge, **"Available at" retailer** buttons (Amazon now; extensible later), "Available in stores" fallback. (Reuse the category-page card.)
- Empty state, loading skeletons, keyboard-accessible filters, `prefers-reduced-motion`.

## 5. Engineering

- **SSR/ISR** for SEO; all filter state in the URL (shareable, crawlable, back-button correct).
- Server component reads the PIM public API; filters map to query params → API call.
- Facet counts + total from the Postgres function (one round trip).
- Cache: ISR `revalidate` + edge `s-maxage`; `minimumCacheTTL` already handled.
- A11y: filter groups as fieldsets, focus states, aria-live on result count.

## 6. Phasing

1. **`/products/all`** — core filters (collection, league, team), sort, SSR pagination, facet counts, PIM-driven. Reuse category product card.
2. **`/licenses/[team]`** + **league pages** — same list component, clean indexable URLs; regenerate old `/Licenses/*` redirects to them.
3. Canonical/robots/sitemap wiring for the whole catalog.
4. **Product detail pages** + extensible retailers model (later).
5. Search (`q`), price filter, merchandising (featured/new).

## BUILD STATUS

**Phase 1 — DONE (2026-07-24).** `/products/all` catalog is live locally.
- apphub migration `00176_web_catalog_fns.sql` (applied to prod): `web_catalog_products(...)` (filtered/paginated page + windowed total, sorts featured|newest|az|za) and `web_catalog_facets(...)` (jsonb: collections/leagues/teams counts with **self-exclusion**).
- apphub route `app/api/public/products/route.ts`: params `collection` (slug→descendant ids), `league`, `team`, `q`, `sort`, `page`, `pageSize` (cap 480 for accumulation). Returns products + total + facets + `applied` (resolved names for chips).
- site: `lib/pim.ts#getCatalog`, `lib/catalog-url.ts` (pure href/parse helpers + SORT_OPTIONS), `components/product-card.tsx` (shared; category page now reuses it), `components/catalog/{filter-groups,filter-drawer,sort-select}.tsx`, `app/products/all/page.tsx`.
- Pagination model: **accumulating SSR** — `?page=N` renders items 1..N*48 in one call; "Load more" is a real `<a href=?page=N+1>` (crawlable, works w/o JS). Filters are real `<Link>`s (crawlable). Mobile = filter drawer.
- SEO: base `/products/all` = index,follow; any filter/sort/page = noindex,follow + `canonical`→`/products/all`. Verified.
- **Known content gap:** `display_in_web_site` currently includes trade/display units (Gravity Feed Display, Foil Bag, half-panels) — needs PIM curation to hide from the public catalog (separate follow-up, not a code change here).

**Phase 2 — DONE (2026-07-25).** Dedicated `/licenses/[slug]` team + league landing pages, live locally.
- apphub migration `00177_web_license_counts_fn.sql` (applied): `web_license_counts()` (per-league + per-team web-visible counts, one round trip).
- apphub route `app/api/public/licenses/route.ts`: leagues (each with nested teams) that have ≥1 web-visible product, with **slugs** (slugify = lowercased old NetSuite segment, so redirects are deterministic), images, counts.
- site: `lib/pim.ts#getLicenses` + `resolveLicense`, `lib/license-url.ts`, generic `components/catalog/sort-menu.tsx` (server precomputes hrefs; replaced `sort-select`), `app/licenses/[slug]/page.tsx` (team + league; reuses ProductCard grid + collection sub-filter chips + sort + accumulating Load-more), `app/licenses/page.tsx` hub rebuilt to a **Shop-by-League** directory. `PageHeader` gained an optional `logo` (team/league mark).
- **Legacy redirects handled in `src/middleware.ts`** (NOT config — config matches case-insensitively and would swallow the new lowercase pages). Middleware owns capital-`/Licenses/*`: landing → `/licenses/{lowercased-segment}`; hub root + deeper product URLs → `/licenses`. Removed the old `/Licenses/:path+` config wildcard. Known team/league landings = 2 hops (Next trailing-slash strip + middleware lowercase); unknown PA segments (nflpa/mlbpa) = 3 hops to hub. All 308/307, SEO-safe.
- SEO: team/league base = index,follow + canonical `/licenses/{slug}`; any collection/sort/page = noindex,follow. Titles like "Dallas Cowboys Merchandise & Collectibles". Team pages suppress the per-card team badge (`ProductCard hideTeam`); league pages keep it + add a Shop-by-Team row.
- **Still pending (later phase):** per-product `/Licenses/{Team}/*.html` 301s resolve by SKU once product detail pages exist; today they bounce to the hub (interim).

**Phase 3 — DONE (2026-07-25).** SEO wiring + product detail pages + full legacy redirect coverage.
- **Sitemap** (`src/app/sitemap.ts`) now async/dynamic: static routes + every standard category + every league + every team (332 URLs). `robots.ts` unchanged (allow all + sitemap).
- **Product detail pages** at flat **`/products/{web_slug}`**:
  - Migration **00178** `products.web_slug` (backfilled from the OLD item_url filename → deterministic 1:1 with legacy URLs; 2053/2053 unique) + `web_slugify()`. Migration **00179** `web_product_detail(slug)` RPC — **resolves description inheritance from product_parents** (products_rendered does NOT; ~600 children inherit their copy). Migration **00180** added `web_slug` to `web_catalog_products` + `web_category_products` so cards can link.
  - Copy source (inheritance-resolved): `store_description` (marketing para), `detailed_description` (feature bullets), `featured_description` (specs/reseller note). NOT the raw `description` col (nearly empty). Coverage ~1635/2053 (80%).
  - apphub `app/api/public/products/[slug]/route.ts`: detail + specs + breadcrumb/collection + related (same team) + retailers. `retailersFor(p,{faire:true})` adds Faire wholesale (`faire.com/product/{faire_id}`); catalog cards stay Amazon-only.
  - site: `lib/pim.ts#getProduct`, `lib/html.ts` (sanitizer + htmlToText), `lib/slug.ts`, `components/{product-view,product-gallery,category-view}.tsx`. Route `/products/[category]` renamed to unified **`/products/[slug]`** that resolves category-first then product (Next forbids sibling dynamic segments). ProductCard now links image+title to `/products/{slug}` (retailer buttons kept OUTSIDE the link). Product JSON-LD included. generateStaticParams pre-renders categories; ~2000 products are ISR on-demand.
- **Legacy redirects — now COMPLETE, all in `src/middleware.ts`** (config can't: case-insensitive match shadows new lowercase pages):
  - `/Products/{Name}.html` → `/products/{slug}` (deterministic, no map).
  - `/Products/{Category}/` → real `/products/{slug}` when it exists, else curated fallback (`src/lib/legacy-product-categories.json`, 85 discontinued/merged cats → /products or /team-gear etc).
  - `/Licenses/{Team}/` → `/licenses/{slug}`; `/Licenses/{Team}/{item}.html` → team page.
  - **Fixed a pre-existing bug:** all 173 trailing-slash config redirects (e.g. `/Shop/`) were silently 404ing (Next strips the trailing slash before matching; sources still had them). `redirects.ts` now filters `/Products|/Licenses` out (middleware owns them) and strips trailing slashes from the remaining ~12 corp redirects. Verified every class resolves to 200.
- Per-product `/Licenses/*.html` currently → team page (not the exact item). Could add a SKU→slug map later for exact per-product license redirects; the canonical `/Products/*.html` already preserves per-product equity.

## Decisions (LOCKED 2026-07-24)
- **Visibility flag:** REUSE `products.display_in_web_site` as the public-catalog gate (no new column). All public API/catalog queries filter `is_active AND display_in_web_site`.
- **League/team URLs:** DEDICATED indexable pages — `/licenses/[team]` (e.g. `/licenses/dallas-cowboys`) and league pages; reuse the list component. Regenerate old `/Licenses/{Team}/` 301s to these.
- **Indexing:** INDEX `/products/all`, each `/products/[category]`, each league + team page; put in sitemap. `noindex,follow` + `rel=canonical`→base for sort/page/secondary-filter combos.
- **Pagination:** SSR `?page=` URLs (crawlable) + a "Load more" button enhancement; show result count.
