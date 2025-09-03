'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminBlog() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  
  // État pour le formulaire
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: '',
    content: '',
    status: 'draft'
  })

  // Vérifier l'authentification
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/check-auth', {
        credentials: 'include'
      })
      if (res.ok) {
        setIsAuthenticated(true)
        // Charger les articles après authentification
        loadArticles()
      } else {
        router.push('/admin-tarifs')
      }
    } catch (error) {
      console.error('Erreur vérification auth:', error)
      router.push('/admin-tarifs')
    } finally {
      setLoading(false)
    }
  }

  const loadArticles = async () => {
    try {
      const res = await fetch('/api/blog/articles', {
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        setArticles(data)
      }
    } catch (error) {
      console.error('Erreur chargement articles:', error)
    }
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      if (res.ok) {
        router.push('/admin-tarifs')
      }
    } catch (error) {
      console.error('Erreur déconnexion:', error)
    }
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: generateSlug(value)
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      category: '',
      content: '',
      status: 'draft'
    })
    setEditingArticle(null)
    setShowForm(false)
  }

  const handleEdit = (article) => {
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || '',
      category: article.category || '',
      content: article.content || '',
      status: article.status
    })
    setEditingArticle(article)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return
    
    try {
      const res = await fetch(`/api/blog/articles?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (res.ok) {
        setMessage('✓ Article supprimé avec succès')
        loadArticles()
      } else {
        setMessage('Erreur lors de la suppression')
      }
    } catch (error) {
      setMessage('Erreur de connexion')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    
    try {
      const method = editingArticle ? 'PUT' : 'POST'
      const url = editingArticle 
        ? `/api/blog/articles?id=${editingArticle.id}`
        : '/api/blog/articles'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      })
      
      if (res.ok) {
        setMessage(`✓ Article ${editingArticle ? 'modifié' : 'créé'} avec succès`)
        resetForm()
        loadArticles()
      } else {
        setMessage('Erreur lors de l\'enregistrement')
      }
    } catch (error) {
      setMessage('Erreur de connexion')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestion Blog</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/admin-tarifs')}
              className="bg-blue-600 text-white px-4 py-3 text-sm rounded-lg hover:bg-blue-700 w-32 text-center"
            >
              Gestion<br />Tarifs
            </button>
            <button
              onClick={() => router.push('/admin-realisations')}
              className="bg-blue-600 text-white px-4 py-3 text-sm rounded-lg hover:bg-blue-700 w-32 text-center"
            >
              Gestion<br />Réalisations
            </button>
            <button
              onClick={() => router.push('/admin-devis')}
              className="bg-blue-600 text-white px-4 py-3 text-sm rounded-lg hover:bg-blue-700 w-32 text-center"
            >
              Gestion<br />Devis
            </button>
            <button
              onClick={() => router.push('/admin-blog')}
              className="bg-gray-600 text-white px-4 py-3 text-sm rounded-lg w-32 text-center"
            >
              Gestion<br />Blog
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-4 py-3 text-sm rounded-lg hover:bg-gray-700 w-32 text-center"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Liste des articles ou formulaire */}
        {!showForm ? (
          <>
            {/* Bouton Nouvel Article */}
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                + Nouvel Article
              </button>
            </div>

            {/* Liste des articles */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Articles existants</h2>
              {articles.length === 0 ? (
                <p className="text-gray-500">Aucun article pour le moment</p>
              ) : (
                <div className="space-y-4">
                  {articles.map(article => (
                    <div key={article.id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{article.title}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="mr-4">Slug: {article.slug}</span>
                          <span className="mr-4">Catégorie: {article.category || 'Sans catégorie'}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            article.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {article.status === 'published' ? 'Publié' : 'Brouillon'}
                          </span>
                        </div>
                        {article.excerpt && (
                          <p className="text-gray-600 mt-2 text-sm">{article.excerpt}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(article)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Formulaire de création/édition */
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Ex: Actualités, Tutoriels..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Extrait</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows="3"
                    placeholder="Résumé de l'article..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Contenu (temporaire - éditeur à venir)</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows="10"
                    placeholder="Contenu de l'article..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                  </select>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    {editingArticle ? 'Modifier' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}