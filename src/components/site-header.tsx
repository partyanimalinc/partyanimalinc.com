"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV } from "@/lib/site";
import { EnterToWinButton } from "@/components/enter-to-win-button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur supports-[backdrop-filter]:bg-ink/70 border-b border-ink-line">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        {/* Logo — horizontal on mobile (keeps the bar short), stacked on desktop */}
        <Link href="/" className="shrink-0" aria-label="Party Animal home">
          <Image
            src="/brand/pa-logo-horizontal.png"
            alt="Party Animal"
            width={3095}
            height={666}
            priority
            className="h-8 w-auto lg:hidden"
          />
          <Image
            src="/brand/pa-logo.png"
            alt="Party Animal"
            width={636}
            height={384}
            priority
            className="hidden h-14 w-auto lg:block"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                href={item.href}
                className="label-athletic flex items-center gap-1 py-2 text-[15px] text-white/90 transition-colors hover:text-white"
              >
                {item.label}
                {item.children && (
                  <svg
                    className="mt-0.5 h-2.5 w-2.5 text-white/60"
                    viewBox="0 0 12 8"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M1 1l5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full min-w-52 -translate-y-1 rounded-xl border border-ink-line bg-ink-soft p-2 opacity-0 shadow-2xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.children.map((c) => (
                    <Link
                      key={c.label}
                      href={c.href}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <span className="hidden lg:block">
            <EnterToWinButton />
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-ink-line text-white lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-ink-line bg-ink lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {NAV.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="label-athletic block py-2 text-lg text-white"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="mb-2 ml-3 border-l border-ink-line pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="block py-1.5 text-sm font-medium text-white/70"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <EnterToWinButton
              fullWidth
              className="mt-4"
              onClick={() => setOpen(false)}
            />
          </div>
        </nav>
      )}
    </header>
  );
}
