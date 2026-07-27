import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ObfuscatedEmail } from "@/components/obfuscated-email";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Party Animal, Inc. collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" eyebrow="Legal" />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="mb-8 text-sm text-white/40">Last updated: July 26, 2026</p>

        <div className="legal-prose">
          <p>
            This privacy policy tells you how we use personal information collected at
            this site. Please read this privacy policy before using the site or
            submitting any personal information. By using the site, you are accepting the
            practices described in this privacy policy. These practices may be changed,
            but any changes will be posted and changes will only apply to activities and
            information on a going forward, not retroactive basis. You are encouraged to
            review the privacy policy whenever you visit the site to make sure that you
            understand how any personal information you provide will be used. Note: the
            privacy practices set forth in this privacy policy are for this web site
            only. If you link to other web sites, please review the privacy policies
            posted at those sites.
          </p>

          <h2>Collection of Information</h2>
          <p>
            We collect personally identifiable information such as names, postal
            addresses, email addresses, phone numbers, purchase information, and other
            information when voluntarily submitted by our visitors. This information is
            used to fulfill orders, respond to inquiries, improve our services, provide
            customer support, and, where permitted, provide marketing communications and
            promotional offers.
          </p>

          <h2>Cookie / Tracking Technology</h2>
          <p>
            The Site may use cookie and tracking technology depending on the features
            offered. Cookie and tracking technology are useful for gathering information
            such as browser type and operating system, tracking the number of visitors to
            the Site, and understanding how visitors use the Site. Cookies can also help
            customize the Site for visitors. If you previously provided personally
            identifiable information, cookies may be tied to such information. Aggregate
            cookie and tracking information may be shared with third parties for
            analytics, marketing, website operations, and business purposes.
          </p>

          <h2>Distribution of Information</h2>
          <p>
            We may share your information with third parties that perform services on our
            behalf, including payment processing, order fulfillment, shipping, marketing,
            analytics, customer service, website operations, fraud prevention, and
            business administration. We may also share information with governmental
            agencies or other companies assisting us in fraud prevention or
            investigation. We may do so when: (1) permitted or required by law; (2) trying
            to protect against or prevent actual or potential fraud or unauthorized
            transactions; or (3) investigating fraud which has already taken place.
          </p>

          <h2>Sharing with Brand and Licensing Partners</h2>
          <p>
            As a licensee of certain professional sports leagues, teams, and brands,
            including the National Football League (&ldquo;NFL&rdquo;) (See{" "}
            <a href="https://www.nfl.com/legal/privacy/" target="_blank" rel="noopener noreferrer">
              NFL Privacy &amp; Terms
            </a>
            ), we may share limited personal information, such as name, email address,
            mailing address, and purchase activity, with our brand and licensing partners
            for purposes including marketing, customer analytics, brand-related
            communications, reporting, and relationship management. We will only share
            such information where you have provided consent, where permitted by
            applicable law, or where the information has been aggregated or de-identified.
            You may opt out of certain communications or data uses by contacting us using
            the information below.
          </p>

          <h2>Your Privacy Rights</h2>
          <p>
            Depending on your location, you may have the right to request access to,
            correction of, or deletion of your personal information, or to opt out of
            certain data uses. To make such a request, please contact us at{" "}
            <ObfuscatedEmail user="info" domain="partyanimalinc.com" />.
          </p>

          <h2>Commitment to Data Security</h2>
          <p>
            Your personally identifiable information is kept secure. Only authorized
            employees, agents, service providers, and contractors who need access to
            perform their duties have access to this information. Emails and newsletters
            from this site allow you to opt out of further mailings.
          </p>

          <h2>Privacy Contact Information</h2>
          <p>
            If you have any questions, concerns, requests, or comments about our privacy
            policy, you may contact us using the information below:
          </p>
          <p>
            By e-mail: <ObfuscatedEmail user="info" domain="partyanimalinc.com" />
          </p>
          <p>
            We reserve the right to make changes to this policy. Any changes to this
            policy will be posted.
          </p>
        </div>
      </section>
    </>
  );
}
