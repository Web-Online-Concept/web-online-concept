import Link from 'next/link'
import { getAllCategories } from '@/lib/blog-db'
import AdminCategoryActions from '@/components/AdminCategoryActions'
import AdminCategoryForm from '@/components/AdminCategoryForm'

export const metadata = {
  title: 'Gestion des catégories - Administration Blog',
  robots: 'noindex, nofollow',
}

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0073a8] via-[#00b4d8] to-[#006a87] text-white py-6">
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Gestion des catégories</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Liste des catégories */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Catégories existantes ({categories.length})
            </h2>
            
            {categories.length > 0 ? (
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">Slug: {category.slug}</p>
                      {category.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {category.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {category.post_count} article{category.post_count > 1 ? 's' : ''}
                      </p>
                    </div>
                    <AdminCategoryActions category={category} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Aucune catégorie créée pour le moment.
              </p>
            )}
          </div>

          {/* Formulaire de création */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Créer une nouvelle catégorie
            </h2>
            <AdminCategoryForm mode="create" />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            href="/admin-blog"
            className="text-gray-600 hover:text-[#0073a8] transition-colors"
          >
            ← Retour à l'administration du blog
          </Link>
          
          <Link
            href="/admin-tarifs"
            className="text-gray-600 hover:text-[#0073a8] transition-colors"
          >
            Administration générale →
          </Link>
        </div>
      </div>
    </div>
  )
}