import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/pim";

// Same-origin proxy for the nav typeahead: keeps the PIM API key server-side
// while letting the client fetch live product suggestions. Delegates to apphub's
// public /search endpoint (exact + fuzzy over web-visible products).
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() || "";
  if (!q) return NextResponse.json({ products: [], fuzzy: false });
  const data = await searchProducts(q, 8);
  return NextResponse.json(data);
}
