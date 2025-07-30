"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function SitesGestion() {
  const [activeCategory, setActiveCategory] = useState('actifs')
  const [categories, setCategories] = useState({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSite, setEditingSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [editingTargetCategory, setEditingTargetCategory] = useState('')
  const [expandedSite, setExpandedSite] = useState(null)
  const [draggedSite, setDraggedSite] = useState(null)
  const [siteOrders, setSiteOrders] = useState({})
  
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
    image: ''
  })

  // Charger les sites depuis l'API
  useEffect(() => {
    fetchSites()
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

  // Upload d'image
  const handleImageUpload = async (e, isEditing = false) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image')
      return
    }
    
    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB')
      return
    }
    
    setUploadingImage(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const data = await response.json()
        setNewSite({ ...newSite, image: data.url })
      } else {
        const error = await response.json()
        alert(error.error || 'Erreur lors de l\'upload')
      }
    } catch (error) {
      console.error('Erreur upload:', error)
      alert('Erreur lors de l\'upload de l\'image')
    } finally {
      setUploadingImage(false)
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
        setNewSite({ name: '', url: '', type: '', client: '', adresse: '', email: '', tel: '', infos: '', image: '' })
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
      // Si la catégorie a changé, on doit déplacer le site
      if (editingSite.originalCategory !== editingTargetCategory) {
        // D'abord supprimer de l'ancienne catégorie
        await fetch('/api/admin/sites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: editingSite.originalCategory,
            siteId: editingSite.id
          })
        })
        
        // Puis ajouter dans la nouvelle catégorie
        await fetch('/api/admin/sites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: editingTargetCategory,
            site: { ...newSite, id: editingSite.id }
          })
        })
      } else {
        // Sinon, modification normale
        const response = await fetch('/api/admin/sites', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'site',
            category: editingTargetCategory,
            siteId: editingSite.id,
            siteData: newSite
          })
        })
        
        if (!response.ok) {
          throw new Error('Erreur lors de la modification')
        }
      }
      
      await fetchSites()
      setEditingSite(null)
      setEditingTargetCategory('')
      setNewSite({ name: '', url: '', type: '', client: '', adresse: '', email: '', tel: '', infos: '', image: '' })
      setShowAddForm(false)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la modification du site')
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

  // Gestion du drag & drop pour les sites
  const handleSiteDragStart = (e, siteId) => {
    setDraggedSite(siteId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleSiteDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleSiteDrop = (e, targetSiteId) => {
    e.preventDefault()
    
    if (draggedSite === targetSiteId) return
    
    // Obtenir tous les sites actuels
    const sites = getOrderedSites()
    const siteIds = sites.map(s => s.id)
    
    const draggedIndex = siteIds.indexOf(draggedSite)
    const targetIndex = siteIds.indexOf(targetSiteId)
    
    if (draggedIndex === -1 || targetIndex === -1) return
    
    // Créer le nouvel ordre
    const newOrder = [...siteIds]
    
    // Retirer l'élément déplacé
    newOrder.splice(draggedIndex, 1)
    // L'insérer à la nouvelle position
    newOrder.splice(targetIndex, 0, draggedSite)
    
    // Mettre à jour l'état
    const updatedOrders = {
      ...siteOrders,
      [activeCategory]: newOrder
    }
    setSiteOrders(updatedOrders)
    setDraggedSite(null)
    
    // Sauvegarder dans localStorage
    localStorage.setItem('siteOrders', JSON.stringify(updatedOrders))
  }

  const handleSiteDragEnd = () => {
    setDraggedSite(null)
  }

  // Obtenir les sites dans l'ordre
  const getOrderedSites = () => {
    const sites = currentCategory.sites || []
    const order = siteOrders[activeCategory] || []
    
    // Si pas d'ordre sauvegardé, retourner les sites tels quels
    if (order.length === 0) return sites
    
    // Créer une map pour un accès rapide
    const siteMap = new Map(sites.map(s => [s.id, s]))
    const orderedSites = []
    
    // D'abord ajouter les sites dans l'ordre sauvegardé
    order.forEach(siteId => {
      const site = siteMap.get(siteId)
      if (site) {
        orderedSites.push(site)
        siteMap.delete(siteId) // Retirer de la map pour éviter les doublons
      }
    })
    
    // Ajouter les nouveaux sites (qui restent dans la map) au début
    const newSites = Array.from(siteMap.values())
    return [...newSites, ...orderedSites]
  }

  // Charger l'ordre sauvegardé
  useEffect(() => {
    // Ordre des sites
    const savedSiteOrders = localStorage.getItem('siteOrders')
    if (savedSiteOrders) {
      try {
        const orders = JSON.parse(savedSiteOrders)
        setSiteOrders(orders)
      } catch (e) {
        console.error('Erreur chargement ordre sites:', e)
      }
    }
  }, [])

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
              Portfolio des Sites
            </h1>
            <p className="text-gray-600">
              Gérez et accédez rapidement à tous les sites que vous avez créés
            </p>
          </div>

          {/* Catégories */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="flex flex-wrap items-center justify-center">
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                    activeCategory === key
                      ? 'text-[#0073a8] border-b-2 border-[#0073a8] bg-blue-50/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2 text-xl">{category.icon}</span>
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* Statistiques */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Statistiques
            </h2>
            <div className="flex flex-wrap justify-around gap-2">
              <div className="text-center px-3">
                <p className="text-2xl font-bold text-[#0073a8]">
                  {Object.values(categories).reduce((acc, cat) => acc + cat.sites.length, 0)}
                </p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
              <div className="text-center px-3">
                <p className="text-2xl font-bold text-green-600">
                  {categories.actifs?.sites?.length || 0}
                </p>
                <p className="text-xs text-gray-600">Clients Actifs</p>
              </div>
              <div className="text-center px-3">
                <p className="text-2xl font-bold text-blue-600">
                  {categories.persos?.sites?.length || 0}
                </p>
                <p className="text-xs text-gray-600">Entreprise</p>
              </div>
              <div className="text-center px-3">
                <p className="text-2xl font-bold text-gray-600">
                  {categories.archives?.sites?.length || 0}
                </p>
                <p className="text-xs text-gray-600">Archives</p>
              </div>
            </div>
          </div>

          {/* Grille de sites */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getOrderedSites().map((site, index) => (
              editingSite?.id === site.id ? (
                <form key={site.id} onSubmit={handleEditSite} className="bg-white rounded-lg shadow-sm border border-[#0073a8] p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Modifier le site</h3>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Image du site
                      </label>
                      <div className="relative">
                        {newSite.image ? (
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={newSite.image}
                              alt={newSite.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setNewSite({ ...newSite, image: '' })}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#0073a8] bg-gray-50 hover:bg-gray-100">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="mt-2 text-sm text-gray-600">
                              {uploadingImage ? 'Upload en cours...' : 'Cliquer pour ajouter une image'}
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, true)}
                              disabled={uploadingImage}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                    
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
                    
                    {/* Sélecteur de catégorie */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catégorie
                      </label>
                      <select
                        value={editingTargetCategory}
                        onChange={(e) => setEditingTargetCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8] bg-yellow-50"
                        required
                      >
                        <option value="">Choisir une catégorie</option>
                        {Object.entries(categories).map(([key, category]) => (
                          <option key={key} value={key}>
                            {category.icon} {category.title}
                          </option>
                        ))}
                      </select>
                      {editingTargetCategory !== editingSite.originalCategory && (
                        <p className="text-sm text-amber-600 mt-1">
                          ⚠️ Le site sera déplacé vers "{categories[editingTargetCategory]?.title}"
                        </p>
                      )}
                    </div>
                    
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
                        setEditingTargetCategory('')
                        setNewSite({ name: '', url: '', type: '', client: '', adresse: '', email: '', tel: '', infos: '', image: '' })
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div 
                  key={site.id} 
                  className={`relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-[#0073a8] transition-all group ${editMode ? 'cursor-move' : ''} ${draggedSite === site.id ? 'opacity-50' : ''}`}
                  draggable={editMode}
                  onDragStart={(e) => handleSiteDragStart(e, site.id)}
                  onDragOver={handleSiteDragOver}
                  onDrop={(e) => handleSiteDrop(e, site.id)}
                  onDragEnd={handleSiteDragEnd}
                >
                  {/* Indicateur de glisser-déposer */}
                  {editMode && (
                    <div className="absolute top-2 left-2 z-20 p-1 bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    </div>
                  )}
                  <div className="relative aspect-video bg-gray-100">
                    {site.image ? (
                      <Image
                        src={site.image}
                        alt={site.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        priority={index === 0}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <Link
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-10"
                      title="Voir le site"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#0073a8] transition-colors">
                      {site.name}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Type :</span> {site.type}</p>
                      <p><span className="font-medium">Client :</span> {site.client}</p>
                      
                      {/* Vue détaillée - Affichage conditionnel */}
                      {expandedSite === site.id && (
                        <>
                          {site.adresse && <p><span className="font-medium">Adresse :</span> {site.adresse}</p>}
                          {site.email && <p><span className="font-medium">Email :</span> <a href={`mailto:${site.email}`} className="text-[#0073a8] hover:underline">{site.email}</a></p>}
                          {site.tel && <p><span className="font-medium">Tél :</span> <a href={`tel:${site.tel}`} className="text-[#0073a8] hover:underline">{site.tel}</a></p>}
                          {site.infos && <p className="mt-2 italic text-xs border-t pt-2">{site.infos}</p>}
                        </>
                      )}
                      
                      {expandedSite !== site.id && site.infos && <p className="italic text-xs">{site.infos}</p>}
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-2">
                      {site.url}
                    </p>
                    
                    {/* Bouton pour afficher/masquer les détails */}
                    <button
                      onClick={() => setExpandedSite(expandedSite === site.id ? null : site.id)}
                      className="mt-3 text-xs text-[#0073a8] hover:text-[#006a87] font-medium flex items-center gap-1"
                    >
                      {expandedSite === site.id ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          Masquer les détails
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          Voir tous les détails
                        </>
                      )}
                    </button>
                  </div>
                  
                  {editMode && (
                    <div className="absolute top-4 right-4 flex gap-2 z-20">
                      <button
                        onClick={() => {
                          setEditingSite({
                            ...site,
                            originalCategory: activeCategory
                          })
                          setEditingTargetCategory(activeCategory)
                          setNewSite({
                            name: site.name,
                            url: site.url,
                            type: site.type || '',
                            client: site.client || '',
                            adresse: site.adresse || '',
                            email: site.email || '',
                            tel: site.tel || '',
                            infos: site.infos || '',
                            image: site.image || ''
                          })
                          setShowAddForm(false)
                          setExpandedSite(null)
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
            
            {!showAddForm && !editingSite ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-[#0073a8] hover:bg-gray-100 transition-all group flex flex-col items-center justify-center min-h-[300px]"
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
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Image du site
                    </label>
                    <div className="relative">
                      {newSite.image ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={newSite.image}
                            alt={newSite.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setNewSite({ ...newSite, image: '' })}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#0073a8] bg-gray-50 hover:bg-gray-100">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span className="mt-2 text-sm text-gray-600">
                            {uploadingImage ? 'Upload en cours...' : 'Cliquer pour ajouter une image'}
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  
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