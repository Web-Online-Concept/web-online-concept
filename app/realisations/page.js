"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function Realisations() {
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredSite, setHoveredSite] = useState(null)
  
  // Charger les sites depuis l'API
  useEffect(() => {
    fetchRealisations()
  }, [])
  
  const fetchRealisations = async () => {
    try {
      const response = await fetch('/api/admin/realisations')
      const data = await response.json()
      
      // Organiser les sites selon l'ordre sauvegardé
      if (data.siteOrder && data.siteOrder.length > 0) {
        const siteMap = new Map(data.sites.map(s => [s.id, s]))
        const orderedSites = []
        
        // D'abord ajouter les sites dans l'ordre
        data.siteOrder.forEach(id => {
          const site = siteMap.get(id)
          if (site) {
            orderedSites.push(site)
            siteMap.delete(id)
          }
        })
        
        // Ajouter les nouveaux sites à la fin
        const newSites = Array.from(siteMap.values())
        setSites([...orderedSites, ...newSites])
      } else {
        setSites(data.sites || [])
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      // Données par défaut en cas d'erreur
      setSites([
        {
          id: 1,
          name: "Restaurant Le Gourmet",
          type: "Site vitrine",
          url: "https://restaurant-legourmet.fr",
          image: "/images/sites/restaurant-gourmet.jpg",
          description: "Site moderne pour restaurant gastronomique avec réservation en ligne"
        },
        {
          id: 2,
          name: "Boutique Mode & Style",
          type: "E-commerce",
          url: "https://mode-et-style.fr",
          image: "/images/sites/boutique-mode.jpg",
          description: "Boutique en ligne complète avec paiement sécurisé"
        }
      ])
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-[100px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0073a8] mx-auto"></div>
            <p className="text-gray-600 mt-4">Chargement des réalisations...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }
  
  return (
    <>
      <Head>
        <title>Portfolio Sites Web - Nos Réalisations | Web Online Concept</title>
        <meta name="description" content="Découvrez notre portfolio de sites web professionnels : sites vitrines, e-commerce, blogs. Des créations sur mesure pour restaurants, artisans et entreprises." />
        <meta name="keywords" content="portfolio web design, réalisations sites web, exemples sites internet, création site vitrine portfolio, références web, sites web professionnels" />
        <link rel="canonical" href="https://web-online-concept.fr/realisations" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Portfolio - Nos Réalisations Web | Web Online Concept" />
        <meta property="og:description" content="Explorez nos créations de sites web sur mesure. Chaque projet est unique et adapté aux besoins de nos clients." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://web-online-concept.fr/realisations" />
        <meta property="og:site_name" content="Web Online Concept" />
        <meta property="og:image" content="https://web-online-concept.fr/images/og-realisations.jpg" />
        <meta property="og:locale" content="fr_FR" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Portfolio Web - Nos Réalisations" />
        <meta name="twitter:description" content="Découvrez nos créations de sites web professionnels sur mesure" />
        <meta name="twitter:image" content="https://web-online-concept.fr/images/og-realisations.jpg" />
        
        {/* Robots */}
        <meta name="robots" content="index, follow" />
        
        {/* Structured Data pour Portfolio */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "Portfolio Web Online Concept",
              "description": "Portfolio de sites web créés par Web Online Concept",
              "url": "https://web-online-concept.fr/realisations",
              "isPartOf": {
                "@type": "WebSite",
                "name": "Web Online Concept",
                "url": "https://web-online-concept.fr"
              },
              "about": {
                "@type": "Service",
                "name": "Création de sites web professionnels"
              },
              "mainEntity": {
                "@type": "ItemList",
                "numberOfItems": sites.length,
                "itemListElement": sites.map((site, index) => ({
                  "@type": "CreativeWork",
                  "position": index + 1,
                  "name": site.name,
                  "url": site.url,
                  "description": site.description,
                  "genre": site.type,
                  "creator": {
                    "@type": "Organization",
                    "name": "Web Online Concept",
                    "url": "https://web-online-concept.fr"
                  }
                }))
              }
            })
          }}
        />
      </Head>
      
      <Header />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-[100px]">
        {/* Hero Section - Uniformisé avec la page tarifs */}
        <section className="bg-gradient-to-r from-[#0073a8] to-[#005580] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Nos Réalisations
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Découvrez une sélection de sites web que nous avons créés. 
                Chaque projet est unique et adapté aux besoins spécifiques de nos clients.
              </p>
            </div>
          </div>
        </section>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Grille de sites */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sites.map((site) => (
              <article
                key={site.id}
                className="group relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                onMouseEnter={() => setHoveredSite(site.id)}
                onMouseLeave={() => setHoveredSite(null)}
              >
                {/* Image du site */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  {site.image ? (
                    <Image
                      src={site.image}
                      alt={`Capture d'écran du site ${site.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Overlay au survol avec bouton visiter */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
                    hoveredSite === site.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <Link
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-[#0073a8] px-6 py-2 rounded-full font-medium hover:bg-[#0073a8] hover:text-white transition-colors shadow-lg"
                        aria-label={`Visiter le site ${site.name}`}
                      >
                        Visiter le site
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Informations du site */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0073a8] transition-colors">
                    {site.name}
                  </h2>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Type :</span> {site.type}
                  </p>
                  
                  {/* Description/Commentaire */}
                  {site.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {site.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
          
          {/* Message si aucun site */}
          {sites.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 text-lg">
                Aucune réalisation pour le moment.
              </p>
            </div>
          )}
          
          {/* Section processus */}
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Notre Processus de Création</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#0073a8] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-bold mb-2">Écoute & Conseil</h3>
                <p className="text-sm text-gray-600">Nous analysons vos besoins pour créer un site qui vous ressemble</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-[#0073a8] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold mb-2">Conception</h3>
                <p className="text-sm text-gray-600">Design moderne et ergonomique adapté à votre activité</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-[#0073a8] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold mb-2">Développement</h3>
                <p className="text-sm text-gray-600">Création technique avec les dernières technologies web</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-[#0073a8] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold mb-2">Livraison & Suivi</h3>
                <p className="text-sm text-gray-600">Formation et accompagnement pour votre autonomie</p>
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="mt-16 bg-gradient-to-r from-[#0073a8] to-[#005580] rounded-2xl p-8 md:p-12 text-white text-center shadow-xl">
            <h2 className="text-3xl font-bold mb-4">
              Votre projet mérite un site professionnel
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Rejoignez nos clients satisfaits et donnez vie à votre projet web. 
              Obtenez votre devis personnalisé gratuitement !
            </p>
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 bg-white text-[#0073a8] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg"
            >
              Obtenir mon devis gratuit
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </section>
        </div>
      </div>
      
      <Footer />
    </>
  )
}