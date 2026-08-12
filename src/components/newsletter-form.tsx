"use client";

import { useState } from "react";

// "Join the Animal Pack" signup. POSTs to /api/subscribe, which adds the address
// to the Mailchimp audience as double opt-in (they get a confirmation email).
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state === "loading") return;
    setState("loading");
    setError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not sign you up. Please try again.");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError("Could not sign you up. Please try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <p className="text-sm text-brand-gold">
        Almost there &mdash; check your inbox to confirm and you&rsquo;re in for drops,
        news &amp; exclusives.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          aria-label="Email address"
          disabled={state === "loading"}
          className="h-12 min-w-0 flex-1 rounded-lg border border-white/15 bg-ink px-4 text-sm text-white placeholder:text-white/40 focus:border-brand-red focus:outline-none disabled:opacity-60"
        />
        {/* Honeypot: hidden from users, bots fill it in. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          aria-hidden
          className="hidden"
        />
        <button
          type="submit"
          aria-label="Sign up"
          disabled={state === "loading"}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand-red text-white transition-colors hover:bg-brand-red-dark disabled:opacity-60"
        >
          {state === "loading" ? (
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-brand-red">
          {error}
        </p>
      )}
    </form>
  );
}
