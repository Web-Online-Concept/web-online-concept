"use client"

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const numeroDevis = searchParams.get('numero')

  return (
    <div className="min-h-screen bg-gray-50 pt-[120px] pb-20">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Merci pour votre demande !
            </h1>
            <p className="text-lg text-gray-600">
              Votre demande de devis a bien été enregistrée
            </p>
            {numeroDevis && (
              <p className="text-sm text-gray-500 mt-2">
                Référence : {numeroDevis}
              </p>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-lg mb-4 text-gray-800">
              Que se passe-t-il maintenant ?
            </h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-[#0073a8] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <p className="ml-3 text-gray-700">
                  Nous allons étudier votre demande et vous enverrons dans les 24/48h un devis personnalisé
                </p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-[#0073a8] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <p className="ml-3 text-gray-700">
                  Si vous acceptez le devis, faites rapidement le paiement des 50% du solde (infos sur le devis)
                </p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-[#0073a8] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <p className="ml-3 text-gray-700">
                  Une fois votre paiement reçu, nous vous contacterons rapidement par téléphone afin de faire le point sur le projet
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold mb-3">Une question ?</h3>
            <p className="text-gray-600">
              Contactez-nous par email : <a href="mailto:web.online.concept@gmail.com" className="text-[#0073a8] hover:underline">web.online.concept@gmail.com</a>
            </p>
          </div>

          <Link 
            href="/"
            className="inline-block bg-[#0073a8] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#005580] transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationDevis() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-[120px] pb-20 flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}