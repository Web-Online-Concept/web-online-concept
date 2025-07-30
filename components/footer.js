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
              <li><Link href="/services" className="hover:text-white transition-colors">Nos services</Link></li>
              <li><Link href="/tarifs" className="hover:text-white transition-colors">Tarifs</Link></li>
              <li><Link href="/realisations" className="hover:text-white transition-colors">Réalisations</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Informations</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📧 contact@webonlineconcept.fr</li>
              <li>📱 06 XX XX XX XX</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Web Online Concept. Tous droits réservés.
          </p>
          
          {/* Lien admin discret */}
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link 
              href="/admin" 
              className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
              title="Accès administrateur"
            >
              •
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}