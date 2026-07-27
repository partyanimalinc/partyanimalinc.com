import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Placeholder } from "@/components/placeholder";
import { EXTERNAL } from "@/lib/site";

export const metadata: Metadata = { title: "Where to Buy" };

export default function WhereToBuyPage() {
  return (
    <>
      <PageHeader
        title="Where to Buy"
        eyebrow="Available in Stores"
        subtitle="Find Party Animal products at retailers near you and online."
      />
      <Placeholder
        cta={{ label: "Shop at PartyAnimalToys.com", href: EXTERNAL.toysStore }}
      >
        <p>
          Party Animal products are sold at major retailers including Amazon,
          Target, Dick&rsquo;s Sporting Goods, Walmart and more.
        </p>
        <p>
          A shoppable retailer directory &mdash; with a live &ldquo;Available
          at&rdquo; link on every product &mdash; is on the way.
        </p>
      </Placeholder>
    </>
  );
}
