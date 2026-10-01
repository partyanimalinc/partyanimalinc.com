// Read-only star row. Server-safe (no client code); the review form has its own
// interactive picker. `value` may be fractional for the summary (4.8 → four full
// stars and a partial fifth).
export function Stars({
  value,
  size = 16,
  className = "",
  label,
}: {
  value: number;
  size?: number;
  className?: string;
  /** Accessible name; defaults to "N out of 5 stars". */
  label?: string;
}) {
  const v = Math.max(0, Math.min(5, value));
  return (
    <span
      role="img"
      aria-label={label ?? `${Math.round(v * 10) / 10} out of 5 stars`}
      className={`inline-flex items-center gap-0.5 ${className}`}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, v - (i - 1)));
        return <Star key={i} fill={fill} size={size} />;
      })}
    </span>
  );
}

export function Star({ fill, size }: { fill: number; size: number }) {
  // A gold star over a grey one, clipped by `fill`. SVG is inline so there is
  // nothing to load and the shape is identical in the picker.
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }} aria-hidden>
      <StarGlyph size={size} className="absolute inset-0 text-ink/15" />
      {fill > 0 && (
        <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
          <StarGlyph size={size} className="text-brand-gold" />
        </span>
      )}
    </span>
  );
}

export function StarGlyph({ size, className = "" }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2.5l2.95 6.26 6.85.86-5.03 4.74 1.3 6.79L12 17.77l-6.07 3.38 1.3-6.79L2.2 9.62l6.85-.86L12 2.5z" />
    </svg>
  );
}
