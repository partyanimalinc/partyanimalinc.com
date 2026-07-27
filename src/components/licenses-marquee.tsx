import Link from "next/link";
import Image from "next/image";

// Individual league/partner logos sliced from the "All Licenses (on light)"
// artwork. Order matches the source strip.
const LOGOS = [
  { file: "logo-01.png", name: "NFL" },
  { file: "logo-02.png", name: "NFLPA" },
  { file: "logo-03.png", name: "Football Greats Alliance" },
  { file: "logo-04.png", name: "NHL" },
  { file: "logo-05.png", name: "NHLPA" },
  { file: "logo-06.png", name: "MLB" },
  { file: "logo-07.png", name: "MLB Players" },
  { file: "logo-08.png", name: "NBA" },
  { file: "logo-09.png", name: "National Basketball Players Association" },
  { file: "logo-10.png", name: "WNBA" },
  { file: "logo-11.png", name: "WNBPA" },
  { file: "logo-12.png", name: "College" },
  { file: "logo-13.png", name: "USA" },
  { file: "logo-14.png", name: "US National Soccer Players" },
];

function LogoRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
      aria-hidden={hidden}
    >
      {LOGOS.map((l) => (
        <li key={l.file} className="shrink-0">
          <Image
            src={`/partners/logos/${l.file}`}
            alt={hidden ? "" : l.name}
            width={220}
            height={120}
            className="h-9 w-auto object-contain sm:h-12"
          />
        </li>
      ))}
    </ul>
  );
}

export function LicensesMarquee() {
  return (
    <section className="bg-white text-ink">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:gap-8 lg:px-8">
        {/* Left text block */}
        <div className="flex shrink-0 items-start gap-3 lg:max-w-xs">
          <span className="mt-1 text-2xl leading-none text-brand-red">★</span>
          <div>
            <h2 className="font-heading text-xl leading-tight text-ink sm:text-2xl">
              Proud Partners.
              <br />
              Iconic Brands.
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              We&rsquo;re proud to partner with the most recognized names in
              sports.
            </p>
            <Link
              href="/licenses"
              className="label-athletic mt-3 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs text-white transition-colors hover:bg-ink-soft"
            >
              View Our Licenses
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden w-px self-stretch bg-ink/10 lg:block" />

        {/* Infinite marquee */}
        <div className="marquee-mask relative min-w-0 flex-1 overflow-hidden">
          <div className="flex w-max animate-marquee">
            <LogoRow />
            <LogoRow hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
