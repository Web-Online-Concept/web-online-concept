"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function SitesGestion() {
  const [activeCategory, setActiveCategory] = useState('actifs')
  const [categories, setCategories] = useState({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingSite, setEditingSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  
  // Formulaire d'ajout de site
  const [newSite, setNewSite] = useState({
    name: '',
    url: '',
    type: '',
    client: '',
    adresse: '',
    email: '',
    tel: '',
    infos: '',
    icon: '🌐'
  })
  
  // Formulaire de catégorie
  const [categoryForm, setCategoryForm] = useState({
    key: '',
    title: '',
    icon: '📁'
  })
  
  // État pour le sélecteur d'emojis
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showCategoryEmojiPicker, setShowCategoryEmojiPicker] = useState(false)
  
  // Liste d'emojis populaires pour les sites
  const popularEmojis = [
    '🌐', '🏢', '🏪', '🏠', '🏭', '🏥', '🏫', '🏨', '🏛️', '⛪',
    '🍽️', '☕', '🍕', '🍔', '🥐', '🎂', '🍷', '🍺', '🥗', '🍜',
    '👗', '👔', '👠', '💄', '💍', '🎁', '🛍️', '👜', '🕶️', '⌚',
    '🚗', '🚙', '🏍️', '🚲', '✈️', '🚢', '🚁', '🚂', '🚌', '🚕',
    '⚕️', '💊', '🦷', '👨‍⚕️', '🏥', '💉', '🩺', '🔬', '🧬', '🩹',
    '📚', '🎓', '✏️', '🎨', '🎭', '🎪', '🎬', '🎮', '🎯', '🎸',
    '💼', '📊', '💰', '🏦', '💳', '📈', '🔧', '🔨', '⚙️', '🛠️'
  ]

  // Charger les sites depuis l'API
  useEffect(() => {
    fetchSites()
  }, [])
  
  // Fermer les sélecteurs d'emojis quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false)
        setShowCategoryEmojiPicker(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/admin/sites')
      const data = await response.json()
      setCategories(data)
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      setLoading(false)
    }
  }

  // Ajouter un site
  const handleAddSite = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: activeCategory,
          site: newSite
        })
      })
      
      if (response.ok) {
        await fetchSites()
        setNewSite({ name: '', url: '', type: '', client: '', adresse: '', email: '', tel: '', infos: '', icon: '🌐' })
        setShowAddForm(false)
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Modifier un site
  const handleEditSite = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/sites', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'site',
          category: activeCategory,
          siteId: editingSite.id,
          siteData: newSite
        })
      })
      
      if (response.ok) {
        await fetchSites()
        setEditingSite(null)
        setNewSite({ name: '', url: '', type: '', client: '', adresse: '', email: '', tel: '', infos: '', icon: '🌐' })
        setShowAddForm(false)
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Ajouter une catégorie
  const handleAddCategory = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'category',
          categoryKey: categoryForm.key.toLowerCase().replace(/\s+/g, ''),
          categoryData: {
            title: categoryForm.title,
            icon: categoryForm.icon
          }
        })
      })
      
      if (response.ok) {
        await fetchSites()
        setCategoryForm({ key: '', title: '', icon: '📁' })
        setShowCategoryForm(false)
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }
  
  // Modifier une catégorie
  const handleEditCategory = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/sites', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldKey: editingCategory,
          newKey: categoryForm.key.toLowerCase().replace(/\s+/g, ''),
          categoryData: {
            title: categoryForm.title,
            icon: categoryForm.icon
          }
        })
      })
      
      if (response.ok) {
        await fetchSites()
        setEditingCategory(null)
        setCategoryForm({ key: '', title: '', icon: '📁' })
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }
  
  // Supprimer une catégorie
  const handleDeleteCategory = async (categoryKey) => {
    if (!confirm('Êtes-vous sûr ? Tous les sites de cette catégorie seront supprimés !')) return
    
    try {
      const response = await fetch('/api/admin/sites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'category',
          categoryKey
        })
      })
      
      if (response.ok) {
        await fetchSites()
        // Si on supprime la catégorie active, revenir à la première
        if (categoryKey === activeCategory) {
          const firstCategory = Object.keys(categories).find(key => key !== categoryKey)
          if (firstCategory) setActiveCategory(firstCategory)
        }
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Supprimer un site
  const handleDeleteSite = async (siteId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce site ?')) return
    
    try {
      const response = await fetch('/api/admin/sites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: activeCategory,
          siteId
        })
      })
      
      if (response.ok) {
        await fetchSites()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100 pt-[100px] flex items-center justify-center">
          <p className="text-gray-600">Chargement...</p>
        </div>
        <Footer />
      </>
    )
  }

  const currentCategory = categories[activeCategory] || { sites: [] }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-100 pt-[100px]">
        {/* Barre d'admin */}
        <div className="bg-[#0073a8] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <Link href="/admin" className="text-white/80 hover:text-white transition-colors">
                  ← Retour
                </Link>
                <span className="text-lg font-semibold">
                  🌐 Sites en Gestion
                </span>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  editMode 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {editMode ? '✕ Terminer' : '✏️ Modifier'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Titre */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Portfolio des Sites Clients
            </h1>
            <p className="text-gray-600">
              Gérez et accédez rapidement à tous les sites que vous avez créés
            </p>
          </div>

          {/* Catégories */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="flex flex-wrap items-center">
              {Object.entries(categories).map(([key, category]) => (
                <div key={key} className="relative group">
                  <button
                    onClick={() => {
                      if (!editMode) setActiveCategory(key)
                    }}
                    className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                      activeCategory === key
                        ? 'text-[#0073a8] border-b-2 border-[#0073a8] bg-blue-50/50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    } ${editMode ? 'pr-20' : ''}`}
                  >
                    <span className="mr-2 text-xl">{category.icon}</span>
                    {category.title}
                  </button>
                  
                  {/* Boutons d'édition */}
                  {editMode && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingCategory(key)
                          setCategoryForm({
                            key: key,
                            title: category.title,
                            icon: category.icon
                          })
                        }}
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(key)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Bouton ajouter catégorie */}
              {editMode && !showCategoryForm && !editingCategory && (
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="flex items-center px-4 py-2 m-2 text-sm font-medium text-[#0073a8] border-2 border-dashed border-[#0073a8] rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nouvelle catégorie
                </button>
              )}
            </div>
            
            {/* Formulaire de catégorie */}
            {(showCategoryForm || editingCategory) && (
              <form onSubmit={editingCategory ? handleEditCategory : handleAddCategory} className="p-4 border-t bg-gray-50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Clé (ex: archives)"
                    value={categoryForm.key}
                    onChange={(e) => setCategoryForm({ ...categoryForm, key: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    required
                    disabled={editingCategory}
                  />
                  <input
                    type="text"
                    placeholder="Titre"
                    value={categoryForm.title}
                    onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    required
                  />
                  <div className="relative emoji-picker-container">
                    <button
                      type="button"
                      onClick={() => setShowCategoryEmojiPicker(!showCategoryEmojiPicker)}
                      className="w-16 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8] text-center hover:bg-gray-50"
                    >
                      {categoryForm.icon}
                    </button>
                    
                    {/* Sélecteur d'emojis pour catégorie */}
                    {showCategoryEmojiPicker && (
                      <div className="absolute z-10 mt-1 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-h-48 overflow-y-auto">
                        <div className="grid grid-cols-8 gap-1">
                          {popularEmojis.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                setCategoryForm({ ...categoryForm, icon: emoji })
                                setShowCategoryEmojiPicker(false)
                              }}
                              className="text-2xl p-2 hover:bg-gray-100 rounded transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0073a8] text-white rounded-lg hover:bg-[#006a87] transition-colors"
                  >
                    {editingCategory ? 'Modifier' : 'Ajouter'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryForm(false)
                      setEditingCategory(null)
                      setCategoryForm({ key: '', title: '', icon: '📁' })
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Grille de sites */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCategory.sites?.map((site) => (
              editingSite?.id === site.id ? (
                // Formulaire d'édition
                <form key={site.id} onSubmit={handleEditSite} className="bg-white rounded-lg shadow-sm border border-[#0073a8] p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Modifier le site</h3>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nom du Site"
                      value={newSite.name}
                      onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      required
                    />
                    
                    <input
                      type="url"
                      placeholder="URL (https://...)"
                      value={newSite.url}
                      onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      required
                    />
                    
                    <select
                      value={newSite.type}
                      onChange={(e) => setNewSite({ ...newSite, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      required
                    >
                      <option value="">Type de site</option>
                      <option value="WordPress">WordPress</option>
                      <option value="WooCommerce">WooCommerce</option>
                      <option value="Wix">Wix</option>
                      <option value="Autres">Autres</option>
                    </select>
                    
                    <input
                      type="text"
                      placeholder="Client"
                      value={newSite.client}
                      onChange={(e) => setNewSite({ ...newSite, client: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      required
                    />
                    
                    <input
                      type="text"
                      placeholder="Adresse"
                      value={newSite.adresse}
                      onChange={(e) => setNewSite({ ...newSite, adresse: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    />
                    
                    <input
                      type="email"
                      placeholder="Email"
                      value={newSite.email}
                      onChange={(e) => setNewSite({ ...newSite, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    />
                    
                    <input
                      type="tel"
                      placeholder="Téléphone"
                      value={newSite.tel}
                      onChange={(e) => setNewSite({ ...newSite, tel: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    />
                    
                    <textarea
                      placeholder="Infos Complémentaires"
                      value={newSite.infos}
                      onChange={(e) => setNewSite({ ...newSite, infos: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      rows="2"
                    />
                    
                    <div className="relative emoji-picker-container">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8] flex items-center justify-between hover:bg-gray-50"
                      >
                        <span className="text-2xl">{newSite.icon}</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Sélecteur d'emojis */}
                      {showEmojiPicker && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-h-48 overflow-y-auto">
                          <div className="grid grid-cols-8 gap-1">
                            {popularEmojis.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                  setNewSite({ ...newSite, icon: emoji })
                                  setShowEmojiPicker(false)
                                }}
                                className="text-2xl p-2 hover:bg-gray-100 rounded transition-colors"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-[#0073a8] text-white py-2 rounded-lg hover:bg-[#006a87] transition-colors"
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSite(null)
                        setNewSite({ name: '', url: '', description: '', icon: '🌐', adminUrl: '' })
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div key={site.id} className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-[#0073a8] transition-all group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{site.icon}</div>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#0073a8] transition-colors"
                        title="Voir le site"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#0073a8] transition-colors">
                      {site.name}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Type :</span> {site.type}</p>
                      <p><span className="font-medium">Client :</span> {site.client}</p>
                      {site.infos && <p className="italic text-xs">{site.infos}</p>}
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-2">
                      {site.url}
                    </p>
                  </div>
                  
                  {/* Boutons d'édition en mode édition */}
                  {editMode && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingSite(site)
                          setNewSite({
                            name: site.name,
                            url: site.url,
                            type: site.type || '',
                            client: site.client || '',
                            adresse: site.adresse || '',
                            email: site.email || '',
                            tel: site.tel || '',
                            infos: site.infos || '',
                            icon: site.icon
                          })
                          setShowAddForm(false)
                        }}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteSite(site.id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )
            ))}
            
            {/* Carte d'ajout */}
            {!showAddForm && !editingSite ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-[#0073a8] hover:bg-gray-100 transition-all group flex flex-col items-center justify-center min-h-[200px]"
              >
                <svg className="w-12 h-12 text-gray-400 group-hover:text-[#0073a8] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-gray-600 group-hover:text-[#0073a8] font-medium">
                  Ajouter un site
                </span>
              </button>
            ) : showAddForm && (
              <form onSubmit={handleAddSite} className="bg-white rounded-lg shadow-sm border border-[#0073a8] p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Nouveau site</h3>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nom du Site"
                    value={newSite.name}
                    onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    required
                  />
                  
                  <input
                    type="url"
                    placeholder="URL (https://...)"
                    value={newSite.url}
                    onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    required
                  />
                  
                  <select
                    value={newSite.type}
                    onChange={(e) => setNewSite({ ...newSite, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    required
                  >
                    <option value="">Type de site</option>
                    <option value="Woc">Woc</option>
                    <option value="Wix">Wix</option>
                    <option value="Autres">Autres</option>
                  </select>
                  
                  <input
                    type="text"
                    placeholder="Client"
                    value={newSite.client}
                    onChange={(e) => setNewSite({ ...newSite, client: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    required
                  />
                  
                  <input
                    type="text"
                    placeholder="Adresse"
                    value={newSite.adresse}
                    onChange={(e) => setNewSite({ ...newSite, adresse: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                  />
                  
                  <input
                    type="email"
                    placeholder="Email"
                    value={newSite.email}
                    onChange={(e) => setNewSite({ ...newSite, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                  />
                  
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    value={newSite.tel}
                    onChange={(e) => setNewSite({ ...newSite, tel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                  />
                  
                  <textarea
                    placeholder="Infos Complémentaires"
                    value={newSite.infos}
                    onChange={(e) => setNewSite({ ...newSite, infos: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    rows="2"
                  />
                  
                  <div className="relative emoji-picker-container">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8] flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="text-2xl">{newSite.icon}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Sélecteur d'emojis */}
                    {showEmojiPicker && (
                      <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-h-48 overflow-y-auto">
                        <div className="grid grid-cols-8 gap-1">
                          {popularEmojis.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                setNewSite({ ...newSite, icon: emoji })
                                setShowEmojiPicker(false)
                              }}
                              className="text-2xl p-2 hover:bg-gray-100 rounded transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#0073a8] text-white py-2 rounded-lg hover:bg-[#006a87] transition-colors"
                  >
                    Ajouter
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Statistiques */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Statistiques
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#0073a8]">
                  {Object.values(categories).reduce((acc, cat) => acc + cat.sites.length, 0)}
                </p>
                <p className="text-sm text-gray-600">Sites total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {categories.actifs?.sites?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Sites actifs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {categories.maintenance?.sites?.length || 0}
                </p>
                <p className="text-sm text-gray-600">En maintenance</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {categories.developpement?.sites?.length || 0}
                </p>
                <p className="text-sm text-gray-600">En développement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}