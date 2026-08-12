import { NextResponse } from "next/server";
import { createHash } from "crypto";

// Footer newsletter signup -> Mailchimp audience (double opt-in).
// New addresses are added as "pending": Mailchimp emails a confirmation link and
// they only become "subscribed" after clicking it. Existing members are left
// as-is (status_if_new never downgrades or re-subscribes anyone). Every signup
// is tagged so website leads can be segmented.
export const runtime = "nodejs";

const AUDIENCE = process.env.MAILCHIMP_AUDIENCE_ID;
const SERVER = process.env.MAILCHIMP_SERVER_PREFIX; // e.g. "us21"
const API_KEY = process.env.MAILCHIMP_API_KEY;
const TAG = process.env.MAILCHIMP_SIGNUP_TAG || "Website Signup";

function mcHeaders() {
  // Mailchimp Marketing API: HTTP Basic auth, username is arbitrary.
  const auth = Buffer.from(`anystring:${API_KEY}`).toString("base64");
  return { Authorization: `Basic ${auth}`, "Content-Type": "application/json" };
}

export async function POST(req: Request) {
  let body: { email?: string; company?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden "company" field. Pretend success, do nothing.
  if (body.company) return NextResponse.json({ ok: true });

  const email = (body.email || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!AUDIENCE || !SERVER || !API_KEY) {
    console.error("subscribe: Mailchimp env not configured");
    return NextResponse.json({ error: "Signups are not configured yet." }, { status: 500 });
  }

  const base = `https://${SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE}`;
  const hash = createHash("md5").update(email).digest("hex");

  try {
    // Upsert the member. status_if_new "pending" -> triggers the opt-in email
    // for new addresses; ignored for anyone already on the list.
    const put = await fetch(`${base}/members/${hash}`, {
      method: "PUT",
      headers: mcHeaders(),
      body: JSON.stringify({
        email_address: email,
        status_if_new: "pending",
      }),
    });

    if (!put.ok) {
      const detail = await put.json().catch(() => ({}));
      // A previously-unsubscribed address can't be re-added via the API — tell
      // them to use the link in an older email rather than leaking list state.
      if (detail?.title === "Member In Compliance State") {
        return NextResponse.json(
          { error: "This address was unsubscribed before. Use the confirm link in a past email to rejoin." },
          { status: 409 },
        );
      }
      // Mailchimp rejects addresses that look fake/undeliverable.
      if (put.status === 400) {
        return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
      }
      console.error("subscribe: Mailchimp upsert error", put.status, detail);
      return NextResponse.json({ error: "Could not sign you up. Please try again." }, { status: 502 });
    }

    // Tag the signup (best-effort; a tag failure shouldn't fail the signup).
    await fetch(`${base}/members/${hash}/tags`, {
      method: "POST",
      headers: mcHeaders(),
      body: JSON.stringify({ tags: [{ name: TAG, status: "active" }] }),
    }).catch((err) => console.error("subscribe: tag failed", err));
  } catch (err) {
    console.error("subscribe: request failed", err);
    return NextResponse.json({ error: "Could not sign you up. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
