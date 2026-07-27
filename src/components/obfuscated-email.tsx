"use client";

import { useEffect, useState } from "react";

// Anti-scraper email. The address is split into user + domain (never a
// contiguous "info@partyanimalinc.com" literal in the server HTML), and the
// clickable mailto: is assembled only after hydration. Bots that regex the
// server response or the DOM before JS runs see "info [at] partyanimalinc.com".
export function ObfuscatedEmail({
  user,
  domain,
  className,
}: {
  user: string;
  domain: string;
  className?: string;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!ready) {
    return (
      <span className={className}>
        {user} [at] {domain}
      </span>
    );
  }

  const addr = `${user}@${domain}`;
  return (
    <a href={`mailto:${addr}`} className={className}>
      {addr}
    </a>
  );
}
