import type { Metadata } from "next";
import { metaPage } from "@/lib/seo";
import { Conteneur, EnTetePage } from "@/components/site/Blocs";
import { LEGAL } from "@/lib/contenu";

export const metadata: Metadata = metaPage("Politique de confidentialité", "Comment Web Online Concept traite les données personnelles transmises par le formulaire de contact.", "/confidentialite");

export default function Confidentialite() {
  return (
    <>
      <EnTetePage titre="Politique de confidentialité" />
      <section className="bg-white py-14 sm:py-16">
        <Conteneur className="max-w-3xl">
          <div className="prose-woc">
            <h2>Responsable du traitement</h2>
            <p>
              {LEGAL.editeur} ({LEGAL.nomCommercial}), {LEGAL.adresse}. Contact :{" "}
              <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
            </p>

            <h2>Données collectées et finalité</h2>
            <p>
              Seules les informations saisies dans le formulaire de contact sont collectées : nom, adresse e-mail, objet et
              message. Elles servent uniquement à répondre à votre demande et à assurer le suivi de l&apos;échange. Le
              traitement repose sur l&apos;intérêt légitime à répondre aux messages reçus.
            </p>

            <h2>Durée de conservation</h2>
            <p>
              Les messages sont conservés trois ans après le dernier échange, puis supprimés. Les données de facturation des
              clients sont conservées dix ans, conformément aux obligations comptables.
            </p>

            <h2>Destinataires</h2>
            <p>
              Les données sont destinées à Web Online Concept uniquement. Elles ne sont ni vendues ni cédées. Elles sont
              traitées par les prestataires techniques suivants : Vercel (hébergement du site) et Supabase (base de données
              hébergée dans l&apos;Union européenne). Les transferts éventuels hors de l&apos;Union européenne sont encadrés par
              les garanties prévues par le RGPD.
            </p>

            <h2>Cookies</h2>
            <p>
              Ce site n&apos;utilise aucun cookie publicitaire ni de mesure d&apos;audience. Seul un cookie technique protège
              l&apos;accès à l&apos;espace d&apos;administration.
            </p>

            <h2>Vos droits</h2>
            <p>
              Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, d&apos;opposition, de limitation
              et de portabilité de vos données. Pour l&apos;exercer, écrivez à{" "}
              <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>. En cas de désaccord, vous pouvez adresser une réclamation
              à la CNIL (<a href="https://www.cnil.fr">cnil.fr</a>).
            </p>
          </div>
        </Conteneur>
      </section>
    </>
  );
}
