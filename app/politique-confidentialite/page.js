import { Metadata } from 'next'

export const metadata = {
  title: 'Politique de Confidentialité - Web Online Concept',
  description: 'Politique de confidentialité et protection des données personnelles de Web Online Concept. RGPD, cookies, droits des utilisateurs.',
  keywords: 'politique confidentialité, protection données personnelles, rgpd, web online concept, cookies, données personnelles',
  openGraph: {
    title: 'Politique de Confidentialité - Web Online Concept',
    description: 'Politique de confidentialité et protection des données personnelles. Conforme RGPD.',
    url: 'https://www.webonlineconcept.com/politique-confidentialite',
    siteName: 'Web Online Concept',
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.webonlineconcept.com/politique-confidentialite',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PolitiqueConfidentialite() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Politique de Confidentialité',
    description: 'Politique de confidentialité de Web Online Concept',
    url: 'https://www.webonlineconcept.com/politique-confidentialite',
    publisher: {
      '@type': 'Organization',
      name: 'Web Online Concept',
      legalName: 'Auto-Entreprise Web Online Concept',
      email: 'web.online.concept@gmail.com'
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de Confidentialité</h1>
            <p className="text-gray-600">Dernière mise à jour : Août 2025</p>
          </div>

          {/* Contenu */}
          <div className="space-y-8">
            {/* Préambule */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Préambule</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  La protection de vos données personnelles est une priorité pour Web Online Concept. 
                  Cette politique de confidentialité explique comment nous collectons, utilisons, 
                  stockons et protégeons vos informations personnelles.
                </p>
                <p>
                  En utilisant notre site web et nos services, vous acceptez les pratiques décrites 
                  dans cette politique de confidentialité.
                </p>
              </div>
            </section>

            {/* Responsable du traitement */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Responsable du traitement</h2>
              <div className="space-y-3 text-gray-700">
                <p>Le responsable du traitement des données personnelles est :</p>
                <div className="ml-4">
                  <p><strong>Web Online Concept</strong></p>
                  <p>Auto-entreprise - SIRET : 510 583 800 00048</p>
                  <p>Rue Paul Estival, 31200 Toulouse</p>
                  <p>Email : web.online.concept@gmail.com</p>
                </div>
              </div>
            </section>

            {/* Données collectées */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Données collectées</h2>
              <div className="space-y-3 text-gray-700">
                <h3 className="font-semibold text-gray-800 mt-4 mb-2">2.1 Types de données</h3>
                <p>Nous collectons les données suivantes :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Données d'identification</strong> : nom, prénom, raison sociale</li>
                  <li><strong>Données de contact</strong> : email, téléphone, adresse postale</li>
                  <li><strong>Données professionnelles</strong> : nom d'entreprise, site web actuel</li>
                  <li><strong>Données de navigation</strong> : adresse IP, type de navigateur, pages visitées</li>
                  <li><strong>Données de communication</strong> : messages échangés, demandes de devis</li>
                </ul>

                <h3 className="font-semibold text-gray-800 mt-4 mb-2">2.2 Méthodes de collecte</h3>
                <p>Les données sont collectées via :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Les formulaires de contact et de demande de devis</li>
                  <li>Les échanges par email</li>
                  <li>Les cookies et technologies similaires</li>
                  <li>Les interactions avec notre site web</li>
                </ul>
              </div>
            </section>

            {/* Finalités du traitement */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Finalités du traitement</h2>
              <div className="space-y-3 text-gray-700">
                <p>Vos données personnelles sont utilisées pour :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Répondre à vos demandes de contact et de devis</li>
                  <li>Établir et gérer la relation contractuelle</li>
                  <li>Fournir les services demandés</li>
                  <li>Assurer le suivi client et le support technique</li>
                  <li>Envoyer des informations relatives à votre projet</li>
                  <li>Respecter nos obligations légales et comptables</li>
                  <li>Améliorer nos services et notre site web</li>
                </ul>
              </div>
            </section>

            {/* Base légale */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base légale du traitement</h2>
              <div className="space-y-3 text-gray-700">
                <p>Le traitement de vos données personnelles est fondé sur :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Le contrat</strong> : pour l'exécution des prestations</li>
                  <li><strong>Le consentement</strong> : pour l'envoi de communications commerciales</li>
                  <li><strong>L'intérêt légitime</strong> : pour l'amélioration de nos services</li>
                  <li><strong>L'obligation légale</strong> : pour la conservation des documents comptables</li>
                </ul>
              </div>
            </section>

            {/* Durée de conservation */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Durée de conservation</h2>
              <div className="space-y-3 text-gray-700">
                <p>Les données sont conservées selon les durées suivantes :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Données clients</strong> : pendant toute la durée de la relation commerciale + 5 ans</li>
                  <li><strong>Données prospects</strong> : 3 ans après le dernier contact</li>
                  <li><strong>Documents comptables</strong> : 10 ans (obligation légale)</li>
                  <li><strong>Données de navigation</strong> : 13 mois maximum</li>
                </ul>
              </div>
            </section>

            {/* Destinataires */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Destinataires des données</h2>
              <div className="space-y-3 text-gray-700">
                <p>Vos données peuvent être transmises à :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Nos prestataires techniques</strong> : hébergement (Vercel), base de données (Neon)</li>
                  <li><strong>Services de communication</strong> : pour l'envoi d'emails</li>
                  <li><strong>Autorités compétentes</strong> : sur demande légale uniquement</li>
                </ul>
                <p className="mt-4">
                  Nous ne vendons, ne louons ni ne partageons vos données personnelles avec des 
                  tiers à des fins commerciales.
                </p>
              </div>
            </section>

            {/* Sécurité */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Sécurité des données</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
                  pour protéger vos données contre tout accès non autorisé, modification, 
                  divulgation ou destruction :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Chiffrement des données sensibles</li>
                  <li>Accès restreint aux données personnelles</li>
                  <li>Protocole HTTPS pour toutes les transmissions</li>
                  <li>Sauvegardes régulières</li>
                  <li>Mise à jour régulière des systèmes de sécurité</li>
                </ul>
              </div>
            </section>

            {/* Cookies */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies et technologies similaires</h2>
              <div className="space-y-3 text-gray-700">
                <h3 className="font-semibold text-gray-800 mt-4 mb-2">8.1 Qu'est-ce qu'un cookie ?</h3>
                <p>
                  Un cookie est un petit fichier texte déposé sur votre appareil lors de votre 
                  visite sur notre site. Les cookies nous permettent de reconnaître votre 
                  navigateur et d'améliorer votre expérience.
                </p>

                <h3 className="font-semibold text-gray-800 mt-4 mb-2">8.2 Types de cookies utilisés</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Cookies essentiels</strong> : nécessaires au fonctionnement du site</li>
                  <li><strong>Cookies analytiques</strong> : pour comprendre l'utilisation du site</li>
                </ul>

                <h3 className="font-semibold text-gray-800 mt-4 mb-2">8.3 Gestion des cookies</h3>
                <p>
                  Vous pouvez configurer votre navigateur pour refuser les cookies. Cependant, 
                  cela peut affecter votre expérience d'utilisation du site.
                </p>
              </div>
            </section>

            {/* Droits des utilisateurs */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Vos droits</h2>
              <div className="space-y-3 text-gray-700">
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Droit d'accès</strong> : obtenir la confirmation que vos données sont traitées et en recevoir une copie</li>
                  <li><strong>Droit de rectification</strong> : corriger vos données inexactes ou incomplètes</li>
                  <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
                  <li><strong>Droit à la limitation</strong> : limiter le traitement de vos données</li>
                  <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
                  <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
                  <li><strong>Droit de retirer votre consentement</strong> : à tout moment</li>
                </ul>
                <p className="mt-4">
                  Pour exercer ces droits, contactez-nous à : web.online.concept@gmail.com
                </p>
              </div>
            </section>

            {/* Modifications */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modifications de la politique</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Nous nous réservons le droit de modifier cette politique de confidentialité à 
                  tout moment. Les modifications entrent en vigueur dès leur publication sur le 
                  site. Nous vous encourageons à consulter régulièrement cette page.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact</h2>
              <div className="space-y-3 text-gray-700">
                <p>Pour toute question concernant cette politique ou vos données personnelles :</p>
                <div className="ml-4">
                  <p><strong>Email :</strong> web.online.concept@gmail.com</p>
                  <p><strong>Adresse :</strong> Web Online Concept, Rue Paul Estival, 31200 Toulouse</p>
                </div>
                <p className="mt-4">
                  Vous pouvez également déposer une réclamation auprès de la CNIL : 
                  <a href="https://www.cnil.fr" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer"> www.cnil.fr</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}