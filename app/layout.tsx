import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { siteConfig } from "@/data/site";
import { AnnouncementBar, Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomDock } from "@/components/layout/BottomDock";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const description =
  "Shop meat, hampers, seafood, deli favourites and groceries from Mother of Plain Foods in Mitchell's Plain. Browse specials and reserve your order on WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Mother of Plain Foods | Butchery, Meat & Groceries in Mitchell's Plain",
    template: "%s | Mother of Plain Foods",
  },
  description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: siteConfig.name,
    title: "Mother of Plain Foods | Fresh cuts. Big value.",
    description,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#d72729",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Browser extensions commonly add attributes to <html> before hydration; this
    // only silences attribute mismatches on this element, not its children.
    <html lang="en-ZA" className={`${inter.variable} ${barlow.variable}`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 bg-ink px-4 py-3 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <AnnouncementBar />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <BottomDock />
        <LocalBusinessJsonLd />
      </body>
    </html>
  );
}
