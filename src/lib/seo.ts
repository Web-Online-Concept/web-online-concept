import type { Metadata } from "next";
import { SITE } from "@/lib/contenu";
import { chemin, LANGUES, LOCALES, LOCALES_OG, type Langue, type Page } from "@/lib/i18n/chemins";

// Adresses d'une même page dans chaque langue (balises hreflang), x-default = français
export type Versions = Record<Langue, string>;

export function versions(page?: Page, suite?: string | Record<Langue, string>): Versions {
  return Object.fromEntries(
    LANGUES.map((l) => [l, chemin(l, page, typeof suite === "string" ? suite : suite?.[l])]),
  ) as Versions;
}

export function alternatesLangues(v: Versions) {
  return { ...Object.fromEntries(LANGUES.map((l) => [LOCALES[l], v[l]])), "x-default": v.fr };
}

// Métadonnées d'une page : titre, description, adresse canonique, versions linguistiques et aperçu de partage
export function metaPage(l: Langue, titre: string, description: string, v: Versions): Metadata {
  const adresse = v[l];
  return {
    title: titre,
    description,
    alternates: { canonical: adresse, languages: alternatesLangues(v) },
    openGraph: {
      type: "website",
      locale: LOCALES_OG[l],
      alternateLocale: LANGUES.filter((x) => x !== l).map((x) => LOCALES_OG[x]),
      siteName: SITE.nom,
      title: `${titre} | ${SITE.nom}`,
      description,
      url: adresse,
      images: [IMAGE_PARTAGE],
    },
    twitter: { card: "summary_large_image", title: `${titre} | ${SITE.nom}`, description, images: [IMAGE_PARTAGE.url] },
  };
}

// Image de partage par défaut (1200 × 630)
export const IMAGE_PARTAGE = { url: "/opengraph-image.png", width: 1200, height: 630, alt: "Web Online Concept" };

// Identifiant de l'entreprise dans les données structurées (référencé par toutes les pages)
export const ID_ENTREPRISE = `${SITE.url}/#entreprise`;

export function jsonLd(donnees: object) {
  return { __html: JSON.stringify(donnees).replace(/</g, "\\u003c") };
}
