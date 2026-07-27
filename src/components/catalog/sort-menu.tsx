"use client";

import { useRouter } from "next/navigation";

// Generic sort dropdown. The server precomputes each option's target href
// (via catalogHref / licenseHref), so this stays agnostic to the page it's on.
export function SortMenu({
  value,
  options,
}: {
  value: string;
  options: { value: string; label: string; href: string }[];
}) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-sm text-white/60">
      <span className="hidden sm:inline">Sort</span>
      <select
        value={value}
        onChange={(e) => {
          const o = options.find((x) => x.value === e.target.value);
          if (o) router.push(o.href, { scroll: false });
        }}
        className="rounded-lg border border-ink-line bg-ink-soft px-3 py-2 text-sm font-medium text-white outline-none focus:border-brand-red"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
