"use client";

import { useEffect, useRef, useState } from "react";
import { StarGlyph } from "@/components/stars";
import { useTurnstile } from "@/components/use-turnstile";

// Inline "Write a review" form on the product page. Posts straight from the
// browser to AppHub's public reviews intake; AppHub verifies Turnstile, checks
// the email against orders for the Verified purchase badge, and holds the
// review for moderation. Nothing is shown on this site until AppHub approves
// it and the PIM API serves it back, so the success copy says "in the queue".
//
// Loaded lazily by review-form-toggle.tsx; keep every import here, not in the
// server-rendered list, so the chunk only costs when someone opens the form.

const ENDPOINT =
  process.env.NEXT_PUBLIC_REVIEWS_ENDPOINT || "https://hq.partyanimalinc.com/api/public/reviews";

const BODY_MIN = 10;
const BODY_MAX = 4000;
const TITLE_MAX = 120;

const RATING_WORDS = ["", "Poor", "Fair", "Good", "Great", "Love it"];

type Errors = Partial<Record<"rating" | "body" | "name" | "email" | "turnstile" | "form", string>>;

const INPUT =
  "h-11 w-full rounded-md border border-ink/20 bg-white px-3 text-sm text-ink placeholder:text-ink/40 focus:border-brand-red focus:outline-none";

