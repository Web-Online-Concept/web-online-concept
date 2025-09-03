import { Suspense } from 'react'
import BlogContent from './BlogContent'

// Métadonnées pour le SEO
export const metadata = {
  title: 'Blog - Actualités, Tutoriels et Conseils',
  description: 'Découvrez nos derniers articles, tutoriels et actualités. Conseils pratiques et retours d\'expérience pour vous accompagner dans vos projets.',
  openGraph: {
    title: 'Blog - Actualités, Tutoriels et Conseils',
    description: 'Découvrez nos derniers articles, tutoriels et actualités. Conseils pratiques et retours d\'expérience.',
    type: 'website',
    url: '/blog',
    images: [
      {
        url: '/og-blog.jpg', // À créer
        width: 1200,
        height: 630,
        alt: 'Blog'
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
    name: 'Notre Blog',
    description: 'Actualités, tutoriels et conseils',
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
        name: 'Votre Entreprise' // À personnaliser
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
      
      {/* Hero Section (Server Component) */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Notre Blog
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Découvrez nos derniers articles, tutoriels et actualités
            </p>
          </div>
        </div>
      </div>

      {/* Contenu dynamique avec loading state */}
      <Suspense fallback={<BlogLoading />}>
        <BlogContent initialArticles={articles} />
      </Suspense>

      {/* Newsletter CTA (Server Component) */}
      <NewsletterSection />
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

// Section Newsletter (Server Component)
function NewsletterSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 mt-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Restez informé
        </h2>
        <p className="text-blue-100 text-lg mb-8">
          Inscrivez-vous à notre newsletter pour recevoir nos derniers articles
        </p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Votre email"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <button 
            type="submit"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </section>
  )
}