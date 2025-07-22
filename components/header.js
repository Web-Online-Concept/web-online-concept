"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed w-full top-0 z-50 bg-white shadow-lg">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-[140px]">
          {/* Logo et nom */}
          <div className="flex items-center gap-4">
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
                width={169} 
                height={130} 
                className="object-contain"
              />
            </div>
            <div>
              <Link href="/" className="block">
                <h1 className="text-3xl font-bold relative" style={{ display: 'inline-block' }}>
                  <span className="font-semibold tracking-tight" style={{ fontFamily: 'Inter, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>
                    <span className="text-[#00b4d8]" style={{ fontWeight: '600' }}>WEB</span>
                    <span className="text-gray-800" style={{ fontWeight: '500' }}> ONLINE</span>
                    <span className="text-[#00b4d8]" style={{ fontWeight: '600' }}> CONCEPT</span>
                  </span>
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
                      width: '50px',
                      height: '100%',
                      animation: 'slide 13s linear infinite',
                      transform: 'skewX(-20deg)'
                    }}
                  />
                </h1>
              </Link>
              <p 
                className="text-base text-gray-600 mt-1 text-center relative inline-block"
                style={{
                  cursor: 'pointer'
                }}
              >
                Le partenaire de votre communication digitale
                <span
                  className="underline-effect"
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0%',
                    height: '2px',
                    background: 'linear-gradient(90deg, #00b4d8, #00d4ff)',
                    transition: 'width 0.3s ease',
                    borderRadius: '1px'
                  }}
                />
              </p>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#services" className="text-gray-700 hover:text-[#00b4d8] transition-colors">
              Services
            </Link>
            <Link href="#team" className="text-gray-700 hover:text-[#00b4d8] transition-colors">
              Notre équipe
            </Link>
            <Link href="#portfolio" className="text-gray-700 hover:text-[#00b4d8] transition-colors">
              Réalisations
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#00b4d8] transition-colors">
              Contact
            </Link>
            <Link href="/devis" className="bg-[#00b4d8] text-white px-6 py-2 rounded-full hover:bg-[#0095b8] transition-all transform hover:scale-105">
              Devis gratuit
            </Link>
          </nav>

          {/* Menu mobile */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link href="#services" className="block py-2 text-gray-700 hover:text-[#00b4d8]">
              Services
            </Link>
            <Link href="#team" className="block py-2 text-gray-700 hover:text-[#00b4d8]">
              Notre équipe
            </Link>
            <Link href="#portfolio" className="block py-2 text-gray-700 hover:text-[#00b4d8]">
              Réalisations
            </Link>
            <Link href="/contact" className="block py-2 text-gray-700 hover:text-[#00b4d8]">
              Contact
            </Link>
            <Link href="/devis" className="block py-2 text-[#00b4d8] font-semibold">
              Devis gratuit
            </Link>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(-50px);
          }
          38% {
            transform: translateX(-50px);
          }
          100% {
            transform: translateX(400px);
          }
        }
        
        .logo-animation {
          transition: transform 0.3s ease;
        }
        
        .logo-animation:hover {
          transform: scale(1.05) rotate(2deg);
        }
      `}</style>
    </header>
  )
}