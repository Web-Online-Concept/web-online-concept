'use client'

import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function DevisConfirmation() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-[120px] pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              {/* Icône de succès */}
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Message de confirmation */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Demande de devis envoyée !
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                Merci pour votre demande. Nous avons bien reçu votre projet et nous vous répondrons dans les plus brefs délais.
              </p>

              {/* Informations */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h2 className="font-semibold text-gray-900 mb-3">
                  Que se passe-t-il maintenant ?
                </h2>
                <div className="space-y-2 text-left text-gray-700">
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2">1.</span>
                    <span>Vous allez recevoir un email de confirmation</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2">2.</span>
                    <span>Nous étudions votre projet en détail</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2">3.</span>
                    <span>Vous recevrez votre devis personnalisé sous 24-48h</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2">4.</span>
                    <span>Acceptez ou refusez le devis. Si vous refusez, nous en sommes informés et nos échanges s'arrêtent là</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2">5.</span>
                    <span>Si vous acceptez, effectuez le paiement des 50% pour valider le devis</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2">6.</span>
                    <span>Une fois votre paiement validé, nous commençons la création du site et vous contactons si besoin pour échanger ensemble</span>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retour à l'accueil
                </Link>
                <Link
                  href="/realisations"
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Voir nos réalisations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}