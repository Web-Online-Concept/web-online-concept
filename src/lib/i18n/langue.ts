import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { estLangue, type Langue } from "@/lib/i18n/chemins";

// Langue de la page en cours (segment [lang] de src/app/[lang]), lisible depuis tout composant serveur
export async function langue(): Promise<Langue> {
  const l = await lang();
  if (!estLangue(l)) notFound();
  return l;
}

// Choisit le texte de la langue : t({ fr: "…", en: "…", es: "…" }, l)
export function t<T>(textes: Record<Langue, T>, l: Langue): T {
  return textes[l];
}
