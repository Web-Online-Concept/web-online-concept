import Image from 'next/image'
import Link from 'next/link'
import { searchPosts, getAllCategories, getPopularPosts } from '@/lib/blog-db'
import BlogSearch from '@/components/BlogSearch'
import BlogPagination from '@/components/BlogPagination'

export const metadata = {
  title: 'Recherche - Blog Web Online Concept',
  description: 'Recherchez des articles sur notre blog.',
}

export default async function BlogSearchPage({ searchParams }) {
  const query = searchParams.q || ''
  const page = parseInt(searchParams.page || '1')
  
  // Rechercher les articles seulement si il y a une query
  const searchResults = query ? await searchPosts(query, page) : null
  const categories = await getAllCategories()
  const popularPosts = await getPopularPosts()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0073a8] via-[#00b4d8] to-[#006a87] text-white py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Recherche d'articles
          </h1>
          {query && (
            <p className="text-xl text-center opacity-90">
              Résultats pour : <span className="font-semibold">"{query}"</span>
            </p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Results */}
          <div className="lg:col-span-2">
            {/* Search Bar */}
            <div className="mb-8">
              <BlogSearch />
            </div>

            {/* Results */}
            {!query ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-600 text-lg">
                  Utilisez la barre de recherche ci-dessus pour trouver des articles.
                </p>
              </div>
            ) : searchResults && searchResults.posts.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    {searchResults.posts.length} article{searchResults.posts.length > 1 ? 's' : ''} trouvé{searchResults.posts.length > 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="grid gap-8">
                  {searchResults.posts.map((post) => (
                    <article 
                      key={post.id} 
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <div className="relative h-48 md:h-64">
                          {post.featured_image ? (
                            <Image
                              src={post.featured_image}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#0073a8] to-[#00b4d8] flex items-center justify-center">
                              <span className="text-white text-4xl font-bold opacity-30">
                                {post.title.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                      
                      <div className="p-6">
                        {/* Categories */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/blog/categorie/${category.slug}`}
                              className="text-xs bg-[#0073a8] text-white px-3 py-1 rounded-full hover:bg-[#006a87] transition-colors"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                        
                        <Link href={`/blog/${post.slug}`}>
                          <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-[#0073a8] transition-colors">
                            {post.title}
                          </h2>
                        </Link>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            <span>{new Date(post.published_at).toLocaleDateString('fr-FR')}</span>
                            {post.views_count > 0 && (
                              <span className="ml-4">{post.views_count} vues</span>
                            )}
                          </div>
                          
                          <Link 
                            href={`/blog/${post.slug}`}
                            className="text-[#0073a8] font-semibold hover:text-[#006a87] transition-colors"
                          >
                            Lire la suite →
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {searchResults.totalPages > 1 && (
                  <div className="mt-12">
                    <BlogPagination 
                      currentPage={searchResults.currentPage}
                      totalPages={searchResults.totalPages}
                      basePath={`/blog/recherche?q=${encodeURIComponent(query)}`}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 text-lg mb-2">
                  Aucun article trouvé pour "{query}"
                </p>
                <p className="text-gray-500">
                  Essayez avec d'autres mots-clés ou consultez nos catégories.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Catégories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/blog/categorie/${category.slug}`}
                      className="flex items-center justify-between text-gray-700 hover:text-[#0073a8] transition-colors"
                    >
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">({category.post_count})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Posts */}
            {popularPosts.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Articles populaires</h3>
                <ul className="space-y-4">
                  {popularPosts.map((post) => (
                    <li key={post.id}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          {post.featured_image ? (
                            <div className="relative w-20 h-20 flex-shrink-0">
                              <Image
                                src={post.featured_image}
                                alt={post.title}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-[#0073a8] to-[#00b4d8] rounded flex items-center justify-center">
                              <span className="text-white text-xl font-bold opacity-50">
                                {post.title.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#0073a8] transition-colors line-clamp-2">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {post.views_count} vues
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-[#0073a8] to-[#00b4d8] rounded-lg shadow-md p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Besoin d'un site web ?</h3>
              <p className="text-sm opacity-90 mb-4">
                Concrétisez votre projet web avec notre équipe d'experts.
              </p>
              <Link
                href="/demande-devis"
                className="block text-center bg-white text-[#0073a8] font-semibold py-2 px-4 rounded hover:bg-gray-100 transition-colors"
              >
                Demander un devis gratuit
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}