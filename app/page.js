import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Création de Sites Web Professionnels à 500€ - Web Online Concept',
  description: 'Créez votre site web professionnel à partir de 500€ HT. Design moderne, SEO inclus, hébergement offert 1 an. Devis gratuit sous 24h.',
  keywords: 'création site web, site internet pas cher, site web 500 euros, création site professionnel, site vitrine, agence web, web online concept',
  openGraph: {
    title: 'Création de Sites Web Professionnels à 500€ - Web Online Concept',
    description: 'Créez votre site web professionnel à partir de 500€ HT. Design moderne, SEO inclus, hébergement offert 1 an.',
    url: 'https://www.webonlineconcept.com',
    siteName: 'Web Online Concept',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Web Online Concept - Création de sites web'
      }
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Création de Sites Web Professionnels à 500€',
    description: 'Créez votre site web professionnel à partir de 500€ HT. Design moderne, SEO inclus.',
    images: ['/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.webonlineconcept.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebDesignAgency',
    name: 'Web Online Concept',
    description: 'Agence de création de sites web professionnels à prix accessibles',
    url: 'https://www.webonlineconcept.com',
    logo: 'https://www.webonlineconcept.com/images/logo.png',
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
      addressRegion: 'Occitanie'
    },
    offers: {
      '@type': 'Offer',
      name: 'Site Web - Formule de Base',
      price: '500',
      priceCurrency: 'EUR',
      description: 'Site 5 pages avec design moderne, SEO de base et hébergement 1 an inclus'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <section className="pt-[100px] min-h-screen flex items-center relative overflow-hidden">
        {/* Vidéo de fond */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-label="Vidéo de présentation Web Online Concept"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
        
        {/* Contenu */}
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-white text-center max-w-3xl mx-auto">
            <div className="bg-[#00334d]/80 backdrop-blur-sm p-8 md:p-12 rounded-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'}}>
                <span className="block animate-slide-up">
                  Création de Sites Web
                </span>
                <span className="block text-yellow-300 animate-slide-up-delay-1" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)'}}>
                  à partir de 500€
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 animate-slide-up-delay-2" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'}}>
                Sites web professionnels pour TPE, PME et artisans.
                <br className="hidden md:block" />
                Design moderne, SEO inclus, hébergement offert 1 an.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay">
                <Link href="/demande-devis" className="bg-white text-[#0073a8] px-8 py-4 rounded-full font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg text-center whitespace-nowrap">
                  Obtenir un devis gratuit
                </Link>
                <Link href="#services" className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#0073a8] transition-all text-center whitespace-nowrap">
                  Découvrir nos services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50 scroll-mt-[100px]">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Création de Site Internet à Prix Fixe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une formule transparente : site web complet à 500€ HT, 
              puis ajoutez uniquement les options dont vous avez besoin
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Formule de Base */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-20 h-20 bg-[#0073a8] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Site Web 500€ HT</h3>
              <p className="text-gray-600 text-center mb-6">
                Tout ce qu&apos;il faut pour démarrer votre présence en ligne
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Site vitrine 5 pages personnalisé</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Design professionnel moderne</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>100% responsive mobile/tablette</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Référencement SEO de base inclus</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Hébergement & Domaine 1 an inclus</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <p className="text-3xl font-bold text-[#0073a8] group-hover:scale-110 transition-transform duration-300">500€</p>
                <p className="text-sm text-gray-500">Prix fixe transparent</p>
              </div>
            </div>

            {/* Options */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-20 h-20 bg-[#0073a8] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Options Sur Mesure</h3>
              <p className="text-gray-600 text-center mb-6">
                Personnalisez votre site selon vos besoins réels
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>Pages supplémentaires (25€/page)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>Blog / E-commerce / Réservation</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>Rédaction de contenu professionnelle</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>Pack référencement SEO avancé</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>Maintenance et mises à jour</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <p className="text-3xl font-bold text-[#0073a8] group-hover:scale-110 transition-transform duration-300">À la carte</p>
                <p className="text-sm text-gray-500">Payez uniquement ce dont vous avez besoin</p>
              </div>
            </div>

            {/* Résultat */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-20 h-20 bg-[#0073a8] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Votre Site Unique</h3>
              <p className="text-gray-600 text-center mb-6">
                Un site web professionnel adapté à votre budget et vos besoins
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#0073a8] mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Prix transparent et maîtrisé</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#0073a8] mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Livraison rapide sous 2-3 semaines</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#0073a8] mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Formation incluse à la prise en main</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#0073a8] mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Support technique 30 jours offert</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#0073a8] mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Site évolutif dans le temps</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <p className="text-3xl font-bold text-[#0073a8] group-hover:scale-110 transition-transform duration-300">100% Vous</p>
                <p className="text-sm text-gray-500">Un site qui vous ressemble</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link href="/infos-tarifs" className="inline-flex items-center bg-[#0073a8] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#006a87] transition-all transform hover:scale-105 shadow-lg">
              Voir tous les tarifs et options
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Agence Web : Une Équipe d'Experts à Votre Service
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Plus de 10 spécialistes freelance pour créer votre site web professionnel
            </p>
          </div>

          {/* Partie haute : Texte à gauche, Image à droite */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#0073a8] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Équipe de +10 experts du web</h3>
                  <p className="text-gray-600">Webmasters, designers, développeurs, experts SEO, chacun maîtrise son domaine à la perfection.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#0073a8] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Création de sites web sur mesure</h3>
                  <p className="text-gray-600">Sites vitrines, e-commerce, blogs, landing pages : nous créons tous types de sites internet.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#0073a8] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Un chef de projet dédié</h3>
                  <p className="text-gray-600">Un seul interlocuteur qui coordonne toute l'équipe pour simplifier la création de votre site.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#0073a8] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Réactivité et professionnalisme</h3>
                  <p className="text-gray-600">Réponse sous 24h, respect des délais, accompagnement personnalisé tout au long du projet.</p>
                </div>
              </div>
            </div>

            {/* Image à droite */}
            <div className="flex justify-center">
              <div className="border-4 border-[#0073a8] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/team-image.jpg"
                  alt="Équipe Web Online Concept - Agence création sites web"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Partie basse : Bloc bleu sur toute la largeur */}
          <div className="bg-gradient-to-br from-[#0073a8] to-[#006a87] rounded-2xl p-8 md:p-12 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">L'Alternative Idéale à une Agence Web Traditionnelle</h3>
              <p className="text-base leading-relaxed">
                Web Online Concept combine la flexibilité et les tarifs attractifs du freelance avec l'expertise complète d'une agence web. 
                Nous permettons à toute entreprise, TPE, PME ou artisan, d'avoir un site web professionnel 
                sans se ruiner. Création de sites internet à prix fixe, transparence totale, résultats garantis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section */}
      <section className="py-20 bg-gray-100">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Référencement SEO Inclus dans Chaque Site
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Votre site web optimisé pour Google dès sa création, avec possibilité d'amélioration SEO avancée
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image à gauche */}
            <div className="flex justify-center order-2 md:order-1">
              <div className="border-4 border-[#0073a8] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/seo-google.jpg"
                  alt="Référencement SEO Google - Optimisation site web"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Texte à droite */}
            <div className="space-y-6 order-1 md:order-2">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#0073a8] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">SEO de base inclus dans la formule 500€</h3>
                  <p className="text-gray-600">Balises meta, structure optimisée, sitemap XML, robots.txt : les fondamentaux du référencement.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#0073a8] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Sites web rapides et optimisés</h3>
                  <p className="text-gray-600">Performance optimale, temps de chargement rapide, code propre : critères essentiels pour Google.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#0073a8] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Pack SEO avancé en option (400€)</h3>
                  <p className="text-gray-600">Audit complet, recherche mots-clés, optimisation contenu, netlinking, suivi positionnement.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#0073a8] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Référencement local pour artisans et PME</h3>
                  <p className="text-gray-600">Google My Business, citations locales, optimisation géographique pour attirer vos clients locaux.</p>
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-[#0073a8] to-[#006a87] rounded-xl p-6 text-white">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-10 h-10 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-bold">+127 sites web créés et référencés</p>
                    <p className="text-sm opacity-90">Expertise SEO reconnue depuis 2015</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Pourquoi Choisir Web Online Concept ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les avantages d'un site web professionnel créé par nos experts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Prix fixe transparent</h3>
              <p className="text-gray-600">Site complet à 500€ HT, pas de mauvaise surprise, devis détaillé gratuit</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Croissance garantie</h3>
              <p className="text-gray-600">Un site professionnel pour développer votre activité et attirer plus de clients</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Design moderne</h3>
              <p className="text-gray-600">Sites web au design actuel qui valorisent votre image professionnelle</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Support inclus</h3>
              <p className="text-gray-600">Formation 1h offerte + support technique 30 jours pour bien démarrer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0073a8] to-[#006a87]">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Créez Votre Site Web Professionnel Dès Aujourd'hui
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Devis gratuit personnalisé sous 24h. 
            Votre site en ligne sous 2-3 semaines. Prix fixe garanti.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/demande-devis" className="bg-white text-[#0073a8] px-8 py-4 rounded-full font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg">
              Demander un devis gratuit →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}