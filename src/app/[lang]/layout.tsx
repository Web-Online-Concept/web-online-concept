import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Entete from "@/components/site/Entete";
import PiedDePage from "@/components/site/PiedDePage";
import { BandeauLangue, LangueProvider } from "@/components/site/Langue";
import { CONTENUS } from "@/lib/i18n/contenu";
import { LANGUES, LOCALES_OG } from "@/lib/i18n/chemins";
import { langue, t } from "@/lib/i18n/langue";
import { SITE } from "@/lib/contenu";
import { IMAGE_PARTAGE } from "@/lib/seo";
import { sora } from "../police";
import "../globals.css";

// Mise en page racine du site public : une version par langue (/, /en, /es)
export function generateStaticParams() {
  return LANGUES.map((lang) => ({ lang }));
}

// Barres du navigateur mobile (adresse, état) dans le bleu nuit de l'en-tête.
// Safari 26 ignore theme-color : il reprend la couleur de l'en-tête collé en haut et celle du fond de page
export const viewport: Viewport = { themeColor: "#0A1A2F" };

export async function generateMetadata(): Promise<Metadata> {
  const l = await langue();
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: t(
        {
          fr: "Web Online Concept, studio de développement web et IA",
          en: "Web Online Concept, web development and AI studio",
          es: "Web Online Concept, estudio de desarrollo web e IA",
        },
        l,
      ),
      template: "%s | Web Online Concept",
    },
    description: CONTENUS[l].SITE.sousTitre,
    openGraph: { type: "website", locale: LOCALES_OG[l], siteName: SITE.nom, images: [IMAGE_PARTAGE] },
    appleWebApp: { title: SITE.nom },
  };
}

export default async function RacineSite({ children }: LayoutProps<"/[lang]">) {
  const l = await langue();
  return (
    // suppressHydrationWarning : le script d'avant affichage de l'accueil pose data-intro sur <html>
    <html lang={l} data-scroll-behavior="smooth" suppressHydrationWarning className={`${sora.variable} h-full antialiased`}>
      <body className="site flex min-h-full flex-col">
        <LangueProvider l={l}>
          <a
            href="#contenu"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-nuit"
          >
            {t({ fr: "Aller au contenu", en: "Skip to content", es: "Ir al contenido" }, l)}
          </a>
          <Entete navigation={CONTENUS[l].NAVIGATION} lienX={SITE.x} />
          <main id="contenu" className="flex-1 bg-white">
            {children}
          </main>
          <PiedDePage />
          <Suspense>
            <BandeauLangue />
          </Suspense>
        </LangueProvider>
      </body>
    </html>
  );
}
