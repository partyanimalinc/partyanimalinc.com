import NextLink from "next/link";
import type { ComponentProps } from "react";

// Drop-in for next/link that turns prefetch OFF for links into on-demand
// routes. Every listing route on this site reads searchParams, so it renders
// in a function on each request and has no static shell to prefetch. A league
// page exposes 20–100 such links (team chips, facet chips, sort options); with
// the default prefetch, one Chrome visit — including Googlebot's renderer —
// fires a function invocation per link within a second of landing. Seen in
// the Vercel logs on 2026-09-24: ten /licenses/miami-heat?collection=… RSC
// fetches from one visitor inside one second. /licenses/[slug] alone was
// ~60% of all function invocations that billing cycle.
//
// Static and ISR routes (home, brand landings, /licenses hub, /products/[slug])
// keep the default: their prefetch is a CDN hit and makes navigation snappy.
const ON_DEMAND = /^\/(licenses\/|products\/all|teenymates\/|squeezymates\/|jumbo-squeezy\/all|team-gear\/all|api\/)/;

export default function Link(props: ComponentProps<typeof NextLink>) {
  const { href, prefetch } = props;
  const path = typeof href === "string" ? href : (href?.pathname ?? "");
  const resolved = prefetch ?? (ON_DEMAND.test(path) ? false : undefined);
  return <NextLink {...props} prefetch={resolved} />;
}
