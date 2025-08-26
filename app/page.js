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
        
        {/* Contenu */}
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-white text-center max-w-3xl mx-auto">
            <div className="bg-[#00334d]/80 backdrop-blur-sm p-8 md:p-12 rounded-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'}}>
                <span className="block animate-slide-up">
                  Votre présence web
                </span>
                <span className="block text-yellow-300 animate-slide-up-delay-1" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)'}}>
                  commence ici
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 animate-slide-up-delay-2" style={{textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'}}>
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
                  <span>Hébergement & Domaine 1 an inclus</span>
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
                Personnalisez votre site selon vos besoins réels
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
                  <span>Blog / E-commerce / Boutique...</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>Rédaction de contenu</span>
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
                Résultat conforme à vos besoins : Un tarif détaillé et optimisé pour votre site
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
                  <span>Correspond à vos besoins</span>
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

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Une team professionnelle à votre écoute
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pour tous types de projets, une équipe de spécialistes dédiée à votre réussite
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
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Une équipe composée de +10 spécialistes freelance</h3>
                  <p className="text-gray-600">Chaque expert maîtrise parfaitement son domaine pour vous garantir le meilleur résultat.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#0073a8] rounded-full flex items-center justify-center">
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
                <div className="flex-shrink-0 w-12 h-12 bg-[#0073a8] rounded-full flex items-center justify-center">
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
                <div className="flex-shrink-0 w-12 h-12 bg-[#0073a8] rounded-full flex items-center justify-center">
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

            {/* Image à droite */}
            <div className="flex justify-center">
              <div className="border-4 border-[#0073a8] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/team-image.jpg"
                  alt="Équipe Web Online Concept"
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
              <h3 className="text-2xl font-bold mb-4">Mieux qu&apos;une agence web classique</h3>
              <p className="text-base leading-relaxed">
                WEB ONLINE CONCEPT, c&apos;est la flexibilité du freelance avec la puissance d&apos;une agence complète. 
                Nous permettons à toute entreprise, peu importe sa taille, d&apos;optimiser au maximum sa communication 
                digitale et sa présence sur le web.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Optimisation du référencement Web
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous optimisons votre site pour améliorer votre visibilité dans les résultats des meilleurs moteurs de recherche
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image à gauche */}
            <div className="flex justify-center order-2 md:order-1">
              <div className="border-4 border-[#0073a8] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/seo-google.jpg"
                  alt="Référencement Google SEO"
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
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Audit SEO complet de votre site</h3>
                  <p className="text-gray-600">Nous analysons chaque page pour identifier les points d'amélioration et maximiser votre visibilité.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#0073a8] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Optimisation technique et contenu</h3>
                  <p className="text-gray-600">Vitesse de chargement, balises méta, mots-clés stratégiques : tout est optimisé pour Google.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#0073a8] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Suivi et amélioration continue</h3>
                  <p className="text-gray-600">Rapports mensuels de positionnement et ajustements pour maintenir votre site en tête des résultats.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#0073a8] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Référencement local ciblé</h3>
                  <p className="text-gray-600">Soyez visible pour vos clients locaux avec une stratégie SEO adaptée à votre zone géographique.</p>
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
                    <p className="text-lg font-bold">Notre expertise à votre service</p>
                    <p className="text-sm opacity-90">Des années d'expérience en référencement pour propulser votre site</p>
                  </div>
                </div>
              </div>
            </div>
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
              <h3 className="text-lg font-bold text-gray-800 mb-2">Visibilité améliorée</h3>
              <p className="text-gray-600">Optimisation pour une meilleure présence dans les moteurs de recherche</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Potentiel de croissance</h3>
              <p className="text-gray-600">Un site professionnel pour développer votre activité et attirer plus de clients</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Image professionnelle</h3>
              <p className="text-gray-600">Un site moderne qui valorise votre entreprise et renforce votre crédibilité</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Gestion simplifiée</h3>
              <p className="text-gray-600">Interface intuitive pour mettre à jour facilement le contenu de votre site</p>
            </div>
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
          </div>
        </div>
      </section>
    </>
  )
}