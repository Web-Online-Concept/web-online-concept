import type { Metadata } from "next";
import { sora } from "./police";
import "./globals.css";

// Page 404 des adresses qui ne correspondent à aucune page (français, anglais ou espagnol selon l'adresse)
export const metadata: Metadata = { title: "404 | Web Online Concept" };

const TEXTES = {
  fr: { erreur: "Erreur 404", titre: "Cette page n'existe pas ou a été déplacée.", lien: "Revenir à l'accueil", href: "/" },
  en: { erreur: "Error 404", titre: "This page doesn't exist or has moved.", lien: "Back to the home page", href: "/en" },
  es: { erreur: "Error 404", titre: "Esta página no existe o se ha movido.", lien: "Volver al inicio", href: "/es" },
};

// Choisit la langue d'après le début de l'adresse, avant l'affichage
const SCRIPT = `(function(){var m=location.pathname.match(/^\\/(en|es)(\\/|$)/);var l=m?m[1]:"fr";var d=document.documentElement;d.lang=l;d.dataset.l=l})()`;

export default function PageIntrouvableGlobale() {
  return (
    <html lang="fr" data-l="fr" className={`${sora.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
        <style>{`[data-texte]{display:none}${Object.keys(TEXTES)
          .map((l) => `html[data-l="${l}"] [data-texte="${l}"]`)
          .join(",")}{display:flex}`}</style>
        <main className="flex flex-1 bg-nuit text-white">
          {Object.entries(TEXTES).map(([l, x]) => (
            <div key={l} data-texte={l} lang={l} className="flex-1 flex-col items-center justify-center gap-6 px-6 py-32 text-center">
              <p className="text-sm text-[#B8C6D6]">{x.erreur}</p>
              <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold">{x.titre}</h1>
              <a href={x.href} className="rounded-full bg-bleu px-6 py-3 font-medium hover:bg-[#3A72FF]">
                {x.lien}
              </a>
            </div>
          ))}
        </main>
      </body>
    </html>
  );
}
