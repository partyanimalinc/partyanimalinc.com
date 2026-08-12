import Image from "next/image";
import Link from "next/link";

// Simple brand landing (SqueezyMates / Jumbo Squeezy / Team Gear): the designed
// hero + a short intro and a primary CTA into the brand catalog (/{base}/all).
// TeenyMates has its own richer landing. When an introImage is supplied it
// becomes a large left-hand visual beside the copy on desktop, and a centered
// image above the copy on mobile.
export function BrandLanding({
  name,
  base,
  heroSrc,
  heroWidth,
  heroHeight,
  description,
  introImage,
}: {
  name: string;
  base: string; // brand root, e.g. "/squeezymates"
  heroSrc: string;
  heroWidth: number;
  heroHeight: number;
  description: string;
  // Optional accent image. Mobile: centered above the copy. Desktop: a large
  // left column beside the copy + button.
  introImage?: { src: string; width: number; height: number; alt?: string };
}) {
  const cta = (
    <Link
      href={`${base}/all`}
      className="label-athletic inline-flex items-center gap-2 rounded-full bg-brand-red px-8 py-3.5 text-sm text-white transition-colors hover:bg-brand-red-dark"
    >
      Browse All {name}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );

  return (
    <>
      <section className="relative bg-ink">
        <Image src={heroSrc} alt={name} width={heroWidth} height={heroHeight} priority className="h-auto w-full" />
      </section>

      <section className="bg-ink">
        {introImage ? (
          <div className="mx-auto max-w-6xl px-6 py-12 lg:py-20">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-14">
              <div className="w-60 shrink-0 sm:w-72 lg:w-[48%]">
                <Image
                  src={introImage.src}
                  width={introImage.width}
                  height={introImage.height}
                  alt={introImage.alt ?? ""}
                  className="h-auto w-full"
                />
              </div>
              <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
                <p className="max-w-xl text-lg leading-relaxed text-white/75">{description}</p>
                {cta}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-12 text-center lg:py-16">
            <p className="max-w-2xl text-lg leading-relaxed text-white/75">{description}</p>
            {cta}
          </div>
        )}
      </section>
    </>
  );
}
