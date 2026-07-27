"use client";

import { useState } from "react";

// "Join the Fandom" signup. Currently a client stub - will POST to a route
// handler that subscribes the address to the client's Mailchimp audience.
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done">("idle");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: POST /api/subscribe -> Mailchimp
    setState("done");
  }

  if (state === "done") {
    return (
      <p className="text-sm text-brand-gold">
        You&rsquo;re in. Watch your inbox for drops, news &amp; exclusives.
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full items-center gap-2"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        aria-label="Email address"
        className="h-12 min-w-0 flex-1 rounded-lg border border-white/15 bg-ink px-4 text-sm text-white placeholder:text-white/40 focus:border-brand-red focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Sign up"
        className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand-red text-white transition-colors hover:bg-brand-red-dark"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  );
}
