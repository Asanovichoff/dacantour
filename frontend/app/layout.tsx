import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { Analytics } from "@/components/Analytics";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  alternates: { canonical: "/" },
  keywords: [
    "Kyrgyzstan tours",
    "Song-Köl horse trek",
    "Kel-Suu",
    "Central Asia travel",
    "Silk Road tours",
    "Ala-Kul trek",
    "small group tours Kyrgyzstan",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description:
      "Cinematic small-group trips through Kyrgyzstan's mountains, run by a US-based team you can meet in person.",
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-lake focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <OrganizationJsonLd />
        <SmoothScroll>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
