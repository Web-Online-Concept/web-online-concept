'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function InfosTarifs() {
  const [tarifs, setTarifs] = useState({
    formuleBase: { prix: 500 },
    options: [],
    remises: []
  })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/tarifs')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setTarifs(data)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Erreur chargement tarifs:', err)
        setLoading(false)
      })
  }, [])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Chargement des tarifs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Bloc 1 - Site Web - 500€ HT */}
      <section className="bg-gradient-to-r from-[#0073a8] to-[#005580] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Site Web - {tarifs.formuleBase.prix}€ HT
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Formule de base
            </p>
          </div>
        </div>
      </section>
      
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* Image hero centrée */}
          <div className="mb-12 text-center">
            <Image 
              src="/images/hero-top.png" 
              alt="Création de sites web professionnels - Web Online Concept"
              className="mx-auto rounded-lg shadow-lg"
              width={400}
              height={200}
              priority
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-100 rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="font-semibold mb-4 text-lg flex items-center text-gray-800">
                <span className="text-2xl mr-2">✨</span>
                Inclus dans votre site
              </h3>
              <ul className="space-y-3 text-gray-700">
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
                  5 pages personnalisées (+pages légales inclues)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  SEO de base inclus
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  Hébergement & NDD inclus la 1ere année
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="font-semibold mb-4 text-lg flex items-center text-gray-800">
                <span className="text-2xl mr-2">🎁</span>
                Services inclus
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  Formation 1h à la prise en main
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
                  Sites conformes RGPD
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  Conseils divers
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link href="/demande-devis" className="inline-block bg-[#0073a8] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#005580] transition-all transform hover:scale-105">
              Demander un devis gratuit
            </Link>
          </div>
        </div>
      </section>

      {/* Bloc 2 - Options disponibles */}
      <section className="bg-gradient-to-r from-[#029be5] to-[#0288d1] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Options disponibles
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Personnalisez votre site selon vos besoins
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {tarifs.options.map((option) => (
              <div key={option.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">{option.nom}</h3>
                  <span className="text-2xl font-bold text-[#0073a8] bg-blue-50 px-3 py-1 rounded-lg">{option.prix}€</span>
                </div>
                {option.description && (
                  <p className="text-gray-600 leading-relaxed">{option.description}</p>
                )}
                {option.unite && (
                  <p className="text-sm text-gray-500 mt-2 italic">{option.unite}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bloc 3 - Processus de création */}
      <section className="bg-gradient-to-r from-[#029be5] to-[#0288d1] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Processus de création
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              4 étapes simples & un accompagnement personnalisé
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Processus */}
          <div className="mb-12">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-[#0073a8] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h4 className="font-semibold mb-2">Devis gratuit</h4>
                <p className="text-gray-600 text-sm">Réception de votre devis personnalisé</p>
              </div>
              <div className="text-center">
                <div className="bg-[#0073a8] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h4 className="font-semibold mb-2">Analyse</h4>
                <p className="text-gray-600 text-sm">Analyse de votre demande et création de votre devis personnalisé</p>
              </div>
              <div className="text-center">
                <div className="bg-[#0073a8] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h4 className="font-semibold mb-2">Création du site</h4>
                <p className="text-gray-600 text-sm">Après devis accepté et acompte reçu, nous développons votre site web</p>
              </div>
              <div className="text-center">
                <div className="bg-[#0073a8] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  4
                </div>
                <h4 className="font-semibold mb-2">Livraison du site</h4>
                <p className="text-gray-600 text-sm">Mise en ligne et formation à la gestion du site</p>
              </div>
            </div>

            {/* Processus détaillé */}
            <div className="max-w-4xl mx-auto">
              <div className="space-y-3 border-t pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Demande de devis</h3>
                      <span className="text-sm text-gray-500">Immédiat</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Vous remplissez le formulaire en ligne</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Devis personnalisé</h3>
                      <span className="text-sm text-gray-500">Sous 24-48h</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Nous analysons votre demande et créons votre devis</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Validation</h3>
                      <span className="text-sm text-gray-500">À votre rythme</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Signature du devis et versement acompte (50%)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Brief créatif</h3>
                      <span className="text-sm text-gray-500">1h par téléphone</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Nous définissons ensemble vos besoins exacts</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    5
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Envoi des contenus</h3>
                      <span className="text-sm text-gray-500">Sous 1 semaine</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Vous nous transmettez textes, images et logo</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    6
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Création</h3>
                      <span className="text-sm text-gray-500">2-3 semaines</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Nous développons votre site web</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    7
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Révisions</h3>
                      <span className="text-sm text-gray-500">2h</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">1 session de modifications inclus</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    8
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Mise en ligne</h3>
                      <span className="text-sm text-gray-500">1h</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Formation à la gestion du site</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bloc 4 - Conditions détaillées */}
      <section className="bg-gradient-to-r from-[#029be5] to-[#0288d1] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Conditions détaillées
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Détail complet des conditions de créations
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Conditions détaillées */}
          <div>
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
                    <strong>💡 Besoin d'aide ?</strong> Nous proposons des options de rédaction et des packs d'images professionnelles.
                  </p>
                </div>
              </div>
            </div>

            {/* Grilles de conditions */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-blue-800">💳 Paiements</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Acompte 50% à la commande</li>
                    <li>• Solde 50% à la livraison</li>
                    <li>• Virement bancaire uniquement</li>
                    <li>• Livraison du site après paiement total</li>
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
                <li>• Toute modification majeure après validation fera l'objet d'un nouveau devis</li>
                <li>• Les prix indiqués sont HT (TVA non applicable)</li>
                <li>• L'hébergement et nom de domaine doivent être renouvelés chaque année</li>
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