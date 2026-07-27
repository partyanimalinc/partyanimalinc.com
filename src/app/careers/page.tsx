import type { Metadata } from "next";
import Link from "next/link";
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
          <span aria-hidden>★</span> No open listings right now
        </p>

        <div className="mt-8 space-y-4 text-lg leading-relaxed text-white/80">
          <p>
            We do not have any positions posted at the moment, but that can
            change fast. When roles open up, you will find them right here.
          </p>
          <p>
            Think you belong on the Party Animal team anyway? We are always glad
            to hear from talented, sports-loving people. Send us a direct inquiry
            and tell us what you bring to the lineup.
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/contact"
            className="label-athletic inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm text-white transition-colors hover:bg-brand-red-dark"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
