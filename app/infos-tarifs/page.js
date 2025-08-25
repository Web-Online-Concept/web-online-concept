'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Check, Clock, Shield, HeadphonesIcon, Laptop, Search, PenTool, Rocket, MousePointer, RefreshCw, CheckCircle } from 'lucide-react'

export default function InfosTarifs() {
  const [tarifs, setTarifs] = useState(null)

  useEffect(() => {
    // Charger les tarifs depuis l'API
    fetch('/api/tarifs')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setTarifs(data)
        }
      })
      .catch(err => console.error('Erreur chargement tarifs:', err))
  }, [])

  // Valeurs par défaut si les tarifs ne sont pas chargés
  const defaultTarifs = {
    formuleBase: { prix: 500 },
    options: [],
    remises: []
  }

  const currentTarifs = tarifs || defaultTarifs

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0073a8] to-[#005580] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Site Web - {currentTarifs.formuleBase.prix}€ HT
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Formule de base
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/demande-devis"
                className="bg-white text-[#0073a8] px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
              >
                Demander un devis gratuit
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#processus"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#0073a8] transition-colors inline-flex items-center justify-center"
              >
                Voir le processus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bloc 1 - Services inclus */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Colonne 1 */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-[#0073a8] flex items-center">
                  ✨ Inclus dans votre site
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Design moderne et personnalisé</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Site responsive (mobile, tablette, PC)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>5 pages personnalisées (+pages légales inclues)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>SEO de base inclus</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Hébergement & NDD inclus la 1ere année</span>
                  </li>
                </ul>
              </div>

              {/* Colonne 2 */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-[#0073a8] flex items-center">
                  🎁 Services inclus
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Formation 1h à la prise en main</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Support technique 30 jours</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Certificat SSL (https)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Sites conformes RGPD</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Conseils divers</span>
                  </li>
                </ul>
              </div>

              {/* Colonne 3 */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-[#0073a8] flex items-center">
                  🎯 Idéal pour
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-[#0073a8] mr-2 mt-0.5 flex-shrink-0" />
                    <span>TPE / PME</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-[#0073a8] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Artisans & Commerçants</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-[#0073a8] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Professions libérales</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-[#0073a8] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Associations</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-[#0073a8] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Startups</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/demande-devis"
                className="bg-[#0073a8] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#005580] transition-colors inline-flex items-center"
              >
                Demander un devis gratuit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bloc 2 - Options disponibles */}
      <section className="py-16 bg-gray-50">
        <div className="relative bg-gradient-to-r from-[#029be5] to-[#0288d1] text-white py-8 mb-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center">Options disponibles</h2>
            <p className="text-center mt-2 text-blue-100">Personnalisez votre site selon vos besoins</p>
          </div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {currentTarifs.options.map((option) => (
              <div key={option.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{option.nom}</h3>
                <p className="text-sm text-gray-600 mb-4">{option.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-[#0073a8] bg-blue-50 px-3 py-1 rounded-lg">
                    {option.prix}€{option.unite ? `/${option.unite}` : ''}
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link
              href="/demande-devis"
              className="bg-[#0073a8] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#005580] transition-colors inline-flex items-center"
            >
              Personnaliser mon devis
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bloc 3 - Processus de création */}
      <section id="processus" className="py-16 bg-white">
        <div className="relative bg-gradient-to-r from-[#029be5] to-[#0288d1] text-white py-8 mb-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center">Processus de création</h2>
            <p className="text-center mt-2 text-blue-100">4 étapes simples & un accompagnement personnalisé</p>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-[#0073a8] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="font-semibold mb-2">Devis Gratuit</h3>
                <p className="text-sm text-gray-600">Envoi de votre demande personnalisée</p>
              </div>
              <div className="text-center">
                <div className="bg-[#0073a8] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="font-semibold mb-2">Conception</h3>
                <p className="text-sm text-gray-600">Création sur mesure de votre site</p>
              </div>
              <div className="text-center">
                <div className="bg-[#0073a8] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="font-semibold mb-2">Validation</h3>
                <p className="text-sm text-gray-600">Révisions et ajustements</p>
              </div>
              <div className="text-center">
                <div className="bg-[#0073a8] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                <h3 className="font-semibold mb-2">Mise en ligne</h3>
                <p className="text-sm text-gray-600">Votre site 100% opérationnel</p>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6 text-center text-[#0073a8]">Notre processus détaillé</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="bg-[#0073a8] text-white text-sm px-2 py-1 rounded font-semibold">1</span>
                  <div className="flex-1">
                    <h4 className="font-semibold">Demande de devis</h4>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Immédiat</span>
                      <span>Vous remplissez le formulaire en ligne</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-[#0073a8] text-white text-sm px-2 py-1 rounded font-semibold">2</span>
                  <div className="flex-1">
                    <h4 className="font-semibold">Devis personnalisé</h4>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Sous 24-48h</span>
                      <span>Nous analysons votre demande et créons votre devis</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-[#0073a8] text-white text-sm px-2 py-1 rounded font-semibold">3</span>
                  <div className="flex-1">
                    <h4 className="font-semibold">Validation</h4>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>À votre rythme</span>
                      <span>Signature du devis et versement acompte (50%)</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-[#0073a8] text-white text-sm px-2 py-1 rounded font-semibold">4</span>
                  <div className="flex-1">
                    <h4 className="font-semibold">Brief créatif</h4>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>1h par téléphone</span>
                      <span>Nous définissons ensemble vos besoins exacts</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-[#0073a8] text-white text-sm px-2 py-1 rounded font-semibold">5</span>
                  <div className="flex-1">
                    <h4 className="font-semibold">Envoi des contenus</h4>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Sous 1 semaine</span>
                      <span>Vous nous transmettez textes, images et logo</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-[#0073a8] text-white text-sm px-2 py-1 rounded font-semibold">6</span>
                  <div className="flex-1">
                    <h4 className="font-semibold">Création</h4>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>2-3 semaines</span>
                      <span>Nous développons votre site web</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-[#0073a8] text-white text-sm px-2 py-1 rounded font-semibold">7</span>
                  <div className="flex-1">
                    <h4 className="font-semibold">Révisions</h4>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>2h</span>
                      <span>1 session de modifications inclus</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-[#0073a8] text-white text-sm px-2 py-1 rounded font-semibold">8</span>
                  <div className="flex-1">
                    <h4 className="font-semibold">Mise en ligne</h4>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>1h</span>
                      <span>Votre site est en ligne et opérationnel</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bloc 4 - Conditions détaillées */}
      <section className="py-16 bg-gray-50">
        <div className="relative bg-gradient-to-r from-[#29b6f6] to-[#039be5] text-white py-8 mb-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center">Conditions détaillées</h2>
            <p className="text-center mt-2 text-blue-100">Détail complet des conditions de créations</p>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-[#0073a8]">📁 Contenus à fournir</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Textes de vos pages</li>
                <li>• Photos haute résolution</li>
                <li>• Logo (format vectoriel si possible)</li>
                <li>• Informations légales de l'entreprise</li>
                <li>• Accès à vos réseaux sociaux si besoin</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-[#0073a8]">💳 Paiements</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Acompte 50% à la commande</li>
                <li>• Solde 50% à la livraison</li>
                <li>• Virement bancaire uniquement</li>
                <li>• Livraison du site après paiement total</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-[#0073a8]">✅ Garanties</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Site garanti 30 jours</li>
                <li>• Corrections bugs incluses</li>
                <li>• Formation à l'utilisation</li>
                <li>• Support technique initial</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-[#0073a8]">📋 Responsabilités</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Propriété intellectuelle des contenus</li>
                <li>• Conformité légale des textes</li>
                <li>• Droits d'utilisation des images</li>
                <li>• Exactitude des informations fournies</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-[#0073a8]">❌ Non inclus</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Rédaction des contenus</li>
                <li>• Shooting photo professionnel</li>
                <li>• Création de logo</li>
                <li>• Traductions</li>
                <li>• Maintenance après 30 jours</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-[#0073a8]">ℹ️ Informations importantes</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Délai moyen : 3-4 semaines</li>
                <li>• Technologies modernes utilisées</li>
                <li>• Compatible tous navigateurs</li>
                <li>• Optimisé pour le référencement</li>
                <li>• Code source propre et documenté</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-br from-[#0073a8] to-[#005580] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à créer votre site web ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Obtenez votre devis personnalisé en moins de 48h
          </p>
          <Link
            href="/demande-devis"
            className="bg-white text-[#0073a8] px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center text-lg"
          >
            Demander mon devis gratuit
            <ChevronRight className="ml-2 h-6 w-6" />
          </Link>
        </div>
      </section>
    </div>
  )
}