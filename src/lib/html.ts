// Minimal allowlist sanitizer for first-party PIM description HTML.
// Keeps a small set of formatting tags, strips ALL attributes (no on*, href,
// style) and any tag outside the allowlist (inner text preserved). Also removes
// <script>/<style> blocks outright. Conservative by design.
const ALLOWED = new Set(["p", "br", "ul", "ol", "li", "b", "strong", "i", "em", "span"]);

export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return "";
  let s = html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "");
  s = s.replace(/<(\/?)([a-zA-Z0-9]+)[^>]*>/g, (_m, close: string, tag: string) => {
    const t = tag.toLowerCase();
    return ALLOWED.has(t) ? `<${close}${t}>` : "";
  });
  return s.trim();
}

// Strip all tags + collapse whitespace + decode a few common entities, for
// meta descriptions and JSON-LD (which must be plain text).
export function htmlToText(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
