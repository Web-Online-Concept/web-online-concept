import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Web Online Concept</h3>
            <p className="text-gray-400">
              Création de sites web professionnels à prix accessibles.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/#services" className="hover:text-white transition-colors">Nos services</Link></li>
              <li><Link href="/infos-tarifs" className="hover:text-white transition-colors">Tarifs</Link></li>
              <li><Link href="/demande-devis" className="hover:text-white transition-colors">Devis gratuit</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Informations</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link></li>
              <li><Link href="/cgv" className="hover:text-white transition-colors">CGV</Link></li>
              <li><Link href="/politique-confidentialite" className="hover:text-white transition-colors">Confidentialité</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📧 web.online.concept@gmail.com</li>
              <li>📱 06 46 17 02 07</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Web Online Concept. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}