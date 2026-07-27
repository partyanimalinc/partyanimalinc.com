import { permanentRedirect } from "next/navigation";

// FAQ has no standalone page yet; send visitors to Contact (308).
export default function FaqPage() {
  permanentRedirect("/contact");
}
