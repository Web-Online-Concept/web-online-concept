import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://web-online-concept.fr'),
  title: {
    default: 'Création Site Internet Professionnel - Devis Gratuit | Web Online Concept',
    template: '%s | Web Online Concept'
  },
  description: 'Création de sites web professionnels sur mesure. Design moderne, responsive, hébergement inclus. Devis gratuit sous 24h. Entreprise locale à votre écoute.',
  keywords: 'création site internet, site web professionnel, création site web, webdesigner, développeur web, site vitrine, site internet entreprise',
  authors: [{ name: 'Web Online Concept' }],
  creator: 'Web Online Concept',
  publisher: 'Web Online Concept',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://web-online-concept.fr',
    siteName: 'Web Online Concept',
    title: 'Création Site Internet Professionnel - Web Online Concept',
    description: 'Création de sites web professionnels sur mesure. Design moderne, responsive, hébergement inclus.',
    images: [
      {
        url: 'https://web-online-concept.fr/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Web Online Concept - Création de sites internet'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Online Concept - Création Sites Web Pro',
    description: 'Création de sites internet professionnels. Design moderne, responsive, optimisé SEO.',
    images: ['https://web-online-concept.fr/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'votre-code-verification-google',
    yandex: 'votre-code-verification-yandex',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Web Online Concept",
              "description": "Création de sites web professionnels à prix accessible",
              "url": "https://web-online-concept.fr",
              "telephone": "+33970019353",
              "priceRange": "€€",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "FR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "48.8566",
                "longitude": "2.3522"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
              }
            })
          }}
        />
      </body>
    </html>
  )
}