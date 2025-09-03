import { Suspense } from 'react'
import BlogContent from './BlogContent'
import Link from 'next/link'

// Métadonnées pour le SEO
export const metadata = {
  title: 'Blog - Actualités, Tutoriels et Conseils | Web Online Concept',
  description: 'Découvrez nos derniers articles, tutoriels et actualités. Conseils pratiques et retours d\'expérience pour vous accompagner dans vos projets web.',
  openGraph: {
    title: 'Blog - Actualités, Tutoriels et Conseils | Web Online Concept',
    description: 'Découvrez nos derniers articles, tutoriels et actualités. Conseils pratiques et retours d\'expérience.',
    type: 'website',
    url: '/blog',
    images: [
      {
        url: '/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'Blog Web Online Concept'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Actualités, Tutoriels et Conseils',
    description: 'Découvrez nos derniers articles, tutoriels et actualités.',
    images: ['/og-blog.jpg']
  },
  alternates: {
    canonical: '/blog'
  }
}

// Fonction pour récupérer les articles côté serveur
async function getArticles() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/blog/articles`, {
      cache: 'no-store' // Pour toujours avoir les derniers articles
    })
    
    if (res.ok) {
      return await res.json()
    }
    return []
  } catch (error) {
    console.error('Erreur chargement articles:', error)
    return []
  }
}

// Page principale (Server Component)
export default async function BlogPage() {
  const articles = await getArticles()
  
  // Données structurées pour le SEO (Blog)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog Web Online Concept',
    description: 'Actualités, tutoriels et conseils sur la création de sites web',
    url: '/blog',
    inLanguage: 'fr-FR',
    blogPost: articles.map(article => ({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.excerpt,
      url: `/blog/${article.slug}`,
      datePublished: article.published_at || article.created_at,
      dateModified: article.updated_at,
      author: {
        '@type': 'Organization',
        name: 'Web Online Concept'
      }
    }))
  }

  return (
    <>
      {/* Données structurées */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section uniforme avec les autres pages */}
      <section className="bg-gradient-to-r from-[#0073a8] to-[#005580] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Notre Blog
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Actualités, tutoriels et conseils sur la création de sites web
            </p>
          </div>
        </div>
      </section>

      {/* Contenu dynamique avec loading state */}
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        {/* Contenu dynamique avec loading state */}
        <Suspense fallback={<BlogLoading />}>
          <BlogContent initialArticles={articles} />
        </Suspense>

        {/* Call to Action - Devis gratuit */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Vous avez un projet de site web ?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Contactez-nous pour obtenir un devis gratuit et personnalisé pour votre projet
              </p>
              <Link
                href="/demande-devis"
                className="inline-flex items-center px-8 py-4 bg-[#0073a8] text-white font-bold rounded-lg hover:bg-[#005580] transition-all transform hover:scale-105 shadow-lg"
              >
                Demander un devis gratuit
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

// Composant de chargement
function BlogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded w-full mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}