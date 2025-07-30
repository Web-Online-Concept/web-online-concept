"use client"

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'

export default function InfosTarifs() {
  const [activeTab, setActiveTab] = useState('formules')
  const [showDetails, setShowDetails] = useState({
    services: false,
    siteInclus: false
  })
  const [tarifs, setTarifs] = useState({
    siteWeb: 500,
    pageSupp: 50,
    hebergement: 40,
    emailPro: 120,
    maintenance: 120,
    redactionSiteComplet: 150,
    redactionPageSupp: 20,
    packImages: 50,
    backOffice: 150
  })
  const [loading, setLoading] = useState(true)
  
  // Charger les tarifs depuis l'API
  useEffect(() => {
    loadTarifs()
  }, [])
  
  const loadTarifs = async () => {
    try {
      const response = await fetch('/api/admin/tarifs')
      if (response.ok) {
        const data = await response.json()
        // Fusionner avec les valeurs par défaut au cas où certaines propriétés manquent
        setTarifs({
          ...tarifs,
          ...data
        })
      }
    } catch (error) {
      console.error('Erreur chargement tarifs:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <>
      <Header />
      
      {loading ? (
        <div className="min-h-screen bg-gray-50 pt-[100px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0073a8] mx-auto"></div>
            <p className="text-gray-600 mt-4">Chargement des tarifs...</p>
          </div>
        </div>
      ) : (
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
                {/* Formule principale dans une bande comme les options */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">Notre offre principale</h3>
                  
                  <div className="space-y-4">
                    {/* Site Web Professionnel */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">🌟 Site Web Professionnel</h4>
                          <p className="text-gray-600">5 pages personnalisées + pages légales offertes + hébergement 1 an inclus</p>
                          <p className="text-sm text-gray-500 mt-1">Design responsive • Animations modernes • Formation incluse</p>
                        </div>
                        <div className="flex-shrink-0 text-right ml-6">
                          <p className="text-3xl font-bold text-[#0073a8]">{tarifs.siteWeb}€</p>
                          <p className="text-sm text-gray-500">tout compris</p>
                        </div>
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
                            
                            {/* Ce que vous pouvez mettre dans vos pages */}
                            <div className="border-t border-blue-100 pt-4">
                              <h6 className="font-semibold mb-4 text-[#0073a8]">🔍 Ce que vous pouvez mettre dans vos pages :</h6>
                              <div className="grid md:grid-cols-3 gap-4 text-sm bg-gray-50 rounded-lg p-6">
                                <div>
                                  <p className="font-medium mb-2">📝 Textes</p>
                                  <ul className="space-y-1 text-gray-700">
                                    <li>• Titres et sous-titres</li>
                                    <li>• Paragraphes illimités</li>
                                    <li>• Listes à puces</li>
                                    <li>• Citations</li>
                                  </ul>
                                </div>
                                <div>
                                  <p className="font-medium mb-2">🖼️ Médias</p>
                                  <ul className="space-y-1 text-gray-700">
                                    <li>• Images (galeries incluses)</li>
                                    <li>• Vidéos YouTube/Vimeo</li>
                                    <li>• Icônes et pictogrammes</li>
                                    <li>• Documents PDF</li>
                                  </ul>
                                </div>
                                <div>
                                  <p className="font-medium mb-2">⚡ Fonctionnalités</p>
                                  <ul className="space-y-1 text-gray-700">
                                    <li>• Formulaires de contact</li>
                                    <li>• Cartes Google Maps</li>
                                    <li>• Boutons d'action</li>
                                    <li>• Liens réseaux sociaux</li>
                                  </ul>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 mt-4 italic">
                                * Dans la limite des contraintes techniques détaillées dans l'onglet Conditions
                              </p>
                            </div>
                            
                            {/* Bonus première année */}
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                              <p className="text-green-800 font-medium text-sm">
                                🎁 Bonus première année : Hébergement professionnel + Nom de domaine + Certificat SSL inclus !
                              </p>
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
                  
                  <div className="space-y-4">
                    {/* Option Page supplémentaire - 50€ */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">📄 Page supplémentaire</h4>
                          <p className="text-gray-600">Au-delà des 5 pages incluses - Ajoutez autant de pages que nécessaire</p>
                        </div>
                        <div className="flex-shrink-0 text-right ml-6">
                          <p className="text-3xl font-bold text-[#0073a8]">{tarifs.pageSupp}€</p>
                          <p className="text-sm text-gray-500">par page</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Option Images - 50€ */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">📸 Pack images/vidéos professionnelles</h4>
                          <p className="text-gray-600">10 images / vidéos libres de droits sélectionnées pour votre site</p>
                        </div>
                        <div className="flex-shrink-0 text-right ml-6">
                          <p className="text-3xl font-bold text-green-700">{tarifs.packImages}€</p>
                          <p className="text-sm text-gray-500">par pack</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Option Maintenance - 120€ */}
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">🛠️ Forfait Maintenance</h4>
                          <p className="text-gray-600">12 interventions par an - Modifications de textes, images, actualités...</p>
                        </div>
                        <div className="flex-shrink-0 text-right ml-6">
                          <p className="text-3xl font-bold text-purple-700">{tarifs.maintenance}€</p>
                          <p className="text-sm text-gray-500">par an</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Option Rédaction - 150€ */}
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">✍️ Rédaction complète</h4>
                          <p className="text-gray-600">Textes professionnels pour les 5 pages de base (2 sessions de corrections incluses)</p>
                          <p className="text-sm text-gray-500 mt-1">Pages supplémentaires : +{tarifs.redactionPageSupp}€/page</p>
                        </div>
                        <div className="flex-shrink-0 text-right ml-6">
                          <p className="text-3xl font-bold text-orange-700">{tarifs.redactionSiteComplet}€</p>
                          <p className="text-sm text-gray-500">forfait</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Option Back Office - 150€ */}
                    <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">🔐 Back Office</h4>
                          <p className="text-gray-600">Interface d'administration pour modifier vous-même vos textes et images</p>
                          <p className="text-sm text-gray-500 mt-1">Formation incluse + accès sécurisé</p>
                        </div>
                        <div className="flex-shrink-0 text-right ml-6">
                          <p className="text-3xl font-bold text-indigo-700">150€</p>
                          <p className="text-sm text-gray-500">forfait</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services annuels */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold mb-2 text-center">Services annuels</h3>
                  <p className="text-center text-gray-600 mb-6">À partir de la deuxième année</p>
                  
                  <div className="space-y-4">
                    {/* Hébergement */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">🌐</span>
                          <div className="flex-1">
                            <h4 className="font-semibold">Hébergement & Domaine</h4>
                            <p className="text-gray-600 text-sm">Hébergement haute performance • Nom de domaine inclus • Certificat SSL • Sauvegardes quotidiennes</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right ml-6">
                          <p className="text-3xl font-bold text-blue-700">{tarifs.hebergement}€</p>
                          <p className="text-sm text-gray-500">par an</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Email */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">📧</span>
                          <div className="flex-1">
                            <h4 className="font-semibold">Email Professionnel</h4>
                            <p className="text-gray-600 text-sm">contact@votredomaine.fr • Interface pro • 10 Go stockage • Synchronisation mobile</p>
                            <p className="text-gray-500 text-xs mt-1">10€/mois par adresse</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right ml-6">
                          <p className="text-3xl font-bold text-green-700">{tarifs.emailPro}€</p>
                          <p className="text-sm text-gray-500">par an/adresse</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulateur de prix */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-300">
                  <h3 className="text-xl font-bold mb-6 text-center text-gray-800">
                    💡 Exemple de tarification
                  </h3>
                  <div className="max-w-lg mx-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                      <h4 className="font-semibold mb-4">Site 7 pages + rédaction + 3 emails :</h4>
                      
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3">Site 5 pages</td>
                            <td className="text-right font-medium">{tarifs.siteWeb}€</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3">+ 2 pages supplémentaires</td>
                            <td className="text-right">{2 * tarifs.pageSupp}€</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3">+ Rédaction complète (5 pages)</td>
                            <td className="text-right">{tarifs.redactionSiteComplet}€</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3">+ Rédaction 2 pages supp.</td>
                            <td className="text-right">{2 * tarifs.redactionPageSupp}€</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3">+ 3 adresses email</td>
                            <td className="text-right">{3 * tarifs.emailPro}€</td>
                          </tr>
                          <tr className="font-bold text-lg">
                            <td className="pt-4">Total première année</td>
                            <td className="text-right pt-4 text-[#0073a8]">{tarifs.siteWeb + (2 * tarifs.pageSupp) + tarifs.redactionSiteComplet + (2 * tarifs.redactionPageSupp) + (3 * tarifs.emailPro)}€ TTC</td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <div className="mt-4 pt-4 border-t text-xs text-gray-600">
                        <p>Années suivantes : {tarifs.hebergement}€ (hébergement) + {3 * tarifs.emailPro}€ (emails) = {tarifs.hebergement + (3 * tarifs.emailPro)}€/an</p>
                        <p className="mt-1">Avec maintenance : + {tarifs.maintenance}€/an</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <Link
                    href="/devis"
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
                        <strong>💡 Besoin d'aide ?</strong> Nous proposons la rédaction complète pour {tarifs.redactionSiteComplet}€ 
                        (5 pages de base) ou {tarifs.redactionPageSupp}€ par page supplémentaire, 
                        et des packs d'images à {tarifs.packImages}€ (10 images).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Limites techniques et fonctionnalités */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Capacités techniques et fonctionnalités disponibles
                  </h2>

                  <div className="space-y-6">
                    {/* Page d'accueil */}
                    <div className="border-l-4 border-[#0073a8] pl-6">
                      <h3 className="text-xl font-semibold mb-3">🏠 Page d'accueil</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="font-medium mb-2">Structure maximale :</p>
                          <ul className="space-y-1 text-gray-700">
                            <li>• 1 bannière principale (avec slider optionnel)</li>
                            <li>• 5 sections maximum</li>
                            <li>• 500 mots par section</li>
                            <li>• 3 témoignages maximum</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="font-medium mb-2">Médias autorisés :</p>
                          <ul className="space-y-1 text-gray-700">
                            <li>• 10 images maximum</li>
                            <li>• 1 vidéo d'arrière-plan</li>
                            <li>• Taille max : 2 Mo/image</li>
                            <li>• Formats : JPG, PNG, WebP</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-3 bg-blue-50 rounded-lg p-4">
                        <p className="font-medium mb-2 text-blue-800">Fonctionnalités disponibles :</p>
                        <ul className="space-y-1 text-gray-700 text-sm">
                          <li>• <strong>Slider/Carrousel</strong> : Défilement automatique d'images ou de contenus</li>
                          <li>• <strong>Compteurs animés</strong> : Pour afficher vos chiffres clés</li>
                          <li>• <strong>Boutons d'appel à l'action</strong> : Avec effets au survol</li>
                          <li>• <strong>Section actualités</strong> : Les 3 derniers articles de blog</li>
                        </ul>
                      </div>
                    </div>

                    {/* Pages standards */}
                    <div className="border-l-4 border-green-500 pl-6">
                      <h3 className="text-xl font-semibold mb-3">📄 Pages standards (Services, À propos, etc.)</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="font-medium mb-2">Contenu autorisé :</p>
                          <ul className="space-y-1 text-gray-700">
                            <li>• 1500 mots maximum</li>
                            <li>• 4 sections maximum</li>
                            <li>• 1 formulaire par page</li>
                            <li>• Tableaux illimités</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="font-medium mb-2">Médias autorisés :</p>
                          <ul className="space-y-1 text-gray-700">
                            <li>• 8 images maximum</li>
                            <li>• 1 galerie (20 photos max)</li>
                            <li>• 2 vidéos YouTube/Vimeo</li>
                            <li>• 3 PDF téléchargeables</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-3 bg-green-50 rounded-lg p-4">
                        <p className="font-medium mb-2 text-green-800">Fonctionnalités disponibles :</p>
                        <ul className="space-y-1 text-gray-700 text-sm">
                          <li>• <strong>Accordéons/FAQ</strong> : Questions-réponses dépliables</li>
                          <li>• <strong>Onglets</strong> : Pour organiser le contenu</li>
                          <li>• <strong>Timeline</strong> : Historique de votre entreprise</li>
                          <li>• <strong>Équipe</strong> : Présentation avec photos et bios</li>
                          <li>• <strong>Grille de services</strong> : Avec icônes et descriptions</li>
                        </ul>
                      </div>
                    </div>

                    {/* Pages spécifiques */}
                    <div className="border-l-4 border-purple-500 pl-6">
                      <h3 className="text-xl font-semibold mb-3">⚡ Pages avec fonctionnalités avancées</h3>
                      <div className="grid md:grid-cols-3 gap-3">
                        <div className="bg-purple-50 rounded-lg p-4">
                          <p className="font-medium mb-2 text-purple-800">📸 Galerie/Portfolio</p>
                          <ul className="space-y-1 text-gray-700 text-sm">
                            <li>• Jusqu'à 50 images</li>
                            <li>• Catégories filtrables</li>
                            <li>• Lightbox (zoom)</li>
                            <li>• Lazy loading</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <p className="font-medium mb-2 text-purple-800">📍 Contact/Localisation</p>
                          <ul className="space-y-1 text-gray-700 text-sm">
                            <li>• Google Maps interactive</li>
                            <li>• Formulaire avancé</li>
                            <li>• Horaires d'ouverture</li>
                            <li>• Multi-établissements</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <p className="font-medium mb-2 text-purple-800">📰 Blog/Actualités</p>
                          <ul className="space-y-1 text-gray-700 text-sm">
                            <li>• Articles illimités</li>
                            <li>• Catégories et tags</li>
                            <li>• Partage réseaux sociaux</li>
                            <li>• Articles similaires</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Fonctionnalités globales */}
                    <div className="border-l-4 border-yellow-500 pl-6">
                      <h3 className="text-xl font-semibold mb-3">🌟 Fonctionnalités disponibles sur tout le site</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <p className="font-medium mb-2 text-yellow-800">Intégrations externes</p>
                          <ul className="space-y-1 text-gray-700 text-sm">
                            <li>• <strong>Google My Business</strong> : Avis clients en temps réel</li>
                            <li>• <strong>Réseaux sociaux</strong> : Flux Instagram, Facebook, LinkedIn</li>
                            <li>• <strong>Calendly/Booking</strong> : Prise de rendez-vous en ligne</li>
                            <li>• <strong>Chatbot</strong> : Assistant virtuel (Crisp, Tawk.to)</li>
                            <li>• <strong>Newsletter</strong> : Inscription Mailchimp/Sendinblue</li>
                          </ul>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <p className="font-medium mb-2 text-yellow-800">Fonctionnalités techniques</p>
                          <ul className="space-y-1 text-gray-700 text-sm">
                            <li>• <strong>Pop-up intelligent</strong> : Promotion ou newsletter</li>
                            <li>• <strong>Barre de cookies RGPD</strong> : Conformité légale</li>
                            <li>• <strong>Mode sombre</strong> : Confort de lecture</li>
                            <li>• <strong>Recherche interne</strong> : Navigation facilitée</li>
                            <li>• <strong>Multi-langue</strong> : Version anglaise possible</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Limitations importantes */}
                    <div className="mt-6 bg-red-50 rounded-lg p-4 border border-red-200">
                      <p className="font-medium mb-2 text-red-800">❌ Fonctionnalités NON incluses (nécessitent un devis spécifique) :</p>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>• E-commerce / Boutique en ligne avec paiement</li>
                        <li>• Espace membre avec connexion utilisateur</li>
                        <li>• Réservation avec paiement en ligne</li>
                        <li>• Application mobile native</li>
                        <li>• Système de gestion complexe (CRM, ERP)</li>
                      </ul>
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
                        desc: "Nous vous envoyons une proposition détaillée",
                        delay: "Sous 24-48h"
                      },
                      {
                        num: "3",
                        title: "Validation",
                        desc: "Signature du devis et versement de l'acompte (50%)",
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
                        desc: "3 rounds de modifications inclus",
                        delay: "3-5 jours"
                      },
                      {
                        num: "8",
                        title: "Mise en ligne",
                        desc: "Paiement du solde (50%) et formation",
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
                          <li>• Acompte 50% à la commande</li>
                          <li>• Solde 50% à la livraison</li>
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
                        <h3 className="font-semibold mb-2 text-purple-800">📝 Vos responsabilités</h3>
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
                          <li>• Rédaction des textes</li>
                          <li>• Achat d'images</li>
                          <li>• Référencement avancé</li>
                          <li>• Fonctionnalités hors devis</li>
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
                    <li>• Les prix indiqués sont TTC (pas de TVA applicable - micro-entreprise)</li>
                    <li>• L'hébergement et le domaine doivent être renouvelés chaque année</li>
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
                  En général, comptez 1 semaine après réception de tous vos contenus (textes, images, logo). 
                  Le délai exact est confirmé dans le devis selon notre charge de travail actuelle.
                </p>
              </details>

              <details className="bg-white rounded-lg shadow-md p-6 group">
                <summary className="font-semibold cursor-pointer flex items-center justify-between">
                  Puis-je modifier mon site moi-même ?
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700">
                  Votre site est développé sur mesure pour être performant et sécurisé. Nous proposons deux services complémentaires :
                  <br/><br/>
                  <strong>🔐 Back Office ({tarifs.backOffice}€) :</strong> Une interface d'administration qui vous permet de modifier vous-même vos textes et images en toute autonomie. Idéal pour les mises à jour régulières de contenu.
                  <br/><br/>
                  <strong>🛠️ Forfait Maintenance ({tarifs.maintenance}€/an) :</strong> Pour les modifications techniques (réorganisation de pages, ajout de fonctionnalités, changement de design, etc.). Inclut 12 interventions techniques par an effectuées par nos soins.
                  <br/><br/>
                  <em>💡 Ces deux services peuvent être souscrits ensemble selon vos besoins.</em>
                </p>
              </details>

              <details className="bg-white rounded-lg shadow-md p-6 group">
                <summary className="font-semibold cursor-pointer flex items-center justify-between">
                  Que se passe-t-il si je ne renouvelle pas l'hébergement ?
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700">
                  Si vous ne renouvelez pas l'hébergement ({tarifs.hebergement}€/an), votre site sera désactivé 
                  et votre nom de domaine pourra être récupéré par quelqu'un d'autre. Nous vous envoyons une facture 
                  30 jours avant l'échéance pour éviter toute interruption. Vous pouvez choisir de refuser de payer 
                  la facture, nous serons alors informés et votre site ne sera pas prolongé.
                </p>
              </details>

              <details className="bg-white rounded-lg shadow-md p-6 group">
                <summary className="font-semibold cursor-pointer flex items-center justify-between">
                  Les emails professionnels sont-ils obligatoires ?
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700">
                  Non, c'est optionnel. Mais une adresse contact@votredomaine.fr est bien plus professionnelle 
                  qu'une adresse Gmail. Chaque adresse coûte {tarifs.emailPro}€/an (10€/mois).
                </p>
              </details>

              <details className="bg-white rounded-lg shadow-md p-6 group">
                <summary className="font-semibold cursor-pointer flex items-center justify-between">
                  Et si je n'ai pas de textes ou d'images ?
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700">
                  Pas de panique ! Nous proposons la rédaction complète de votre site (5 pages) pour {tarifs.redactionSiteComplet}€. 
                  Pour les pages supplémentaires, c'est seulement {tarifs.redactionPageSupp}€ par page.
                  Nous avons aussi des packs d'images et vidéos professionnelles à {tarifs.packImages}€ (10 médias).
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
                href="/devis"
                className="inline-flex items-center px-8 py-4 bg-white text-[#0073a8] font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                <span className="mr-2">🚀</span>
                Démarrer mon projet
              </Link>
              <a
                href="tel:0970019353"
                className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-white/30 transition-all"
              >
                <span className="mr-2">📞</span>
                <span>09 70 01 93 53</span>
              </a>
            </div>
          </div>
        </section>
      </div>
      )}
      
      <Footer />
    </>
  )
}