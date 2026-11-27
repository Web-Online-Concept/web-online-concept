import { CONTENU_FR, type Contenu } from "@/lib/contenu";
import { CONTENU_EN } from "@/lib/contenu-en";
import { CONTENU_ES } from "@/lib/contenu-es";
import type { Langue } from "@/lib/i18n/chemins";
import { langue } from "@/lib/i18n/langue";

export const CONTENUS: Record<Langue, Contenu> = { fr: CONTENU_FR, en: CONTENU_EN, es: CONTENU_ES };

// Contenu éditorial de la langue de la page en cours
export async function contenu(): Promise<Contenu & { l: Langue }> {
  const l = await langue();
  return { ...CONTENUS[l], l };
}

export const projetsSurMesure = (c: Contenu) => c.REALISATIONS.filter((r) => r.categorie === "sur-mesure");
export const sitesClients = (c: Contenu) => c.REALISATIONS.filter((r) => r.categorie === "client");
export const realisationDe = (c: Contenu, slug: string) => c.REALISATIONS.find((r) => r.slug === slug);

// Écrans mobiles d'une réalisation (au plus trois), pour les éventails d'application
export const ecransDe = (c: Contenu, slug: string) =>
  (realisationDe(c, slug)?.visuels ?? []).filter((v) => v.format === "telephone").slice(0, 3);
