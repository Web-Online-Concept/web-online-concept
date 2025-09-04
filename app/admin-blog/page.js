'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

export default function AdminBlog() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const editorRef = useRef(null)
  
  // État pour le formulaire
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: '',
    content: '',
    status: 'draft',
    featured_image: '',
    initial_views: 0,
    published_at: ''
  })

  // Vérifier l'authentification
  useEffect(() => {
    checkAuth()
  }, [])

  // Initialiser TinyMCE quand le formulaire est affiché
  useEffect(() => {
    if (showForm && window.tinymce) {
      initializeTinyMCE()
    }
    
    return () => {
      // Nettoyer l'éditeur lors du démontage
      if (window.tinymce && window.tinymce.get('content-editor')) {
        window.tinymce.get('content-editor').remove()
      }
    }
  }, [showForm])

  // Charger les articles une fois authentifié
  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log('Chargement des articles - Auth:', isAuthenticated, 'Loading:', loading)
      // Petit délai pour s'assurer que le cookie est bien établi
      const timer = setTimeout(() => {
        loadArticles()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, loading])

  const initializeTinyMCE = () => {
    // S'assurer que TinyMCE est chargé
    if (!window.tinymce) return

    // Supprimer l'instance existante
    if (window.tinymce.get('content-editor')) {
      window.tinymce.get('content-editor').remove()
    }

    window.tinymce.init({
      selector: '#content-editor',
      height: 500,
      menubar: false,
      language: 'fr_FR',
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'help', 'wordcount'
      ],
      toolbar: 'undo redo | formatselect | bold italic forecolor | ' +
        'alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image media | ' +
        'removeformat | code fullscreen | help',
      block_formats: 'Paragraphe=p; Titre 1=h1; Titre 2=h2; Titre 3=h3; Titre 4=h4',
      content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; line-height: 1.6; }',
      
      // Configuration pour préserver les URLs des images
      relative_urls: false,
      remove_script_host: false,
      convert_urls: false,
      
      // Configuration pour les images
      images_upload_handler: async (blobInfo, progress) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            resolve(reader.result)
          }
          reader.onerror = reject
          reader.readAsDataURL(blobInfo.blob())
        })
      },
      
      // Configuration pour le copier-coller (TinyMCE 6)
      paste_data_images: true,
      paste_as_text: false,
      paste_block_drop: false,
      paste_merge_formats: true,
      automatic_uploads: true,
      
      // Callback quand le contenu change
      setup: (editor) => {
        editor.on('change', () => {
          const content = editor.getContent()
          setFormData(prev => ({ ...prev, content }))
        })
        
        // Charger le contenu initial si en mode édition
        editor.on('init', () => {
          if (editingArticle && editingArticle.content) {
            editor.setContent(editingArticle.content)
          }
        })
      }
    })
  }

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/check-auth', {
        credentials: 'include'
      })
      if (res.ok) {
        setIsAuthenticated(true)
        // NE PAS appeler loadArticles() ici
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
    console.log('LoadArticles appelé')
    try {
      const res = await fetch('/api/blog/articles', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log('Réponse API:', res.status)
      if (res.ok) {
        const data = await res.json()
        console.log('Articles reçus:', data)
        setArticles(data)
      } else {
        console.error('Erreur API:', res.status)
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
      status: 'draft',
      featured_image: '',
      initial_views: 0,
      published_at: ''
    })
    setEditingArticle(null)
    setShowForm(false)
  }

  const handleEdit = (article) => {
    // Convertir la date au format datetime-local si elle existe
    let formattedDate = ''
    if (article.published_at) {
      const date = new Date(article.published_at)
      // Format: YYYY-MM-DDTHH:mm
      formattedDate = date.toISOString().slice(0, 16)
    }
    
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || '',
      category: article.category || '',
      content: article.content || '',
      status: article.status,
      featured_image: article.featured_image || '',
      initial_views: article.views || 0,
      published_at: formattedDate
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
        setMessage('✔ Article supprimé avec succès')
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
    
    // Récupérer le contenu de TinyMCE
    if (window.tinymce && window.tinymce.get('content-editor')) {
      formData.content = window.tinymce.get('content-editor').getContent()
    }
    
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
        setMessage(`✔ Article ${editingArticle ? 'modifié' : 'créé'} avec succès`)
        resetForm()
        loadArticles()
      } else {
        const error = await res.text()
        console.error('Erreur serveur:', error)
        setMessage(`Erreur: ${error || 'Erreur lors de l\'enregistrement'}`)
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
    <>
      {/* Charger TinyMCE */}
      <Script 
        src="https://cdn.tiny.cloud/1/sc5sn2i22r4cd2g4phfct7exajptsws2qt2j0kw1tdnxzlr1/tinymce/6/tinymce.min.js" 
        strategy="afterInteractive"
        onLoad={() => {
          console.log('TinyMCE chargé')
          if (showForm) {
            setTimeout(() => initializeTinyMCE(), 100)
          }
        }}
      />

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
              message.includes('✔') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
                    <label className="block text-sm font-medium mb-1">Image à la une</label>
                    <input
                      type="text"
                      value={formData.featured_image}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="/images/blog/nom-image.jpg ou https://..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Chemin relatif (/images/...) ou URL complète (https://...)</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Vues initiales</label>
                    <input
                      type="number"
                      value={formData.initial_views}
                      onChange={(e) => setFormData(prev => ({ ...prev, initial_views: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="0"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Nombre de vues de départ (0 par défaut)</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Date de publication</label>
                    <input
                      type="datetime-local"
                      value={formData.published_at}
                      onChange={(e) => setFormData(prev => ({ ...prev, published_at: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Laissez vide pour utiliser la date actuelle lors de la publication</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Extrait</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows="3"
                      placeholder="Résumé de l'article pour les aperçus..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Contenu de l'article</label>
                    <textarea
                      id="content-editor"
                      className="w-full"
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
    </>
  )
}