'use client'

import { useEffect } from 'react'
import Image from 'next/image'

export default function FlorentAvatar({ isSpeaking, isListening, isThinking, onStopSpeaking }) {
  
  return (
    <div className="relative w-full mx-auto">
      {/* Conteneur principal de l'avatar */}
      <div className={`relative transition-all duration-300 ${isThinking ? 'scale-98' : 'scale-100'}`}>
        {/* Photo de Florent */}
        <div className="relative rounded-2xl shadow-2xl overflow-hidden w-[200px] h-[250px] mx-auto">
          <Image
            src="/images/florent-avatar.jpg"
            alt="Florent - Consultant Digital"
            width={200}
            height={250}
            className="object-cover rounded-2xl"
            priority
          />
          
          {/* Indicateur de parole */}
          {isSpeaking && (
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-500/20 to-transparent pointer-events-none">
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Badge de statut */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <div className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            isListening ? 'bg-red-500 text-white' :
            isThinking ? 'bg-amber-500 text-white' :
            isSpeaking ? 'bg-blue-500 text-white' :
            'bg-green-500 text-white'
          }`}>
            {isListening ? 'Écoute...' :
             isThinking ? 'Réflexion...' :
             isSpeaking ? 'Parle...' :
             'Disponible'}
          </div>
        </div>
      </div>
      
      {/* Informations sur Florent */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">IA Florent</h2>
        <p className="text-gray-600 mt-1">Web Online Concept</p>
        <p className="text-sm text-gray-500 mt-2">Testez comment fonctionne un assistant virtuel en ligne</p>
        
        {/* Bouton Arrêter la voix - Juste sous le texte */}
        {isSpeaking && (
          <button
            onClick={() => onStopSpeaking && onStopSpeaking()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
              <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
            </svg>
            Arrêter la voix
          </button>
        )}
      </div>
      
      {/* Effet de respiration subtile */}
      <style jsx>{`
        .scale-98 {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  )
}