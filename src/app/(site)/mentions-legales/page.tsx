import type { Metadata } from "next";
import { metaPage } from "@/lib/seo";
import { Conteneur, EnTetePage } from "@/components/site/Blocs";
import { LEGAL } from "@/lib/contenu";

export const metadata: Metadata = metaPage("Mentions légales", "Mentions légales du site web-online-concept.com : éditeur, hébergeur, propriété intellectuelle.", "/mentions-legales");

export default function MentionsLegales() {
  return (
    <>
      <EnTetePage titre="Mentions légales" />
      <section className="bg-white py-14 sm:py-16">
        <Conteneur className="max-w-3xl">
          <div className="prose-woc">
            <h2>Éditeur du site</h2>
            <p>
              <strong>{LEGAL.editeur}</strong>, exerçant sous le nom commercial {LEGAL.nomCommercial}
              <br />
              Entrepreneur individuel immatriculé au Registre national des entreprises
              <br />
              SIREN : {LEGAL.siren}, SIRET : {LEGAL.siret}
              <br />
              Adresse : {LEGAL.adresse}
              <br />
              Téléphone : {LEGAL.telephone}
              <br />
              E-mail : <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
              <br />
              TVA non applicable, article 293 B du CGI
            </p>
            <p>Directeur de la publication : {LEGAL.directeur}</p>

            <h2>Hébergeur</h2>
            <p>
              {LEGAL.hebergeur.nom}
              <br />
              {LEGAL.hebergeur.adresse}
              <br />
              Contact : <a href={`mailto:${LEGAL.hebergeur.contact}`}>{LEGAL.hebergeur.contact}</a>
              <br />
              Site : <a href={LEGAL.hebergeur.site}>vercel.com</a>
            </p>

            <h2>Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble du site (textes, logo, identité visuelle, code, illustrations) est la propriété de Web Online
              Concept. Toute reproduction, totale ou partielle, sans autorisation écrite préalable est interdite. Les
              réalisations présentées le sont avec l&apos;accord des clients concernés. La police Sora est utilisée sous
              licence SIL Open Font License.
            </p>

            <h2>Données personnelles</h2>
            <p>
              Le traitement des données transmises via le formulaire de contact est décrit dans la{" "}
              <a href="/confidentialite">politique de confidentialité</a>.
            </p>
          </div>
        </Conteneur>
      </section>
    </>
  );
}
