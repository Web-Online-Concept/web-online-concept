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
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      role: 'assistant',
      content: "Bonjour ! Je suis Florent, assistant virtuel du site Web Online Concept. Je suis là pour répondre à toutes vos questions sur notre entreprise et nos produits, et vous permettre de tester comment fonctionne un assistant virtuel en ligne. Posez moi toutes les questions que vous souhaitez, par écris ou en vocal !"
    }
    setMessages([welcomeMessage])
  }, [])

  const handleStartConversation = async () => {
    setHasStarted(true)
    
    // Utiliser directement le message de bienvenue existant
    const welcomeText = messages[0].content
    setCurrentText(welcomeText)
    
    try {
      const response = await fetch('/api/florent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: "dis bonjour",
          isWelcome: true 
        })
      })
      
      const data = await response.json()
      
      if (data.audioUrl) {
        setCurrentAudio(data.audioUrl)
        setIsSpeaking(true)
      } else {
        // Si pas d'audio ElevenLabs, utiliser la voix du navigateur
        setIsSpeaking(true)
      }
    } catch (error) {
      console.error('Erreur:', error)
      // En cas d'erreur, utiliser la voix du navigateur
      setIsSpeaking(true)
    }
  }

  const handleSendMessage = async (message) => {
    if (!message.trim() || isLoading) return

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
      const response = await fetch('/api/florent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })

      const data = await response.json()
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response || "Je suis désolé, je n'ai pas pu comprendre votre question."
      }

      // MODIFICATION ICI : Afficher le message immédiatement
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
      
      // Préparer la voix
      setCurrentText(aiMessage.content)
      if (data.audioUrl) {
        setCurrentAudio(data.audioUrl)
      }
      setIsSpeaking(true)

    } catch (error) {
      console.error('Erreur:', error)
      setIsLoading(false)
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Désolé, j'ai rencontré un problème technique. Pouvez-vous réessayer ?"
      }
      
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleReset = () => {
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: "Bonjour ! Je suis Florent, assistant virtuel du site Web Online Concept. Je suis là pour répondre à toutes vos questions sur notre entreprise et nos produits, et vous permettre de tester comment fonctionne un assistant virtuel en ligne. Posez moi toutes les questions que vous souhaitez, par écris ou en vocal !"
    }])
    setIsLoading(false)
    setIsSpeaking(false)
    setCurrentText('')
    setCurrentAudio(null)
    setHasStarted(false)
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Avatar Florent - 3/12 (25%) */}
          <div className="md:col-span-3">
            <div className="relative bg-white rounded-xl shadow-lg p-8 h-[600px] flex flex-col justify-start">
              <FlorentAvatar 
                isSpeaking={isSpeaking} 
                isListening={false} 
                isThinking={isLoading}
                onStopSpeaking={handleStopSpeaking}
              />
            </div>
          </div>

          {/* Chat Section - 9/12 (75%) */}
          <div className="md:col-span-9">
            <ChatSection 
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onReset={handleReset}
              hasStarted={hasStarted}
              onStart={handleStartConversation}
            />
          </div>
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