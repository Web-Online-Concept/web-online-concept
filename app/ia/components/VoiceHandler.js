'use client'

import { useEffect, useRef } from 'react'

export default function VoiceHandler({ text, isPlaying, onSpeakingChange, audioUrl }) {
  const audioRef = useRef(null)
  const utteranceRef = useRef(null)

  useEffect(() => {
    if (text && isPlaying) {
      // Si on a un audioUrl d'ElevenLabs, l'utiliser
      if (audioUrl) {
        playElevenLabsAudio()
      } else {
        // Fallback sur la synthèse vocale du navigateur
        playBrowserTTS()
      }
    }

    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (utteranceRef.current) {
        window.speechSynthesis.cancel()
      }
    }
  }, [text, isPlaying, audioUrl])

  const playElevenLabsAudio = () => {
    if (!audioUrl) return

    const audio = new Audio(audioUrl)
    audioRef.current = audio

    audio.addEventListener('play', () => {
      onSpeakingChange(true)
    })

    audio.addEventListener('ended', () => {
      onSpeakingChange(false)
    })

    audio.addEventListener('error', (error) => {
      console.error('Erreur audio ElevenLabs:', error)
      onSpeakingChange(false)
      // Fallback sur TTS navigateur en cas d'erreur
      playBrowserTTS()
    })

    audio.play().catch(error => {
      console.error('Erreur lecture audio:', error)
      onSpeakingChange(false)
    })
  }

  const playBrowserTTS = () => {
    if (!window.speechSynthesis || !text) return

    // Annuler toute synthèse en cours
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance

    // Configuration de la voix
    utterance.lang = 'fr-FR'
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Sélectionner une voix masculine française
    const voices = window.speechSynthesis.getVoices()
    const frenchVoices = voices.filter(voice => voice.lang.includes('fr'))
    const maleVoices = frenchVoices.filter(voice => 
      voice.name.toLowerCase().includes('male') ||
      voice.name.toLowerCase().includes('homme') ||
      voice.name.includes('Thomas') ||
      voice.name.includes('Nicolas') ||
      voice.name.includes('Antoine') ||
      voice.name.includes('Paul') ||
      voice.name.includes('Jacques')
    )

    if (maleVoices.length > 0) {
      utterance.voice = maleVoices[0]
      console.log('Voix sélectionnée:', maleVoices[0].name)
    } else if (frenchVoices.length > 0) {
      utterance.voice = frenchVoices[0]
      console.log('Voix française par défaut:', frenchVoices[0].name)
    }

    // Événements
    utterance.onstart = () => onSpeakingChange(true)
    utterance.onend = () => onSpeakingChange(false)
    utterance.onerror = () => onSpeakingChange(false)

    // Parler
    window.speechSynthesis.speak(utterance)
  }

  // Fonction publique pour arrêter la voix
  useEffect(() => {
    window.stopSpeaking = () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
      onSpeakingChange(false)
    }
  }, [onSpeakingChange])

  return null
}