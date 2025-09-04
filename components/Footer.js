import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Colonne avec Logo et Titre */}
          <div className="text-center">
            <Link href="/">
              <div className="inline-block hover:opacity-90 transition-opacity mb-4">
                <Image 
                  src="/images/logo.png" 
                  alt="Web Online Concept Logo" 
                  width={104} 
                  height={80} 
                  className="object-contain mx-auto"
                />
              </div>
            </Link>
            <h3 className="text-lg font-semibold mb-4">Web Online Concept</h3>
            <p className="text-gray-400">
              Création de sites web professionnels à prix accessibles.
            </p>
          </div>
          
          {/* Colonne Services */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/#services" className="hover:text-white transition-colors">Nos services</Link></li>
              <li><Link href="/infos-tarifs" className="hover:text-white transition-colors">Tarifs</Link></li>
              <li><Link href="/realisations" className="hover:text-white transition-colors">Réalisations</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/demande-devis" className="hover:text-white transition-colors">Devis gratuit</Link></li>
            </ul>
          </div>
          
          {/* Colonne Informations */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Informations</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link></li>
              <li><Link href="/cgv" className="hover:text-white transition-colors">CGV</Link></li>
              <li><Link href="/politique-confidentialite" className="hover:text-white transition-colors">Confidentialité</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Web Online Concept. Tous droits réservés.
          </p>
          <Link 
            href="/admin-tarifs" 
            className="text-gray-600 hover:text-gray-500 text-xs mt-2 inline-block transition-colors"
          >
            Administration
          </Link>
        </div>
      </div>
    </footer>
  )
}