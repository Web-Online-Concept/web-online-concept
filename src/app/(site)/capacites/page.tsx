import type { Metadata } from "next";
import Link from "next/link";
import { AppelFinal, Conteneur, EnTetePage } from "@/components/site/Blocs";
import { PastilleIcone } from "@/components/site/Icones";
import { CAPACITES, realisation } from "@/lib/contenu";

export const metadata: Metadata = {
  title: "Capacités",
  description:
    "Sites sur mesure, applications web et mobiles, plateformes à abonnement, IA intégrée, référencement et visibilité IA, back-offices, refonte et suivi, performance et sécurité.",
};

export default function Capacites() {
  return (
    <>
      <EnTetePage
        illustration="capacites"
        titre="Tout ce qu'un projet web exige, réuni au même endroit"
        intro="Du site vitrine à la plateforme complète avec IA intégrée : un seul interlocuteur pour concevoir, développer, mettre en ligne et faire évoluer."
      />
      <section className="bg-white py-16 sm:py-20">
        <Conteneur>
          <ul className="grid gap-x-12 gap-y-12 md:grid-cols-2">
            {CAPACITES.map((c) => (
              <li key={c.titre} className="border-t border-[#DCE3EC] pt-7">
                <PastilleIcone nom={c.icone} />
                <h2 className="mt-5 text-2xl font-semibold text-nuit">{c.titre}</h2>
                <p className="mt-3 text-[17px] leading-relaxed text-[#2C4558]">{c.texte}</p>
                {c.exemples.length > 0 && (
                  <p className="mt-4 text-[15px] text-[#4A6178]">
                    Exemple :{" "}
                    {c.exemples.map((slug, i) => {
                      const r = realisation(slug);
                      if (!r) return null;
                      return (
                        <span key={slug}>
                          {i > 0 && ", "}
                          <Link href={`/realisations/${slug}`} className="font-medium text-bleu hover:underline">
                            {r.nom}
                          </Link>
                        </span>
                      );
                    })}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Conteneur>
      </section>
      <AppelFinal />
    </>
  );
}
