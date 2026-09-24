import type { Metadata } from "next";
import Link from "@/components/link";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <>
      <PageHeader
        title="Careers"
        eyebrow="Join the Team"
        subtitle="Help us build the products that bring fans together."
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-4 py-2 text-sm text-brand-gold">
          <span aria-hidden>★</span> We are growing
        </p>

        <div className="mt-8 space-y-4 text-lg leading-relaxed text-white/80">
          <p>
            Party Animal is growing fast, and we post every open role to our
            LinkedIn Jobs feed. Head over to see the positions we are hiring for
            right now and to apply.
          </p>
          <p>
            Think you belong on the Party Animal team but do not see the right
            role listed yet? We are always glad to hear from talented,
            sports-loving people. Send us a direct inquiry and tell us what you
            bring to the lineup.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="https://www.linkedin.com/company/the-party-animal/jobs/"
            target="_blank"
            rel="noopener noreferrer"
            className="label-athletic inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm text-white transition-colors hover:bg-brand-red-dark"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
            </svg>
            View Jobs on LinkedIn
          </a>
          <Link
            href="/contact"
            className="label-athletic inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
