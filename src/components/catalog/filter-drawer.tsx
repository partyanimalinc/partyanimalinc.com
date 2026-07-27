"use client";

import { useEffect, useState } from "react";

// Mobile filter drawer: a "Filters" button that opens a left slide-over holding
// the same filter groups the desktop sidebar shows (passed as children).
// Desktop (lg+) hides the button and shows the sidebar directly.
export function FilterDrawer({
  activeCount,
  children,
}: {
  activeCount: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="label-athletic inline-flex items-center gap-2 rounded-lg border border-ink-line bg-ink-soft px-4 py-2 text-sm text-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-red px-1 text-[11px] text-white">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 motion-safe:animate-[fadeIn_150ms_ease-out]"
          />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-ink shadow-2xl motion-safe:animate-[slideIn_200ms_ease-out]">
            <div className="flex items-center justify-between border-b border-ink-line px-5 py-4">
              <h2 className="font-heading text-lg uppercase text-white">Filters</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5" onClick={() => setOpen(false)}>
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
