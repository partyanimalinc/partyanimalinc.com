import { NextResponse } from "next/server";

// Contact form handler: emails the submission to Party Animal via Resend
// (reusing the apphub Resend connection; verified sender domain is
// hq.partyanimalinc.com). From is a verified address with Reply-To set to the
// submitter, so hitting "Reply" replies straight to them — the deliverable
// equivalent of "From: the submitter" (a provider can't send From a domain it
// hasn't verified without failing SPF/DKIM).
const TO = process.env.CONTACT_TO_EMAIL || "information@partyanimalinc.com";
const FROM = process.env.CONTACT_FROM_EMAIL || "Party Animal Website <noreply@hq.partyanimalinc.com>";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string; company?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();

  // Honeypot: bots fill the hidden "company" field. Pretend success, send nothing.
  if (body.company) return NextResponse.json({ ok: true });

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Please fill in every field." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("contact: RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Email is not configured." }, { status: 500 });
  }

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;">
      <h2 style="color:#18181b;margin-bottom:16px;">New Website Contact Request</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr><td style="padding:8px 0;color:#71717a;width:110px;">Name</td><td style="padding:8px 0;color:#18181b;font-weight:500;">${esc(name)}</td></tr>
        <tr><td style="padding:8px 0;color:#71717a;">Email</td><td style="padding:8px 0;color:#18181b;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
      </table>
      <div style="background:#f4f4f5;border-radius:8px;padding:16px;">
        <p style="color:#18181b;margin:0;white-space:pre-wrap;">${esc(message)}</p>
      </div>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: `${name} <${email}>`,
        subject: "New Website Contact Request",
        html,
        text: `New Website Contact Request\n\nName: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("contact: Resend error", res.status, detail);
      return NextResponse.json({ error: "Could not send your message. Please try again." }, { status: 502 });
    }
  } catch (err) {
    console.error("contact: send failed", err);
    return NextResponse.json({ error: "Could not send your message. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
