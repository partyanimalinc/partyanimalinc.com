import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ObfuscatedEmail } from "@/components/obfuscated-email";

export const metadata: Metadata = {
  title: "Become a Reseller",
  description:
    "Carry Party Animal products in your store. Order wholesale on Faire or contact our sales team to get set up as a vendor.",
};

export default function BecomeAResellerPage() {
  return (
    <>
      <PageHeader
        title="Become a Reseller"
        eyebrow="Wholesale & Retail Partners"
        subtitle="Bring officially licensed fan gear and collectibles to your shelves."
      />

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="legal-prose">
          <p>
            Thank you for your interest in Party Animal, Inc. and our products! If you are
            interested in ordering our products for your retail or distribution outlet,
            and have valid vendor resale credentials for the U.S. or Canada, we would love
            to set you up as our customer.
          </p>
          <p>
            The fastest way to get started is to order wholesale through our Faire
            storefront. You can also reach our sales team directly and we will help get
            you set up as a vendor. Please have your applicable federal and state tax I.D.
            information available. We look forward to becoming your business partner!
          </p>
        </div>

        {/* Primary path: Faire wholesale */}
        <div className="mt-10 rounded-2xl border border-ink-line bg-ink-soft p-6 sm:p-8">
          <h2 className="font-heading text-2xl uppercase text-white">Order Wholesale on Faire</h2>
          <p className="mt-2 text-white/70">
            Browse the full line and order at wholesale pricing through our official Faire
            storefront.
          </p>
          <a
            href="https://partyanimalinc.faire.com"
            target="_blank"
            rel="noopener noreferrer"
            className="label-athletic mt-5 inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-sm text-white shadow-lg shadow-brand-red/25 transition-colors hover:bg-brand-red-dark"
          >
            Shop on Faire
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Talk to sales */}
        <div className="mt-6 rounded-2xl border border-ink-line bg-ink-soft p-6 sm:p-8">
          <h2 className="font-heading text-2xl uppercase text-white">Talk to Our Sales Team</h2>
          <p className="mt-2 text-white/70">
            Prefer to set things up directly? Reach out and we will get you started.
          </p>
          <ul className="mt-4 space-y-2 text-white/80">
            <li>
              <span className="text-white/50">Email</span>{" "}
              <ObfuscatedEmail user="sales" domain="partyanimalinc.com" className="text-brand-red underline-offset-2 hover:text-white hover:underline" />
            </li>
            <li>
              <span className="text-white/50">Phone</span>{" "}
              <a href="tel:+18004560145" className="hover:text-white">1.800.456.0145</a>
            </li>
          </ul>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-white/50">
          Please note we cannot accept third-party ecommerce marketplace (online only)
          resellers as wholesale customers. Do you have a brick-and-mortar store? We would
          love to hear from you.
        </p>
      </section>
    </>
  );
}
