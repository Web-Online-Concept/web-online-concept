import type { Metadata } from "next";
import { SITE } from "@/lib/contenu";

// Métadonnées d'une page : titre, description, adresse canonique et aperçu de partage
export function metaPage(titre: string, description: string, chemin: string): Metadata {
  return {
    title: titre,
    description,
    alternates: { canonical: chemin },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: SITE.nom,
      title: `${titre} | ${SITE.nom}`,
      description,
      url: chemin,
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
