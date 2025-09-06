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

        {/* Mobile menu - Effet WOW plein écran */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-gradient-to-br from-[#0073a8] via-[#00b4d8] to-[#0073a8] md:hidden z-50"
            style={{
              top: '80px'
            }}
          >
            <div className="flex flex-col justify-center items-center h-full px-8">
              <nav className="text-center space-y-6">
                <Link 
                  href="/#services" 
                  className="block text-3xl font-bold text-white hover:scale-110 transform transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Services
                </Link>
                <Link 
                  href="/infos-tarifs" 
                  className="block text-3xl font-bold text-white hover:scale-110 transform transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Infos & Tarifs
                </Link>
                <Link 
                  href="/realisations" 
                  className="block text-3xl font-bold text-white hover:scale-110 transform transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Réalisations
                </Link>
                <Link 
                  href="/blog" 
                  className="block text-3xl font-bold text-white hover:scale-110 transform transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Blog
                </Link>
                <Link 
                  href="/ia" 
                  className="block text-3xl font-bold text-white hover:scale-110 transform transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  IA
                </Link>
                <Link 
                  href="/contact" 
                  className="block text-3xl font-bold text-white hover:scale-110 transform transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Contact
                </Link>
                <Link 
                  href="/demande-devis" 
                  className="block mt-8 bg-white text-[#0073a8] px-8 py-4 rounded-full text-xl font-bold hover:scale-110 transform transition-all duration-300 shadow-xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Devis Gratuit
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}