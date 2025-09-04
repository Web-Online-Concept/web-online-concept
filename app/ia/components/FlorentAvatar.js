"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function FlorentAvatar({ isSpeaking, isListening, isThinking }) {
  const [blinkAnimation, setBlinkAnimation] = useState(false)
  
  // Animation de clignement des yeux
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkAnimation(true)
      setTimeout(() => setBlinkAnimation(false), 150)
    }, 3000 + Math.random() * 2000)
    
    return () => clearInterval(blinkInterval)
  }, [])

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Conteneur principal de l'avatar */}
      <div className={`relative transition-all duration-300 ${isThinking ? 'scale-98' : 'scale-100'}`}>
        {/* Photo de Florent */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <Image
            src="/images/florent-avatar.jpg"
            alt="Florent - Consultant Digital"
            width={400}
            height={500}
            className="object-cover"
            priority
          />
          
          {/* Overlay pour les yeux (effet clignement) */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-150 pointer-events-none ${
              blinkAnimation ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              clipPath: 'polygon(25% 35%, 75% 35%, 75% 45%, 25% 45%)'
            }}
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
          <div className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            isListening ? 'bg-red-500 text-white' :
            isThinking ? 'bg-amber-500 text-white' :
            isSpeaking ? 'bg-blue-500 text-white' :
            'bg-green-500 text-white'
          }`}>
            {isListening ? '🎤 Écoute...' :
             isThinking ? '🤔 Réflexion...' :
             isSpeaking ? '🗣️ Parle...' :
             '✅ Disponible'}
          </div>
        </div>
      </div>
      
      {/* Informations sur Florent */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Florent</h2>
        <p className="text-gray-600 mt-1">Consultant Digital Senior</p>
        <p className="text-sm text-gray-500 mt-2">Expert en transformation digitale</p>
      </div>
      
      {/* Effet de respiration subtile - DÉSACTIVÉ pour l'instant */}
      <style jsx>{`
        .scale-98 {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  )
}