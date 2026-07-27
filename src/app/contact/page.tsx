import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { ObfuscatedEmail } from "@/components/obfuscated-email";

export const metadata: Metadata = { title: "Contact Us" };

function InfoHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="label-athletic mb-3 text-xs tracking-wider text-brand-red">{children}</h2>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        eyebrow="Get in Touch"
        subtitle="Questions, partnerships, or press? We&rsquo;d love to hear from you."
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <ContactForm />

        <div className="mt-14 grid gap-10 border-t border-ink-line pt-12 sm:grid-cols-3">
          <div>
            <InfoHeading>Address</InfoHeading>
            <address className="not-italic leading-relaxed text-white/75">
              Party Animal, Inc.
              <br />
              909 Crocker Rd.
              <br />
              Westlake, OH 44145
            </address>
          </div>

          <div>
            <InfoHeading>Phone</InfoHeading>
            <ul className="space-y-1.5 text-white/75">
              <li>
                <a href="tel:+14404711030" className="hover:text-white">
                  1.440.471.1030
                </a>
              </li>
              <li>
                <span className="text-white/50">Toll Free</span>{" "}
                <a href="tel:+18004560145" className="hover:text-white">
                  1.800.456.0145
                </a>
              </li>
              <li>
                <span className="text-white/50">Fax</span> 1.440.617.9476
              </li>
            </ul>
          </div>

          <div>
            <InfoHeading>Email</InfoHeading>
            <ul className="space-y-3 text-white/75">
              <li>
                <span className="block text-xs text-white/50">General Inquiries</span>
                <ObfuscatedEmail user="info" domain="partyanimalinc.com" className="hover:text-white" />
              </li>
              <li>
                <span className="block text-xs text-white/50">Reseller Sales</span>
                <ObfuscatedEmail user="sales" domain="partyanimalinc.com" className="hover:text-white" />
              </li>
              <li>
                <span className="block text-xs text-white/50">Accounting &amp; Billing</span>
                <ObfuscatedEmail user="accounting" domain="partyanimalinc.com" className="hover:text-white" />
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
