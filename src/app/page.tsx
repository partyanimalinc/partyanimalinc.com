import Link from "next/link";
import Image from "next/image";
import { LINEUP } from "@/lib/site";
import { LicensesMarquee } from "@/components/licenses-marquee";

export default function HomePage() {
  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <Image
            src="/hero/hero.png"
            alt="Party Animal licensed sports figures"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-105"
          />
          {/* Desktop: dark scrim only behind the left-side text; clears by mid-frame so figures stay bright */}
          <div className="absolute inset-0 hidden sm:block bg-[linear-gradient(90deg,rgba(10,10,10,0.92)_0%,rgba(10,10,10,0.5)_22%,rgba(10,10,10,0.12)_44%,transparent_60%)]" />
          {/* Mobile: overall scrim so the stacked text stays legible over the centered figures */}
          <div className="absolute inset-0 sm:hidden bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
        </div>

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:min-h-[660px] lg:px-8">
          <Image
            src="/hero/ready-to-rip.png"
            alt="Ready to Rip"
            width={560}
            height={403}
            priority
            className="w-64 max-w-full sm:w-80 lg:w-[26rem]"
          />
          <p className="text-shadow-hero mt-6 max-w-xs text-lg font-medium text-white sm:max-w-md sm:text-xl">
            Fan-first collectibles and pro-grade gear that turns every purchase
            into a win.
          </p>
          <div className="mt-8">
            <Link
              href="/products"
              className="label-athletic inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-sm text-white shadow-xl shadow-brand-red/30 transition-colors hover:bg-brand-red-dark"
            >
              Explore Our Products
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Partners / Licenses marquee ---------------- */}
      <LicensesMarquee />

      {/* ---------------- Choose Your Lineup ---------------- */}
      <section className="bg-ink py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="hidden h-px w-16 bg-brand-red sm:block" />
            <span className="text-brand-gold">★</span>
            <h2 className="font-heading text-center text-3xl uppercase text-white sm:text-4xl">
              Choose Your Lineup
            </h2>
            <span className="text-brand-gold">★</span>
            <span className="hidden h-px w-16 bg-brand-red sm:block" />
          </div>

          <div className="space-y-5">
            {LINEUP.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-label={`Explore the ${item.name} collection`}
                className="group block overflow-hidden rounded-2xl ring-1 ring-white/10 transition-transform duration-200 hover:scale-[1.01] hover:ring-white/25"
              >
                <Image
                  src={item.banner}
                  alt={item.alt}
                  width={1448}
                  height={280}
                  className="h-auto w-full"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Built for Real Ones ---------------- */}
      <section className="border-t border-ink-line bg-ink-soft py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[280px_1fr] lg:gap-16 lg:px-8">
          <Image
            src="/brand/pa-mascot.png"
            alt="Party Animal mascot"
            width={843}
            height={954}
            className="mx-auto w-40 lg:w-full"
          />
          <div>
            <Image
              src="/brand/built-for-real-ones.png"
              alt="For the Real Ones"
              width={1455}
              height={727}
              className="h-auto w-full max-w-xl"
            />
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
              For over 35 years, Party Animal has created officially licensed
              products that help fans celebrate the teams and players they love.
              From collectibles to tailgates, we bring the party to life.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="label-athletic inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm text-white transition-colors hover:bg-brand-red-dark"
              >
                About Us
              </Link>
              <Link
                href="/licenses"
                className="label-athletic inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm text-white transition-colors hover:bg-white/10"
              >
                Our Licenses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
