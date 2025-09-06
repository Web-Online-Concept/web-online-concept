"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed w-full top-0 z-50 bg-white shadow-lg">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-[80px] md:h-[100px]">
          {/* Conteneur mobile avec burger à gauche */}
          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
            {/* Menu burger mobile - À GAUCHE */}
            <button
              className="md:hidden text-gray-700 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Logo */}
            <Link href="/">
              <div 
                className="logo-container"
                style={{
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) rotate(2deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                }}
              >
                <Image 
                  src="/images/logo.png" 
                  alt="Web Online Concept Logo" 
                  width={80} 
                  height={62} 
                  className="object-contain md:w-[104px] md:h-[80px]"
                />
              </div>
            </Link>
            
            {/* Nom de l'entreprise */}
            <div className="text-center">
              <Link href="/" className="block">
                <h1 className="text-2xl md:text-3xl font-bold relative inline-block" style={{ marginBottom: '-4px' }}>
                  <span style={{ fontFamily: 'Poppins, -apple-system, sans-serif', letterSpacing: '-0.05em' }}>
                    <span className="text-[#0073a8]" style={{ fontWeight: '700' }}>WEB</span><span> </span><span className="text-red-800" style={{ fontWeight: '700', fontStyle: 'italic' }}>ONLINE</span><span> </span><span className="text-[#0073a8]" style={{ fontWeight: '700' }}>CONCEPT</span>
                  </span>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100px',
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
                        width: '50px',
                        height: '100%',
                        animation: 'slide 6s linear infinite',
                        transform: 'skewX(-20deg)'
                      }}
                    />
                  </div>
                </h1>
              </Link>
              <p className="text-xs text-gray-600 block md:hidden text-center">Sites Web Clés en Main à Prix Malins</p>
              <Link href="/" className="hidden md:block">
                <div 
                  className="relative inline-block"
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelector('.underline-bar').style.width = '100%';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelector('.underline-bar').style.width = '0';
                  }}
                >
                  <p className="text-base text-gray-600 cursor-pointer">
                    Sites Web Clés en Main à Prix Malins
                  </p>
                  <div 
                    className="underline-bar"
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: '0',
                      width: '0',
                      height: '2px',
                      background: 'linear-gradient(90deg, #0073a8, #00b4d8)',
                      transition: 'width 0.3s ease',
                      borderRadius: '1px'
                    }}
                  />
                </div>
              </Link>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#services" className="relative text-gray-700 hover:text-[#0073a8] transition-colors group">
              Services
              <span 
                className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#0073a8] to-[#00b4d8] transition-all duration-300 group-hover:w-full"
              />
            </Link>
            <Link href="/infos-tarifs" className="relative text-gray-700 hover:text-[#0073a8] transition-colors group">
              Infos & Tarifs
              <span 
                className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#0073a8] to-[#00b4d8] transition-all duration-300 group-hover:w-full"
              />
            </Link>
            <Link href="/realisations" className="relative text-gray-700 hover:text-[#0073a8] transition-colors group">
              Réalisations
              <span 
                className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#0073a8] to-[#00b4d8] transition-all duration-300 group-hover:w-full"
              />
            </Link>
            <Link href="/blog" className="relative text-gray-700 hover:text-[#0073a8] transition-colors group">
              Blog
              <span 
                className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#0073a8] to-[#00b4d8] transition-all duration-300 group-hover:w-full"
              />
            </Link>
            <Link href="/ia" className="relative text-gray-700 hover:text-[#0073a8] transition-colors group">
              IA
              <span 
                className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#0073a8] to-[#00b4d8] transition-all duration-300 group-hover:w-full"
              />
            </Link>
            <Link href="/contact" className="relative text-gray-700 hover:text-[#0073a8] transition-colors group">
              Contact
              <span 
                className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#0073a8] to-[#00b4d8] transition-all duration-300 group-hover:w-full"
              />
            </Link>
            <Link href="/demande-devis" className="bg-[#0073a8] text-white px-6 py-2 rounded-full hover:bg-[#005580] transition-all transform hover:scale-105">
              Devis Gratuit
            </Link>
          </nav>
        </div>

        {/* Mobile menu - Effet WOW plein écran avec animations */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-[#00334d]/95 backdrop-blur-sm md:hidden z-50 overflow-hidden"
            style={{
              top: '80px'
            }}
          >
            {/* Effet de vagues animées en arrière-plan */}
            <div className="absolute inset-0 opacity-20">
              <div 
                className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2"
                style={{
                  background: 'radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                  animation: 'wave 8s ease-in-out infinite'
                }}
              />
              <div 
                className="absolute w-[200%] h-[200%] -right-1/2 -bottom-1/2"
                style={{
                  background: 'radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                  animation: 'wave 10s ease-in-out infinite reverse'
                }}
              />
            </div>

            <div className="flex flex-col justify-center items-center h-full px-8 relative">
              <nav className="text-center space-y-6">
                <Link 
                  href="/#services" 
                  className="flex items-center justify-center gap-4 text-3xl font-bold text-white hover:scale-110 transform transition-all duration-300 opacity-0"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    animation: 'slideInFade 0.5s ease-out 0.1s forwards'
                  }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Services
                </Link>
                <Link 
                  href="/infos-tarifs" 
                  className="flex items-center justify-center gap-4 text-3xl font-bold text-white hover:scale-110 transform transition-all duration-300 opacity-0"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    animation: 'slideInFade 0.5s ease-out 0.2s forwards'
                  }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Infos & Tarifs
                </Link>
                <Link 
                  href="/realisations" 
                  className="flex items-center justify-center gap-4 text-3xl font-bold text-white hover:scale-110 transform transition-all duration-300 opacity-0"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    animation: 'slideInFade 0.5s ease-out 0.3s forwards'
                  }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Réalisations
                </Link>
                <Link 
                  href="/blog" 
                  className="flex items-center justify-center gap-4 text-3xl font-bold text-white hover:scale-110 transform transition-all duration-300 opacity-0"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    animation: 'slideInFade 0.5s ease-out 0.4s forwards'
                  }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  Blog
                </Link>
                <Link 
                  href="/ia" 
                  className="flex items-center justify-center gap-4 text-3xl font-bold text-white hover:scale-110 transform transition-all duration-300 opacity-0"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    animation: 'slideInFade 0.5s ease-out 0.5s forwards'
                  }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  IA
                </Link>
                <Link 
                  href="/contact" 
                  className="flex items-center justify-center gap-4 text-3xl font-bold text-white hover:scale-110 transform transition-all duration-300 opacity-0"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    animation: 'slideInFade 0.5s ease-out 0.6s forwards'
                  }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact
                </Link>
                <Link 
                  href="/demande-devis" 
                  className="flex items-center justify-center gap-4 mt-8 bg-white text-[#0073a8] px-8 py-4 rounded-full text-xl font-bold hover:scale-110 transform transition-all duration-300 shadow-xl opacity-0"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    animation: 'slideInFade 0.5s ease-out 0.8s forwards, pulse 2s ease-in-out infinite'
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Devis Gratuit
                </Link>
              </nav>
            </div>

            <style jsx>{`
              @keyframes slideInFade {
                from {
                  opacity: 0;
                  transform: translateX(-30px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
              @keyframes wave {
                0%, 100% { transform: rotate(0deg) scale(1); }
                50% { transform: rotate(180deg) scale(1.1); }
              }
              @keyframes pulse {
                0%, 100% { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
                50% { box-shadow: 0 20px 25px -5px rgba(0, 115, 168, 0.25), 0 10px 10px -5px rgba(0, 115, 168, 0.1); }
              }
            `}</style>
          </div>
        )}
      </div>
    </header>
  )
}