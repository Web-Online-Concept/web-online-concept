import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

// Fonction pour récupérer un article
async function getArticle(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/blog/articles?slug=${slug}`, {
      cache: 'no-store'
    })
    
    if (res.ok) {
      return await res.json()
    }
    return null
  } catch (error) {
    console.error('Erreur chargement article:', error)
    return null
  }
}

// Fonction pour récupérer les articles similaires
async function getRelatedArticles(category, currentSlug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/blog/articles`, {
      cache: 'no-store'
    })
    
    if (res.ok) {
      const articles = await res.json()
      return articles
        .filter(a => a.slug !== currentSlug && (a.category === category || !category))
        .slice(0, 3)
    }
    return []
  } catch (error) {
    console.error('Erreur chargement articles similaires:', error)
    return []
  }
}

// Générer les métadonnées dynamiques
export async function generateMetadata({ params }) {
  const article = await getArticle(params.slug)
  
  if (!article) {
    return {
      title: 'Article non trouvé',
      description: 'L\'article que vous recherchez n\'existe pas.'
    }
  }

  const description = article.excerpt || article.content.substring(0, 160).replace(/<[^>]*>/g, '')

  return {
    title: article.title,
    description: description,
    openGraph: {
      title: article.title,
      description: description,
      type: 'article',
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
      images: article.featured_image ? [
        {
          url: article.featured_image,
          width: 1200,
          height: 630,
          alt: article.title
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: description,
      images: article.featured_image ? [article.featured_image] : []
    },
    alternates: {
      canonical: `/blog/${article.slug}`
    }
  }
}

// Composant principal
export default async function ArticlePage({ params }) {
  const article = await getArticle(params.slug)
  
  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(article.category, article.slug)

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }
    return date.toLocaleDateString('fr-FR', options)
  }

  // Temps de lecture
  const getReadingTime = (content) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return minutes
  }

  // Données structurées pour l'article
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: article.featured_image,
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Organization',
      name: 'Votre Entreprise' // À personnaliser
    },
    publisher: {
      '@type': 'Organization',
      name: 'Votre Entreprise', // À personnaliser
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png' // À personnaliser
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/blog/${article.slug}`
    },
    wordCount: article.content.split(/\s+/).length,
    articleSection: article.category
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-white">
        {/* Header avec image */}
        <header className="relative">
          {article.featured_image ? (
            <div className="relative h-[400px] md:h-[500px] w-full">
              <Image
                src={article.featured_image}
                alt={article.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          ) : (
            <div className="h-[300px] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900" />
          )}
          
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="absolute top-24 left-0 right-0 z-10">
            <div className="max-w-4xl mx-auto px-4">
              <ol className="flex items-center space-x-2 text-white/80 text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Accueil
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                {article.category && (
                  <>
                    <li aria-hidden="true">/</li>
                    <li className="text-white">{article.category}</li>
                  </>
                )}
              </ol>
            </div>
          </nav>
        </header>

        {/* Contenu principal */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Titre et métadonnées */}
          <div className="relative -mt-32 bg-white rounded-t-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              {article.category && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {article.category}
                </span>
              )}
              <time dateTime={article.published_at || article.created_at}>
                {formatDate(article.published_at || article.created_at)}
              </time>
              <span aria-hidden="true">•</span>
              <span>{getReadingTime(article.content)} min de lecture</span>
              <span aria-hidden="true">•</span>
              <span>{article.views || 0} vues</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </div>

          {/* Contenu de l'article */}
          <div className="bg-white px-8 md:px-12 pb-12">
            <div 
              className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-700 prose-a:text-blue-600 prose-img:rounded-lg prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Partage social */}
          <div className="bg-gray-50 rounded-b-2xl p-8 md:p-12">
            <h2 className="text-lg font-semibold mb-4">Partager cet article</h2>
            <div className="flex gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${article.slug}`)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copier le lien
              </button>
            </div>
          </div>
        </div>

        {/* Articles similaires */}
        {relatedArticles.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Articles similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map(relatedArticle => (
                <article key={relatedArticle.id} className="group">
                  <Link href={`/blog/${relatedArticle.slug}`} className="block">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      {relatedArticle.featured_image ? (
                        <div className="relative h-48">
                          <Image
                            src={relatedArticle.featured_image}
                            alt={relatedArticle.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <div className="text-gray-400 text-4xl font-bold">
                            {relatedArticle.title.charAt(0)}
                          </div>
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {relatedArticle.excerpt || relatedArticle.content.substring(0, 100).replace(/<[^>]*>/g, '')}...
                        </p>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}