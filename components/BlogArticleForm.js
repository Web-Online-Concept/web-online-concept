'use client'

import { useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

// Import dynamique de React Quill pour éviter les erreurs SSR
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <p>Chargement de l'éditeur...</p>
})

export default function BlogArticleForm({ mode = 'create', article = null, categories = [] }) {
  const router = useRouter()
  const fileInputRef = useRef(null)
  
  // État du formulaire
  const [formData, setFormData] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    featured_image: article?.featured_image || '',
    author: article?.author || 'Web Online Concept',
    status: article?.status || 'draft',
    meta_title: article?.meta_title || '',
    meta_description: article?.meta_description || '',
    meta_keywords: article?.meta_keywords || '',
    published_at: article?.published_at ? new Date(article.published_at).toISOString().slice(0, 16) : '',
    category_ids: article?.categories?.map(c => c.id) || []
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Configuration de Quill
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), [])

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block',
    'list', 'bullet',
    'link', 'image', 'video'
  ]

  // Générer le slug automatiquement depuis le titre
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Gérer les changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Auto-générer le slug si on modifie le titre
    if (name === 'title' && mode === 'create') {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }))
    }
    
    // Réinitialiser l'erreur d'image si on change l'URL
    if (name === 'featured_image') {
      setImageError(false)
    }
  }

  // Gérer le changement de contenu Quill
  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value
    }))
  }

  // Gérer les catégories
  const handleCategoryChange = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId]
    }))
  }

  // Upload d'image (désactivé sur Vercel)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Sur Vercel, on ne peut pas uploader
    if (process.env.NODE_ENV === 'production') {
      alert('L\'upload d\'images n\'est pas disponible en production. Utilisez le champ URL directe avec une image déjà uploadée via GitHub.')
      return
    }
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      alert('Format non supporté. Utilisez JPG, PNG, WebP ou GIF.')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image est trop lourde. Maximum 5MB.')
      return
    }
    
    setUploadingImage(true)
    
    try {
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const { url } = await response.json()
        setFormData(prev => ({ ...prev, featured_image: url }))
      } else {
        alert('Erreur lors de l\'upload de l\'image')
      }
    } catch (error) {
      alert('Erreur lors de l\'upload de l\'image')
    } finally {
      setUploadingImage(false)
    }
  }

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content) {
      alert('Le titre et le contenu sont obligatoires')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const url = mode === 'create' 
        ? '/api/blog/posts' 
        : `/api/blog/posts/${article.id}`
      
      // Nettoyer les données avant envoi
      const dataToSend = {
        ...formData,
        published_at: formData.published_at || null  // Convertir chaîne vide en null
      }
      
      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      })
      
      if (response.ok) {
        router.push('/admin-blog')
      } else {
        const error = await response.text()
        alert(`Erreur : ${error}`)
      }
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Vérifier si l'URL de l'image est valide
  const isValidImageUrl = (url) => {
    if (!url) return false
    // Vérifier que c'est une URL relative ou absolue valide
    return url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations principales */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Informations principales</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL)
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
              placeholder="mon-article"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auteur
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="scheduled">Programmé</option>
            </select>
          </div>
          
          {(formData.status === 'published' || formData.status === 'scheduled') && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de publication
              </label>
              <input
                type="datetime-local"
                name="published_at"
                value={formData.published_at}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
              />
            </div>
          )}
        </div>
      </div>

      {/* Image principale */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Image principale</h2>
        
        <div className="flex items-start gap-6">
          {formData.featured_image && isValidImageUrl(formData.featured_image) && !imageError && (
            <div className="relative w-48 h-32 flex-shrink-0">
              <img
                src={formData.featured_image}
                alt="Image principale"
                className="w-full h-full object-cover rounded-lg"
                onError={() => setImageError(true)}
              />
            </div>
          )}
          
          <div className="flex-1">
            {process.env.NODE_ENV !== 'production' && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploadingImage}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors disabled:opacity-50 mb-3"
                >
                  {uploadingImage ? 'Upload en cours...' : 'Choisir une image (local uniquement)'}
                </button>
                
                <p className="text-sm text-gray-500 mb-3">
                  Formats acceptés : JPG, PNG, WebP, GIF. Max 5MB.
                </p>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de l'image
              </label>
              <input
                type="text"
                name="featured_image"
                value={formData.featured_image}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                placeholder="/images/mon-image.jpg ou https://..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Utilisez des images déjà uploadées : /images/blog/votre-image.jpg
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Catégories */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Catégories</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.category_ids.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="w-4 h-4 text-[#0073a8] border-gray-300 rounded focus:ring-[#0073a8]"
              />
              <span className="text-sm text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Contenu de l'article</h2>
          <p className="text-sm text-gray-600 mt-1">
            Utilisez l'éditeur ci-dessous pour formater votre texte facilement
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Extrait (résumé court)
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
            placeholder="Résumé court qui apparaîtra dans les listes d'articles..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contenu de l'article *
          </label>
          <div className="prose-editor">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
              className="bg-white"
              style={{ minHeight: '400px' }}
              placeholder="Commencez à écrire votre article..."
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Astuce : Pour insérer une image, cliquez sur l'icône image dans la barre d'outils
          </p>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Optimisation SEO</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta titre (laissez vide pour utiliser le titre de l'article)
            </label>
            <input
              type="text"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
              placeholder="Mon titre optimisé pour Google"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta description
            </label>
            <textarea
              name="meta_description"
              value={formData.meta_description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
              placeholder="Description pour les moteurs de recherche (150-160 caractères)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mots-clés (séparés par des virgules)
            </label>
            <input
              type="text"
              name="meta_keywords"
              value={formData.meta_keywords}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
              placeholder="création site web, seo, marketing digital"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Link
          href="/admin-blog"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Retour à la liste
        </Link>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#0073a8] text-white px-8 py-3 rounded-lg hover:bg-[#006a87] transition-colors font-semibold disabled:opacity-50"
        >
          {isSubmitting 
            ? 'Enregistrement...' 
            : mode === 'create' 
              ? 'Créer l\'article' 
              : 'Mettre à jour'
          }
        </button>
      </div>
    </form>
  )
}