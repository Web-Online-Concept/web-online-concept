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

  const handleStartConversation = async (voiceEnabled = true) => {
    setHasStarted(true)
    
    // Utiliser directement le message de bienvenue existant
    const welcomeText = messages[0].content
    
    // Si la voix est activée, lire le message
    if (voiceEnabled) {
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
  }

  const handleSendMessage = async (message, voiceEnabled = true) => {
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
      
      // Préparer la voix seulement si activée
      if (voiceEnabled) {
        setCurrentText(aiMessage.content)
        if (data.audioUrl) {
          setCurrentAudio(data.audioUrl)
        }
        setIsSpeaking(true)
      }

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
            La Puissance de l'IA pour Votre Entreprise
          </h1>
          <p className="text-xl text-white/90">
            Testez notre assistant intelligent (Voix/Textes)
          </p>
        </div>
      </section>

      {/* Section sous-titre */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <p className="text-lg text-gray-600">
            Notre assistant virtuel Florent n'est qu'un aperçu des possibilités infinies qu'offre l'intelligence artificielle pour transformer votre business
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

      {/* Section de présentation de l'assistant IA */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Grille des capacités */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Support Client 24/7</h3>
              <p className="text-gray-600">
                Répondez instantanément aux questions de vos clients, jour et nuit. L'IA ne dort jamais et assure une présence continue sur votre site.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Génération de Leads</h3>
              <p className="text-gray-600">
                Collectez automatiquement les coordonnées des prospects intéressés et qualifiez-les selon vos critères commerciaux.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Formation Personnalisée</h3>
              <p className="text-gray-600">
                Créez des assistants qui forment vos équipes ou clients sur vos produits, procédures et meilleures pratiques.
              </p>
            </div>
          </div>

          {/* Section cas d'usage */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white mb-16">
            <h3 className="text-3xl font-bold mb-8 text-center">Cas d'Usage Concrets par Secteur</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">💼</span>
                  E-commerce
                </h4>
                <ul className="space-y-2 text-white/90">
                  <li>• Assistant shopping qui guide vers les produits</li>
                  <li>• Suivi de commande automatisé</li>
                  <li>• Recommandations personnalisées</li>
                  <li>• Gestion des retours et SAV</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">🏥</span>
                  Santé
                </h4>
                <ul className="space-y-2 text-white/90">
                  <li>• Prise de rendez-vous intelligente</li>
                  <li>• Rappels de médicaments</li>
                  <li>• Première orientation médicale</li>
                  <li>• FAQ sur les traitements</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">🏢</span>
                  Immobilier
                </h4>
                <ul className="space-y-2 text-white/90">
                  <li>• Qualification des prospects</li>
                  <li>• Visites virtuelles guidées</li>
                  <li>• Estimation automatique</li>
                  <li>• Matching acheteur/bien</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3 flex items-center">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">📚</span>
                  Formation
                </h4>
                <ul className="space-y-2 text-white/90">
                  <li>• Tuteur IA personnalisé</li>
                  <li>• Quiz et évaluations</li>
                  <li>• Support étudiant 24/7</li>
                  <li>• Parcours adaptatifs</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section automatisations */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12">Automatisations Intelligentes</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-6 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Intégration CRM Automatique</h4>
                  <p className="text-gray-600">
                    Connectez votre assistant à votre CRM (Salesforce, HubSpot, etc.) pour enregistrer automatiquement chaque interaction, 
                    qualifier les leads et déclencher des workflows commerciaux.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Emails de Suivi Intelligents</h4>
                  <p className="text-gray-600">
                    L'IA envoie des emails personnalisés selon les interactions : devis après discussion produit, 
                    relance si abandon panier, remerciements post-achat avec recommandations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Analyse Comportementale</h4>
                  <p className="text-gray-600">
                    Comprenez vos visiteurs : pages visitées, questions posées, objections soulevées. 
                    L'IA génère des rapports détaillés pour optimiser votre stratégie commerciale.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA final */}
          <div className="bg-gray-900 rounded-2xl p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-6">
              Prêt à Révolutionner Votre Relation Client ?
            </h3>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              L'assistant Florent n'est qu'un début. Nous créons des assistants IA sur-mesure, 
              parfaitement adaptés à votre secteur, vos processus et votre ton de marque.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/demande-devis" className="inline-block px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-colors duration-200 transform hover:scale-105">
                Demander un Devis Gratuit
              </a>
              <a href="/contact" className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-full transition-colors duration-200 transform hover:scale-105">
                Discuter de Mon Projet
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}