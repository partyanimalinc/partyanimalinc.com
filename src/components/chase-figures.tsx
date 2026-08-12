// "Chase Figures" band — the gold rare figure (teenymates-rare-bg.png) pinned to
// the right as a background layer, with the headline + copy in a left column.
// The figure layer and the capped-width text column keep the text to the LEFT of
// the figure at every breakpoint (see .chase-* rules in globals.css).

export function ChaseFigures({ figClassName = "" }: { figClassName?: string } = {}) {
  return (
    <section className="chase-section" aria-label="Chase figures">
      <div className={`chase-fig ${figClassName}`.trim()} aria-hidden />
      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-8">
        <div className="chase-text py-12 lg:py-16">
          <h2 className="font-heading text-3xl uppercase leading-none text-brand-gold sm:text-4xl lg:text-5xl">
            Chase Figures
          </h2>
          <p className="font-heading mt-1.5 text-xl uppercase italic leading-none text-white sm:text-2xl lg:text-3xl">
            The Ultimate Finds.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
            Every series has rare, ultra rare and limited chase figures. Will you find them all?
          </p>
        </div>
      </div>
    </section>
  );
}
