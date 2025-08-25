"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function InfosTarifs() {
  const [tarifs, setTarifs] = useState(null)

  useEffect(() => {
    fetch('/api/tarifs')
      .then(res => res.json())
      .then(data => setTarifs(data))
      .catch(err => console.error('Erreur chargement tarifs:', err))
  }, [])

  if (!tarifs) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[100px]">
        <div className="text-xl">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[120px] pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0073a8] to-[#006a87] text-white py-16">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Tarifs Transparents & Sans Surprise
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Un concept simple : une formule de base complète + des options à la carte. 
            Vous ne payez que ce dont vous avez besoin.
          </p>
        </div>
      </section>

      {/* Formule de Base */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#0073a8] to-[#00b4d8] p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">{tarifs.formuleBase.nom}</h2>
              <p className="text-5xl font-bold">{tarifs.formuleBase.prix}€ <span className="text-xl font-normal">HT</span></p>
            </div>
            <div className="p-8">
              <p className="text-lg text-gray-700 mb-8">{tarifs.formuleBase.description}</p>
              
              <h3 className="text-xl font-bold mb-4 text-gray-800">Inclus dans la formule de base :</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-semibold">5 pages personnalisées</p>
                    <p className="text-sm text-gray-600">Accueil, services, à propos, contact + 1 au choix</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-semibold">Design sur mesure</p>
                    <p className="text-sm text-gray-600">Création graphique adaptée à votre image</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-semibold">100% Responsive</p>
                    <p className="text-sm text-gray-600">Parfait sur mobile, tablette et ordinateur</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-semibold">SEO de base</p>
                    <p className="text-sm text-gray-600">Optimisation pour les moteurs de recherche</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-semibold">Hébergement 1 an</p>
                    <p className="text-sm text-gray-600">Hébergement sécurisé et nom de domaine</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-semibold">Formation incluse</p>
                    <p className="text-sm text-gray-600">Apprenez à gérer votre site facilement</p>
                  </div>
                </div>
              </div>

              <Link href="/demande-devis" className="inline-block bg-[#0073a8] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#005580] transition-all transform hover:scale-105">
                Demander un devis gratuit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Options à la carte */}
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Options à la carte</h2>
            <p className="text-xl text-gray-600">
              Ajoutez uniquement les fonctionnalités dont vous avez besoin
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tarifs.options.map((option) => (
              <div key={option.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{option.nom}</h3>
                <p className="text-3xl font-bold text-[#0073a8] mb-3">
                  {option.prix}€ 
                  {option.unite && <span className="text-base font-normal text-gray-600"> {option.unite}</span>}
                </p>
                {option.description && (
                  <p className="text-gray-600">{option.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Comment ça marche ?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0073a8] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Demande de devis</h3>
              <p className="text-gray-600">Remplissez le formulaire en ligne en 2 minutes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0073a8] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Étude du projet</h3>
              <p className="text-gray-600">Nous analysons vos besoins et vous conseillons</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0073a8] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Validation</h3>
              <p className="text-gray-600">Vous validez le devis et nous démarrons</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0073a8] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Livraison</h3>
              <p className="text-gray-600">Votre site est en ligne et opérationnel</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Questions fréquentes
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Combien de temps pour créer mon site ?</h3>
              <p className="text-gray-600">
                En moyenne, comptez 2 à 4 semaines selon la complexité du projet. 
                Nous vous tenons informé à chaque étape.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Puis-je modifier mon site moi-même ?</h3>
              <p className="text-gray-600">
                Oui ! Nous vous formons à l'utilisation de votre site. 
                Vous pourrez facilement modifier vos textes et images.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Que comprend l'hébergement ?</h3>
              <p className="text-gray-600">
                L'hébergement inclut : nom de domaine, certificat SSL, sauvegardes automatiques, 
                support technique et maintenance de sécurité.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Et après la première année ?</h3>
              <p className="text-gray-600">
                L'hébergement est renouvelable à 120€/an. Vous restez propriétaire de votre site 
                et pouvez changer d'hébergeur si vous le souhaitez.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-[#0073a8] to-[#006a87]">
        <div className="container max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Demandez votre devis gratuit et sans engagement
          </p>
          <Link href="/demande-devis" className="inline-block bg-white text-[#0073a8] px-8 py-4 rounded-full font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg">
            Obtenir mon devis personnalisé
          </Link>
        </div>
      </section>
    </div>
  )
}