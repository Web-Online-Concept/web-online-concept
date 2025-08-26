"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed w-full top-0 z-50 bg-white shadow-lg">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-[100px]">
          {/* Logo et nom */}
          <div className="flex items-center gap-4">
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
                  width={104} 
                  height={80} 
                  className="object-contain"
                />
              </div>
            </Link>
            <div className="text-center">
              <Link href="/" className="block">
                <h1 className="text-3xl font-bold relative inline-block" style={{ marginBottom: '-4px' }}>
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
              <Link href="/">
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
            <Link href="/realisations" className="relative text-gray-700 hover:text-[#0073a8] transition-colors group">
              Réalisations
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
            <Link 
              href="/#services" 
              className="block py-2 text-gray-700 hover:text-[#0073a8]"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/realisations" 
              className="block py-2 text-gray-700 hover:text-[#0073a8]"
              onClick={() => setIsMenuOpen(false)}
            >
              Réalisations
            </Link>
            <Link 
              href="/infos-tarifs" 
              className="block py-2 text-gray-700 hover:text-[#0073a8]"
              onClick={() => setIsMenuOpen(false)}
            >
              Infos & Tarifs
            </Link>
            <Link 
              href="/contact" 
              className="block py-2 text-gray-700 hover:text-[#0073a8]"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/demande-devis" 
              className="block py-2 text-[#0073a8] font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Devis Gratuit
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}