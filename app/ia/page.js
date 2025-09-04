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

  const handleReset = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Assistant IA Web Online Concept
          </h1>
          <p className="text-gray-600">
            Posez vos questions à Florent, notre expert digital
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Avatar Florent */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <FlorentAvatar 
              isSpeaking={isSpeaking}
              isListening={isListening}
              isThinking={isLoading}
            />
          </div>

          {/* Zone de chat */}
          <div className="bg-white rounded-2xl shadow-xl p-8 h-[600px] flex flex-col">
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