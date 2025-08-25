'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function InfosTarifs() {
  const [tarifs, setTarifs] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openSections, setOpenSections] = useState({})
  
  useEffect(() => {
    fetch('/api/tarifs')
      .then(res => res.json())
      .then(data => {
        setTarifs(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Erreur chargement tarifs:', err)
        setLoading(false)
      })
  }, [])
  
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }
  
  if (loading || !tarifs) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[100px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0073a8] mx-auto"></div>
          <p className="text-gray-600 mt-4">Chargement des tarifs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[100px]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0073a8] to-[#005580] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nos Tarifs
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Des solutions web adaptées à votre budget
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Formule de Base */}
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {tarifs.formuleBase.nom}
                </h2>
                <p className="text-5xl font-bold text-[#0073a8] mb-4">
                  {tarifs.formuleBase.prix}€ HT
                </p>
                <p className="text-gray-600 mb-6">
                  {tarifs.formuleBase.description}
                </p>
              </div>
              
              <button
                onClick={() => toggleSection('details')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold">Voir les détails inclus</span>
                <svg className={`w-5 h-5 transform transition-transform ${openSections.details ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openSections.details && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">✨ Inclus dans votre site</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          Design moderne et personnalisé
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          Site responsive (mobile, tablette, PC)
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          5 pages personnalisées
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          SEO de base inclus
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          Hébergement 1 an inclus
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">🎁 Services inclus</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          Formation à l'utilisation
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          Support technique 30 jours
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          Certificat SSL (https)
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          Nom de domaine 1 an
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          Emails professionnels
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="text-center mt-6">
                    <Link href="/demande-devis" className="inline-block bg-[#0073a8] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#005580] transition-all transform hover:scale-105">
                      Demander un devis gratuit
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Options disponibles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {tarifs.options.map((option) => (
                <div key={option.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{option.nom}</h3>
                    <span className="text-2xl font-bold text-[#0073a8]">{option.prix}€</span>
                  </div>
                  {option.description && (
                    <p className="text-gray-600">{option.description}</p>
                  )}
                  {option.unite && (
                    <p className="text-sm text-gray-500 mt-1">{option.unite}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Processus */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Notre processus</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-[#0073a8] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Demande de devis</h3>
                <p className="text-gray-600 text-sm">Remplissez le formulaire en ligne</p>
              </div>
              <div className="text-center">
                <div className="bg-[#0073a8] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Analyse</h3>
                <p className="text-gray-600 text-sm">Nous analysons votre demande et créons votre devis</p>
              </div>
              <div className="text-center">
                <div className="bg-[#0073a8] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Création</h3>
                <p className="text-gray-600 text-sm">Nous développons votre site web</p>
              </div>
              <div className="text-center">
                <div className="bg-[#0073a8] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  4
                </div>
                <h3 className="font-semibold mb-2">Livraison</h3>
                <p className="text-gray-600 text-sm">Mise en ligne et formation</p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Questions fréquentes</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <button
                  onClick={() => toggleSection('faq1')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="font-semibold">Quels sont les délais de création ?</h3>
                  <svg className={`w-5 h-5 transform transition-transform ${openSections.faq1 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSections.faq1 && (
                  <p className="mt-4 text-gray-600">
                    Comptez environ 2 à 3 semaines après réception de tous vos contenus (textes, images, logo).
                  </p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <button
                  onClick={() => toggleSection('faq2')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="font-semibold">Que se passe-t-il après la première année ?</h3>
                  <svg className={`w-5 h-5 transform transition-transform ${openSections.faq2 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSections.faq2 && (
                  <p className="mt-4 text-gray-600">
                    L'hébergement et le nom de domaine sont à renouveler chaque année (120€/an). Vous restez propriétaire de votre site.
                  </p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <button
                  onClick={() => toggleSection('faq3')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="font-semibold">Faut-il fournir les contenus ?</h3>
                  <svg className={`w-5 h-5 transform transition-transform ${openSections.faq3 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSections.faq3 && (
                  <p className="mt-4 text-gray-600">
                    Oui, vous devez nous fournir les textes et images. Si besoin, nous proposons des options de rédaction et de création visuelle.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center">
            <Link
              href="/demande-devis"
              className="inline-flex items-center px-8 py-4 bg-[#0073a8] text-white font-bold rounded-lg hover:bg-[#005580] transition-all transform hover:scale-105 shadow-lg"
            >
              Obtenir mon devis gratuit
            </Link>
            <p className="mt-4 text-gray-600">
              Réponse sous 24h ouvrées
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}