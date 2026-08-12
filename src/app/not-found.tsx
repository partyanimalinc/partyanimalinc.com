import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop All Products", href: "/products/all" },
  { label: "Where to Buy", href: "/where-to-buy" },
];

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/pa-monkey-mark.png"
        alt=""
        aria-hidden
        className="mb-8 w-28 opacity-20"
      />
      <p className="label-athletic mb-3 text-sm tracking-wider text-brand-red">
        Error 404
      </p>
      <h1 className="font-heading text-4xl uppercase leading-tight text-white sm:text-5xl">
        This one got away
      </h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-white/70">
        We could not find that page. It may have moved, or the link might be off.
        Try one of these instead.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {LINKS.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            className={`label-athletic rounded-full px-6 py-3 text-sm transition-colors ${
              i === 0
                ? "bg-brand-red text-white hover:bg-brand-red-dark"
                : "border border-ink-line text-white/80 hover:border-white/40 hover:text-white"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
