"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const numero = searchParams.get('numero')

  return (
    <div className="min-h-screen bg-gray-50 pt-[120px] pb-20">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          {/* Icône de succès */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Demande envoyée avec succès !
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            Nous avons bien reçu votre demande de devis.
          </p>

          {numero && (
            <div className="bg-gray-100 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-600">Votre référence :</p>
              <p className="text-2xl font-bold text-[#0073a8]">{numero}</p>
            </div>
          )}

          <div className="space-y-4 text-left bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-lg text-gray-900 mb-3">
              Que se passe-t-il maintenant ?
            </h2>
            <div className="flex items-start">
              <span className="text-[#0073a8] font-bold mr-3">1.</span>
              <p className="text-gray-700">
                Vous allez recevoir un email de confirmation avec votre devis en PDF
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-[#0073a8] font-bold mr-3">2.</span>
              <p className="text-gray-700">
                Notre équipe va étudier votre projet en détail
              </p>
            </div>
            <div className="flex items-start">
              <span className="text-[#0073a8] font-bold mr-3">3.</span>
              <p className="text-gray-700">
                Nous vous recontacterons sous 24-48h pour discuter de votre projet
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="px-6 py-3 bg-[#0073a8] text-white rounded-full font-semibold hover:bg-[#005580] transition-all"
            >
              Retour à l'accueil
            </Link>
            <a 
              href="tel:0646170207"
              className="px-6 py-3 border-2 border-[#0073a8] text-[#0073a8] rounded-full font-semibold hover:bg-[#0073a8] hover:text-white transition-all"
            >
              Nous appeler
            </a>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Une question ? Contactez-nous au 06 46 17 02 07 ou par email : web.online.concept@gmail.com
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Confirmation() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-[100px]">
        <div className="text-xl">Chargement...</div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}