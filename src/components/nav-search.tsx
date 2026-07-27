"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchProduct } from "@/lib/pim";

const SEE_ALL = (q: string) => `/products/all?q=${encodeURIComponent(q)}`;

// Universal nav search: a command-palette-style overlay (same UX on desktop and
// mobile) with debounced product typeahead by SKU or name. Borrows the apphub
// universal-search behavior (debounce, exact-then-fuzzy fallback, arrow/enter
// keyboard nav, ⌘K to open) against the site's public /api/search proxy.
export function NavSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [fuzzy, setFuzzy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestTermRef = useRef("");

  const close = useCallback(() => {
    setOpen(false);
    setActive(-1);
  }, []);

  const run = useCallback(async (term: string) => {
    const t = term.trim();
    if (!t) {
      setResults([]);
      setFuzzy(false);
      setLoading(false);
      return;
    }
    latestTermRef.current = t;
    setLoading(true);
    try {
      const r = await fetch(`/api/search?q=${encodeURIComponent(t)}`);
      const data = (await r.json()) as { products: SearchProduct[]; fuzzy: boolean };
      if (latestTermRef.current !== t) return; // a newer keystroke won
      setResults(data.products || []);
      setFuzzy(Boolean(data.fuzzy));
      setActive(-1);
    } catch {
      if (latestTermRef.current === t) {
        setResults([]);
        setFuzzy(false);
      }
    } finally {
      if (latestTermRef.current === t) setLoading(false);
    }
  }, []);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setQuery(v);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!v.trim()) {
        setResults([]);
        setFuzzy(false);
        setLoading(false);
        return;
      }
      setLoading(true);
      debounceRef.current = setTimeout(() => run(v), 250);
    },
    [run],
  );

  const goProduct = useCallback(
    (p: SearchProduct) => {
      close();
      setQuery("");
      setResults([]);
      router.push(p.slug ? `/products/${p.slug}` : SEE_ALL(query));
    },
    [close, query, router],
  );

  const goSeeAll = useCallback(() => {
    const t = query.trim();
    if (!t) return;
    close();
    setQuery("");
    setResults([]);
    router.push(SEE_ALL(t));
  }, [close, query, router]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => (i < results.length - 1 ? i + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => (i > 0 ? i - 1 : results.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (active >= 0 && results[active]) goProduct(results[active]);
        else goSeeAll();
      } else if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    },
    [active, results, goProduct, goSeeAll, close],
  );

  // ⌘K / Ctrl+K to open, and focus the input once the overlay mounts.
  useEffect(() => {
    function onGlobalKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", onGlobalKey);
    return () => document.removeEventListener("keydown", onGlobalKey);
  }, []);

  // Focus input + lock body scroll while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const hasQuery = query.trim().length > 0;

  return (
    <>
      {/* Desktop trigger: looks like a search field, opens the overlay */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search products"
        className="hidden items-center gap-2 rounded-full border border-ink-line bg-white/5 py-2 pl-3 pr-2.5 text-sm text-white/55 transition-colors hover:border-white/30 hover:text-white/80 lg:flex xl:w-56"
      >
        <SearchIcon className="h-4 w-4 shrink-0" />
        <span className="hidden xl:inline">Search products</span>
        <kbd className="ml-auto hidden items-center gap-0.5 rounded border border-ink-line bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/50 xl:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Mobile trigger: icon only, sits next to the hamburger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-ink-line text-white lg:hidden"
      >
        <SearchIcon className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
          onMouseDown={close}
          className="fixed inset-0 z-[100] flex justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"
        >
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="h-fit w-full max-w-xl overflow-hidden rounded-2xl border border-ink-line bg-ink-soft shadow-2xl"
          >
            {/* Input row */}
            <div className="flex items-center gap-3 border-b border-ink-line px-4">
              <SearchIcon className="h-5 w-5 shrink-0 text-white/40" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder="Search by product name or SKU"
                className="w-full bg-transparent py-4 text-base text-white placeholder:text-white/35 focus:outline-none"
              />
              {loading ? (
                <Spinner />
              ) : (
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); close(); }}
                  aria-label="Close search"
                  className="rounded border border-ink-line px-1.5 py-0.5 text-[11px] text-white/45 hover:text-white/70"
                >
                  Esc
                </button>
              )}
            </div>

            {/* Results */}
            {hasQuery && (
              <div className="max-h-[60vh] overflow-y-auto py-2">
                {fuzzy && results.length > 0 && (
                  <p className="px-4 pb-1 pt-1 text-[11px] text-white/40">
                    No exact matches, showing closest
                  </p>
                )}

                {results.map((p, i) => (
                  <button
                    key={p.sku}
                    onMouseDown={(e) => { e.preventDefault(); goProduct(p); }}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      i === active ? "bg-brand-red/15" : "hover:bg-white/5"
                    }`}
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-white">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt="" className="h-full w-full object-contain p-1" />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src="/brand/pa-monkey-mark.png" alt="" aria-hidden className="h-7 w-7 opacity-[0.12]" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-white">{p.name}</span>
                      <span className="block truncate text-xs text-white/45">{p.sku}</span>
                    </span>
                    {p.series != null && (
                      <span className="label-athletic shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70">
                        Series {p.series}
                      </span>
                    )}
                  </button>
                ))}

                {!loading && results.length === 0 && (
                  <p className="px-4 py-6 text-center text-sm text-white/45">
                    No products match “{query.trim()}”.
                  </p>
                )}

                {/* See-all footer */}
                <button
                  onMouseDown={(e) => { e.preventDefault(); goSeeAll(); }}
                  className={`mt-1 flex w-full items-center gap-2 border-t border-ink-line px-4 py-3 text-left text-sm transition-colors ${
                    active === -1 ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  <SearchIcon className="h-4 w-4 shrink-0 text-white/40" />
                  See all results for “{query.trim()}”
                  <span aria-hidden className="ml-auto text-white/30">↵</span>
                </button>
              </div>
            )}

            {!hasQuery && (
              <p className="px-4 py-6 text-sm text-white/40">
                Search the full catalog by product name or SKU.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 shrink-0 animate-spin text-white/50" fill="none" viewBox="0 0 24 24" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
