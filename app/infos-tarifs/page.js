'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function InfosTarifs() {
  const [tarifs, setTarifs] = useState(null)
  const [loading, setLoading] = useState(true)
  
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
            <h2 className="text-3xl text-yellow-400 mt-4">VERSION TEST - SI VOUS VOYEZ CECI, LE DEPLOIEMENT FONCTIONNE</h2>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Site Web - Formule de Base */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Site Web - Formule de Base
            </h2>
            
            <div className="text-center mb-8">
              <p className="text-5xl font-bold text-[#0073a8] mb-2">500€ HT</p>
              <p className="text-gray-600 text-lg">
                Site 5 pages, design personnalisé, responsive, SEO de base, hébergement 1 an inclus
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-lg">✨ Inclus dans votre site</h3>
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
                <h3 className="font-semibold mb-3 text-lg">🎁 Services inclus</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    {`Formation à l'utilisation`}
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

          {/* Options disponibles */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Options disponibles
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {tarifs.options.map((option) => (
                <div key={option.id} className="border border-gray-200 rounded-lg p-6">
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

          {/* Processus et Conditions détaillées */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Processus et Conditions détaillées
            </h2>
            
            {/* Processus */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-6">Notre processus</h3>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-[#0073a8] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    1
                  </div>
                  <h4 className="font-semibold mb-2">Analyse</h4>
                  <p className="text-gray-600 text-sm">Nous analysons votre demande et créons votre devis personnalisé</p>
                </div>
                <div className="text-center">
                  <div className="bg-[#0073a8] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    2
                  </div>
                  <h4 className="font-semibold mb-2">Création</h4>
                  <p className="text-gray-600 text-sm">Après devis accepté et acompte reçu, nous développons votre site web</p>
                </div>
                <div className="text-center">
                  <div className="bg-[#0073a8] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    3
                  </div>
                  <h4 className="font-semibold mb-2">Livraison</h4>
                  <p className="text-gray-600 text-sm">{`Mise en ligne du site et formation rapide à l'utilisation`}</p>
                </div>
              </div>

              {/* Processus détaillé */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-start">
                  <div className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Demande de devis</h3>
                      <span className="text-sm text-gray-500">Immédiat</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Vous remplissez le formulaire en ligne</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Devis personnalisé</h3>
                      <span className="text-sm text-gray-500">Sous 24-48h</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Nous analysons votre demande et créons votre devis</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Validation</h3>
                      <span className="text-sm text-gray-500">À votre rythme</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{`Signature du devis et versement de l'acompte (50%)`}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Brief créatif</h3>
                      <span className="text-sm text-gray-500">1h par téléphone</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Nous définissons ensemble vos besoins exacts</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    5
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Envoi des contenus</h3>
                      <span className="text-sm text-gray-500">Sous 1 semaine</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Vous nous transmettez textes, images et logo</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    6
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Création</h3>
                      <span className="text-sm text-gray-500">2-3 semaines</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Nous développons votre site web</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    7
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Révisions</h3>
                      <span className="text-sm text-gray-500">2h</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">1 session de modifications inclus</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    8
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Mise en ligne</h3>
                      <span className="text-sm text-gray-500">1h</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Formation à la gestion du site</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="border-t pt-8">
              <h3 className="text-2xl font-semibold mb-6">Conditions détaillées</h3>
              
              {/* Contenus à fournir */}
              <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-300 mb-6">
                <h4 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">📝</span>
                  Contenus à fournir
                </h4>
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
                      <strong>{`💡 Besoin d'aide ?`}</strong> {`Nous proposons des options de rédaction et des packs d'images professionnelles.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Conditions générales */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-blue-800">💳 Paiement</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Acompte 50% à la commande</li>
                      <li>• Solde 50% à la livraison</li>
                      <li>• Virement bancaire uniquement</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-green-800">✅ Nos garanties</h4>
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
                    <h4 className="font-semibold mb-2 text-purple-800">📋 Vos responsabilités</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Fournir tous les contenus</li>
                      <li>• Droits sur les images/textes</li>
                      <li>• Validation dans les délais</li>
                      <li>• Brief clair et complet</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-orange-800">⚠️ Non inclus dans le site de base</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• E-commerce / Boutique en ligne</li>
                      <li>• Espace membre avec connexion</li>
                      <li>• Application mobile</li>
                      <li>• Référencement avancé (SEO+)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Mentions importantes */}
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h4 className="font-semibold mb-4 text-red-800 flex items-center">
                  <span className="text-xl mr-2">⚠️</span>
                  Informations importantes
                </h4>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>• Les délais commencent à réception de TOUS les éléments</li>
                  <li>{`• Toute modification majeure après validation fera l'objet d'un nouveau devis`}</li>
                  <li>• Les prix indiqués sont HT (TVA non applicable)</li>
                  <li>{`• L'hébergement et nom de domaine doivent être renouvelés chaque année`}</li>
                </ul>
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