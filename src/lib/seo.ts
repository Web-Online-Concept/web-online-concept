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
    },
  };
}

// Identifiant de l'entreprise dans les données structurées (référencé par toutes les pages)
export const ID_ENTREPRISE = `${SITE.url}/#entreprise`;

export function jsonLd(donnees: object) {
  return { __html: JSON.stringify(donnees).replace(/</g, "\\u003c") };
}
