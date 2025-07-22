"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styles from '@/styles/header.module.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          {/* Logo et nom */}
          <div className={styles.logoSection}>
            <Image 
              src="/images/logo.png" 
              alt="Web Online Concept Logo" 
              width={120} 
              height={120} 
              className={styles.logoImage}
            />
            <div>
              <Link href="/" className={styles.titleLink}>
                <h1 className={styles.title}>
                  <span className={styles.titleGlow}>
                    <span className={styles.textGradient}>
                      WEB ONLINE CONCEPT
                    </span>
                  </span>
                </h1>
              </Link>
              <p className={styles.tagline}>Le partenaire de votre communication digitale</p>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className={styles.nav}>
            <Link href="#services" className={styles.navLink}>
              Services
            </Link>
            <Link href="#team" className={styles.navLink}>
              Notre équipe
            </Link>
            <Link href="#portfolio" className={styles.navLink}>
              Réalisations
            </Link>
            <Link href="/contact" className={styles.navLink}>
              Contact
            </Link>
            <Link href="/devis" className={styles.ctaButton}>
              Devis gratuit
            </Link>
          </nav>

          {/* Menu mobile */}
          <button
            className={styles.mobileMenuButton}
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
          <div className={styles.mobileMenu}>
            <Link href="#services" className={styles.mobileNavLink}>
              Services
            </Link>
            <Link href="#team" className={styles.mobileNavLink}>
              Notre équipe
            </Link>
            <Link href="#portfolio" className={styles.mobileNavLink}>
              Réalisations
            </Link>
            <Link href="/contact" className={styles.mobileNavLink}>
              Contact
            </Link>
            <Link href="/devis" className={styles.mobileCtaLink}>
              Devis gratuit
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}