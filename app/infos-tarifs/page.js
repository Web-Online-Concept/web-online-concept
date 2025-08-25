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
                          Formation à l\'utilisation
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

          {/* Section Conditions - Directement affichée */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-8">Conditions détaillées</h2>
            
            {/* Contenus à fournir */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-300">
              <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">📝</span>
                Contenus à fournir
              </h2>
              <div className="space-y-4 text-amber-800">
                <p className="font-medium">
                  Pour créer votre site, vous devez nous fournir :
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    <div>
                      <strong>Les textes</strong> : Tous les contenus écrits de votre site (présentation, services, etc.)
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    <div>
                      <strong>Les images</strong> : Photos libres de droits, votre logo, visuels de vos produits/services
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    <div>
                      <strong>Les informations</strong> : Coordonnées, horaires, liens réseaux sociaux, etc.
                    </div>
                  </li>
                </ul>
                <div className="bg-amber-100 rounded-lg p-4 mt-4">
                  <p className="text-sm">
                    <strong>💡 Besoin d\'aide ?</strong> Nous proposons des options de rédaction et des packs d\'images professionnelles.
                  </p>
                </div>
              </div>
            </div>

            {/* Processus détaillé */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Notre processus de création détaillé
              </h2>

              <div className="space-y-4">
                {[
                  {
                    num: "1",
                    title: "Demande de devis",
                    desc: "Vous remplissez le formulaire en ligne",
                    delay: "Immédiat"
                  },
                  {
                    num: "2",
                    title: "Devis personnalisé",
                    desc: "Nous analysons votre demande et créons votre devis",
                    delay: "Sous 24-48h"
                  },
                  {
                    num: "3",
                    title: "Validation",
                    desc: "Signature du devis et versement de l\'acompte (30%)",
                    delay: "À votre rythme"
                  },
                  {
                    num: "4",
                    title: "Brief créatif",
                    desc: "Nous définissons ensemble vos besoins exacts",
                    delay: "1h par téléphone"
                  },
                  {
                    num: "5",
                    title: "Envoi des contenus",
                    desc: "Vous nous transmettez textes, images et logo",
                    delay: "Sous 1 semaine"
                  },
                  {
                    num: "6",
                    title: "Création",
                    desc: "Nous développons votre site web",
                    delay: "2-3 semaines"
                  },
                  {
                    num: "7",
                    title: "Révisions",
                    desc: "2 rounds de modifications inclus",
                    delay: "3-5 jours"
                  },
                  {
                    num: "8",
                    title: "Mise en ligne",
                    desc: "Paiement du solde et formation",
                    delay: "1 journée"
                  }
                ].map((step) => (
                  <div key={step.num} className="flex items-start">
                    <div className="bg-[#0073a8] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                      {step.num}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{step.title}</h3>
                        <span className="text-sm text-gray-500">{step.delay}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditions générales */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Conditions générales
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-blue-800">💳 Paiement</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Acompte 30% à la commande</li>
                      <li>• Solde 70% à la livraison</li>
                      <li>• Virement, CB ou chèque</li>
                      <li>• Paiement 3x sans frais possible</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-green-800">✅ Nos garanties</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Site conforme RGPD</li>
                      <li>• Compatible tous navigateurs</li>
                      <li>• Formation 1h incluse</li>
                      <li>• Support 30 jours offert</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-purple-800">📋 Vos responsabilités</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Fournir tous les contenus</li>
                      <li>• Droits sur les images/textes</li>
                      <li>• Validation dans les délais</li>
                      <li>• Brief clair et complet</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-orange-800">⚠️ Non inclus</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• E-commerce / Boutique en ligne</li>
                      <li>• Espace membre avec connexion</li>
                      <li>• Application mobile</li>
                      <li>• Référencement avancé (SEO+)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Mentions importantes */}
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h3 className="font-semibold mb-4 text-red-800 flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                Informations importantes
              </h3>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• Les délais commencent à réception de TOUS les éléments</li>
                <li>• Toute modification majeure après validation fera l\'objet d\'un nouveau devis</li>
                <li>• La propriété du site est transférée après paiement complet</li>
                <li>• Les prix indiqués sont HT (TVA non applicable)</li>
                <li>• L\'hébergement doit être renouvelé chaque année</li>
              </ul>
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center mt-12">
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