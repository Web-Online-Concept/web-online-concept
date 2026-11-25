import type { Metadata } from "next";
import { AppelFinal, Conteneur, EnTetePage } from "@/components/site/Blocs";
import { MANIFESTE, METHODE } from "@/lib/contenu";

export const metadata: Metadata = {
  title: "Méthode",
  description: "Une méthode augmentée par l'IA : cadrer vite, produire plus, tout vérifier, faire évoluer.",
};

export default function Methode() {
  return (
    <>
      <EnTetePage
        illustration="methode"
        titre="Une méthode augmentée par l'IA"
        intro="L'expertise technique fixe le cap, l'IA démultiplie la production. Résultat : des projets ambitieux, livrés vite, sans compromis sur la qualité."
      />
      <section className="bg-white py-16 sm:py-20">
        <Conteneur>
          <ol className="flex flex-col">
            {METHODE.map((e, i) => (
              <li
                key={e.titre}
                className="grid gap-4 border-t border-[#DCE3EC] py-10 first:border-t-2 first:border-t-nuit md:grid-cols-[10rem_1fr]"
              >
                <span className="text-[clamp(2.4rem,4vw,3.2rem)] font-semibold leading-none text-bleu">{i + 1}</span>
                <div>
                  <h2 className="text-2xl font-semibold text-nuit">{e.titre}</h2>
                  <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-[#2C4558]">{e.texte}</p>
                </div>
              </li>
            ))}
          </ol>
        </Conteneur>
      </section>
      <section className="bg-ciel py-16 sm:py-20">
        <Conteneur className="max-w-4xl">
          <p className="text-xl leading-relaxed text-[#4A6178]">{MANIFESTE[0]}</p>
          <p className="mt-4 text-xl leading-relaxed text-[#2C4558]">{MANIFESTE[1]}</p>
          <p className="mt-6 text-[clamp(1.4rem,2.6vw,2rem)] font-semibold leading-snug text-nuit">{MANIFESTE[2]}</p>
        </Conteneur>
      </section>
      <AppelFinal />
    </>
  );
}
