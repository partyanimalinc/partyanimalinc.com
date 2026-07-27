"use client";

import { useState } from "react";

// Contact form. POSTs to /api/contact, which emails the submission to Party
// Animal via Resend (Reply-To set to the submitter).
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-6 text-brand-gold">
        Thanks for reaching out. We&rsquo;ll get back to you soon.
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          company: data.get("company"), // honeypot
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
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
