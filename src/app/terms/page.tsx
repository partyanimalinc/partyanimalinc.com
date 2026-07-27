import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions of use for the Party Animal, Inc. website.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms & Conditions" eyebrow="Legal" />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="mb-8 text-sm text-white/40">Last updated: July 26, 2026</p>

        <div className="legal-prose">
          <p>
            Welcome to Party Animal, Inc. Please review the following terms of use for
            your protection.
          </p>

          <h2>Terms</h2>
          <p>
            By accessing this website, you are agreeing to be bound by these website
            Terms and Conditions of use, all applicable laws and regulations and agree
            that you are responsible for compliance with all local laws. If you do not
            agree with any of these terms, you are prohibited from using or accessing
            this site. The materials contained in this website are protected by
            applicable copyright and trademark laws and all items listed on this site
            are fully licensed by the appropriate league or organization.
          </p>

          <h2>Use License</h2>
          <p>
            Users of this website shall be of lawful age to enter into contracts and
            place orders. You may not use the materials on this site for commercial use
            and may not modify or copy the materials or use them in any public display.
            Any attempt to decompile or reverse engineer any software contained on this
            website will result in legal action.
          </p>

          <h2>Online Marketplaces</h2>
          <p>
            Consumers are prohibited from purchasing products from Party Animal, Inc. or
            any authorized retailer or distributor and reselling them on any online
            marketplace, including but not limited to Amazon, eBay, and Walmart.com.
          </p>

          <h2>Disclaimer</h2>
          <p>
            The products on the website are provided &ldquo;as is&rdquo; from the
            manufacturer and as such, Party Animal, Inc. makes no warranties, whether
            express or implied, including without limitation, implied warranties or
            conditions of merchantability, fitness for a particular purpose, or
            non-infringement of intellectual property or other violation of rights. By
            your use of this site, you acknowledge that you are using the site at your
            own risk and that the information you provide to us is accurate and truthful.
          </p>

          <h2>Information (Privacy Policy)</h2>
          <p>
            The information collected by this website when you register is not shared or
            sold in any way. The information may be used for future communication
            regarding products and promotions by this company and its affiliates and for
            communication regarding order status. The credit card information that is
            entered must be keyed in for each order and will not be stored for future
            use. The credit card information is being gathered by a third party company
            that specializes in secure online transactions.
          </p>

          <h2>Fraudulent Activity</h2>
          <p>
            If we suspect you or your account of suspicious or fraudulent activity, we
            reserve the right to ban you from our site and in the case of excessive
            problems, we can and will ban your IP address and possibly report you to the
            proper authorities.
          </p>

          <h2>Sweepstakes &amp; Contests</h2>
          <p>
            For complete rules and terms of conditions, we have moved all sweepstakes and
            contest information to{" "}
            <a href="https://partyanimaltoys.com" target="_blank" rel="noopener noreferrer">
              partyanimaltoys.com
            </a>
            . Please visit that address for more details.
          </p>
        </div>
      </section>
    </>
  );
}
