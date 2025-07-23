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
        <div className="absolute inset-0 bg-gradient-to-br from-[#0073a8]/90 via-[#00b4d8]/80 to-[#006a87]/90" />
        
        {/* Contenu divisé en 2 parties horizontales */}
        <div className="container max-w-7xl mx-auto px-4 relative z-10 min-h-screen flex flex-col">
          
          {/* Partie haute */}
          <div className="flex items-center justify-center pt-8 md:pt-16" style={{height: 'calc(50% - 25px)'}}>
            {/* Texte centré */}
            <div className="text-white text-center max-w-3xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
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
                className="flex flex-col sm:flex-row gap-4 justify-center"
                style={{
                  animation: 'fadeIn 1s ease-out 0.6s forwards',
                  opacity: 0
                }}
              >
                <Link href="/devis" className="bg-white text-[#0073a8] px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg text-center whitespace-nowrap">
                  Obtenir un devis gratuit
                </Link>
                <Link href="#services" className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-[#0073a8] transition-all text-center whitespace-nowrap">
                  Découvrir nos services
                </Link>
              </div>
            </div>
          </div>
          
          {/* Espace de 80px entre les parties */}
          <div style={{height: '80px'}}></div>
          
          {/* Partie basse */}
          <div className="flex items-end pb-8 md:pb-16" style={{height: 'calc(50% - 25px)'}}>
            <div className="grid md:grid-cols-[55%_45%] gap-8 w-full">
              {/* Colonne gauche - Image agrandie */}
              <div className="hidden md:flex items-center justify-center">
                {/* Image plus grande */}
                <div 
                  className="w-full max-w-2xl"
                  style={{
                    opacity: 0,
                    animation: 'fadeInLeft 1s ease-out 1.2s forwards'
                  }}
                >
                  <Image
                    src="/images/hero-bottom.png"
                    alt="Solutions web professionnelles"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              
              {/* Colonne droite - Liste Réalisez */}
              <div className="text-white">
                <h2 
                  className="text-5xl font-bold text-white mb-8"
                  style={{
                    fontFamily: 'Poppins, -apple-system, sans-serif',
                    animation: 'fadeInScale 0.8s ease-out forwards'
                  }}
                >
                  Réalisez..
                </h2>
                
                <div className="space-y-4">
                  {[
                    { text: "Votre site internet clé en main", delay: "0.5s" },
                    { text: "100% adapté mobile et tablette", delay: "1s" },
                    { text: "Choisissez vos options à la carte", delay: "1.5s" },
                    { text: "Développement sur mesure adapté", delay: "2s" },
                    { text: "Référencement Google : Spécialiste SEO", delay: "2.5s" },
                    { text: "Meilleur rapport qualité / prix !", delay: "3s", highlight: true }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3"
                      style={{
                        opacity: 0,
                        animation: `slideInLeft 0.6s ease-out ${item.delay} forwards`
                      }}
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 ${item.highlight ? 'bg-yellow-400' : 'bg-green-500'} rounded-full flex items-center justify-center`}>
                          {item.highlight ? (
                            <svg className="w-5 h-5 text-yellow-900" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className={`text-xl font-semibold ${item.highlight ? 'text-yellow-300' : 'text-white'}`}>
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
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
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Team Section */}
      <section id="team" className="py-20 bg-white">
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
                  src="/images/team-image.png"
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

      {/* Services Section - Concept À la Carte */}
      <section id="services" className="py-20 bg-gray-100 relative">
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Votre site web à la carte
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un concept simple et transparent : une formule de base complète à prix fixe, 
              puis ajoutez uniquement les options dont vous avez besoin
            </p>
          </div>

          {/* Présentation du concept en 3 étapes */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Étape 1 - La Base */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all">
              <div className="w-20 h-20 bg-[#0073a8] rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">La Formule de Base</h3>
              <p className="text-gray-600 text-center mb-6">
                Tout ce qu&apos;il faut pour démarrer votre présence en ligne
              </p>
              <ul className="space-y-2 text-gray-600">
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
                  <span>Pages légales & contact incluses</span>
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
                  <span>Accompagnement personnalisé</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <p className="text-3xl font-bold text-[#0073a8]">Prix fixe</p>
                <p className="text-sm text-gray-500">Transparent et sans surprise</p>
              </div>
            </div>

            {/* Étape 2 - Les Options */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all">
              <div className="w-20 h-20 bg-[#0073a8] rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Ajoutez vos Options</h3>
              <p className="text-gray-600 text-center mb-6">
                Personnalisez selon vos besoins réels
              </p>
              <ul className="space-y-2 text-gray-600">
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
                  <span>Galerie photos/vidéos</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>Formulaires avancés</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>Espace membre/blog</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>Et bien plus encore...</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <p className="text-3xl font-bold text-[#0073a8]">À la carte</p>
                <p className="text-sm text-gray-500">Payez uniquement ce dont vous avez besoin</p>
              </div>
            </div>

            {/* Étape 3 - Votre Site */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all">
              <div className="w-20 h-20 bg-[#0073a8] rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Votre Site Unique</h3>
              <p className="text-gray-600 text-center mb-6">
                Résultat : exactement ce qu&apos;il vous faut
              </p>
              <ul className="space-y-2 text-gray-600">
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

          {/* CTA vers la page tarifs */}
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-6">
              Découvrez notre grille tarifaire claire et détaillée
            </p>
            <Link href="/tarifs" className="inline-flex items-center bg-[#0073a8] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#006a87] transition-all transform hover:scale-105 shadow-lg">
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
            Notre équipe vous répondra sous 24h.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/devis" className="bg-white text-[#0073a8] px-8 py-4 rounded-full font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg">
              Demander un devis gratuit
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#0073a8] transition-all">
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