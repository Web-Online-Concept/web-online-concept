"use client"

import { forwardRef, useImperativeHandle, useRef } from 'react'

const VoiceHandler = forwardRef(({ onStartSpeaking, onStopSpeaking }, ref) => {
  const audioRef = useRef(null)
  const synthRef = useRef(null)
  
  useImperativeHandle(ref, () => ({
    // Méthode pour la synthèse vocale basique
    speak: (text) => {
      if ('speechSynthesis' in window) {
        // Annuler toute parole en cours
        window.speechSynthesis.cancel()
        
        const utterance = new SpeechSynthesisUtterance(text)
        
        // Configuration pour une voix française masculine
        utterance.lang = 'fr-FR'
        utterance.rate = 0.9
        utterance.pitch = 0.9
        utterance.volume = 1
        
        // Chercher une voix française masculine
        const voices = window.speechSynthesis.getVoices()
        const frenchMaleVoice = voices.find(voice => 
          voice.lang.includes('fr') && 
          (voice.name.toLowerCase().includes('male') || 
           voice.name.toLowerCase().includes('homme') ||
           voice.name.includes('Thomas') ||
           voice.name.includes('Nicolas'))
        )
        
        if (frenchMaleVoice) {
          utterance.voice = frenchMaleVoice
        }
        
        utterance.onstart = () => {
          onStartSpeaking()
        }
        
        utterance.onend = () => {
          onStopSpeaking()
        }
        
        utterance.onerror = (event) => {
          console.error('Erreur synthèse vocale:', event)
          onStopSpeaking()
        }
        
        window.speechSynthesis.speak(utterance)
      }
    },
    
    // Méthode pour jouer un fichier audio (si on utilise ElevenLabs)
    playAudio: async (audioUrl) => {
      try {
        onStartSpeaking()
        
        // Créer un nouvel élément audio
        const audio = new Audio(audioUrl)
        audioRef.current = audio
        
        audio.onended = () => {
          onStopSpeaking()
          audioRef.current = null
        }
        
        audio.onerror = (error) => {
          console.error('Erreur lecture audio:', error)
          onStopSpeaking()
          audioRef.current = null
        }
        
        // Jouer l'audio
        await audio.play()
        
      } catch (error) {
        console.error('Erreur lors de la lecture:', error)
        onStopSpeaking()
        
        // Fallback vers la synthèse vocale
        if ('speechSynthesis' in window && typeof audioUrl === 'string') {
          console.log('Fallback vers synthèse vocale')
          // Cette partie serait utilisée si on passe le texte au lieu de l'URL
        }
      }
    },
    
    // Méthode pour arrêter toute parole/audio
    stop: () => {
      // Arrêter la synthèse vocale
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      
      // Arrêter l'audio en cours
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      
      onStopSpeaking()
    }
  }))
  
  // Charger les voix au montage du composant
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.getVoices()
    
    // Certains navigateurs nécessitent un event listener
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices()
    }
  }
  
  return null // Composant invisible
})

VoiceHandler.displayName = 'VoiceHandler'

export default VoiceHandler