import Link from 'next/link'
import { getAllPosts, deletePost } from '@/lib/blog-db'
import AdminBlogActions from '@/components/AdminBlogActions'

export const metadata = {
  title: 'Administration Blog - Web Online Concept',
  robots: 'noindex, nofollow',
}

export default async function AdminBlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestion Blog</h1>
          <div className="flex gap-4">
            <Link
              href="/admin-tarifs"
              className="bg-blue-600 text-white px-4 py-3 text-sm rounded-lg hover:bg-blue-700 w-32 text-center"
            >
              Gestion<br />Tarifs
            </Link>
            <Link
              href="/admin-realisations"
              className="bg-blue-600 text-white px-4 py-3 text-sm rounded-lg hover:bg-blue-700 w-32 text-center"
            >
              Gestion<br />Réalisations
            </Link>
            <Link
              href="/admin-blog"
              className="bg-gray-600 text-white px-4 py-3 text-sm rounded-lg w-32 text-center"
            >
              Gestion<br />Blog
            </Link>
            <Link
              href="/admin-devis"
              className="bg-blue-600 text-white px-4 py-3 text-sm rounded-lg hover:bg-blue-700 w-32 text-center"
            >
              Gestion<br />Devis
            </Link>
            <button
              onClick={() => window.location.href = '/api/admin/logout'}
              className="bg-gray-600 text-white px-4 py-3 text-sm rounded-lg hover:bg-gray-700 w-32 text-center"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Gestion des articles</h2>
              <p className="text-gray-600">{posts.length} article{posts.length > 1 ? 's' : ''} au total</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/admin-blog/nouvel-article"
                className="bg-[#0073a8] text-white px-6 py-2 rounded-lg hover:bg-[#006a87] transition-colors font-semibold"
              >
                + Nouvel article
              </Link>
              <Link
                href="/admin-blog/categories"
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Gérer les catégories
              </Link>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vues
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          /blog/{post.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : post.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status === 'published' ? 'Publié' : post.status === 'draft' ? 'Brouillon' : 'Programmé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.categories.map(cat => cat.name).join(', ') || 'Aucune'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.published_at 
                      ? new Date(post.published_at).toLocaleDateString('fr-FR')
                      : new Date(post.created_at).toLocaleDateString('fr-FR')
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.views_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <AdminBlogActions postId={post.id} postSlug={post.slug} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun article</h3>
              <p className="mt-1 text-sm text-gray-500">Commencez par créer votre premier article.</p>
              <div className="mt-6">
                <Link
                  href="/admin-blog/nouvel-article"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0073a8] hover:bg-[#006a87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0073a8]"
                >
                  + Nouvel article
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}