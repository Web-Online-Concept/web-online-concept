"use client"

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>Web Online Concept - Le partenaire de votre communication digitale</title>
        <meta name="description" content="Web Online Concept, c'est une équipe complète de passionnés & Freelances qui se met au service de votre communication digitale. Sites web, applications mobiles, boutiques en ligne, réseaux sociaux et SEO." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {/* Hero Section */}
      <section className="pt-[100px] min-h-screen flex items-center relative overflow-hidden">
        {/* Vidéo de fond */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay pour estomper la vidéo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0073a8]/80 via-[#00b4d8]/70 to-[#006a87]/80" />
        
        {/* Contenu */}
        <div className="container max-w-7xl mx-auto px-4 py-16 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="block overflow-hidden">
                  <span 
                    className="block"
                    style={{
                      animation: 'slideInUp 0.8s ease-out forwards'
                    }}
                  >
                    Votre présence web
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span 
                    className="block text-yellow-300"
                    style={{
                      animation: 'slideInUp 0.8s ease-out 0.2s forwards',
                      opacity: 0
                    }}
                  >
                    commence ici
                  </span>
                </span>
              </h1>
              <div className="overflow-hidden">
                <p 
                  className="text-xl mb-8 opacity-90"
                  style={{
                    animation: 'slideInUp 0.8s ease-out 0.4s forwards',
                    opacity: 0
                  }}
                >
                  Création de sites web professionnels à prix accessibles. 
                  Une solution clé en main pour votre entreprise.
                </p>
              </div>
              <div 
                className="flex flex-wrap gap-4"
                style={{
                  animation: 'fadeIn 1s ease-out 0.6s forwards',
                  opacity: 0
                }}
              >
                <Link href="/devis" className="bg-white text-[#0073a8] px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg">
                  Obtenir un devis gratuit
                </Link>
                <Link href="#services" className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#0073a8] transition-all">
                  Découvrir nos services
                </Link>
              </div>
              
              {/* Texte animé bonus */}
              <div className="mt-12 flex items-center gap-4 opacity-80">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full border-2 border-white flex items-center justify-center text-sm font-bold">5★</div>
                </div>
                <p 
                  className="text-sm"
                  style={{
                    animation: 'fadeIn 1s ease-out 1s forwards',
                    opacity: 0
                  }}
                >
                  Plus de 100 sites créés • 100% de clients satisfaits
                </p>
              </div>
            </div>
            
            <div className="relative hidden md:block">
              <div 
                className="relative w-full h-[500px]"
                style={{
                  animation: 'fadeIn 1.5s ease-out 0.8s forwards',
                  opacity: 0
                }}
              >
                <Image
                  src="/images/hero-devices.png"
                  alt="Sites web responsive"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group hover:transform hover:scale-105 transition-all">
              <h3 className="text-4xl font-bold text-[#00b4d8] mb-2">+10</h3>
              <p className="text-gray-600">Spécialistes freelance</p>
            </div>
            <div className="group hover:transform hover:scale-105 transition-all">
              <h3 className="text-4xl font-bold text-[#00b4d8] mb-2">100%</h3>
              <p className="text-gray-600">Clients satisfaits</p>
            </div>
            <div className="group hover:transform hover:scale-105 transition-all">
              <h3 className="text-4xl font-bold text-[#00b4d8] mb-2">24/7</h3>
              <p className="text-gray-600">Support réactif</p>
            </div>
            <div className="group hover:transform hover:scale-105 transition-all">
              <h3 className="text-4xl font-bold text-[#00b4d8] mb-2">#1</h3>
              <p className="text-gray-600">Rapport qualité/prix</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Une gamme complète de solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pour répondre à toutes vos demandes et booster votre présence en ligne
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-[#00b4d8] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Sites vitrines</h3>
              <p className="text-gray-600 text-center mb-6">
                Votre site internet clé en main, responsive et optimisé pour convertir vos visiteurs en clients.
              </p>
              <Link href="/services/sites-vitrines" className="text-[#00b4d8] font-semibold hover:underline flex items-center justify-center">
                En savoir plus 
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-[#00b4d8] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Applications mobiles</h3>
              <p className="text-gray-600 text-center mb-6">
                Votre app mobile personnalisée disponible sur iOS et Android pour toucher vos clients partout.
              </p>
              <Link href="/services/applications-mobiles" className="text-[#00b4d8] font-semibold hover:underline flex items-center justify-center">
                En savoir plus 
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-[#00b4d8] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Boutiques en ligne</h3>
              <p className="text-gray-600 text-center mb-6">
                Votre boutique e-commerce sur mesure pour vendre vos produits 24h/24 et 7j/7.
              </p>
              <Link href="/services/boutiques-en-ligne" className="text-[#00b4d8] font-semibold hover:underline flex items-center justify-center">
                En savoir plus 
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Service 4 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-[#00b4d8] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Réseaux sociaux</h3>
              <p className="text-gray-600 text-center mb-6">
                Création et gestion de vos réseaux sociaux pour développer votre communauté.
              </p>
              <Link href="/services/reseaux-sociaux" className="text-[#00b4d8] font-semibold hover:underline flex items-center justify-center">
                En savoir plus 
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Service 5 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-[#00b4d8] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Référencement SEO</h3>
              <p className="text-gray-600 text-center mb-6">
                Spécialiste SEO pour vous positionner dans les premiers résultats Google.
              </p>
              <Link href="/services/referencement-seo" className="text-[#00b4d8] font-semibold hover:underline flex items-center justify-center">
                En savoir plus 
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Service 6 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-[#00b4d8] rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Cartes de visite digitales</h3>
              <p className="text-gray-600 text-center mb-6">
                Vos cartes de visite virtuelles modernes et interactives pour marquer les esprits.
              </p>
              <Link href="/services/cartes-visite-digitales" className="text-[#00b4d8] font-semibold hover:underline flex items-center justify-center">
                En savoir plus 
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Une team professionnelle à votre écoute
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pour tous types de projets, une équipe de spécialistes dédiée à votre réussite
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#00b4d8] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Une équipe composée de +10 spécialistes freelance</h3>
                  <p className="text-gray-600">Chaque expert maîtrise parfaitement son domaine pour vous garantir le meilleur résultat.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#00b4d8] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Tous les métiers du digital réunis</h3>
                  <p className="text-gray-600">Webmasters, Webdesigners, Développeurs, Spécialistes SEO, Marketing digital & Stratégique.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#00b4d8] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">1 interlocuteur unique dédié</h3>
                  <p className="text-gray-600">Un chef de projet dédié au suivi de votre projet de A à Z pour simplifier vos échanges.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#00b4d8] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Disponibilité, réactivité et professionnalisme</h3>
                  <p className="text-gray-600">Nous sommes là quand vous en avez besoin, avec une réponse rapide à toutes vos demandes.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#00b4d8] to-[#006a87] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Mieux qu&apos;une agence web classique</h3>
                <p className="mb-6">
                  WEB ONLINE CONCEPT, c&apos;est la flexibilité du freelance avec la puissance d&apos;une agence complète. 
                  Nous permettons à toute entreprise, peu importe sa taille, d&apos;optimiser au maximum sa communication 
                  digitale et sa présence sur le web.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">F</span>
                  </div>
                  <div>
                    <p className="font-bold text-lg">Florent</p>
                    <p className="opacity-90">Créateur de l&apos;agence Web Online Concept</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#00b4d8] to-[#006a87]">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à booster votre présence en ligne ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Demandez votre devis gratuit et sans engagement dès maintenant. 
            Notre équipe vous répondra sous 24h.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/devis" className="bg-white text-[#00b4d8] px-8 py-4 rounded-full font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg">
              Demander un devis gratuit
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#00b4d8] transition-all">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Tous nos clients satisfaits
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez pourquoi nos clients nous font confiance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Présence Google</h3>
              <p className="text-gray-600">Votre site présent dans les 1ers résultats de recherche sur Google</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Augmentation CA</h3>
              <p className="text-gray-600">Augmentation significative de vos ventes et de votre chiffre d&apos;affaire</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Visibilité accrue</h3>
              <p className="text-gray-600">Amélioration de votre visibilité et de votre image de marque</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Modifications faciles</h3>
              <p className="text-gray-600">Modifications des informations sur votre site/appli à tout moment</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}