export function ReviewForm({
  sku,
  productName,
  onCancel,
}: {
  sku: string;
  productName: string;
  onCancel?: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [bodyLen, setBodyLen] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { widgetEl, token, reset: resetTurnstile } = useTurnstile({
    action: "review-submit",
    theme: "light",
  });

  // The form appears on a button press lower on the page; move focus to it so
  // keyboard and screen-reader users land where the change happened.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (status === "sent") {
    return (
      <div
        role="status"
        className="mt-6 rounded-xl border border-brand-gold/50 bg-brand-gold/10 p-5 text-sm text-ink"
      >
        Thanks! Your review is in the queue and will appear after a quick check.
      </div>
    );
  }

  function validate(data: FormData): Errors {
    const e: Errors = {};
    const body = String(data.get("body") ?? "").trim();
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    if (!rating) e.rating = "Pick a star rating.";
    if (body.length < BODY_MIN) e.body = `Please write at least ${BODY_MIN} characters.`;
    else if (body.length > BODY_MAX) e.body = `Please keep it under ${BODY_MAX} characters.`;
    if (!name) e.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email address.";
    if (!token) e.turnstile = "Please complete the verification challenge.";
    return e;
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = new FormData(form);
    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku,
          rating,
          title: String(data.get("title") ?? "").trim() || null,
          body: String(data.get("body") ?? "").trim(),
          name: String(data.get("name") ?? "").trim(),
          email: String(data.get("email") ?? "").trim(),
          turnstileToken: token,
          website: String(data.get("website") ?? ""), // honeypot; humans leave it empty
          source: "corp",
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErrors({ form: json.error || "Something went wrong. Please try again." });
        setStatus("idle");
        resetTurnstile();
        return;
      }
      setStatus("sent");
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
      setStatus("idle");
      resetTurnstile();
    }
  }

  const shown = hover || rating;

  return (
    <form
      id="review-form"
      onSubmit={onSubmit}
      noValidate
      className="mt-6 grid gap-5 border-t border-ink/10 pt-6 sm:grid-cols-2"
      aria-describedby={errors.form ? "review-form-error" : undefined}
    >
      <div className="sm:col-span-2">
        <h3 ref={headingRef} tabIndex={-1} className="font-heading text-xl uppercase text-ink focus:outline-none">
          Write a review
        </h3>
        <p className="mt-1 text-sm text-ink/55">{productName}</p>
      </div>

      {/* Rating: five radios so arrow keys and screen readers work for free. */}
      <fieldset className="sm:col-span-2" aria-describedby={errors.rating ? "review-rating-error" : undefined}>
        <legend className="mb-1 block text-sm text-ink/70">
          Your rating <span aria-hidden>*</span>
        </legend>
        <div className="flex items-center gap-3">
          <div className="flex" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <label
                key={n}
                className="cursor-pointer p-0.5 focus-within:rounded focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-red"
                onMouseEnter={() => setHover(n)}
              >
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={rating === n}
                  onChange={() => setRating(n)}
                  className="sr-only"
                  aria-label={`${n} ${n === 1 ? "star" : "stars"}, ${RATING_WORDS[n]}`}
                />
                <StarGlyph size={28} className={n <= shown ? "text-brand-gold" : "text-ink/15"} />
              </label>
            ))}
          </div>
          <span className="text-sm text-ink/60" aria-hidden>
            {shown ? RATING_WORDS[shown] : ""}
          </span>
        </div>
        {errors.rating && (
          <p id="review-rating-error" className="mt-1 text-sm text-brand-red">
            {errors.rating}
          </p>
        )}
      </fieldset>

      <label className="block sm:col-span-2">
        <span className="mb-1 block text-sm text-ink/70">Title (optional)</span>
        <input name="title" maxLength={TITLE_MAX} className={INPUT} placeholder="Sum it up in a few words" />
      </label>

      <label className="block sm:col-span-2">
        <span className="mb-1 flex items-baseline justify-between text-sm text-ink/70">
          <span>
            Your review <span aria-hidden>*</span>
          </span>
          <span className={`text-xs tabular-nums ${bodyLen > BODY_MAX ? "text-brand-red" : "text-ink/45"}`} aria-live="polite">
            {bodyLen} / {BODY_MAX}
          </span>
        </span>
        <textarea
          name="body"
          required
          rows={5}
          minLength={BODY_MIN}
          maxLength={BODY_MAX}
          onChange={(e) => setBodyLen(e.currentTarget.value.length)}
          aria-invalid={errors.body ? true : undefined}
          aria-describedby={errors.body ? "review-body-error" : "review-body-hint"}
          className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:border-brand-red focus:outline-none"
          placeholder="What did you think? How does it look, how does it hold up, who did you get it for?"
        />
        {errors.body ? (
          <span id="review-body-error" className="mt-1 block text-sm text-brand-red">
            {errors.body}
          </span>
        ) : (
          <span id="review-body-hint" className="mt-1 block text-xs text-ink/45">
            At least {BODY_MIN} characters.
          </span>
        )}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm text-ink/70">
          Name <span aria-hidden>*</span>
        </span>
        <input
          name="name"
          required
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "review-name-error" : "review-name-hint"}
          className={INPUT}
          placeholder="Your name"
        />
        {errors.name ? (
          <span id="review-name-error" className="mt-1 block text-sm text-brand-red">
            {errors.name}
          </span>
        ) : (
          <span id="review-name-hint" className="mt-1 block text-xs text-ink/45">
            Shown as first name and last initial.
          </span>
        )}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm text-ink/70">
          Email <span aria-hidden>*</span>
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "review-email-error" : "review-email-hint"}
          className={INPUT}
          placeholder="you@email.com"
        />
        {errors.email ? (
          <span id="review-email-error" className="mt-1 block text-sm text-brand-red">
            {errors.email}
          </span>
        ) : (
          <span id="review-email-hint" className="mt-1 block text-xs text-ink/45">
            Never shown. Used to mark verified purchases.
          </span>
        )}
      </label>

      {/* Honeypot: hidden from people, filled by bots. */}
      <div aria-hidden className="hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="sm:col-span-2">
        <div ref={widgetEl} className="cf-turnstile" />
        {errors.turnstile && <p className="mt-1 text-sm text-brand-red">{errors.turnstile}</p>}
      </div>

      <div className="sm:col-span-2">
        {errors.form && (
          <p id="review-form-error" role="alert" className="mb-3 text-sm text-brand-red">
            {errors.form}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={status === "sending"}
            className="label-athletic inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3 text-sm text-white transition-colors hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Submit review"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-ink/60 underline-offset-2 hover:text-ink hover:underline"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
