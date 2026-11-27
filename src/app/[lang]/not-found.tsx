import Link from "next/link";
import { chemin } from "@/lib/i18n/chemins";
import { langue, t } from "@/lib/i18n/langue";

// Page introuvable à l'intérieur du site (réalisation ou article inexistant), dans la langue de l'adresse
export default async function PageIntrouvable() {
  const l = await langue();
  const x = t(
    {
      fr: { erreur: "Erreur 404", titre: "Cette page n'existe pas ou a été déplacée.", lien: "Revenir à l'accueil" },
      en: { erreur: "Error 404", titre: "This page doesn't exist or has moved.", lien: "Back to the home page" },
      es: { erreur: "Error 404", titre: "Esta página no existe o se ha movido.", lien: "Volver al inicio" },
    },
    l,
  );
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 bg-nuit px-6 py-32 text-center text-white">
      <p className="text-sm text-[#B8C6D6]">{x.erreur}</p>
      <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold">{x.titre}</h1>
      <Link href={chemin(l)} className="rounded-full bg-bleu px-6 py-3 font-medium hover:bg-[#3A72FF]">
        {x.lien}
      </Link>
    </section>
  );
}
