@AGENTS.md

# partyanimalinc.com — working notes

Party Animal's public corporate and catalog site. Reads product data from
AppHub's PIM API — **the PIM is the source of truth; this site does not own
product data.** `~/.claude/CLAUDE.md` has the map of how this relates to AppHub.

Stack: Next.js 16 (App Router, `src/`, `proxy.ts` not middleware) · Tailwind v4
(`@theme` tokens in `globals.css`) · Resend · Umami · Vercel. No Supabase of
its own.

## Domain map

| Domain | Code | Agent | Notebook |
|---|---|---|---|
| Design & brand — tokens, fonts, layout, components | `src/app/globals.css` `src/app/layout.tsx` `src/components/` | `design` | `docs/domains/design.md` |
| Catalog — PIM consumption, URLs, facets, redirects, SEO | `src/lib/pim.ts` `catalog-url.ts` `license-url.ts` `slug.ts` `redirects.ts` `src/app/products/` `src/app/licenses/` | `catalog` | `docs/domains/catalog.md` |
| Revalidation — AppHub pings `/api/revalidate` on product edits | `src/app/api/revalidate/` | `catalog` | `docs/domains/catalog.md` |
| Forms — contact, newsletter | `src/app/api/contact/` `api/subscribe/` `src/components/contact-form.tsx` | `design` | — |

Plans: `SITEMAP.md` (IA + build status), `PRODUCT-CATALOG-PLAN.md` (URL/SEO
strategy and open PIM decisions).

## Routing
- Anything visual → **`design`**. Brand tokens are in `globals.css` `@theme`;
  read `docs/domains/design.md` for the font situation.
- Product data, URLs, redirects, facet pages → **`catalog`**. If the fix
  belongs in the PIM (a missing field, a bad slug), say so and stop — it gets
  fixed in AppHub, not patched here.
- A PIM field this site needs but AppHub does not expose → note it for
  AppHub's `pim` agent; do not invent it here.

## Scratch files
`scripts/_<name>.<ext>` — underscore prefix is gitignored.

## Shipping
`/ship` runs lint + build, commits, pushes `main`. Vercel deploys.
