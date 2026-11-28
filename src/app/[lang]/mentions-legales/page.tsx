import type { Metadata } from "next";
import Link from "next/link";
import { metaPage, versions } from "@/lib/seo";
import { Conteneur, EnTetePage } from "@/components/site/Blocs";
import { LEGAL } from "@/lib/contenu";
import { chemin } from "@/lib/i18n/chemins";
import { langue, t } from "@/lib/i18n/langue";

const TEXTES = {
  fr: {
    titre: "Mentions légales",
    description: "Mentions légales du site web-online-concept.com : éditeur, hébergeur, propriété intellectuelle.",
    fait: null as string | null,
    editeur: "Éditeur du site",
    nomCommercial: "exerçant sous le nom commercial",
    statut: "Entrepreneur individuel immatriculé au Registre national des entreprises",
    adresse: "Adresse",
    telephone: "Téléphone",
    email: "E-mail",
    tva: "TVA non applicable, article 293 B du CGI",
    directeur: "Directeur de la publication",
    hebergeur: "Hébergeur",
    contact: "Contact",
    site: "Site",
    pi: "Propriété intellectuelle",
    piTexte:
      "L'ensemble du site (textes, logo, identité visuelle, code, illustrations) est la propriété de Web Online Concept. Toute reproduction, totale ou partielle, sans autorisation écrite préalable est interdite. Les réalisations présentées le sont avec l'accord des clients concernés. La police Sora est utilisée sous licence SIL Open Font License.",
    donnees: "Données personnelles",
    donneesTexte: "Le traitement des données transmises via le formulaire de contact est décrit dans la",
    politique: "politique de confidentialité",
  },
  en: {
    titre: "Legal notice",
    description: "Legal notice for the web-online-concept.com website: publisher, host, intellectual property.",
    fait: "This English translation is provided for convenience; the French version is the legally binding one.",
    editeur: "Website publisher",
    nomCommercial: "trading as",
    statut: "Sole proprietorship registered with the French National Business Register (RNE)",
    adresse: "Address",
    telephone: "Phone",
    email: "Email",
    tva: "VAT not applicable, article 293 B of the French General Tax Code",
    directeur: "Publication director",
    hebergeur: "Hosting provider",
    contact: "Contact",
    site: "Website",
    pi: "Intellectual property",
    piTexte:
      "The entire website (text, logo, visual identity, code, illustrations) is the property of Web Online Concept. Any reproduction, in whole or in part, without prior written permission is prohibited. The projects shown are presented with the consent of the clients concerned. The Sora typeface is used under the SIL Open Font License.",
    donnees: "Personal data",
    donneesTexte: "The processing of data submitted through the contact form is described in the",
    politique: "privacy policy",
  },
  es: {
    titre: "Aviso legal",
    description: "Aviso legal del sitio web-online-concept.com: editor, alojamiento, propiedad intelectual.",
    fait: "Esta traducción al español se ofrece a título informativo; la versión francesa es la única jurídicamente vinculante.",
    editeur: "Editor del sitio",
    nomCommercial: "con el nombre comercial",
    statut: "Empresario individual inscrito en el Registro Nacional de Empresas de Francia (RNE)",
    adresse: "Dirección",
    telephone: "Teléfono",
    email: "Correo electrónico",
    tva: "IVA no aplicable, artículo 293 B del Código General de Impuestos francés",
    directeur: "Director de la publicación",
    hebergeur: "Alojamiento",
    contact: "Contacto",
    site: "Sitio",
    pi: "Propiedad intelectual",
    piTexte:
      "Todo el sitio (textos, logotipo, identidad visual, código, ilustraciones) es propiedad de Web Online Concept. Queda prohibida cualquier reproducción, total o parcial, sin autorización previa por escrito. Los proyectos presentados se muestran con el acuerdo de los clientes correspondientes. La tipografía Sora se utiliza bajo la licencia SIL Open Font License.",
    donnees: "Datos personales",
    donneesTexte: "El tratamiento de los datos enviados mediante el formulario de contacto se describe en la",
    politique: "política de privacidad",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const l = await langue();
  const x = t(TEXTES, l);
  return metaPage(l, x.titre, x.description, versions("mentions-legales"));
}

export default async function MentionsLegales() {
  const l = await langue();
  const x = t(TEXTES, l);
  // Deux-points : précédé d'une espace en français seulement
  const d = l === "fr" ? "\u00a0:" : ":";
  return (
    <>
      <EnTetePage titre={x.titre} />
      <section className="bg-white py-14 sm:py-16">
        <Conteneur className="max-w-3xl">
          <div className="prose-woc">
            {x.fait && (
              <p>
                <em>{x.fait}</em> <Link href={chemin("fr", "mentions-legales")} hrefLang="fr" lang="fr">Version française</Link>
              </p>
            )}
            <h2>{x.editeur}</h2>
            <p>
              <strong>{LEGAL.editeur}</strong>, {x.nomCommercial} {LEGAL.nomCommercial}
              <br />
              {x.statut}
              <br />
              SIREN{d} {LEGAL.siren}, SIRET{d} {LEGAL.siret}
              <br />
              {x.adresse}{d} {LEGAL.adresse}
              <br />
              {x.telephone}{d} {LEGAL.telephone}
              <br />
              {x.email}{d} <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
              <br />
              {x.tva}
            </p>
            <p>
              {x.directeur}{d} {LEGAL.directeur}
            </p>

            <h2>{x.hebergeur}</h2>
            <p>
              {LEGAL.hebergeur.nom}
              <br />
              {LEGAL.hebergeur.adresse}
              <br />
              {x.contact}{d} <a href={`mailto:${LEGAL.hebergeur.contact}`}>{LEGAL.hebergeur.contact}</a>
              <br />
              {x.site}{d} <a href={LEGAL.hebergeur.site}>vercel.com</a>
            </p>

            <h2>{x.pi}</h2>
            <p>{x.piTexte}</p>

            <h2>{x.donnees}</h2>
            <p>
              {x.donneesTexte} <Link href={chemin(l, "confidentialite")}>{x.politique}</Link>.
            </p>
          </div>
        </Conteneur>
      </section>
    </>
  );
}
