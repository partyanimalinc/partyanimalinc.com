import Image from "next/image";

// Reusable interior-page header using the grunge art (Figma "image 3").
export function PageHeader({
  title,
  subtitle,
  eyebrow,
  logo,
  bgImage = "/headers/desktop-banner-bg.png",
  bgPosition = "bottom",
  scrim = false,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  // Optional team/league mark shown at the right on larger screens.
  logo?: string | null;
  // Override the banner background (e.g. a photo). Add `scrim` for legibility
  // over a busy image; `bgPosition` picks how it's cropped.
  bgImage?: string;
  bgPosition?: "bottom" | "center";
  scrim?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src={bgImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className={`object-cover ${bgPosition === "center" ? "object-center" : "object-bottom"}`}
      />
      {scrim && (
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-ink/10" />
      )}
      <div className="relative mx-auto flex min-h-[220px] max-w-7xl items-center justify-between gap-6 px-4 py-12 sm:px-6 lg:min-h-[280px] lg:px-8">
        <div className="flex flex-col justify-center">
          {eyebrow && (
            <p className="label-athletic mb-2 text-sm text-white/90 drop-shadow">
              {eyebrow}
            </p>
          )}
          <h1 className="font-heading text-4xl uppercase text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-lg text-white/90 drop-shadow">
              {subtitle}
            </p>
          )}
        </div>
        {logo && (
          <div className="hidden shrink-0 sm:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt=""
              className="h-24 w-24 object-contain drop-shadow-[0_6px_20px_rgba(0,0,0,0.55)] lg:h-32 lg:w-32"
            />
          </div>
        )}
      </div>
    </section>
  );
}
