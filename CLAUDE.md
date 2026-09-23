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

## Scripts — three tiers

The test is "does this ship?", not "is this useful?".

| What | Where | Git |
|---|---|---|
| Imported by the app / runs on Vercel | `lib/` `app/` | tracked |
| **Recurring local tooling** — run by hand, every time we need it | `scripts/local/` | ignored, kept |
| One-off: audits, backfills, investigations, generated bundles | `scripts/_<name>` | ignored, disposable |

`scripts/local/` is **its own git repo** — ignored here so it never reaches this
repo, but versioned and backed up on its own remote. Its contents must stay
inside the working tree: they need `node_modules`, the `@/` alias and
`--env-file=.env.local`. Ignored is not the same as homeless.

Planning and working docs live in `~/Documents/planning/<project>/`, in no repo.

**Stage by explicit path — never `git add -A` or `git add -u`.** These repos
regularly carry in-progress work; a blanket add ships it under an unrelated
commit message.


## Shipping
`/ship` runs lint + build, commits, pushes `main`. Vercel deploys.
