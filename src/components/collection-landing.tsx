import type { ReactNode } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { EXTERNAL } from "@/lib/site";

// Shared template for a brand/collection landing page. When `heroSrc` is
// provided (e.g. the designed TeenyMates hero), it renders full-bleed;
// otherwise it falls back to the grunge PageHeader + collection banner.
export function CollectionLanding({
  name,
  tagline,
  description,
  heroSrc,
  heroWidth = 3344,
  heroHeight = 1882,
  bannerSrc,
  listing,
}: {
  name: string;
  tagline: string;
  description: string;
  heroSrc?: string;
  heroWidth?: number;
  heroHeight?: number;
  bannerSrc?: string;
  // Real product listing (rendered in place of the placeholder when present).
  listing?: ReactNode;
}) {
  return (
    <>
      {heroSrc ? (
        <section className="relative bg-ink">
          <Image
            src={heroSrc}
            alt={`${name}: ${tagline}`}
            width={heroWidth}
            height={heroHeight}
            priority
            className="h-auto w-full"
          />
        </section>
      ) : (
        <PageHeader title={name} subtitle={tagline} eyebrow="Collection" />
      )}

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        {!heroSrc && bannerSrc && (
          <Image
            src={bannerSrc}
            alt={`${name} collection`}
            width={1448}
            height={280}
            className="mb-10 h-auto w-full rounded-2xl ring-1 ring-white/10"
          />
        )}

        <p className="mb-12 max-w-2xl text-xl leading-relaxed text-white/80">
          {description}
        </p>

        {listing ?? (
          // Fallback placeholder when no live listing is wired for this collection.
          <div className="rounded-2xl border border-ink-line bg-ink-soft p-8">
            <h2 className="font-heading text-2xl uppercase text-white">
              The {name} Lineup
            </h2>
            <p className="mt-3 max-w-2xl text-white/70">
              Products load here from the Party Animal catalog. To buy direct,
              visit our toys store.
            </p>
            <div className="mt-6">
              <a
                href={EXTERNAL.toysStore}
                target="_blank"
                rel="noopener noreferrer"
                className="label-athletic inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2 text-sm text-white transition-colors hover:bg-brand-red-dark"
              >
                Shop at PartyAnimalToys.com
              </a>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
