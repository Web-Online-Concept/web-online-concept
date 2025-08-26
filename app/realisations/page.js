'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Realisations() {
  const [realisations, setRealisations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/realisations')
      .then(res => res.json())
      .then(data => {
        setRealisations(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Erreur chargement réalisations:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Chargement des réalisations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* En-tête */}
      <section className="bg-gradient-to-r from-[#0073a8] to-[#005580] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nos Réalisations
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Découvrez quelques-uns des sites web que nous avons créés pour nos clients
            </p>
          </div>
        </div>
      </section>

      {/* Grille des réalisations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {realisations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Aucune réalisation disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {realisations.map((realisation) => (
                <div key={realisation.id} className="group">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {/* Image */}
                    <a 
                      href={realisation.url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="relative bg-gray-200 overflow-hidden" style={{ paddingBottom: '50%' }}>
                        <img
                          src={`/images/${realisation.image}`}
                          alt={realisation.titre}
                          className="absolute top-0 left-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = '/images/placeholder.jpg'
                          }}
                        />
                      </div>
                    </a>
                    
                    {/* Contenu */}
                    <div className="p-4 text-center">
                      <a 
                        href={realisation.url || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-[#0073a8] transition-colors"
                      >
                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                          {realisation.titre}
                        </h3>
                      </a>
                      
                      {realisation.url && (
                        <a
                          href={realisation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0073a8] hover:text-[#005580] transition-colors duration-200 text-sm block mb-2"
                        >
                          {realisation.url.replace('https://', '').replace('http://', '').replace('www.', '')}
                        </a>
                      )}
                      
                      {realisation.description && (
                        <p className="text-gray-600 text-sm">
                          {realisation.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Call to Action */}
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Vous avez un projet de site web ?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Contactez-nous pour obtenir un devis gratuit et personnalisé pour votre projet
            </p>
            <Link
              href="/demande-devis"
              className="inline-flex items-center px-8 py-4 bg-[#0073a8] text-white font-bold rounded-lg hover:bg-[#005580] transition-all transform hover:scale-105 shadow-lg"
            >
              Demander un devis gratuit
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}