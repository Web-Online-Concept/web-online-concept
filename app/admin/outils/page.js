"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function OutilsWeb() {
  const [activeCategory, setActiveCategory] = useState('developpement')
  const [categories, setCategories] = useState({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editingTool, setEditingTool] = useState(null)
  
  // États pour le drag & drop
  const [draggedCategory, setDraggedCategory] = useState(null)
  const [draggedTool, setDraggedTool] = useState(null)
  const [dragOverCategory, setDragOverCategory] = useState(null)
  const [dragOverTool, setDragOverTool] = useState(null)
  const [categoryOrder, setCategoryOrder] = useState([])
  const [dropPosition, setDropPosition] = useState(null)
  
  // Formulaire d'ajout d'outil
  const [newTool, setNewTool] = useState({
    name: '',
    url: '',
    description: '',
    icon: '🔗'
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
  
  // Liste d'emojis populaires pour les outils web
  const popularEmojis = [
    '🔗', '🌐', '💻', '📱', '🖥️', '⚡', '🚀', '📊', '📈', '💡',
    '🔧', '🛠️', '⚙️', '📝', '✏️', '🎨', '🖌️', '📸', '📷', '🎥',
    '📧', '💬', '💳', '💰', '🔒', '🔐', '🔍', '📂', '📁', '☁️',
    '🌟', '⭐', '✨', '🎯', '📌', '📍', '🔔', '🏷️', '🗂️', '📋',
    '✅', '✔️', '❌', '⚠️', '📢', '🎪', '🎭', '🎬', '🎮', '🕹️',
    '🐙', '🐦', '👥', '💼', '🏢', '🏪', '🛒', '📦', '🚚', '✈️'
  ]

  // Charger les outils depuis l'API
  useEffect(() => {
    fetchTools()
  }, [])
  
  // Initialiser l'ordre des catégories
  useEffect(() => {
    if (Object.keys(categories).length > 0 && categoryOrder.length === 0) {
      setCategoryOrder(Object.keys(categories))
    }
  }, [categories])
  
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

  const fetchTools = async () => {
    try {
      const response = await fetch('/api/admin/outils')
      const data = await response.json()
      
      // Gérer les deux formats possibles
      if (data.categories) {
        setCategories(data.categories)
        setCategoryOrder(data.order || Object.keys(data.categories))
      } else {
        // Ancien format
        setCategories(data)
        setCategoryOrder(Object.keys(data))
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      setLoading(false)
    }
  }
  
  // Sauvegarder les données avec l'ordre
  const saveData = async (newCategories, newOrder = null) => {
    try {
      await fetch('/api/admin/outils', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: newCategories,
          order: newOrder || categoryOrder
        })
      })
    } catch (error) {
      console.error('Erreur sauvegarde:', error)
    }
  }

  // Drag & Drop pour les catégories
  const handleCategoryDragStart = (e, key) => {
    setDraggedCategory(key)
    e.dataTransfer.effectAllowed = 'move'
    // Ajouter une classe pour l'animation
    e.target.classList.add('dragging')
  }

  const handleCategoryDragEnd = (e) => {
    e.target.classList.remove('dragging')
    setDraggedCategory(null)
    setDropPosition(null)
  }

  const handleCategoryDragOver = (e, targetKey) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    
    if (!draggedCategory || draggedCategory === targetKey) return
    
    // Calculer la position de drop (avant ou après)
    const rect = e.currentTarget.getBoundingClientRect()
    const midpoint = rect.left + rect.width / 2
    const position = e.clientX < midpoint ? 'before' : 'after'
    
    setDropPosition({ key: targetKey, position })
  }

  const handleCategoryDragLeave = () => {
    setDropPosition(null)
  }

  const handleCategoryDrop = (e, targetKey) => {
    e.preventDefault()
    
    if (!draggedCategory || draggedCategory === targetKey) {
      setDropPosition(null)
      return
    }
    
    const newOrder = [...categoryOrder]
    const draggedIndex = newOrder.indexOf(draggedCategory)
    const targetIndex = newOrder.indexOf(targetKey)
    
    // Retirer l'élément déplacé
    newOrder.splice(draggedIndex, 1)
    
    // Calculer la nouvelle position en fonction de dropPosition
    let insertIndex = targetIndex
    if (dropPosition?.position === 'after') {
      insertIndex = draggedIndex < targetIndex ? targetIndex : targetIndex + 1
    } else {
      insertIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex
    }
    
    newOrder.splice(insertIndex, 0, draggedCategory)
    
    setCategoryOrder(newOrder)
    saveData(categories, newOrder)
    setDraggedCategory(null)
    setDropPosition(null)
  }

  // Drag & Drop pour les outils
  const handleToolDragStart = (e, categoryKey, toolId) => {
    setDraggedTool({ categoryKey, toolId })
    e.dataTransfer.effectAllowed = 'move'
    e.target.classList.add('dragging')
  }

  const handleToolDragEnd = (e) => {
    e.target.classList.remove('dragging')
    setDraggedTool(null)
    setDragOverCategory(null)
    setDragOverTool(null)
  }

  const handleToolDragOver = (e, categoryKey) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverCategory(categoryKey)
  }

  const handleToolDragOverTool = (e, categoryKey, toolId) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!draggedTool || (draggedTool.categoryKey === categoryKey && draggedTool.toolId === toolId)) return
    
    setDragOverTool({ categoryKey, toolId })
    
    // Calculer la position de drop (avant ou après)
    const rect = e.currentTarget.getBoundingClientRect()
    const midpoint = rect.top + rect.height / 2
    const position = e.clientY < midpoint ? 'before' : 'after'
    
    setDropPosition({ toolId, position })
  }

  const handleToolDragLeave = () => {
    setDragOverCategory(null)
    setDragOverTool(null)
    setDropPosition(null)
  }

  const handleToolDrop = (e, targetCategoryKey, targetToolId = null) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!draggedTool) return
    
    const { categoryKey: sourceCategory, toolId: sourceToolId } = draggedTool
    
    if (sourceCategory === targetCategoryKey && sourceToolId === targetToolId) {
      setDraggedTool(null)
      setDragOverCategory(null)
      setDragOverTool(null)
      setDropPosition(null)
      return
    }
    
    const newCategories = { ...categories }
    
    // Assurer que chaque catégorie a un tableau tools
    Object.keys(newCategories).forEach(key => {
      if (!newCategories[key].tools) {
        newCategories[key].tools = []
      }
    })
    
    // Trouver et retirer l'outil de sa catégorie source
    const toolIndex = newCategories[sourceCategory].tools.findIndex(t => t.id === sourceToolId)
    const [movedTool] = newCategories[sourceCategory].tools.splice(toolIndex, 1)
    
    if (targetToolId && dropPosition) {
      // Insérer à une position spécifique basée sur dropPosition
      const targetIndex = newCategories[targetCategoryKey].tools.findIndex(t => t.id === targetToolId)
      let insertIndex = targetIndex
      
      if (dropPosition.position === 'after') {
        insertIndex = targetIndex + 1
      }
      
      newCategories[targetCategoryKey].tools.splice(insertIndex, 0, movedTool)
    } else {
      // Ajouter à la fin
      newCategories[targetCategoryKey].tools.push(movedTool)
    }
    
    setCategories(newCategories)
    saveData(newCategories)
    setDraggedTool(null)
    setDragOverCategory(null)
    setDragOverTool(null)
    setDropPosition(null)
  }

  // Ajouter un outil
  const handleAddTool = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/outils', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: activeCategory,
          tool: newTool
        })
      })
      
      if (response.ok) {
        await fetchTools()
        setNewTool({ name: '', url: '', description: '', icon: '🔗' })
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
      const response = await fetch('/api/admin/outils', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'category',
          categoryKey: categoryForm.key.toLowerCase().replace(/\s+/g, ''),
          categoryData: {
            title: categoryForm.title,
            icon: categoryForm.icon,
            tools: []
          }
        })
      })
      
      if (response.ok) {
        await fetchTools()
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
      const response = await fetch('/api/admin/outils', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldKey: editingCategory,
          newKey: categoryForm.key.toLowerCase().replace(/\s+/g, ''),
          categoryData: {
            title: categoryForm.title,
            icon: categoryForm.icon,
            tools: categories[editingCategory].tools || []
          }
        })
      })
      
      if (response.ok) {
        await fetchTools()
        setEditingCategory(null)
        setCategoryForm({ key: '', title: '', icon: '📁' })
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }
  
  // Supprimer une catégorie
  const handleDeleteCategory = async (categoryKey) => {
    if (!confirm('Êtes-vous sûr ? Tous les outils de cette catégorie seront supprimés !')) return
    
    try {
      const response = await fetch('/api/admin/outils', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'category',
          categoryKey
        })
      })
      
      if (response.ok) {
        await fetchTools()
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

  // Modifier un outil
  const handleEditTool = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/outils', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'tool',
          category: activeCategory,
          toolId: editingTool.id,
          toolData: newTool
        })
      })
      
      if (response.ok) {
        await fetchTools()
        setEditingTool(null)
        setNewTool({ name: '', url: '', description: '', icon: '🔗' })
        setShowAddForm(false)
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Supprimer un outil
  const handleDeleteTool = async (toolId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet outil ?')) return
    
    try {
      const response = await fetch('/api/admin/outils', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: activeCategory,
          toolId
        })
      })
      
      if (response.ok) {
        await fetchTools()
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

  const currentCategory = categories[activeCategory] || { tools: [] }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-100 pt-[100px]">
        {/* Styles pour le drag & drop */}
        <style jsx>{`
          .dragging {
            opacity: 0.5;
            transform: scale(0.95);
          }
          
          .drag-over {
            background-color: #EBF8FF;
            border-color: #0073a8;
          }
          
          .drop-indicator {
            position: absolute;
            height: 3px;
            background-color: #0073a8;
            left: 0;
            right: 0;
            z-index: 10;
          }
          
          .drop-indicator.before {
            top: -2px;
          }
          
          .drop-indicator.after {
            bottom: -2px;
          }
          
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          
          .drag-hint {
            animation: pulse 2s infinite;
          }
        `}</style>

        {/* Barre d'admin */}
        <div className="bg-[#0073a8] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <Link href="/admin" className="text-white/80 hover:text-white transition-colors">
                  ← Retour
                </Link>
                <span className="text-lg font-semibold">
                  🔧 Outils Web
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
              Mes Outils Web Favoris
            </h1>
            <p className="text-gray-600">
              Accès rapide à tous les outils essentiels pour la création et gestion de sites web
            </p>
            {editMode && (
              <p className="text-sm text-[#0073a8] mt-2 drag-hint">
                💡 Glissez-déposez pour réorganiser les catégories et les outils
              </p>
            )}
          </div>

          {/* Catégories */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="flex flex-wrap items-center relative">
              {categoryOrder.map((key) => {
                const category = categories[key]
                if (!category) return null
                
                return (
                  <div 
                    key={key} 
                    className={`relative group ${draggedCategory === key ? 'dragging' : ''}`}
                    draggable={editMode}
                    onDragStart={(e) => editMode && handleCategoryDragStart(e, key)}
                    onDragEnd={handleCategoryDragEnd}
                    onDragOver={(e) => editMode && handleCategoryDragOver(e, key)}
                    onDragLeave={handleCategoryDragLeave}
                    onDrop={(e) => editMode && handleCategoryDrop(e, key)}
                  >
                    {/* Indicateur de drop position */}
                    {dropPosition?.key === key && draggedCategory && (
                      <div className={`drop-indicator ${dropPosition.position}`} />
                    )}
                    
                    <button
                      onClick={() => {
                        if (!editMode) setActiveCategory(key)
                      }}
                      className={`flex items-center px-6 py-4 text-sm font-medium transition-all cursor-${editMode ? 'move' : 'pointer'} ${
                        activeCategory === key
                          ? 'text-[#0073a8] border-b-2 border-[#0073a8] bg-blue-50/50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      } ${editMode ? 'pr-20' : ''}`}
                    >
                      {editMode && (
                        <svg className="w-4 h-4 mr-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      )}
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
                )
              })}
              
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
                    placeholder="Clé (ex: marketing)"
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
                      <div className="absolute z-10 mt-1 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-3 w-[320px] max-h-64 overflow-y-auto">
                        <div className="grid grid-cols-8 gap-2">
                          {popularEmojis.map((emoji, index) => (
                            <button
                              key={`cat-emoji-${index}`}
                              type="button"
                              onClick={() => {
                                setCategoryForm({ ...categoryForm, icon: emoji })
                                setShowCategoryEmojiPicker(false)
                              }}
                              className="text-2xl p-2 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
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
                      setShowCategoryEmojiPicker(false)
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Grille d'outils */}
          <div 
            className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px] transition-all ${
              dragOverCategory === activeCategory && editMode
                ? 'bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 drag-over'
                : ''
            }`}
            onDragOver={(e) => editMode && handleToolDragOver(e, activeCategory)}
            onDragLeave={handleToolDragLeave}
            onDrop={(e) => editMode && handleToolDrop(e, activeCategory)}
          >
            {currentCategory.tools?.map((tool) => (
              editingTool?.id === tool.id ? (
                // Formulaire d'édition
                <form key={tool.id} onSubmit={handleEditTool} className="bg-white rounded-lg shadow-sm border border-[#0073a8] p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Modifier l'outil</h3>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nom de l'outil"
                      value={newTool.name}
                      onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      required
                    />
                    
                    <input
                      type="url"
                      placeholder="URL (https://...)"
                      value={newTool.url}
                      onChange={(e) => setNewTool({ ...newTool, url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      required
                    />
                    
                    <input
                      type="text"
                      placeholder="Description courte"
                      value={newTool.description}
                      onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      required
                    />
                    
                    <div className="relative emoji-picker-container">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8] flex items-center justify-between hover:bg-gray-50"
                      >
                        <span className="text-2xl">{newTool.icon}</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Sélecteur d'emojis */}
                      {showEmojiPicker && (
                        <div className="absolute z-10 mt-1 w-[320px] bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-h-64 overflow-y-auto">
                          <div className="grid grid-cols-8 gap-2">
                            {popularEmojis.map((emoji, index) => (
                              <button
                                key={`tool-emoji-${index}`}
                                type="button"
                                onClick={() => {
                                  setNewTool({ ...newTool, icon: emoji })
                                  setShowEmojiPicker(false)
                                }}
                                className="text-2xl p-2 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
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
                        setEditingTool(null)
                        setNewTool({ name: '', url: '', description: '', icon: '🔗' })
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div 
                  key={tool.id} 
                  className={`relative ${
                    draggedTool?.toolId === tool.id ? 'dragging' : ''
                  } ${
                    dragOverTool?.toolId === tool.id && editMode ? 'scale-105' : ''
                  }`}
                  draggable={editMode}
                  onDragStart={(e) => editMode && handleToolDragStart(e, activeCategory, tool.id)}
                  onDragEnd={handleToolDragEnd}
                  onDragOver={(e) => editMode && handleToolDragOverTool(e, activeCategory, tool.id)}
                  onDragLeave={handleToolDragLeave}
                  onDrop={(e) => editMode && handleToolDrop(e, activeCategory, tool.id)}
                >
                  {/* Indicateur de drop position pour les outils */}
                  {dropPosition?.toolId === tool.id && draggedTool && (
                    <div className={`drop-indicator ${dropPosition.position}`} />
                  )}
                  
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-[#0073a8] transition-all group ${
                      editMode ? 'pr-16 cursor-move' : ''
                    }`}
                    onClick={(e) => editMode && e.preventDefault()}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{tool.icon}</div>
                      {editMode && (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      )}
                      {!editMode && (
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-[#0073a8] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#0073a8] transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {tool.description}
                    </p>
                  </a>
                  
                  {/* Boutons d'édition en mode édition */}
                  {editMode && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingTool(tool)
                          setNewTool({
                            name: tool.name,
                            url: tool.url,
                            description: tool.description,
                            icon: tool.icon
                          })
                          setShowAddForm(false)
                        }}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteTool(tool.id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
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
            
            {/* Message si aucun outil */}
            {currentCategory.tools?.length === 0 && !showAddForm && (
              <div className="col-span-full text-center py-12 text-gray-500">
                {editMode ? (
                  <p>Glissez des outils ici ou cliquez sur le bouton + pour en ajouter</p>
                ) : (
                  <p>Aucun outil dans cette catégorie</p>
                )}
              </div>
            )}
            
            {/* Carte d'ajout */}
            {!showAddForm && !editingTool ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-[#0073a8] hover:bg-gray-100 transition-all group flex flex-col items-center justify-center min-h-[200px]"
              >
                <svg className="w-12 h-12 text-gray-400 group-hover:text-[#0073a8] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-gray-600 group-hover:text-[#0073a8] font-medium">
                  Ajouter un outil
                </span>
              </button>
            ) : showAddForm && (
              <form onSubmit={handleAddTool} className="bg-white rounded-lg shadow-sm border border-[#0073a8] p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Nouvel outil</h3>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nom de l'outil"
                    value={newTool.name}
                    onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    required
                  />
                  
                  <input
                    type="url"
                    placeholder="URL (https://...)"
                    value={newTool.url}
                    onChange={(e) => setNewTool({ ...newTool, url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    required
                  />
                  
                  <input
                    type="text"
                    placeholder="Description courte"
                    value={newTool.description}
                    onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    required
                  />
                  
                  <div className="relative emoji-picker-container">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8] flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="text-2xl">{newTool.icon}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Sélecteur d'emojis */}
                    {showEmojiPicker && (
                      <div className="absolute z-10 mt-1 w-[320px] bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-h-64 overflow-y-auto">
                        <div className="grid grid-cols-8 gap-2">
                          {popularEmojis.map((emoji, index) => (
                            <button
                              key={`add-emoji-${index}`}
                              type="button"
                              onClick={() => {
                                setNewTool({ ...newTool, icon: emoji })
                                setShowEmojiPicker(false)
                              }}
                              className="text-2xl p-2 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
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
        </div>
      </div>
      
      <Footer />
    </>
  )
}