"use client";

import { useEffect, useRef, useState } from "react";

// Contact form. Submits into apphub's shared support inbox via the public
// intake endpoint (the same one the Shopify store's Get Help form uses), so
// website messages land in the ticket system alongside store and email threads.
// Cloudflare Turnstile guards it: we render the same widget + action the intake
// verifies against ("partyanimaltoys.com (Spin)" site key, action support-intake).
const SUPPORT_INTAKE_URL = "https://hq.partyanimalinc.com/api/support/intake";
const TURNSTILE_SITEKEY = "0x4AAAAAAEv8MdewUdDrs1dS";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [ref, setRef] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const widgetEl = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  // Load the Turnstile script once and render the widget when it is ready.
  // Explicit render (not auto) so it also works after client-side navigation,
  // not just on a fresh page load.
  useEffect(() => {
    let cancelled = false;
    function tryRender() {
      if (cancelled || widgetId.current || !widgetEl.current || !window.turnstile) return;
      widgetId.current = window.turnstile.render(widgetEl.current, {
        sitekey: TURNSTILE_SITEKEY,
        action: "support-intake",
        theme: "dark",
        callback: (t: string) => setToken(t),
        "expired-callback": () => setToken(null),
        "error-callback": () => setToken(null),
      });
    }
    if (window.turnstile) {
      tryRender();
      return () => {
        cancelled = true;
      };
    }
    let s = document.querySelector<HTMLScriptElement>("script[data-cf-turnstile]");
    if (!s) {
      s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      s.dataset.cfTurnstile = "1";
      document.head.appendChild(s);
    }
    s.addEventListener("load", tryRender);
    return () => {
      cancelled = true;
      s?.removeEventListener("load", tryRender);
    };
  }, []);

  function resetTurnstile() {
    setToken(null);
    if (window.turnstile && widgetId.current) window.turnstile.reset(widgetId.current);
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-6 text-brand-gold">
        Thanks for reaching out. We&rsquo;ll get back to you soon.
        {ref && (
          <>
            {" "}
            Your reference number is <strong>{ref}</strong>.
          </>
        )}
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!token) {
      setError("Please complete the verification challenge below.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch(SUPPORT_INTAKE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          topic: "Corporate Website",
          company: data.get("company"), // honeypot
          "cf-turnstile-response": token,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Something went wrong. Please try again.");
        setStatus("error");
        resetTurnstile();
        return;
      }
      setRef(json.ref || null);
      setStatus("sent");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
      resetTurnstile();
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="block">
        <span className="mb-1 block text-sm text-white/70">Name</span>
        <input
          name="name"
          required
          className="h-11 w-full rounded-md border border-ink-line bg-ink px-3 text-white placeholder:text-white/40 focus:border-brand-red focus:outline-none"
          placeholder="Your name"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm text-white/70">Email</span>
        <input
          name="email"
          type="email"
          required
          className="h-11 w-full rounded-md border border-ink-line bg-ink px-3 text-white placeholder:text-white/40 focus:border-brand-red focus:outline-none"
          placeholder="you@email.com"
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1 block text-sm text-white/70">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-md border border-ink-line bg-ink px-3 py-2 text-white placeholder:text-white/40 focus:border-brand-red focus:outline-none"
          placeholder="How can we help?"
        />
      </label>

      {/* Honeypot: hidden from users, catches bots. */}
      <div aria-hidden className="hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="sm:col-span-2">
        <div ref={widgetEl} className="cf-turnstile" />
      </div>

      <div className="sm:col-span-2">
        {status === "error" && error && (
          <p className="mb-3 text-sm text-brand-red">{error}</p>
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="label-athletic inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3 text-sm text-white transition-colors hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send Message"}
        </button>
      </div>
    </form>
  );
}
