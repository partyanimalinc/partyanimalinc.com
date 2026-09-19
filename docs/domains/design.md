# Design & brand — notebook

Read before any visual change. Append to **Learned** when something costs effort.

## Theme system
- Tailwind **v4**, tokens in `@theme` (`src/app/globals.css`), sourced from
  the Figma "Corp-site" file.
- Colors: `brand-red #d90f1d`, `brand-red-dark #b00b16`, `brand-gold #fdb902`,
  `ink #0a0a0a`, `ink-soft #141414`, `ink-line #262626`.
- Fonts via `next/font` in `layout.tsx`: `--font-heading` (Archivo — stand-in
  for licensed **Kommon Grotesk Bold Italic** until the .woff2 is added),
  `--font-body` (Montserrat), `--font-brush` (Pinkblue).
- Dark by default: `color-scheme: dark`, ink background.
- `overflow-x: hidden` on html and body — watch for content that relies on
  horizontal overflow.

## Components (src/components/)
Site chrome: `site-header`, `site-footer`, `nav-search`, `page-header`,
`pre-footer-cta`, `social-icons`. Landings: `brand-landing`,
`collection-landing`, `collection-products`, `featured-collections`,
`fan-favorites`, `collect-by-league`, `licenses-marquee`, `team-finder`.
Catalog: `catalog/`, `product-card`, `product-gallery`, `product-view`,
`category-view`. Campaign: `advent/`, `chase-figures`, `enter-to-win-button`,
`ready-to-rip-cta`, `squeezy-*`.

## Learned (newest first)
- 2026-09-19 — seeded from `globals.css` and the components directory.
