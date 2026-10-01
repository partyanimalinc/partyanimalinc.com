import { Stars } from "@/components/stars";
import { ReviewFormToggle } from "@/components/review-form-toggle";
import type { ProductReviews as ProductReviewsData } from "@/lib/pim";

// Reviews block on the product page. Server component: the summary and the
// review text are in the HTML (search engines and the JSON-LD both lean on
// it); only the "Write a review" button and the form it reveals ship JS, and
// the form chunk itself is fetched when the button is pressed.
//
// `reviews` is optional end to end. Until AppHub serves it, or when a SKU has
// none, the block is just the heading and the button.

export type ProductReviewsProps = {
  sku: string;
  productName: string;
  reviews?: ProductReviewsData | null;
};

// Deterministic (fixed locale + UTC) so the server HTML never depends on where
// the render ran.
const DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : DATE.format(d);
}

export function ProductReviews({ sku, productName, reviews }: ProductReviewsProps) {
  const count = reviews?.ratingCount ?? 0;
  const items = reviews?.items ?? [];
  const avg = count > 0 && reviews?.ratingValue != null ? reviews.ratingValue : null;

  // Distribution from the items we were given. ratingCount may exceed
  // items.length if AppHub ever pages the list; the bars then describe the
  // reviews shown, which is still true.
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    n: items.filter((r) => Math.round(r.rating) === star).length,
  }));
  const distTotal = dist.reduce((a, d) => a + d.n, 0);

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="mt-16">
      <div className="mb-6 flex items-center gap-4">
        <span className="text-brand-red">★</span>
        <h2 id="reviews-heading" className="font-heading text-2xl uppercase text-ink">
          Reviews
        </h2>
        <span className="h-px flex-1 bg-ink/10" />
      </div>

      <div className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-sm sm:p-8">
        {count === 0 || avg === null ? (
          // Heading + button only. Once the button is pressed the slot holds the
          // form, and the row stacks so the form gets the full width.
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between has-[[data-review-form]]:sm:flex-col has-[[data-review-form]]:sm:items-stretch">
            <p className="text-sm text-ink/60">No reviews yet. Be the first to review {productName}.</p>
            <ReviewFormToggle sku={sku} productName={productName} />
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid gap-6 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <div className="flex items-center gap-4">
                <span className="font-heading text-5xl leading-none text-ink">{avg.toFixed(1)}</span>
                <div>
                  <Stars value={avg} size={18} />
                  <p className="mt-1 text-sm text-ink/60">
                    {avg.toFixed(1)} out of 5 · {count} {count === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>

              <dl className="w-full max-w-xs" aria-label="Rating distribution">
                {dist.map(({ star, n }) => {
                  const pct = distTotal ? Math.round((n / distTotal) * 100) : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 py-0.5 text-xs text-ink/60">
                      <dt className="w-9 shrink-0 tabular-nums">
                        {star} <span aria-hidden>★</span>
                        <span className="sr-only">{star === 1 ? "star" : "stars"}</span>
                      </dt>
                      <dd className="flex flex-1 items-center gap-2">
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
                          <span
                            className="block h-full rounded-full bg-brand-gold"
                            style={{ width: `${pct}%` }}
                          />
                        </span>
                        <span className="w-5 text-right tabular-nums">{n}</span>
                      </dd>
                    </div>
                  );
                })}
              </dl>

              {/* Button cell; becomes a full-width row below the summary when the form is open. */}
              <div className="sm:justify-self-end has-[[data-review-form]]:col-span-full has-[[data-review-form]]:sm:justify-self-stretch">
                <ReviewFormToggle sku={sku} productName={productName} />
              </div>
            </div>

            {/* List */}
            <ul className="mt-8 divide-y divide-ink/10 border-t border-ink/10">
              {items.map((r) => (
                <li key={r.id} id={`review-${r.id}`} className="scroll-mt-24 py-6">
                  <article>
                    <header className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <Stars value={r.rating} size={14} label={`Rated ${r.rating} out of 5`} />
                      {r.title && <h3 className="text-base font-semibold text-ink">{r.title}</h3>}
                    </header>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/80">{r.body}</p>
                    <footer className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/50">
                      <span className="font-medium text-ink/70">{r.reviewerName}</span>
                      {r.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold/15 px-2 py-0.5 font-medium text-ink/70">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Verified purchase
                        </span>
                      )}
                      <time dateTime={r.createdAt}>{fmtDate(r.createdAt)}</time>
                    </footer>
                    {r.reply && (
                      <div className="mt-4 rounded-r-lg border-l-2 border-brand-red bg-[#f4f4f6] px-4 py-3">
                        <p className="label-athletic text-[11px] tracking-wider text-brand-red">
                          Party Animal replied
                          {r.reply.at && (
                            <>
                              {" "}
                              <time dateTime={r.reply.at} className="font-body font-normal normal-case tracking-normal text-ink/45">
                                · {fmtDate(r.reply.at)}
                              </time>
                            </>
                          )}
                        </p>
                        <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink/75">{r.reply.body}</p>
                      </div>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
