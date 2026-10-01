import { useEffect, useRef, useState } from "react";

// Cloudflare Turnstile, shared by the contact form and the review form. One
// site key for the whole site ("partyanimaltoys.com (Spin)" in Cloudflare);
// each form passes its own `action` so AppHub can tell them apart.
export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAEv8MdewUdDrs1dS";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

// Loads the Turnstile script once (explicit render, so it also works after a
// client-side navigation) and renders a widget into `widgetEl`. Returns the
// current token (null until solved / after expiry) and a reset for after a
// failed submit, since a token is single-use.
export function useTurnstile(opts: { action: string; theme?: "light" | "dark" | "auto" }) {
  const { action, theme = "auto" } = opts;
  const [token, setToken] = useState<string | null>(null);
  const widgetEl = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    function tryRender() {
      if (cancelled || widgetId.current || !widgetEl.current || !window.turnstile) return;
      widgetId.current = window.turnstile.render(widgetEl.current, {
        sitekey: TURNSTILE_SITE_KEY,
        action,
        theme,
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
  }, [action, theme]);

  function reset() {
    setToken(null);
    if (window.turnstile && widgetId.current) window.turnstile.reset(widgetId.current);
  }

  return { widgetEl, token, reset };
}
