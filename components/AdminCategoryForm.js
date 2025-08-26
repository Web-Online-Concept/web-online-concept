'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminCategoryForm({ mode = 'create', category = null, onCancel = null }) {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Générer le slug automatiquement depuis le nom
  const generateSlug = (name) => {
    return name
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
    
    // Auto-générer le slug si on modifie le nom en mode création
    if (name === 'name' && mode === 'create') {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }))
    }
  }

  // Reset le formulaire
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: ''
    })
  }

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.slug) {
      alert('Le nom et le slug sont obligatoires')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const url = mode === 'create' 
        ? '/api/blog/categories' 
        : `/api/blog/categories/${category.id}`
      
      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        if (mode === 'create') {
          resetForm()
          router.refresh()
        } else {
          if (onCancel) onCancel()
        }
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom de la catégorie *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
          placeholder="Ex: Tutoriels"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slug (URL) *
        </label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
          placeholder="Ex: tutoriels"
          pattern="[a-z0-9-]+"
          title="Uniquement des lettres minuscules, chiffres et tirets"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Sera utilisé dans l'URL : /blog/categorie/{formData.slug || 'slug'}
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optionnelle)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
          placeholder="Description de la catégorie pour le SEO et l'affichage..."
        />
      </div>
      
      <div className="flex gap-4 justify-end pt-4">
        {mode === 'edit' && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            disabled={isSubmitting}
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-[#0073a8] text-white rounded-lg hover:bg-[#006a87] transition-colors font-semibold disabled:opacity-50"
        >
          {isSubmitting 
            ? mode === 'create' ? 'Création...' : 'Modification...'
            : mode === 'create' ? 'Créer la catégorie' : 'Modifier'
          }
        </button>
      </div>
    </form>
  )
}