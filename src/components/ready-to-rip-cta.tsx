import Image from "next/image";
import Link from "next/link";

// Pre-footer "Ready to Rip?" call-to-action that funnels to the full catalog.
// Rendered above the footer on every non-catalog page (see PreFooterCTA).
export function ReadyToRipCTA() {
  return (
    <section className="relative overflow-hidden border-t border-ink-line">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/headers/header-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-ink/80" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 text-center sm:px-6 md:flex-row md:justify-between md:text-left lg:px-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <Image
            src="/brand/pa-mascot.png"
            alt=""
            width={843}
            height={954}
            className="h-20 w-auto drop-shadow-lg"
          />
          <div>
            <h2 className="font-heading text-3xl uppercase text-white">Ready to Rip?</h2>
            <p className="mt-1 text-white/70">
              Explore the full catalog and bring the energy home.
            </p>
          </div>
        </div>
        <Link
          href="/products/all"
          className="label-athletic inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-sm text-white shadow-xl shadow-brand-red/30 transition-colors hover:bg-brand-red-dark"
        >
          View All Products
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
