import type { Metadata } from "next";
import { AppelFinal, Conteneur, EnTetePage } from "@/components/site/Blocs";

export const metadata: Metadata = {
  title: "À propos",
  description: "Web Online Concept, studio de développement web à Toulouse depuis 2009.",
};

const ENGAGEMENTS = [
  {
    titre: "Un seul interlocuteur",
    texte: "De la première discussion à la mise en ligne, une seule personne connaît votre projet de bout en bout. Pas de relais, pas de perte d'information.",
  },
  {
    titre: "Les technologies de pointe",
    texte: "Next.js, TypeScript, Supabase, IA générative : des outils modernes, choisis pour leur solidité et leur capacité à évoluer avec vous.",
  },
  {
    titre: "Une qualité vérifiée",
    texte: "Chaque livraison est testée, relue et sécurisée. Aller vite ne veut jamais dire aller moins bien.",
  },
  {
    titre: "Votre autonomie",
    texte: "Des espaces d'administration pensés pour vous : vous faites vivre votre site ou votre application sans dépendre de personne.",
  },
];

export default function APropos() {
  return (
    <>
      <EnTetePage
        illustration="apropos"
        titre="Un studio de développement web à Toulouse, depuis 2009"
        intro="Plus de quinze ans à concevoir des sites et des applications, et aujourd'hui une façon de travailler transformée par l'IA : un interlocuteur unique, avec la capacité de production d'une équipe entière."
      />
      <section className="bg-white py-16 sm:py-20">
        <Conteneur className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <h2 className="text-[clamp(1.6rem,2.8vw,2.2rem)] font-semibold leading-tight text-nuit">
            Ce qui guide chaque projet
          </h2>
          <ul className="grid gap-10 sm:grid-cols-2">
            {ENGAGEMENTS.map((e) => (
              <li key={e.titre}>
                <h3 className="text-lg font-semibold text-nuit">{e.titre}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#2C4558]">{e.texte}</p>
              </li>
            ))}
          </ul>
        </Conteneur>
      </section>
      <AppelFinal />
    </>
  );
}
