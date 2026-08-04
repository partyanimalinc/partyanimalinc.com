// "What Are TeenyMates?" explainer band — a bright white section directly under
// the TeenyMates hero banner. Mirrors the Figma frame "what-are-teenymates"
// (Corp-site). Live text in the site fonts (Archivo/Kommon heading + Montserrat
// body). The figures-vs-pencils scale photo is a background image on the row
// container (top-right, no-repeat) so the text + features sit over it.

type Feature = { icon: string; iconW: number; iconH: number; title: string; body: string };

const FEATURES: Feature[] = [
  {
    icon: "/lineup/what-are/icon-licensed.png",
    iconW: 675,
    iconH: 675,
    title: "Officially\nLicensed",
    body: "Featuring the biggest teams, leagues, and stars.",
  },
  {
    icon: "/lineup/what-are/icon-rare.png",
    iconW: 525,
    iconH: 483,
    title: "Rare &\nCollectible",
    body: "Find rare chase figures and special editions.",
  },
  {
    icon: "/lineup/what-are/icon-size.png",
    iconW: 576,
    iconH: 633,
    title: "Small Size,\nBig Impact",
    body: "At just 1 inch tall, they pack huge personality.",
  },
];

function FeatureItem({ f }: { f: Feature }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-24 items-end justify-center sm:h-28">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={f.icon}
          alt=""
          aria-hidden
          width={f.iconW}
          height={f.iconH}
          loading="lazy"
          className="max-h-20 w-auto sm:max-h-24"
        />
      </div>
      <h3 className="font-heading mt-4 whitespace-pre-line text-xl uppercase leading-[1.05] text-ink sm:text-2xl">
        {f.title}
      </h3>
      <p className="mt-2.5 max-w-[16rem] text-base leading-snug text-ink/70">{f.body}</p>
    </div>
  );
}

export function WhatAreTeenymates() {
  return (
    <section className="bg-white text-ink">
      <div className="wat-figures-bg mx-auto grid max-w-[96rem] items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
        {/* Left: headline + intro */}
        <div className="text-center lg:text-left">
          <h2 className="font-heading text-4xl uppercase leading-[0.92] tracking-tight text-ink sm:text-5xl xl:text-6xl">
            What Are
            <br />
            <span className="text-brand-red">TeenyMates?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/80 sm:text-xl lg:mx-0">
            TeenyMates are 1-inch collectible figures that bring your favorite teams and
            players to life in the tiniest, most collectible way!
          </p>

          {/* Mobile only: the figures show as a real inline image in the mid
              whitespace (the desktop rotated background is hidden below lg). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/lineup/what-are/teenymates-pencil.png"
            alt="Six TeenyMates figures standing next to two No. 2 pencils, showing their one-inch size"
            className="mx-auto mt-10 w-full max-w-md lg:hidden"
          />
        </div>

        {/* Right: three features */}
        <div className="wat-features grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
          {FEATURES.map((f) => (
            <FeatureItem key={f.title} f={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
