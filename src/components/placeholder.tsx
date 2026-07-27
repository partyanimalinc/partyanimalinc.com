import Link from "next/link";

// Lightweight placeholder body for routes whose full content is not built yet.
export function Placeholder({
  children,
  cta,
}: {
  children: React.ReactNode;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="prose-invert space-y-4 text-lg leading-relaxed text-white/80">
        {children}
      </div>
      <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-4 py-2 text-sm text-brand-gold">
        <span aria-hidden>★</span> Full page coming soon
      </p>
      {cta && (
        <div className="mt-8">
          <Link
            href={cta.href}
            className="label-athletic inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm text-white transition-colors hover:bg-brand-red-dark"
          >
            {cta.label}
          </Link>
        </div>
      )}
    </section>
  );
}
