import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ObfuscatedEmail } from "@/components/obfuscated-email";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "Party Animal, LLC is committed to making its website accessible to everyone, including people with disabilities.",
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader title="Accessibility Statement" eyebrow="Legal" />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="mb-8 text-sm text-white/40">Last updated: September 11, 2026</p>

        <div className="legal-prose">
          <p>
            Party Animal, LLC is committed to making our website accessible to
            everyone, including people with disabilities. We want every visitor to
            be able to explore our products, learn about our brands, and reach us,
            regardless of how they access the web.
          </p>

          <h2>Our Commitment</h2>
          <p>
            We strive to conform to the Web Content Accessibility Guidelines (WCAG)
            2.1, Level AA, published by the World Wide Web Consortium (W3C). These
            guidelines explain how to make web content more accessible for people
            with a wide range of disabilities, including visual, auditory, physical,
            speech, cognitive, and neurological disabilities. Accessibility is an
            ongoing effort, and we continue to improve the experience for all of our
            visitors.
          </p>

          <h2>Measures We Take</h2>
          <p>
            To support accessibility, we work to provide text alternatives for
            meaningful images, maintain sufficient color contrast, support keyboard
            navigation, use clear and consistent page structure, and label
            interactive elements so they can be understood by assistive technologies
            such as screen readers.
          </p>

          <h2>Third-Party Content</h2>
          <p>
            Some content or functionality on our site may be provided by third
            parties, such as embedded video, social media, or retailer links. We do
            not control these third-party services and cannot guarantee their
            accessibility, but we are glad to help you access any information you
            need from them.
          </p>

          <h2>Ongoing Improvements</h2>
          <p>
            We regularly review our website and content to identify and resolve
            accessibility issues. As technology and standards evolve, we update our
            practices to keep improving the experience.
          </p>

          <h2>Feedback and Contact</h2>
          <p>
            We welcome your feedback on the accessibility of our website. If you
            encounter a barrier, or if you need assistance with any part of our site
            or a specific piece of information, please contact us and we will do our
            best to help and to make the information available to you.
          </p>
          <p>
            By e-mail: <ObfuscatedEmail user="info" domain="partyanimalinc.com" />
          </p>
          <p>
            Please include a description of the issue, the web address (URL) where
            you experienced it, and the assistive technology or browser you were
            using, so we can respond as quickly and helpfully as possible.
          </p>
        </div>
      </section>
    </>
  );
}
