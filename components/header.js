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
                    <span className="text-[#0073a8]" style={{ fontWeight: '700' }}>WEB</span><span className="text-gray-800" style={{ fontWeight: '300' }}>ONLINE</span><span className="text-[#0073a8]" style={{ fontWeight: '700' }}>CONCEPT</span>
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
            <Link href="#services" className="text-gray-700 hover:text-[#0073a8] transition-colors">
              Services
            </Link>
            <Link href="#team" className="text-gray-700 hover:text-[#0073a8] transition-colors">
              Notre équipe
            </Link>
            <Link href="#portfolio" className="text-gray-700 hover:text-[#0073a8] transition-colors">
              Réalisations
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#0073a8] transition-colors">
              Contact
            </Link>
            <Link href="/devis" className="bg-[#0073a8] text-white px-6 py-2 rounded-full hover:bg-[#005580] transition-all transform hover:scale-105">
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
            <Link href="#services" className="block py-2 text-gray-700 hover:text-[#0073a8]">
              Services
            </Link>
            <Link href="#team" className="block py-2 text-gray-700 hover:text-[#0073a8]">
              Notre équipe
            </Link>
            <Link href="#portfolio" className="block py-2 text-gray-700 hover:text-[#0073a8]">
              Réalisations
            </Link>
            <Link href="/contact" className="block py-2 text-gray-700 hover:text-[#0073a8]">
              Contact
            </Link>
            <Link href="/devis" className="block py-2 text-[#0073a8] font-semibold">
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
      `}</style>
    </header>
  )
}