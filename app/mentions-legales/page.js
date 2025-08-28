import { Metadata } from 'next'

export const metadata = {
  title: 'Mentions Légales - Web Online Concept',
  description: 'Mentions légales de Web Online Concept. Informations légales, éditeur, hébergement, propriété intellectuelle et protection des données.',
  keywords: 'mentions légales, web online concept, informations légales, rgpd, propriété intellectuelle',
  openGraph: {
    title: 'Mentions Légales - Web Online Concept',
    description: 'Mentions légales de Web Online Concept. Informations légales et protection des données.',
    url: 'https://www.webonlineconcept.com/mentions-legales',
    siteName: 'Web Online Concept',
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.webonlineconcept.com/mentions-legales',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function MentionsLegales() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Mentions Légales',
    description: 'Mentions légales de Web Online Concept',
    url: 'https://www.webonlineconcept.com/mentions-legales',
    publisher: {
      '@type': 'Organization',
      name: 'Web Online Concept',
      legalName: 'Auto-Entreprise Web Online Concept',
      email: 'web.online.concept@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Rue Paul Estival',
        addressLocality: 'Toulouse',
        postalCode: '31200',
        addressCountry: 'FR'
      },
      identifier: '510 583 800 00048'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentions Légales</h1>
            <p className="text-gray-600">Dernière mise à jour : Août 2025</p>
          </div>

          {/* Contenu */}
          <div className="space-y-8">
            {/* Éditeur du site */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Éditeur du site</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>Raison sociale :</strong> Auto-Entreprise Web Online Concept</p>
                <p><strong>Forme juridique :</strong> Auto-entrepreneur</p>
                <p><strong>Siège social :</strong> Rue Paul Estival, 31200 Toulouse</p>
                <p><strong>SIRET :</strong> 510 583 800 00048</p>
                <p><strong>Directeur de publication :</strong> Mr Regnault</p>
                <p><strong>Email :</strong> web.online.concept@gmail.com</p>
              </div>
            </section>

            {/* Hébergement */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hébergement</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Infrastructure technique</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Hébergeur principal :</strong> Vercel Inc.</p>
                    <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
                    <p><strong>Site web :</strong> <a href="https://vercel.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">vercel.com</a></p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Code source</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Plateforme :</strong> GitHub, Inc.</p>
                    <p><strong>Adresse :</strong> 88 Colin P Kelly Jr Street, San Francisco, CA 94107, USA</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Base de données</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Fournisseur :</strong> Neon Inc.</p>
                    <p><strong>Type :</strong> PostgreSQL serverless</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Nom de domaine</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Registrar :</strong> GoDaddy Operating Company, LLC</p>
                    <p><strong>Adresse :</strong> 14455 N. Hayden Road, Scottsdale, AZ 85260, USA</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  L'ensemble du contenu de ce site (structure, textes, logos, images, vidéos, etc.) 
                  est la propriété exclusive de Web Online Concept, sauf mention contraire explicite.
                </p>
                <p>
                  Toute reproduction, représentation, modification, publication, adaptation totale ou 
                  partielle des éléments du site, quel que soit le moyen ou le procédé utilisé, est 
                  interdite sans autorisation écrite préalable de Web Online Concept.
                </p>
                <p>
                  Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il 
                  contient sera considérée comme constitutive d'une contrefaçon et poursuivie 
                  conformément aux dispositions des articles L.335-2 et suivants du Code de la 
                  Propriété Intellectuelle.
                </p>
              </div>
            </section>

            {/* Protection des données */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Protection des données personnelles</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD) et à la 
                  loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, 
                  vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition 
                  aux données personnelles vous concernant.
                </p>
                <p>
                  Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante : 
                  web.online.concept@gmail.com
                </p>
                <p>
                  Pour plus d'informations sur la gestion de vos données personnelles, consultez 
                  notre <a href="/politique-confidentialite" className="text-blue-600 hover:underline">Politique de confidentialité</a>.
                </p>
              </div>
            </section>

            {/* Responsabilité */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation de responsabilité</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Les informations contenues sur ce site sont aussi précises que possible et sont 
                  sujettes à modifications sans préavis. Cependant, Web Online Concept ne peut 
                  garantir l'exactitude, la précision ou l'exhaustivité des informations mises à 
                  disposition sur ce site.
                </p>
                <p>
                  Web Online Concept ne pourra être tenue responsable des dommages directs et 
                  indirects causés au matériel de l'utilisateur lors de l'accès au site, résultant 
                  soit de l'utilisation d'un matériel ne répondant pas aux spécifications requises, 
                  soit de l'apparition d'un bug ou d'une incompatibilité.
                </p>
                <p>
                  Des liens hypertextes peuvent renvoyer vers d'autres sites internet. Web Online 
                  Concept décline toute responsabilité dans le cas où le contenu de ces sites 
                  contreviendrait aux dispositions légales et réglementaires en vigueur.
                </p>
              </div>
            </section>

            {/* Droit applicable */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Droit applicable et juridiction compétente</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Les présentes mentions légales sont régies par le droit français. En cas de litige, 
                  et après échec de toute tentative de règlement amiable, les tribunaux français 
                  seront seuls compétents.
                </p>
                <p>
                  Pour toute réclamation, vous pouvez nous contacter à l'adresse email : 
                  web.online.concept@gmail.com ou par courrier postal à l'adresse du siège social.
                </p>
              </div>
            </section>

            {/* Crédits */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Crédits</h2>
              <div className="space-y-3 text-gray-700">
                <p><strong>Conception et développement :</strong> Web Online Concept</p>
                <p><strong>Technologies utilisées :</strong> Next.js, React, Tailwind CSS</p>
                <p><strong>Icônes :</strong> Heroicons, Lucide Icons</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}