'use client'

import { useState, useRef, useEffect } from 'react'

export default function ChatSection({ 
  messages, 
  onSendMessage, 
  isLoading, 
  onReset 
}) {
  const [inputValue, setInputValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)
  
  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    const messagesContainer = messagesEndRef.current?.parentElement
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }
  
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages])
  
  // Configuration de la reconnaissance vocale
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'fr-FR'
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('')
        setInputValue(transcript)
      }
      
      recognition.onerror = (event) => {
        console.error('Erreur reconnaissance vocale:', event.error)
        setIsRecording(false)
      }
      
      recognition.onend = () => {
        setIsRecording(false)
      }
      
      recognitionRef.current = recognition
    }
  }, [])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }
  
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur.')
      return
    }
    
    if (isRecording) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }
  
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  // Fonction pour copier la conversation
  const copyConversation = () => {
    const conversationText = messages.map(msg => {
      const sender = msg.role === 'user' ? 'Vous' : 'Florent'
      return `${sender}: ${msg.content}`
    }).join('\n\n')
    
    navigator.clipboard.writeText(conversationText)
      .then(() => {
        alert('Conversation copiée dans le presse-papiers !')
        setShowExportMenu(false)
      })
      .catch(err => {
        console.error('Erreur lors de la copie:', err)
      })
  }

  // Fonction pour télécharger la conversation
  const downloadConversation = () => {
    const conversationText = messages.map(msg => {
      const sender = msg.role === 'user' ? 'Vous' : 'Florent'
      return `${sender}: ${msg.content}`
    }).join('\n\n')
    
    const header = `Conversation avec Florent - Web Online Concept\nDate: ${new Date().toLocaleDateString('fr-FR')}\n${'='.repeat(50)}\n\n`
    const fullText = header + conversationText
    
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversation-florent-${new Date().toISOString().slice(0,10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    setShowExportMenu(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 h-[900px] flex flex-col">
      {/* Barre d'outils */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b">
        <h3 className="text-lg font-semibold text-gray-700">Conversation</h3>
        <div className="flex items-center gap-2">
          {/* Bouton reset */}
          <button
            onClick={onReset}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Nouvelle conversation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          {/* Bouton export */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Exporter la conversation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            
            {/* Menu d'export */}
            {showExportMenu && (
              <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg py-2 w-48 z-10 border">
                <button
                  onClick={copyConversation}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copier la conversation
                </button>
                <button
                  onClick={downloadConversation}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Télécharger (.txt)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </div>
        ))}
        
        {/* Indicateur de chargement */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                     style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                     style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                     style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Zone de saisie */}
      <form onSubmit={handleSubmit} className="border-t pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Posez votre question à Florent..."
            className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading || isRecording}
          />
          
          {/* Bouton micro */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-3 rounded-full transition-colors ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          
          {/* Bouton envoyer */}
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}