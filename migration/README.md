# Legacy URL migration (old NetSuite store → new site)

Everything here preserves SEO / avoids 404s when `partyanimalinc.com` cuts over
from the NetSuite SuiteCommerce store to this Next.js site.

## How it was built

The old store has **no usable sitemap** (`/sitemap.xml` is a soft-404) and no
`<link rel=canonical>` tags. So the inventory came from a **full crawl** of the
live site (~10.5k URLs in ~8 min; `robots.txt` allows all). Every product page
embeds `itemid=<NetSuite internal id>`, which joins to `products.internal_id` in
the apphub PIM — making the crawl self-validating. Products hidden behind
paginated/JS grids were recovered via `/s.nl/it.A/id.<internal_id>/.f`, which
resolves any item and 301s to its SEO URL.

Generator scripts live in **apphub** (`apphub/scripts/`):
`_crawl-site-urls.mjs` → `_gen-redirect-source.mjs`.

## Files

- **`old-url-redirects.csv`** — the complete source of truth: every live old URL
  (9,209) → `type`, `sku`, `internal_id`, `proposed_new_path`, `note`.
  Types: `product` (7,011), `category` (174), `license` (203), `corp` (11),
  `asset`/`system`/`netsuite_raw` (excluded from redirects).

## What's wired up now

`src/lib/redirects.ts` → `next.config.ts` `redirects()` emits **184 308-redirects**:
- Corp pages (`/about-us`→`/about`, `/faq.html`→`/faq`, …)
- Category pages → the closest existing landing (`/teenymates`, `/squeezymates`,
  `/jumbo-squeezy`, `/team-gear`, or `/products`) — **interim**, refine when real
  category pages exist.
- `/Licenses/*` → `/licenses` hub (per-team pages TBD).

## TODO — product-level redirects (the 7,011)

Not wired yet: their targets need the product routes + final URL scheme, which
don't exist. Because each old product URL is already resolved to a **SKU** in the
CSV, generating them later is a pure join — do it in **middleware** (not
`next.config`; too many rules for build perf) with a `SKU → /path` lookup once
product pages ship. Same for per-team `/licenses/{team}` pages.

Regenerate after a re-crawl: rerun the two apphub scripts, then
`cp apphub/scripts/{migration-redirect-source.csv,structural-redirects.json}`
here / to `src/lib/redirects.data.json`.
