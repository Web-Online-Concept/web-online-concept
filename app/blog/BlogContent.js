'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function BlogContent({ initialArticles }) {
  const router = useRouter()
  const [articles] = useState(initialArticles)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Extraire les catégories uniques
  const categories = ['all', ...new Set(articles.map(a => a.category).filter(Boolean))]

  // Filtrer les articles (comparaison insensible à la casse)
  const filteredArticles = articles.filter(article => {
    const matchCategory = selectedCategory === 'all' || 
                         article.category?.toLowerCase() === selectedCategory.toLowerCase()
    const matchSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchCategory && matchSearch
  })

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

  // Temps de lecture estimé
  const getReadingTime = (content) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return minutes
  }

  // Article en vedette (le premier article filtré)
  const featuredArticle = filteredArticles.find(a => a.status === 'published')

  return (
    <>
      {/* Barre de recherche et filtres */}
      <div className="sticky top-20 z-40 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Recherche */}
            <div className="flex-1 w-full md:max-w-md">
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtres par catégorie */}
            <nav className="flex gap-2 overflow-x-auto pb-2 md:pb-0" aria-label="Filtres par catégorie">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'Tous' : cat}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Aucun article trouvé avec ces critères.'
                : 'Aucun article publié pour le moment.'}
            </p>
          </div>
        ) : (
          <>
            {/* Article en vedette - Toujours visible sauf en recherche */}
            {featuredArticle && !searchTerm && (
              <section className="mb-16" aria-labelledby="featured-heading">
                <h2 id="featured-heading" className="text-2xl font-bold text-gray-900 mb-8">
                  Article en vedette
                </h2>
                <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <Link href={`/blog/${featuredArticle.slug}`} className="block">
                    <div className="md:flex">
                      {featuredArticle.featured_image ? (
                        <div className="md:w-1/2 relative h-64 md:h-96">
                          <Image
                            src={featuredArticle.featured_image}
                            alt={featuredArticle.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                            priority
                          />
                        </div>
                      ) : (
                        <div className="md:w-1/2 h-64 md:h-96 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                          <div className="text-white text-6xl font-bold opacity-20">
                            {featuredArticle.title.charAt(0)}
                          </div>
                        </div>
                      )}
                      <div className="p-8 md:w-1/2">
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          {featuredArticle.category && (
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                              {featuredArticle.category}
                            </span>
                          )}
                          <time dateTime={featuredArticle.published_at || featuredArticle.created_at}>
                            {formatDate(featuredArticle.published_at || featuredArticle.created_at)}
                          </time>
                          <span aria-hidden="true">•</span>
                          <span>{getReadingTime(featuredArticle.content)} min de lecture</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                          {featuredArticle.title}
                        </h3>
                        {featuredArticle.excerpt && (
                          <p className="text-gray-600 text-lg mb-6 line-clamp-3">
                            {featuredArticle.excerpt}
                          </p>
                        )}
                        <div className="flex items-center text-blue-600 font-medium">
                          <span>Lire l'article</span>
                          <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              </section>
            )}

            {/* Grille d'articles - Exclut l'article vedette s'il y a plus d'un article */}
            {filteredArticles.length > 1 && (
              <section aria-labelledby="articles-heading">
                {!searchTerm && (
                  <h2 id="articles-heading" className="text-2xl font-bold text-gray-900 mb-8">
                    {selectedCategory === 'all' ? 'Autres articles' : 'Articles dans cette catégorie'}
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredArticles
                    .filter(article => !searchTerm && featuredArticle ? article.id !== featuredArticle.id : true)
                    .map(article => (
                    <article
                      key={article.id}
                      className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <Link href={`/blog/${article.slug}`} className="block">
                        {/* Image ou placeholder */}
                        {article.featured_image ? (
                          <div className="h-48 overflow-hidden relative">
                            <Image
                              src={article.featured_image}
                              alt={article.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <div className="text-gray-400 text-4xl font-bold">
                              {article.title.charAt(0)}
                            </div>
                          </div>
                        )}

                        {/* Contenu */}
                        <div className="p-6">
                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                            {article.category && (
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                {article.category}
                              </span>
                            )}
                            <time dateTime={article.published_at || article.created_at}>
                              {formatDate(article.published_at || article.created_at)}
                            </time>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          
                          {article.excerpt && (
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {article.excerpt}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-blue-600 text-sm font-medium">
                              <span>Lire la suite</span>
                              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-500">
                              {getReadingTime(article.content)} min
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </>
  )
}