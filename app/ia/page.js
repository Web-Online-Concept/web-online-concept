"use client"

import { useState, useEffect, useRef } from 'react'
import FlorentAvatar from './components/FlorentAvatar'
import ChatSection from './components/ChatSection'
import VoiceHandler from './components/VoiceHandler'

export default function IAPage() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const voiceHandlerRef = useRef(null)

  // Message de bienvenue au chargement
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      type: 'assistant',
      text: "Bonjour, je suis Florent, votre consultant digital chez Web Online Concept. Je suis ici pour répondre à toutes vos questions sur la création de sites internet, nos services, ou tout autre sujet qui vous intéresse. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date()
    }
    
    setMessages([welcomeMessage])
    
    // Jouer le message de bienvenue
    setTimeout(() => {
      if (voiceHandlerRef.current) {
        voiceHandlerRef.current.speak(welcomeMessage.text)
      }
    }, 1000)
  }, [])

  const handleSendMessage = async (userMessage) => {
    // Ajouter le message utilisateur
    const newUserMessage = {
      id: messages.length + 1,
      type: 'user',
      text: userMessage,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newUserMessage])
    setIsLoading(true)

    try {
      // Appel à l'API Claude
      const response = await fetch('/api/florent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      })

      const data = await response.json()
      
      // Ajouter la réponse de Florent
      const assistantMessage = {
        id: messages.length + 2,
        type: 'assistant',
        text: data.response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
      // Faire parler Florent
      if (voiceHandlerRef.current && data.audioUrl) {
        voiceHandlerRef.current.playAudio(data.audioUrl)
      } else if (voiceHandlerRef.current) {
        voiceHandlerRef.current.speak(data.response)
      }
      
    } catch (error) {
      console.error('Erreur:', error)
      const errorMessage = {
        id: messages.length + 2,
        type: 'assistant',
        text: "Je m'excuse, j'ai rencontré une difficulté technique. Pourriez-vous reformuler votre question ?",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleStopSpeaking = () => {
    if (voiceHandlerRef.current) {
      voiceHandlerRef.current.stop()
      setIsSpeaking(false)
    }
  }

  const handleReset = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header - Même style que les autres pages */}
      <section className="bg-gradient-to-r from-[#0073a8] to-[#005580] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Assistant IA
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Testez notre assistant intelligent (Voix/Textes)
            </p>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Avatar Florent */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-center">
            <FlorentAvatar 
              isSpeaking={isSpeaking}
              isListening={isListening}
              isThinking={isLoading}
            />
            
            {/* Bouton Stop - Affiché uniquement quand Florent parle */}
            {isSpeaking && (
              <div className="text-center mt-4">
                <button
                  onClick={handleStopSpeaking}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-colors flex items-center gap-2 mx-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  Arrêter la voix
                </button>
              </div>
            )}
          </div>

          {/* Zone de chat */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col">
            <ChatSection
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onStartListening={() => setIsListening(true)}
              onStopListening={() => setIsListening(false)}
            />
          </div>
        </div>

        {/* Bouton reset discret */}
        <div className="text-center mt-8">
          <button
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors underline"
          >
            Nouvelle conversation
          </button>
        </div>

        {/* Gestionnaire de voix invisible */}
        <VoiceHandler
          ref={voiceHandlerRef}
          onStartSpeaking={() => setIsSpeaking(true)}
          onStopSpeaking={() => setIsSpeaking(false)}
        />
      </div>
    </div>
  )
}