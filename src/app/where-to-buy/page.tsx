import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Where to Buy" };

// Retailer tiles, in display order. NOTE: hrefs are placeholders pointing at each
// store's homepage — swap them for the exact Party Animal landing/search URL per
// retailer when available. Fanatics + Rally House use wordmark placeholders until
// brand logos are supplied.
const RETAILERS: { name: string; logo: string; href: string }[] = [
  { name: "Dick's Sporting Goods", logo: "/retailers/dicks.svg", href: "https://www.dickssportinggoods.com" },
  { name: "Fanatics", logo: "/retailers/fanatics.png", href: "https://www.fanatics.com" },
  { name: "Amazon.com", logo: "/retailers/amazon.png", href: "https://www.amazon.com/stores/PartyAnimalInc/page/6A6BA724-BD28-4888-868B-B57287C3DFCB" },
  { name: "Target", logo: "/retailers/target.svg", href: "https://www.target.com" },
  { name: "Walgreens", logo: "/retailers/walgreens.png", href: "https://www.walgreens.com" },
  { name: "Walmart", logo: "/retailers/walmart.jpg", href: "https://www.walmart.com" },
  { name: "Rally House", logo: "/retailers/rally-house.png", href: "https://www.rallyhouse.com" },
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
                href={r.href}
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
