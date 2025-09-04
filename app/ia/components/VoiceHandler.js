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
        
        // Attendre que les voix soient chargées
        const speakWithVoice = () => {
          const utterance = new SpeechSynthesisUtterance(text)
          
          // Configuration pour une voix française masculine
          utterance.lang = 'fr-FR'
          utterance.rate = 0.95
          utterance.pitch = 0.8 // Plus bas pour une voix masculine
          utterance.volume = 1
          
          // Chercher une voix française masculine
          const voices = window.speechSynthesis.getVoices()
          
          // Priorité aux voix masculines françaises
          const frenchMaleVoice = voices.find(voice => 
            voice.lang.includes('fr') && 
            (voice.name.toLowerCase().includes('male') || 
             voice.name.toLowerCase().includes('homme') ||
             voice.name.includes('Thomas') ||
             voice.name.includes('Nicolas') ||
             voice.name.includes('Antoine') ||
             voice.name.includes('Microsoft Paul') || // Windows
             voice.name.includes('Fred') || // Mac
             voice.name.includes('Google français')) // Chrome
          )
          
          // Si pas de voix masculine, prendre n'importe quelle voix française
          const frenchVoice = frenchMaleVoice || voices.find(voice => 
            voice.lang.includes('fr-FR') || voice.lang.includes('fr')
          )
          
          if (frenchVoice) {
            utterance.voice = frenchVoice
            console.log('Voix sélectionnée:', frenchVoice.name)
          } else {
            console.log('Aucune voix française trouvée')
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
        
        // Si les voix sont déjà chargées
        if (window.speechSynthesis.getVoices().length > 0) {
          speakWithVoice()
        } else {
          // Attendre le chargement des voix
          window.speechSynthesis.onvoiceschanged = speakWithVoice
        }
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