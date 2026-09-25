import NextLink from "next/link";
import type { ComponentProps } from "react";

// Drop-in for next/link that turns prefetch OFF for links into the listing
// routes. Their clean URL is ISR now (src/proxy.ts rewrites only the filtered
// views to the on-demand /_f twin), but most links INTO this namespace carry a
// query (facet chips, sort options, "load more") and still render on demand.
// A league page exposes 20–100 such links; with the default prefetch, one
// Chrome visit — including Googlebot's renderer — fires a function invocation
// per link within a second of landing. Seen in the Vercel logs on 2026-09-24:
// ten /licenses/miami-heat?collection=… RSC fetches from one visitor inside
// one second. /licenses/[slug] alone was ~60% of all function invocations
// that billing cycle. The clean links (32 team chips) would be CDN hits, but
// prefetching 32 full pages per visit is not worth it either.
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
