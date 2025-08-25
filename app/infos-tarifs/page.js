"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function InfosTarifs() {
  const [activeTab, setActiveTab] = useState('formules')
  const [showDetails, setShowDetails] = useState({
    siteInclus: false
  })
  const [tarifs, setTarifs] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Charger les tarifs depuis l'API
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

  // Trouver les tarifs spécifiques
  const tarifHebergement = tarifs.options.find(o => o.id === 'maintenance')?.prix || 120
  const tarifPageSupp = tarifs.options.find(o => o.id === 'page-supp')?.prix || 50
  const tarifRedaction = tarifs.options.find(o => o.id === 'redaction')?.prix || 150
  const tarifPackImages = tarifs.options.find(o => o.id === 'photos')?.prix || 400
  const tarifMaintenance = tarifs.options.find(o => o.id === 'maintenance')?.prix || 120

  return (
    <div className="min-h-screen bg-gray-50 pt-[100px]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0073a8] to-[#005580] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Une offre simple et transparente
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Découvrez nos tarifs clairs et sans surprise pour votre projet web.
              De la création à la maintenance, tout est détaillé.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-[100px] bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-4 gap-4">
            <button
              onClick={() => setActiveTab('formules')}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'formules'
                  ? 'bg-[#0073a8] text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">💰</span>
              Nos Tarifs
            </button>
            <button
              onClick={() => setActiveTab('conditions')}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'conditions'
                  ? 'bg-[#0073a8] text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">📋</span>
              Conditions
            </button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Onglet Nos Tarifs */}
          {activeTab === 'formules' && (
            <div className="space-y-12">
              {/* Formule principale */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Notre offre principale</h3>
                
                <div className="space-y-4">
                  {/* Site Web Professionnel */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                    <div className="text-center">
                      <h4 className="text-lg font-semibold mb-2">🌟 {tarifs.formuleBase.nom}</h4>
                      <p className="text-3xl font-bold text-[#0073a8]">{tarifs.formuleBase.prix}€ HT</p>
                      <p className="text-gray-600 mt-2">{tarifs.formuleBase.description}</p>
                      <p className="text-sm text-gray-500 mt-1">Design responsive • Animations modernes • Formation incluse</p>
                    </div>
                    
                    {/* Bouton dépliable */}
                    <div className="mt-4 border-t border-blue-200 pt-4">
                      <button
                        onClick={() => setShowDetails({...showDetails, siteInclus: !showDetails.siteInclus})}
                        className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <span className="font-medium text-gray-800">
                          ✨ Tout ce qui est inclus dans votre site
                        </span>
                        <svg 
                          className={`w-5 h-5 text-gray-600 transform transition-transform ${showDetails.siteInclus ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Contenu dépliable */}
                      {showDetails.siteInclus && (
                        <div className="mt-4 space-y-4">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h6 className="font-semibold mb-3 text-[#0073a8]">📄 Contenu</h6>
                              <ul className="space-y-2 text-gray-700 text-sm">
                                <li className="flex items-start">
                                  <span className="text-green-500 mr-2 mt-1">✓</span>
                                  <span>5 pages personnalisées selon vos besoins</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="text-green-500 mr-2 mt-1">✓</span>
                                  <span>Pages légales offertes (RGPD compliant)</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="text-green-500 mr-2 mt-1">✓</span>
                                  <span>Mise en page de vos contenus</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="text-green-500 mr-2 mt-1">✓</span>
                                  <span>SEO de base optimisé</span>
                                </li>
                              </ul>
                            </div>
                            
                            <div>
                              <h6 className="font-semibold mb-3 text-[#0073a8]">🎨 Design & Technique</h6>
                              <ul className="space-y-2 text-gray-700 text-sm">
                                <li className="flex items-start">
                                  <span className="text-green-500 mr-2 mt-1">✓</span>
                                  <span>Design moderne et personnalisé</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="text-green-500 mr-2 mt-1">✓</span>
                                  <span>Site responsive (mobile/tablette/PC)</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="text-green-500 mr-2 mt-1">✓</span>
                                  <span>Animations et effets modernes</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="text-green-500 mr-2 mt-1">✓</span>
                                  <span>Hébergement 1 an inclus</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          
                          {/* IMPORTANT : Contenus à fournir */}
                          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-amber-800 font-medium flex items-start text-sm">
                              <span className="text-lg mr-2">⚠️</span>
                              <span>
                                <strong>Important :</strong> Les textes et images doivent être fournis par vos soins. 
                                Si vous avez besoin d'aide pour la rédaction ou les visuels, consultez nos options ci-dessous.
                              </span>
                            </p>
                          </div>
                          
                          {/* Bonus première année */}
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-green-800 font-medium text-sm">
                              🎁 Bonus première année : Hébergement professionnel + Nom de domaine + Certificat SSL inclus !
                            </p>
                          </div>
                          
                          {/* Bouton CTA centré */}
                          <div className="text-center mt-6">
                            <Link href="/demande-devis" className="inline-block bg-[#0073a8] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#005580] transition-all transform hover:scale-105">
                              Demander un devis gratuit
                            </Link>
                          </div>
                          
                          {/* Bouton CTA centré */}
                          <div className="text-center mt-4">
                            <Link href="/demande-devis" className="inline-block bg-[#0073a8] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#005580] transition-all transform hover:scale-105">
                              Demander un devis gratuit
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Options disponibles</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {tarifs.options.map((option) => (
                    <div key={option.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">{option.nom}</h4>
                          {option.description && <p className="text-gray-600 text-sm mt-1">{option.description}</p>}
                        </div>
                        <div className="flex-shrink-0 text-right ml-6">
                          <p className="text-2xl font-bold text-[#0073a8]">{option.prix}€</p>
                          {option.unite && <p className="text-sm text-gray-500">{option.unite}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exemple de tarification */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-300">
                <h3 className="text-xl font-bold mb-6 text-center text-gray-800">
                  💡 Exemple de tarification
                </h3>
                <div className="max-w-lg mx-auto">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h4 className="font-semibold mb-4">Site 7 pages + rédaction + maintenance :</h4>
                    
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3">Site 5 pages</td>
                          <td className="text-right font-medium">{tarifs.formuleBase.prix}€</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">+ 2 pages supplémentaires</td>
                          <td className="text-right">{2 * tarifPageSupp}€</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">+ Rédaction complète</td>
                          <td className="text-right">{tarifRedaction}€</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">+ Maintenance annuelle</td>
                          <td className="text-right">{tarifMaintenance}€</td>
                        </tr>
                        <tr className="font-bold text-lg">
                          <td className="pt-4">Total première année</td>
                          <td className="text-right pt-4 text-[#0073a8]">
                            {tarifs.formuleBase.prix + (2 * tarifPageSupp) + tarifRedaction + tarifMaintenance}€ HT
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <div className="mt-4 pt-4 border-t text-xs text-gray-600">
                      <p>Années suivantes : {tarifMaintenance}€/an (maintenance seule)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Link
                  href="/demande-devis"
                  className="inline-flex items-center px-8 py-4 bg-[#0073a8] text-white font-bold rounded-lg hover:bg-[#006a87] transition-all transform hover:scale-105 shadow-lg"
                >
                  <span className="mr-2">📝</span>
                  Obtenir mon devis personnalisé
                </Link>
                <p className="mt-3 text-sm text-gray-600">
                  Réponse garantie sous 24h ouvrées
                </p>
              </div>
            </div>
          )}

          {/* Onglet Conditions */}
          {activeTab === 'conditions' && (
            <div className="space-y-8">
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
                      <strong>💡 Besoin d'aide ?</strong> Nous proposons des options de rédaction et des packs d'images professionnelles.
                    </p>
                  </div>
                </div>
              </div>

              {/* Processus */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Notre processus de création
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
                      desc: "Signature du devis et versement de l'acompte (30%)",
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
                  <li>• Toute modification majeure après validation fera l'objet d'un nouveau devis</li>
                  <li>• La propriété du site est transférée après paiement complet</li>
                  <li>• Les prix indiqués sont HT (TVA non applicable)</li>
                  <li>• L'hébergement doit être renouvelé chaque année</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            Questions fréquentes
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="bg-white rounded-lg shadow-md p-6 group">
              <summary className="font-semibold cursor-pointer flex items-center justify-between">
                Combien de temps pour créer mon site ?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-700">
                En général, comptez 2-3 semaines après réception de tous vos contenus (textes, images, logo). 
                Le délai exact est confirmé dans le devis selon notre charge de travail actuelle.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-6 group">
              <summary className="font-semibold cursor-pointer flex items-center justify-between">
                Puis-je modifier mon site moi-même ?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-700">
                Avec l'option maintenance, nous effectuons vos modifications (12 interventions/an).
                Pour une autonomie complète, nous pouvons intégrer un système de gestion de contenu sur devis.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-6 group">
              <summary className="font-semibold cursor-pointer flex items-center justify-between">
                Que se passe-t-il après la première année ?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-700">
                L'hébergement est à renouveler chaque année. Vous restez propriétaire de votre site 
                et pouvez changer d'hébergeur si vous le souhaitez. Nous vous envoyons un rappel 
                30 jours avant l'échéance.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-6 group">
              <summary className="font-semibold cursor-pointer flex items-center justify-between">
                Et si je n'ai pas de textes ou d'images ?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-700">
                Pas de panique ! Nous proposons des options de rédaction professionnelle 
                et des packs d'images libres de droits adaptées à votre activité.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-[#0073a8] to-[#005580] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à créer votre site web ?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Une offre simple, transparente et sans surprise. 
            Obtenez votre devis personnalisé en quelques minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demande-devis"
              className="inline-flex items-center px-8 py-4 bg-white text-[#0073a8] font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              <span className="mr-2">🚀</span>
              Démarrer mon projet
            </Link>
            <a
              href="tel:0646170207"
              className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-white/30 transition-all"
            >
              <span className="mr-2">📞</span>
              <span>06 46 17 02 07</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}