import Image from 'next/image'
import Link from 'next/link'
import { getPublishedPosts, getAllCategories, getRecentPosts, getPopularPosts } from '@/lib/blog-db'
import BlogSearch from '@/components/BlogSearch'
import BlogPagination from '@/components/BlogPagination'

export const metadata = {
  title: 'Blog - Web Online Concept',
  description: 'Conseils, tutoriels et actualités sur la création de sites web, le SEO et le marketing digital.',
  keywords: 'blog, création site web, seo, webdesign, tutoriels, marketing digital',
}

export default async function BlogPage({ searchParams }) {
  const page = parseInt(searchParams.page || '1')
  const { posts, totalPages, currentPage } = await getPublishedPosts(page)
  const categories = await getAllCategories()
  const recentPosts = await getRecentPosts()
  const popularPosts = await getPopularPosts()

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0073a8] to-[#005580] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog Web Online Concept
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Conseils, tutoriels et actualités pour réussir votre présence en ligne
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Articles */}
            <div className="lg:col-span-2">
              {/* Search Bar */}
              <div className="mb-8">
                <BlogSearch />
              </div>

              {/* Articles Grid */}
              {posts.length > 0 ? (
                <div className="grid gap-8">
                  {posts.map((post) => (
                    <article 
                      key={post.id} 
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <div className="relative h-64 md:h-80">
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
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">Aucun article trouvé.</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <BlogPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath="/blog"
                  />
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

              {/* Recent Posts */}
              {recentPosts.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Articles récents</h3>
                  <ul className="space-y-3">
                    {recentPosts.map((post) => (
                      <li key={post.id}>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="block text-gray-700 hover:text-[#0073a8] transition-colors"
                        >
                          <h4 className="font-semibold line-clamp-2">{post.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(post.published_at).toLocaleDateString('fr-FR')}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Newsletter CTA */}
              <div className="bg-gradient-to-br from-[#0073a8] to-[#00b4d8] rounded-lg shadow-md p-6 mt-8 text-white">
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
      </section>
    </div>
  )
}