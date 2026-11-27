import type { Metadata } from "next";
import localFont from "next/font/local";
import { SITE } from "@/lib/contenu";
import "./globals.css";

const sora = localFont({
  src: "./fonts/Sora.ttf",
  variable: "--font-sora",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Web Online Concept, studio de développement web et IA",
    template: "%s | Web Online Concept",
  },
  description: SITE.sousTitre,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE.nom,
  },
  appleWebApp: { title: SITE.nom },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" className={`${sora.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
