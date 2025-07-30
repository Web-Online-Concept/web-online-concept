"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function AdminRealisations() {
  const [sites, setSites] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSite, setEditingSite] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [siteOrder, setSiteOrder] = useState([])
  const [draggedSite, setDraggedSite] = useState(null)
  
  // Formulaire pour ajouter/modifier un site
  const [siteForm, setSiteForm] = useState({
    name: '',
    type: 'Site vitrine',
    url: '',
    image: '',
    description: ''
  })
  
  // Charger les sites depuis l'API
  useEffect(() => {
    fetchRealisations()
  }, [])
  
  const fetchRealisations = async () => {
    try {
      const response = await fetch('/api/admin/realisations')
      const data = await response.json()
      setSites(data.sites || [])
      setSiteOrder(data.siteOrder || [])
      setLoading(false)
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      setLoading(false)
    }
  }
  
  // Upload d'image via l'API
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB')
      return
    }
    
    setUploadingImage(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/admin/realisations-upload', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const data = await response.json()
        setSiteForm({ ...siteForm, image: data.url })
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
  
  // Ajouter un site via l'API
  const handleAddSite = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/realisations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteForm)
      })
      
      if (response.ok) {
        await fetchRealisations()
        setSiteForm({ name: '', type: 'Site vitrine', url: '', image: '', description: '' })
        setShowAddForm(false)
      } else {
        alert('Erreur lors de l\'ajout du site')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'ajout du site')
    }
  }
  
  // Modifier un site via l'API
  const handleEditSite = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/realisations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateSite',
          siteId: editingSite.id,
          siteData: siteForm
        })
      })
      
      if (response.ok) {
        await fetchRealisations()
        setSiteForm({ name: '', type: 'Site vitrine', url: '', image: '', description: '' })
        setEditingSite(null)
      } else {
        alert('Erreur lors de la modification')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la modification')
    }
  }
  
  // Supprimer un site via l'API
  const handleDeleteSite = async (siteId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce site ?')) {
      try {
        const response = await fetch('/api/admin/realisations', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ siteId })
        })
        
        if (response.ok) {
          await fetchRealisations()
        } else {
          alert('Erreur lors de la suppression')
        }
      } catch (error) {
        console.error('Erreur:', error)
        alert('Erreur lors de la suppression')
      }
    }
  }
  
  // Gestion du drag & drop
  const handleSiteDragStart = (e, siteId) => {
    setDraggedSite(siteId)
    e.dataTransfer.effectAllowed = 'move'
  }
  
  const handleSiteDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  
  const handleSiteDrop = async (e, targetSiteId) => {
    e.preventDefault()
    
    if (draggedSite === targetSiteId) return
    
    const orderedSites = getOrderedSites()
    const draggedIndex = orderedSites.findIndex(s => s.id === draggedSite)
    const targetIndex = orderedSites.findIndex(s => s.id === targetSiteId)
    
    if (draggedIndex === -1 || targetIndex === -1) return
    
    // Créer le nouvel ordre
    const newOrder = orderedSites.map(s => s.id)
    const [draggedId] = newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, draggedId)
    
    setSiteOrder(newOrder)
    setDraggedSite(null)
    
    // Sauvegarder dans l'API
    await saveOrder(newOrder)
  }
  
  const handleSiteDragEnd = () => {
    setDraggedSite(null)
  }
  
  // Sauvegarder l'ordre des sites
  const saveOrder = async (newOrder) => {
    try {
      const response = await fetch('/api/admin/realisations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateOrder',
          siteOrder: newOrder
        })
      })
      
      if (!response.ok) {
        console.error('Erreur lors de la sauvegarde de l\'ordre')
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }
  
  // Obtenir les sites dans l'ordre
  const getOrderedSites = () => {
    if (!siteOrder || siteOrder.length === 0) return sites
    
    const siteMap = new Map(sites.map(s => [s.id, s]))
    const orderedSites = []
    
    // D'abord ajouter les sites dans l'ordre sauvegardé
    siteOrder.forEach(id => {
      const site = siteMap.get(id)
      if (site) {
        orderedSites.push(site)
        siteMap.delete(id)
      }
    })
    
    // Ajouter les nouveaux sites à la fin
    const newSites = Array.from(siteMap.values())
    return [...orderedSites, ...newSites]
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
  
  const orderedSites = getOrderedSites()
  
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
                  🎨 Gestion des Réalisations Publiques
                </span>
              </div>
              <Link 
                href="/realisations" 
                target="_blank"
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Voir la page publique
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Titre et description */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Réalisations Visibles sur le Site Public
            </h1>
            <p className="text-gray-600">
              Gérez les sites affichés dans votre portfolio public. Ces réalisations sont visibles par vos visiteurs.
            </p>
          </div>

          {/* Statistiques */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Sites en ligne</h2>
                <p className="text-gray-600">Actuellement visibles sur votre site</p>
              </div>
              <div className="text-3xl font-bold text-[#0073a8]">
                {sites.length}
              </div>
            </div>
          </div>

          {/* Info sur le drag & drop */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              💡 <strong>Astuce :</strong> Glissez-déposez les sites pour réorganiser leur ordre d'affichage sur la page publique.
            </p>
          </div>

          {/* Grille de sites */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderedSites.map((site) => (
              editingSite?.id === site.id ? (
                // Formulaire d'édition
                <form key={site.id} onSubmit={handleEditSite} className="bg-white rounded-lg shadow-lg p-6 border-2 border-[#0073a8]">
                  <h3 className="font-bold text-lg mb-4">Modifier le site</h3>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nom du site"
                      value={siteForm.name}
                      onChange={(e) => setSiteForm({ ...siteForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      required
                    />
                    
                    <select
                      value={siteForm.type}
                      onChange={(e) => setSiteForm({ ...siteForm, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    >
                      <option value="Site vitrine">Site vitrine</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Site professionnel">Site professionnel</option>
                      <option value="Site catalogue">Site catalogue</option>
                      <option value="Blog">Blog</option>
                      <option value="Portfolio">Portfolio</option>
                    </select>
                    
                    <input
                      type="url"
                      placeholder="URL du site (https://...)"
                      value={siteForm.url}
                      onChange={(e) => setSiteForm({ ...siteForm, url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      required
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image du site
                      </label>
                      {siteForm.image ? (
                        <div className="relative">
                          <img src={siteForm.image} alt="Aperçu" className="w-full h-32 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => setSiteForm({ ...siteForm, image: '' })}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#0073a8] bg-gray-50">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span className="mt-2 text-sm text-gray-600">
                            {uploadingImage ? 'Upload...' : 'Ajouter une image'}
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
                    
                    <textarea
                      placeholder="Description / Contexte du site"
                      value={siteForm.description}
                      onChange={(e) => setSiteForm({ ...siteForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      rows="3"
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
                        setSiteForm({ name: '', type: 'Site vitrine', url: '', image: '', description: '' })
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                // Carte de site normale
                <div
                  key={site.id}
                  draggable
                  onDragStart={(e) => handleSiteDragStart(e, site.id)}
                  onDragOver={handleSiteDragOver}
                  onDrop={(e) => handleSiteDrop(e, site.id)}
                  onDragEnd={handleSiteDragEnd}
                  className={`group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-[#0073a8] transition-all cursor-move ${
                    draggedSite === site.id ? 'opacity-50' : ''
                  }`}
                >
                  {/* Indicateur de glisser-déposer */}
                  <div className="absolute top-2 left-2 z-20 p-1 bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                  </div>
                  
                  {/* Boutons d'action */}
                  <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingSite(site)
                        setSiteForm({
                          name: site.name,
                          type: site.type,
                          url: site.url,
                          image: site.image || '',
                          description: site.description || ''
                        })
                      }}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteSite(site.id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Image du site */}
                  <div className="relative aspect-video bg-gray-100">
                    {site.image ? (
                      <Image
                        src={site.image}
                        alt={site.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
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
                  
                  {/* Informations du site */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#0073a8] transition-colors">
                      {site.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Type :</span> {site.type}
                    </p>
                    
                    {site.description && (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {site.description}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-400 truncate mt-2">
                      {site.url}
                    </p>
                  </div>
                </div>
              )
            ))}
            
            {/* Bouton ajouter un site */}
            {!showAddForm && !editingSite && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-[#0073a8] hover:bg-gray-100 transition-all group flex flex-col items-center justify-center min-h-[300px]"
              >
                <svg className="w-12 h-12 text-gray-400 group-hover:text-[#0073a8] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-gray-600 group-hover:text-[#0073a8] font-medium">
                  Ajouter une réalisation
                </span>
              </button>
            )}
            
            {/* Formulaire d'ajout */}
            {showAddForm && (
              <form onSubmit={handleAddSite} className="bg-white rounded-lg shadow-lg p-6 border-2 border-[#0073a8]">
                <h3 className="font-bold text-lg mb-4">Nouvelle réalisation</h3>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nom du site"
                    value={siteForm.name}
                    onChange={(e) => setSiteForm({ ...siteForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    required
                  />
                  
                  <select
                    value={siteForm.type}
                    onChange={(e) => setSiteForm({ ...siteForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                  >
                    <option value="Site vitrine">Site vitrine</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Site professionnel">Site professionnel</option>
                    <option value="Site catalogue">Site catalogue</option>
                    <option value="Blog">Blog</option>
                    <option value="Portfolio">Portfolio</option>
                  </select>
                  
                  <input
                    type="url"
                    placeholder="URL du site (https://...)"
                    value={siteForm.url}
                    onChange={(e) => setSiteForm({ ...siteForm, url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image du site
                    </label>
                    {siteForm.image ? (
                      <div className="relative">
                        <img src={siteForm.image} alt="Aperçu" className="w-full h-32 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => setSiteForm({ ...siteForm, image: '' })}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#0073a8] bg-gray-50">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="mt-2 text-sm text-gray-600">
                          {uploadingImage ? 'Upload...' : 'Ajouter une image'}
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
                  
                  <textarea
                    placeholder="Description / Contexte du site"
                    value={siteForm.description}
                    onChange={(e) => setSiteForm({ ...siteForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    rows="3"
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
                    onClick={() => {
                      setShowAddForm(false)
                      setSiteForm({ name: '', type: 'Site vitrine', url: '', image: '', description: '' })
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
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