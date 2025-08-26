"use client"

import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <>
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#0073a8]/90 via-[#00b4d8]/80 to-[#006a87]/90" />
        
        {/* Contenu */}
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-white text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="block animate-slide-up">
                Votre présence web
              </span>
              <span className="block text-yellow-300 animate-slide-up-delay-1">
                commence ici
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 animate-slide-up-delay-2">
              Création de sites web professionnels à prix accessibles.
              <br className="hidden md:block" />
              Une solution clé en main pour votre entreprise.
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
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50 scroll-mt-[100px]">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Votre site web à la carte
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un concept simple et transparent : une formule de base complète, 
              puis ajoutez uniquement les options dont vous avez besoin
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Formule de Base */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all">
              <div className="w-20 h-20 bg-[#0073a8] rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">La Formule de Base</h3>
              <p className="text-gray-600 text-center mb-6">
                Tout ce qu&apos;il faut pour démarrer votre présence en ligne
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Site 5 pages personnalisé</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Design professionnel adapté</span>
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
                  <span>SEO de base inclus</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Hébergement 1 an inclus</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <p className="text-3xl font-bold text-[#0073a8]">500€</p>
                <p className="text-sm text-gray-500">Prix fixe transparent</p>
              </div>
            </div>

            {/* Options */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all">
              <div className="w-20 h-20 bg-[#0073a8] rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Ajoutez vos Options</h3>
              <p className="text-gray-600 text-center mb-6">
                Personnalisez selon vos besoins réels
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>Pages supplémentaires</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>E-commerce / Boutique</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>Référencement SEO</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>Maintenance mensuelle</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <p className="text-3xl font-bold text-[#0073a8]">À la carte</p>
                <p className="text-sm text-gray-500">Payez uniquement ce dont vous avez besoin</p>
              </div>
            </div>

            {/* Résultat */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all">
              <div className="w-20 h-20 bg-[#0073a8] rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Votre Site Unique</h3>
              <p className="text-gray-600 text-center mb-6">
                Un site web professionnel adapté à votre budget
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#0073a8] mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Adapté à votre budget</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#0073a8] mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Sans fonctionnalités inutiles</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#0073a8] mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Évolutif dans le temps</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#0073a8] mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Prix maîtrisé et transparent</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <p className="text-3xl font-bold text-[#0073a8]">100% Vous</p>
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0073a8] to-[#006a87]">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à booster votre présence en ligne ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Demandez votre devis gratuit et sans engagement dès maintenant. 
            Réponse garantie sous 24h.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/demande-devis" className="bg-white text-[#0073a8] px-8 py-4 rounded-full font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg">
              Demander un devis gratuit
            </Link>
            <Link href="tel:0646170207" className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#0073a8] transition-all">
              06 46 17 02 07
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}