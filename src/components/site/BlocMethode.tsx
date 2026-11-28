import Link from "next/link";
import { Conteneur } from "@/components/site/Blocs";
import { ANIMATIONS_METHODE } from "@/components/site/illustrations/Methode";
import SuiviEtapes from "@/components/site/SuiviEtapes";
import { contenu } from "@/lib/i18n/contenu";
import { chemin } from "@/lib/i18n/chemins";
import { t } from "@/lib/i18n/langue";

// Accueil : la méthode en quatre étapes sur fond sombre. Une ligne lumineuse relie les étapes et
// avance au fil du défilement ; chaque étape s'allume quand elle l'atteint et lance son animation.
const TEXTES = {
  fr: { titre: "Une méthode augmentée par l'IA", texte: "L'expertise fixe le cap, l'IA démultiplie la production.", lien: "La méthode en détail" },
  en: { titre: "A method augmented by AI", texte: "Expertise sets the course, AI multiplies the output.", lien: "The method in detail" },
  es: { titre: "Un método potenciado por la IA", texte: "La experiencia marca el rumbo, la IA multiplica la producción.", lien: "El método en detalle" },
};

export default async function BlocMethode() {
  const { l, METHODE } = await contenu();
  const x = t(TEXTES, l);
  return (
    <section className="ecran rendu-differe relative overflow-hidden bg-nuit py-20 text-white sm:py-28">
      <div aria-hidden="true" className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-bleu opacity-20 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-48 -right-40 h-[30rem] w-[30rem] rounded-full bg-vert opacity-[0.12] blur-3xl" />
      <Conteneur className="relative">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-semibold tracking-tight">{x.titre}</h2>
            <p className="mt-3 text-lg leading-relaxed text-[#B8C6D6]">{x.texte}</p>
          </div>
          <Link href={chemin(l, "methode")} className="font-medium text-[#7CCBFF] transition-colors hover:text-white">
            {x.lien}
          </Link>
        </div>

        <SuiviEtapes className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {METHODE.map((e, i) => {
            const Animation = ANIMATIONS_METHODE[i];
            return (
              <li
                key={e.titre}
                data-etape=""
                data-allume="1"
                // Téléphone et tablette : numéro à gauche du titre. Ordinateur : numéros sur une frise, titre dessous
                className="m-etape grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3.5 lg:flex lg:flex-col lg:items-stretch"
                style={{ "--remplissage": 1 } as React.CSSProperties}
              >
                <div className="m-visuel col-span-2 aspect-[4/3] overflow-hidden rounded-2xl bg-[#0F2340] shadow-[0_30px_60px_-34px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
                  {Animation && <Animation />}
                </div>
                <div className="relative mt-7 flex h-10 items-center">
                  {i < METHODE.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-5 top-1/2 hidden h-0.5 w-[calc(100%+1.5rem)] -translate-y-1/2 overflow-hidden rounded-full bg-white/12 lg:block"
                    >
                      <span className="m-rail-plein block h-full w-full bg-[linear-gradient(90deg,#1F5EFF,#00B4D8_60%,#2BD47D)] shadow-[0_0_12px_rgba(0,180,216,0.8)]" />
                    </span>
                  )}
                  <span className="m-repere relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[15px] font-semibold">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-7 text-lg font-semibold lg:mt-4">{e.titre}</h3>
                <p className="col-span-2 mt-3 text-[15px] leading-relaxed text-[#B8C6D6] lg:mt-2">{e.texte}</p>
              </li>
            );
          })}
        </SuiviEtapes>
      </Conteneur>
    </section>
  );
}
