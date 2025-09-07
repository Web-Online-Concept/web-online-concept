'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function FlorentCard() {
  const [copied, setCopied] = useState(false)
  const [showPhoto, setShowPhoto] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Masquer le header et footer
    const style = document.createElement('style')
    style.textContent = `
      header, footer, .header, .footer {
        display: none !important;
      }
      body {
        padding-top: 0 !important;
      }
    `
    document.head.appendChild(style)
    
    // Alterner entre photo et logo toutes les 8 secondes
    const interval = setInterval(() => {
      setShowPhoto(prev => !prev)
    }, 8000)
    
    // Cleanup
    return () => {
      clearInterval(interval)
      document.head.removeChild(style)
    }
  }, [])

  const generateVCard = () => {
    // Détection de navigateur intégré
    const isInAppBrowser = () => {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      return (ua.includes('FBAN') || ua.includes('FBAV') || // Facebook
              ua.includes('Instagram') || 
              ua.includes('Line') || 
              ua.includes('Telegram') ||
              ua.includes('WhatsApp'));
    };

    if (isInAppBrowser()) {
      // Message plus élégant avec suggestion d'ouvrir dans le navigateur
      setCopied(true);
      setTimeout(() => {
        if (confirm('Pour télécharger le contact, ouvrez cette page dans Chrome ou Safari. Voulez-vous copier le lien ?')) {
          navigator.clipboard.writeText(window.location.href);
        }
        setCopied(false);
      }, 100);
      return;
    }

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Florent Regnault
ORG:Web Online Concept
TITLE:Responsable
TEL;TYPE=CELL:+33603369342
EMAIL:web.online.concept@gmail.com
URL:https://www.web-online-concept.com
END:VCARD`

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    
    // Détection du système
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    
    // Pour iOS : utilise une méthode qui ouvre directement dans Safari
    if (isIOS) {
      // Sur iOS, on crée un lien temporaire et on le clique
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'florent-regnault.vcf')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Nettoyage après un délai
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 100)
    } else {
      // Pour Android et autres : téléchargement classique
      const link = document.createElement('a')
      link.href = url
      link.download = 'florent-regnault.vcf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
  }

  const shareCard = () => {
    const shareText = "Florent Regnault - Web Online Concept - Ma carte de visite digitale : https://www.web-online-concept.com/florent-regnault"
    
    if (navigator.share) {
      navigator.share({
        title: 'Florent Regnault - Web Online Concept',
        text: shareText
      })
    } else {
      navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const actionButtons = [
    // Première ligne
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      label: 'Site Web',
      action: () => window.open('https://www.web-online-concept.com', '_blank'),
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ),
      label: 'Email',
      action: () => window.location.href = 'mailto:web.online.concept@gmail.com',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      label: 'Twitter',
      action: () => window.open('https://x.com/webonlinecom', '_blank'),
      color: 'bg-gray-800 hover:bg-gray-900'
    },
    // Deuxième ligne
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
        </svg>
      ),
      label: 'Appeler',
      action: () => window.location.href = 'tel:+33603369342',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/>
        </svg>
      ),
      label: 'SMS',
      action: () => window.location.href = 'sms:+33603369342',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
        </svg>
      ),
      label: 'Partager',
      action: shareCard,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Bannière en-tête avec l'image SANS OPACITÉ */}
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src="/images/card-background.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Contenu principal */}
      <div className="relative z-20 flex-1 flex flex-col items-center px-6 max-w-md mx-auto w-full -mt-16">
        {/* Cercle central avec photo/logo animé - Plus petit */}
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1 animate-pulse-slow">
            <div className="w-full h-full rounded-full bg-gray-900 relative overflow-hidden">
              {/* Photo */}
              <div className={`absolute inset-0 transition-all duration-1000 ${showPhoto ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
                <Image
                  src="/images/florent-photo.jpg"
                  alt="Florent Regnault"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              
              {/* Logo avec fond blanc circulaire */}
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${!showPhoto ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center p-2">
                  <Image
                    src="/images/logo.png"
                    alt="Web Online Concept Logo"
                    width={100}
                    height={100}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nom et titre */}
        <div className="text-center mb-6 animate-slide-up">
          <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">
            Florent Regnault
          </h1>
          <p className="text-lg text-gray-300">
            Web Online Concept
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Responsable
          </p>
        </div>

        {/* Grille de boutons 2x3 */}
        <div className="grid grid-cols-3 gap-3 mb-6 w-full animate-slide-up-delay">
          {actionButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              className={`${button.color} text-white rounded-xl p-3 transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center space-y-1 animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {button.icon}
              <span className="text-xs font-medium">{button.label}</span>
            </button>
          ))}
        </div>

        {/* Bouton principal "Ajouter aux contacts" */}
        <button
          onClick={generateVCard}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 px-6 rounded-full transform transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 animate-pulse-slow mb-8"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span>Ajouter aux contacts</span>
        </button>

        {/* Section de texte avec À propos et Services */}
        <div className="w-full text-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-3">
              À propos
            </h2>
            <p className="text-gray-200 mb-6 text-sm leading-relaxed">
              Responsable de l'entreprise et coordinateur des projets, je vous accompagne dans la création de sites web professionnels et dans votre transformation digitale.
            </p>
            
            <h3 className="text-lg font-bold text-white mb-3">
              Découvrez nos services
            </h3>
            <div className="space-y-2 text-left text-sm">
              <div className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-200">Sites web à partir de 500€</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-200">Design moderne et responsive</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-200">SEO et performance optimisés</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-200">Support et maintenance inclus</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message de confirmation */}
        {copied && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in z-50">
            Lien copié !
          </div>
        )}
      </div>

      {/* CSS pour les animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animate-slide-up-delay { animation: slide-up 0.8s ease-out 0.2s forwards; opacity: 0; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  )
}