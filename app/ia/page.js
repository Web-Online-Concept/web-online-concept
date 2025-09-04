'use client'

import { useState, useEffect } from 'react'
import FlorentAvatar from './components/FlorentAvatar'
import ChatSection from './components/ChatSection'
import VoiceHandler from './components/VoiceHandler'

export default function IAPage() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentText, setCurrentText] = useState('')
  const [currentAudio, setCurrentAudio] = useState(null)
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    // Message de bienvenue au chargement
    const welcomeMessage = {
      id: 1,
      role: 'assistant',
      content: "Bonjour ! Je suis Florent, consultant digital chez Web Online Concept. Je suis là pour répondre à toutes vos questions sur la création de sites internet, mais aussi sur tout autre sujet qui vous intéresse. Comment puis-je vous aider aujourd'hui ?"
    }
    setMessages([welcomeMessage])
    setCurrentText(welcomeMessage.content)
    setIsSpeaking(true)
  }, [])

  const handleSendMessage = async (message) => {
    if (!message.trim() || isLoading) return

    // Ajouter le message utilisateur
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setCurrentText('')
    setCurrentAudio(null)
    setIsSpeaking(false)

    try {
      // Appeler l'API
      const response = await fetch('/api/florent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      })

      const data = await response.json()
      
      // Créer la réponse IA
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response || "Je suis désolé, je n'ai pas pu comprendre votre question."
      }

      // Afficher la réponse et la lire
      const newMessages = [...messages, userMessage, aiMessage]
      setMessages(newMessages)
      setIsLoading(false)
      
      // Si on a un audioUrl d'ElevenLabs, le passer au VoiceHandler
      if (data.audioUrl) {
        setCurrentAudio(data.audioUrl)
      }
      setCurrentText(aiMessage.content)
      setIsSpeaking(true)

    } catch (error) {
      console.error('Erreur:', error)
      setIsLoading(false)
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Désolé, j'ai rencontré un problème technique. Pouvez-vous réessayer ?"
      }
      
      setMessages(prev => [...prev, userMessage, errorMessage])
    }
  }

  const handleReset = () => {
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: "Bonjour ! Je suis Florent, consultant digital chez Web Online Concept. Comment puis-je vous aider aujourd'hui ?"
    }])
    setIsLoading(false)
    setIsSpeaking(false)
    setCurrentText('')
    setCurrentAudio(null)
  }

  const handleStopSpeaking = () => {
    if (window.stopSpeaking) {
      window.stopSpeaking()
    }
    setIsSpeaking(false)
    setCurrentAudio(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header Hero */}
      <section className="bg-gradient-to-r from-[#0073a8] to-[#005580] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Assistant IA
          </h1>
          <p className="text-xl text-white/90">
            Testez notre assistant intelligent (Voix/Textes)
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Avatar Florent */}
          <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-8 relative">
            <FlorentAvatar isLoading={isLoading} isSpeaking={isSpeaking} />
            
            {/* Bouton arrêter la voix */}
            {isSpeaking && (
              <button
                onClick={handleStopSpeaking}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
                  <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
                </svg>
                Arrêter la voix
              </button>
            )}
          </div>

          {/* Chat Section */}
          <ChatSection 
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onReset={handleReset}
          />
        </div>
      </div>

      <VoiceHandler 
        text={currentText}
        audioUrl={currentAudio}
        isPlaying={isSpeaking}
        onSpeakingChange={setIsSpeaking}
      />
    </div>
  )
}