import { slugify } from "@/lib/slug";

export type LegacySnapshots = {
  /** Retired product slug -> current slug. */
  redirects: Record<string, string>;
  /** Every web-visible product slug. */
  live: ReadonlySet<string>;
  /** Team landing slugs, longest first so "new-york-giants" beats "new-york". */
  teams: readonly string[];
  /** League landing slugs, longest first. */
  leagues: readonly string[];
};

// NetSuite appended `_2`, `_3` … to the URL of an item copied from another, and
// slugify turns that into `-2`. Years (`-2024`) are part of real names, so only
// small counters are stripped.
const DEDUPE_COUNTER = /-(?:[2-9]|1\d)$/;

function product(slug: string, s: LegacySnapshots): string | null {
  const moved = s.redirects[slug];
  if (moved) return `/products/${moved}`;
  return s.live.has(slug) ? `/products/${slug}` : null;
}

function landing(slug: string, prefixes: readonly string[]): string | null {
  const hit = prefixes.find((p) => slug === p || slug.startsWith(`${p}-`));
  return hit ? `/licenses/${hit}` : null;
}

/**
 * Where a legacy /Products/…/{Name}.html page lives now: the product itself
 * (directly, even when its slug was later rebuilt), the same product without
 * NetSuite's copy counter, else the team or league it was for. Null when none of
 * those exist, so the caller keeps the slugified guess.
 */
export function legacyProductTarget(fileName: string, s: LegacySnapshots): string | null {
  const slug = slugify(fileName);
  if (!slug) return null;
  const stripped = slug.replace(DEDUPE_COUNTER, "");
  return (
    product(slug, s) ??
    (stripped !== slug ? product(stripped, s) : null) ??
    landing(slug, s.teams) ??
    landing(slug, s.leagues)
  );
}
