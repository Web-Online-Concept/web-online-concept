import type { Metadata } from "next";
import { SITE } from "@/lib/contenu";
import { sora } from "../police";
import "../globals.css";

// Mise en page racine de l'espace interne (back-office et devis clients), en français
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.nom, template: `%s | ${SITE.nom}` },
  robots: { index: false, follow: false },
};

export default function RacineInterne({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" className={`${sora.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
