import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/pim";

// Same-origin proxy for the nav typeahead: keeps the PIM API key server-side
// while letting the client fetch live product suggestions. Delegates to apphub's
// public /search endpoint (exact + fuzzy over web-visible products).
// Cached at the CDN per query: the same handful of terms repeat constantly,
// and each uncached hit is a function invocation plus an apphub round trip.
const CACHE = { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" };

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() || "";
  if (!q) return NextResponse.json({ products: [], fuzzy: false }, { headers: CACHE });
  const data = await searchProducts(q, 8);
  return NextResponse.json(data, { headers: CACHE });
}
