import type { Metadata } from "next";
import { Archivo, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PreFooterCTA } from "@/components/pre-footer-cta";
import { UmamiAnalytics } from "@/components/umami-analytics";

// Body copy - matches the Figma spec (Montserrat).
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

// Heading substitute for the licensed "Kommon Grotesk Bold Italic".
// Swap this for a local() Kommon face once the web license is purchased.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
});

// Brush/script accent (self-hosted, licensed by the client).
const pinkBlue = localFont({
  src: [{ path: "../fonts/PinkBlue.woff", weight: "400", style: "normal" }],
  variable: "--font-pinkblue",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://partyanimalinc.com"),
  title: {
    default: "Party Animal: Ready to Rip",
    template: "%s | Party Animal",
  },
  description:
    "Party Animal creates fun, high-quality officially licensed sports products: TeenyMates, SqueezyMates, Jumbo Squeezy, Team Gear and more.",
  openGraph: {
    title: "Party Animal: Ready to Rip",
    description:
      "Officially licensed sports collectibles and fan gear. Built for real ones.",
    type: "website",
    siteName: "Party Animal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Party Animal: Ready to Rip",
    description:
      "Officially licensed sports collectibles and fan gear. Built for real ones.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${archivo.variable} ${pinkBlue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-white">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <PreFooterCTA />
        <SiteFooter />
        <UmamiAnalytics />
      </body>
    </html>
  );
}
