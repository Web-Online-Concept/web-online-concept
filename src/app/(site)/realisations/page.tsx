import type { Metadata } from "next";
import { AppelFinal, CarteRealisation, Conteneur, EnTetePage } from "@/components/site/Blocs";
import { REALISATIONS } from "@/lib/contenu";

export const metadata: Metadata = {
  title: "Réalisations",
  description: "Applications web et mobiles, galeries, sites avec réservation : les projets conçus et développés par Web Online Concept.",
};

export default function Realisations() {
  return (
    <>
      <EnTetePage
        illustration="realisations"
        titre="Réalisations"
        intro="Une application mobile dopée à l'IA, une galerie d'art, un site avec réservation en ligne : chaque projet part d'objectifs précis et va jusqu'à la mise en ligne."
      />
      <section className="bg-ciel py-16 sm:py-20">
        <Conteneur>
          <div className="grid gap-6 md:grid-cols-3">
            {REALISATIONS.map((r) => (
              <CarteRealisation key={r.slug} r={r} />
            ))}
          </div>
        </Conteneur>
      </section>
      <AppelFinal />
    </>
  );
}
