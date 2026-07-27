// Subtle, branded fallback for products that have no photo yet. Instead of a
// bare "No image" label, we show the Party Animal monkey mark as a faint
// watermark on the white tile so empty slots still feel on-brand and intentional.
export function ProductImagePlaceholder({ caption = true }: { caption?: boolean }) {
  return (
    <div className="grid h-full w-full place-items-center bg-white p-6">
      <div className="flex w-full flex-col items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/pa-monkey-mark.png"
          alt=""
          aria-hidden
          className="w-1/2 max-w-[170px] opacity-[0.08]"
        />
        {caption && (
          <span className="label-athletic text-[10px] tracking-wider text-ink/25 sm:text-xs">
            Photo coming soon
          </span>
        )}
      </div>
    </div>
  );
}
