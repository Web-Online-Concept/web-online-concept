"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }
      `}</style>

      <header className="fixed w-full top-0 z-50 bg-white shadow-lg">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-[140px]">
            {/* Logo et nom */}
            <div className="flex items-center gap-4">
              <Image 
                src="/images/logo.png" 
                alt="Web Online Concept Logo" 
                width={120} 
                height={120} 
                className="object-contain"
              />
              <div>
                <Link href="/" className="block">
                  <h1 className="text-3xl font-bold relative overflow-hidden group">
                    <span className="relative z-10">
                      <span className="text-[#00b4d8]">WEB</span>
                      <span className="text-gray-800"> ONLINE</span>
                      <span className="text-[#00b4d8]"> CONCEPT</span>
                    </span>
                    <span className="absolute inset-0 -z-10">
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 animate-shine"></span>
                    </span>
                  </h1>
                </Link>
                <p className="text-sm text-gray-600 mt-1">Le partenaire de votre communication digitale</p>
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
      </header>
    </>
  )
}