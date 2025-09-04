'use client'

import Image from 'next/image'

export default function FlorentAvatar({ isLoading, isSpeaking }) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Avatar en haut */}
      <div className="relative mb-6">
        <Image
          src="/images/florent-avatar.jpg"
          alt="Florent - Consultant Digital"
          width={600}
          height={750}
          className="rounded-lg shadow-md"
          priority
        />
        
        {/* Indicateur de statut */}
        <div className={`absolute bottom-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${
          isLoading 
            ? 'bg-yellow-500/90 text-white' 
            : isSpeaking 
              ? 'bg-green-500/90 text-white animate-pulse' 
              : 'bg-blue-500/90 text-white'
        }`}>
          {isLoading ? 'Réflexion...' : isSpeaking ? 'Je parle' : 'À l\'écoute'}
        </div>
      </div>
      
      {/* Texte descriptif */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">Florent</h3>
        <p className="text-gray-600">Consultant Web Online Concept</p>
        <p className="text-sm text-gray-500 mt-1">Testez comment fonctionne une IA en ligne</p>
      </div>
    </div>
  )
}