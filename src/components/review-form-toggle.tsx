"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// The one piece of the Reviews block that needs JS on page load: a button that
// reveals the form. The form (and Turnstile with it) lives in its own chunk,
// fetched on the first press, so the product page's JS stays as it was.
// `ssr: false` is allowed here because this is a Client Component; the form has
// nothing to prerender anyway.
const ReviewForm = dynamic(() => import("@/components/review-form").then((m) => m.ReviewForm), {
  ssr: false,
  loading: () => <p className="mt-6 text-sm text-ink/50">Loading…</p>,
});

export function ReviewFormToggle({ sku, productName }: { sku: string; productName: string }) {
  const [open, setOpen] = useState(false);

  if (open) {
    // The parent cell widens itself to the full row via a `has-[[data-review-form]]`
    // variant (see product-reviews.tsx), so the form gets the card's whole width.
    return (
      <div data-review-form className="w-full">
        <ReviewForm sku={sku} productName={productName} onCancel={() => setOpen(false)} />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-expanded={false}
      className="label-athletic inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 bg-white px-6 py-3 text-sm text-ink transition-colors hover:border-brand-red hover:text-brand-red"
    >
      Write a review
    </button>
  );
}
