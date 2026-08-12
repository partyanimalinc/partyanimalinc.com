import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { amazonAttributed } from "@/lib/amazon";

export const metadata: Metadata = { title: "Where to Buy" };

// Retailer tiles, in display order. Retailers with a Party Animal brand/search
// page link straight to it; Target + Rally House point at the homepage until a
// specific landing URL is available.
const RETAILERS: { name: string; logo: string; href: string }[] = [
  { name: "Dick's Sporting Goods", logo: "/retailers/dicks.svg", href: "https://www.dickssportinggoods.com/f/fan-shop-sale?filterFacets=X_BRAND%253AParty%2520Animal" },
  { name: "Amazon.com", logo: "/retailers/amazon.png", href: "https://www.amazon.com/stores/PartyAnimalInc/page/6A6BA724-BD28-4888-868B-B57287C3DFCB" },
  { name: "Target", logo: "/retailers/target.svg", href: "https://www.target.com" },
  { name: "Walgreens", logo: "/retailers/walgreens.png", href: "https://www.walgreens.com/store/c/productlist/N=20001330-9000149767" },
  { name: "Walmart", logo: "/retailers/walmart.png", href: "https://www.walmart.com/c/brand/party-animal" },
  { name: "Rally House", logo: "/retailers/rally-house.svg", href: "https://www.rallyhouse.com" },
];

export default function WhereToBuyPage() {
  return (
    <>
      <PageHeader
        title="Where to Buy"
        eyebrow="Available in Stores"
        subtitle="Find Party Animal products at these retailers, in stores and online."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-white/75">
          Party Animal products are sold at major retailers across the country.
          Pick your store to start shopping.
        </p>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {RETAILERS.map((r) => (
            <li key={r.name}>
              <a
                href={amazonAttributed(r.href)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Shop Party Animal at ${r.name}`}
                className="group flex h-32 items-center justify-center rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-red/30 hover:shadow-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.logo}
                  alt={r.name}
                  className="max-h-16 w-auto max-w-[82%] object-contain transition-transform duration-200 group-hover:scale-105"
                />
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-white/50">
          More retailers are coming soon. Check back as we add new places to find
          Party Animal.
        </p>
      </section>
    </>
  );
}
