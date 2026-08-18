import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

// On-demand revalidation webhook. apphub calls this when PIM content is
// published so the site refreshes immediately instead of waiting out the ISR
// TTL (product pages 24h, listings 1h). Auth is a shared secret; without it the
// long TTLs still keep the site eventually-consistent, this just makes it instant.
//
// POST body: { paths?: string[]; tags?: string[] }
//   paths — exact routes to rebuild, e.g. ["/products/f-tmxrm", "/team-gear"]
//   tags  — cache tags set in lib/pim.ts:
//           "catalog" (all listings/facets), "categories", "category:<slug>",
//           "product", "product:<slug>", "licenses", "product-slugs"
// Example (one product changed): { tags: ["product:f-tmxrm", "catalog"] }
export const runtime = "nodejs";

const SECRET = process.env.REVALIDATE_SECRET;

export async function POST(req: Request) {
  if (!SECRET) {
    console.error("revalidate: REVALIDATE_SECRET not set");
    return NextResponse.json({ error: "Revalidation not configured." }, { status: 500 });
  }
  const auth = req.headers.get("x-revalidate-secret") || new URL(req.url).searchParams.get("secret");
  if (auth !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { paths?: unknown; tags?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const paths = Array.isArray(body.paths) ? body.paths.filter((p): p is string => typeof p === "string") : [];
  const tags = Array.isArray(body.tags) ? body.tags.filter((t): t is string => typeof t === "string") : [];

  if (paths.length === 0 && tags.length === 0) {
    return NextResponse.json({ error: "Provide paths and/or tags." }, { status: 400 });
  }

  for (const t of tags) revalidateTag(t, "max");
  for (const p of paths) revalidatePath(p, "page");

  return NextResponse.json({ revalidated: true, paths, tags });
}
