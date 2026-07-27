import Link from "next/link";
import Image from "next/image";
import { NewsletterForm } from "@/components/newsletter-form";
import { SocialIcons } from "@/components/social-icons";

const PRODUCTS = [
  { name: "TeenyMates", href: "/teenymates", tagline: '1" collectible figures', img: "/lineup/figures/teenymates.png" },
  { name: "SqueezyMates", href: "/squeezymates", tagline: "Squeeze into the action", img: "/lineup/figures/squeezymates.png" },
  { name: "Jumbo Squeezy", href: "/jumbo-squeezy", tagline: "Go big & squeezy", img: "/lineup/figures/jumbo-squeezy.png" },
  { name: "Team Gear", href: "/team-gear", tagline: "Rep your team", img: "/lineup/figures/team-gear.png" },
];
const COMPANY = [
  { label: "About Us", href: "/about" },
  { label: "Licenses & Partners", href: "/licenses" },
  { label: "Become a Reseller", href: "/become-a-reseller" },
  { label: "Careers", href: "/careers" },
];
const SUPPORT = [
  { label: "Where to Buy", href: "/where-to-buy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact Us", href: "/contact" },
];

// A rough, torn paint streak rendered with SVG turbulence (no texture asset needed).
function GrungeStreak({ className = "", color = "#d90f1d", seed = 7 }: { className?: string; color?: string; seed?: number }) {
  const id = `grunge-${seed}`;
  return (
    <svg aria-hidden className={className} preserveAspectRatio="none" viewBox="0 0 1200 90">
      <defs>
        <filter id={id} x="-10%" y="-40%" width="120%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.18" numOctaves="2" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="46" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <rect x="-30" y="-40" width="1260" height="80" fill={color} filter={`url(#${id})`} />
    </svg>
  );
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-block">
      <h3 className="font-brush text-2xl uppercase leading-none tracking-wide text-white">{children}</h3>
      {/* underline scaled to match the heading's text width */}
      <Image
        src="/footer/underline.png"
        alt=""
        aria-hidden
        width={763}
        height={69}
        className="mt-2 h-3 w-full mix-blend-lighten"
      />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer style={{ minWidth: 0 }} className="relative w-full overflow-hidden bg-ink text-white">
      {/* top torn red streak */}
      <GrungeStreak seed={4} className="absolute inset-x-0 top-0 h-8 w-full" />

      {/* faint mascot watermark, right side */}
      <Image
        src="/brand/pa-mascot.png"
        alt=""
        aria-hidden
        width={860}
        height={980}
        className="pointer-events-none absolute -right-16 top-16 hidden w-[460px] select-none opacity-[0.06] lg:block [filter:grayscale(1)_sepia(1)_saturate(3)_hue-rotate(-18deg)_brightness(0.7)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-16 lg:px-8">
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-12">
          {/* BRAND */}
          <div className="text-center lg:col-span-4">
            <div className="mx-auto w-full max-w-[330px] lg:max-w-none">
              <Image src="/brand/pa-logo.png" alt="Party Animal" width={636} height={384} className="mx-auto block h-24 w-auto" />
              <Image
                src="/footer/ready-to-rip.png"
                alt="Ready to Rip"
                width={1400}
                height={433}
                className="mx-auto mt-6 block h-auto w-full max-w-[280px] mix-blend-lighten lg:h-24 lg:w-auto lg:max-w-none"
              />
              <SocialIcons className="mt-7" />
            </div>
          </div>

          {/* OUR PRODUCTS with figure cutouts */}
          <div className="min-w-0 text-center lg:col-span-3 lg:text-left">
            <SectionHead>Our Products</SectionHead>
            <ul>
              {PRODUCTS.map((p) => (
                <li key={p.name}>
                  <Link
                    href={p.href}
                    className="group flex items-center justify-center gap-4 border-b border-ink-line/70 py-3 last:border-b-0 lg:justify-start"
                  >
                    <span className="grid h-14 w-14 shrink-0 place-items-center">
                      <Image
                        src={p.img}
                        alt={p.name}
                        width={200}
                        height={240}
                        className="h-14 w-auto object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)] transition-transform group-hover:-translate-y-0.5 group-hover:scale-105"
                      />
                    </span>
                    <span className="text-left">
                      <span className="font-heading block uppercase leading-tight text-white transition-colors group-hover:text-brand-red">
                        {p.name}
                      </span>
                      <span className="text-xs text-white/50">{p.tagline}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY + SUPPORT + ANIMAL PACK */}
          <div style={{ minWidth: 0 }} className="lg:col-span-5 lg:border-l lg:border-ink-line/70 lg:pl-10">
            <div className="grid gap-10 text-center sm:grid-cols-2 lg:text-left">
              <div>
                <SectionHead>Company</SectionHead>
                <ul className="space-y-3">
                  {COMPANY.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-[15px] text-white/70 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <SectionHead>Support</SectionHead>
                <ul className="space-y-3">
                  {SUPPORT.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-[15px] text-white/70 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* JOIN THE ANIMAL PACK */}
            <div className="mt-12 text-center lg:text-left">
              <Image
                src="/footer/join-animal-pack.png"
                alt="Join the Animal Pack"
                width={1290}
                height={415}
                className="mx-auto h-[4.5rem] w-auto sm:h-24 lg:mx-0 lg:h-20"
              />
              <p className="mx-auto mt-3 max-w-[300px] text-sm text-white/60 sm:max-w-sm lg:mx-0">
                Be the first to see new drops, limited editions, and exclusive offers.
              </p>
              <div className="mx-auto mt-5 w-full max-w-[300px] sm:max-w-sm lg:mx-0 lg:max-w-md">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>

        {/* FEATURED LICENSES (hidden on mobile) */}
        <div className="mt-16 hidden border-t border-ink-line/70 pt-10 lg:block">
          <div className="flex justify-center">
            <Image
              src="/footer/featured-licenses-heading.png"
              alt="Featured Licenses"
              width={1800}
              height={85}
              className="h-auto w-full max-w-xl mix-blend-lighten"
            />
          </div>
          <Link
            href="/licenses"
            aria-label="See all licenses and partners"
            className="mx-auto mt-8 block max-w-4xl transition-opacity hover:opacity-100"
          >
            <Image
              src="/partners/licenses-ondark.png"
              alt="Officially licensed: NFL, MLB, NBA, NHL, MLS, College and more"
              width={2400}
              height={163}
              className="h-auto w-full opacity-90 transition-opacity hover:opacity-100"
            />
          </Link>
        </div>
      </div>

      {/* COLLECT • PLAY • CELEBRATE bottom bar */}
      <div className="relative overflow-hidden border-t border-ink-line/70 bg-black">
        {/* designed grunge bottom streak (red left, blue/gold right) */}
        <img
          src="/footer/bottom-bg.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-7 text-center md:flex-row md:justify-between md:text-left lg:px-8">
          <p className="order-2 text-xs text-white/40 md:order-1 lg:text-white">
            &copy; 2026 Party Animal, Inc. All rights reserved.
            <br className="hidden sm:block" /> Officially licensed products.
          </p>
          <p className="font-brush order-1 text-lg uppercase tracking-wide text-white sm:text-2xl md:order-2">
            Collect <span className="text-brand-red">•</span> Play{" "}
            <span className="text-brand-red">•</span> Celebrate
          </p>
          <p className="order-3 max-w-[16rem] text-xs text-white/40 lg:text-white">
            Party Animal is a registered trademark of Party Animal, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
