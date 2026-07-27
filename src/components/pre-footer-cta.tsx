"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ReadyToRipCTA } from "@/components/ready-to-rip-cta";

// Shows the "Ready to Rip?" CTA above the footer on every page EXCEPT the
// catalog itself (the /products listing tree), where it would be redundant.
// Gated on mount so the route check is reliable and there's no SSR/hydration
// mismatch (usePathname isn't resolved during the server render here).
export function PreFooterCTA() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const pathname = usePathname() ?? "";
  if (!mounted || pathname.startsWith("/products")) return null;

  return <ReadyToRipCTA />;
}
