"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function AdminDashboard() {
  const router = useRouter()
  const [modules, setModules] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editingModule, setEditingModule] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [draggedModule, setDraggedModule] = useState(null)
  const [moduleOrder, setModuleOrder] = useState([])
  
  // États pour les stats dynamiques
  const [stats, setStats] = useState({
    sitesActifs: 0,
    devisEnCours: 0,
    projetsCeMois: 0,
    tachesActives: 0,
    facturesEnRetard: 0,
    caMonth: 0
  })
  
  // Formulaire d'ajout/modification
  const [moduleForm, setModuleForm] = useState({
    id: '',
    title: '',
    icon: '📦',
    description: '',
    details: '',
    color: 'from-blue-500 to-blue-600',
    link: ''
  })
  
  // États pour les sélecteurs d'icônes
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [showEditIconPicker, setShowEditIconPicker] = useState(false)

  // Liste des couleurs disponibles
  const availableColors = [
    { name: 'Bleu', value: 'from-blue-500 to-blue-600' },
    { name: 'Vert', value: 'from-green-500 to-green-600' },
    { name: 'Violet', value: 'from-purple-500 to-purple-600' },
    { name: 'Orange', value: 'from-orange-500 to-orange-600' },
    { name: 'Rouge', value: 'from-red-500 to-red-600' },
    { name: 'Gris', value: 'from-gray-500 to-gray-600' },
    { name: 'Rose', value: 'from-pink-500 to-pink-600' },
    { name: 'Indigo', value: 'from-indigo-500 to-indigo-600' },
    { name: 'Teal', value: 'from-teal-500 to-teal-600' }
  ]
  
  // Liste d'icônes populaires pour les modules admin
  const popularIcons = [
    '📄', '📊', '📈', '💰', '💳', '🧾', '📋', '✅', '📝', '✏️',
    '📅', '📆', '⏰', '🕐', '📍', '🗓️', '⚡', '🚀', '🎯', '🎪',
    '🌐', '🌍', '🏢', '🏪', '🏭', '🏠', '🔧', '🛠️', '⚙️', '🔨',
    '👥', '👤', '💼', '🤝', '📞', '📧', '💬', '📢', '🔔', '📣',
    '📦', '📮', '🎁', '🛒', '🚚', '✈️', '🔒', '🔐', '🔑', '🛡️',
    '📊', '📉', '💹', '💱', '🏆', '🥇', '⭐', '🌟', '✨', '💎',
    '💸', '💵', '💴', '💶', '💷', '🏦', '💲', '🪙', '💹', '🎨'
  ]

  useEffect(() => {
    fetchModules()
    loadStats()
  }, [])
  
  // Fermer les sélecteurs d'icônes quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.icon-picker-container')) {
        setShowIconPicker(false)
        setShowEditIconPicker(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Charger les statistiques dynamiques
  const loadStats = async () => {
    try {
      // Charger toutes les données nécessaires
      const [facturesRes, sitesRes, agendaRes] = await Promise.all([
        fetch('/api/admin/facturation'),
        fetch('/api/admin/sites'),
        fetch('/api/admin/agenda')
      ])

      let factures = [], sites = [], agenda = []
      
      if (facturesRes.ok) {
        const facturesData = await facturesRes.json()
        factures = [...(facturesData.factures || []), ...(facturesData.devis || [])]
      }
      
      if (sitesRes.ok) {
        const sitesData = await sitesRes.json()
        // Vérifier si c'est un tableau ou un objet avec une propriété sites
        sites = Array.isArray(sitesData) ? sitesData : (sitesData.sites || [])
      }
      
      if (agendaRes.ok) {
        const agendaData = await agendaRes.json()
        // Vérifier si c'est un tableau ou un objet avec une propriété agenda/projets
        agenda = Array.isArray(agendaData) ? agendaData : (agendaData.agenda || agendaData.projets || [])
      }

      // Calculer les stats
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      
      // Sites actifs
      const sitesActifs = sites.filter(s => s.status === 'actif').length
      
      // Devis en cours
      const devisEnCours = factures.filter(f => 
        f.status === 'devis' || f.status === 'en_attente'
      ).length
      
      // Projets ce mois
      const projetsCeMois = agenda.filter(projet => {
        const projetDate = new Date(projet.date)
        return projetDate.getMonth() === currentMonth && 
               projetDate.getFullYear() === currentYear
      }).length
      
      // Tâches actives
      const tachesActives = agenda.filter(t => t.status === 'en_cours').length
      
      // Factures en retard
      const facturesEnRetard = factures.filter(f => {
        if (f.status !== 'facture' || f.paymentStatus === 'paid') return false
        const echeance = new Date(f.dueDate || f.date)
        return echeance < now
      }).length
      
      // CA du mois
      const caMonth = factures
        .filter(f => {
          const factureDate = new Date(f.date)
          return f.status === 'facture' && 
                 f.paymentStatus === 'paid' &&
                 factureDate.getMonth() === currentMonth && 
                 factureDate.getFullYear() === currentYear
        })
        .reduce((sum, f) => sum + (f.total || 0), 0)

      setStats({
        sitesActifs,
        devisEnCours,
        projetsCeMois,
        tachesActives,
        facturesEnRetard,
        caMonth
      })
      
    } catch (error) {
      console.error('Erreur chargement stats:', error)
    }
  }

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/admin/modules')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setModules(data)
      
      // Charger l'ordre sauvegardé ou initialiser
      const savedOrder = localStorage.getItem('moduleOrder')
      if (savedOrder) {
        try {
          const order = JSON.parse(savedOrder)
          setModuleOrder(order)
        } catch (e) {
          console.error('Erreur chargement ordre:', e)
          const defaultOrder = data.sort((a, b) => a.order - b.order).map(m => m.id)
          setModuleOrder(defaultOrder)
          localStorage.setItem('moduleOrder', JSON.stringify(defaultOrder))
        }
      } else {
        const defaultOrder = data.sort((a, b) => a.order - b.order).map(m => m.id)
        setModuleOrder(defaultOrder)
        localStorage.setItem('moduleOrder', JSON.stringify(defaultOrder))
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      // Utiliser les données par défaut en cas d'erreur
      const defaultModules = [
        {
          id: 'crm',
          title: 'Fiches Clients',
          icon: '👥',
          description: 'Gestion clients',
          details: 'Centralisez toutes les informations clients',
          color: 'from-indigo-500 to-indigo-600',
          link: '/admin/crm',
          order: 1
        },
        {
          id: 'devis',
          title: 'Devis',
          icon: '📋',
          description: 'Gestion des devis',
          details: 'Créez, validez et suivez vos devis. Gérez les paiements et la collecte de contenus.',
          color: 'from-emerald-500 to-emerald-600',
          link: '/admin/devis',
          order: 2
        },
        {
          id: 'facturation',
          title: 'Facturation',
          icon: '📄',
          description: 'Gestion des devis et factures',
          details: 'Créez et gérez vos devis, convertissez-les en factures, suivez les paiements.',
          color: 'from-blue-500 to-blue-600',
          link: '/admin/facturation',
          order: 3
        },
        {
          id: 'depenses',
          title: 'Dépenses',
          icon: '💸',
          description: 'Gestion des charges',
          details: 'Suivez toutes vos dépenses professionnelles et charges.',
          color: 'from-red-500 to-red-600',
          link: '/admin/depenses',
          order: 4
        },
        {
          id: 'comptabilite',
          title: 'Comptabilité',
          icon: '💰',
          description: 'Tableau de bord financier',
          details: 'Visualisez votre CA, suivez vos revenus, gérez la TVA.',
          color: 'from-green-500 to-green-600',
          link: '/admin/comptabilite',
          order: 5
        },
        {
          id: 'agenda',
          title: 'Agenda',
          icon: '📅',
          description: 'Gestion des projets',
          details: 'Organisez vos projets, suivez les deadlines, gérez vos tâches.',
          color: 'from-purple-500 to-purple-600',
          link: '/admin/agenda',
          order: 6
        },
        {
          id: 'emails',
          title: 'Emails',
          icon: '📧',
          description: 'Envoi et gestion des emails',
          details: 'Envoyez des emails, programmez des envois, gérez vos templates.',
          color: 'from-cyan-500 to-cyan-600',
          link: '/admin/emails',
          order: 7
        },
        {
          id: 'sites',
          title: 'Sites en Gestion',
          icon: '🌐',
          description: 'Portfolio clients',
          details: 'Visualisez tous les sites que vous gérez.',
          color: 'from-orange-500 to-orange-600',
          link: '/admin/sites',
          order: 8
        },
		{
		  id: 'realisations',
		  title: 'Réalisations Publiques',
		  icon: '🎨',
		  description: 'Portfolio visible',
		  details: 'Gérez les sites affichés sur votre page réalisations publique.',
		  color: 'from-teal-500 to-teal-600',
		  link: '/admin/realisations',
		  order: 9
		},
        {
          id: 'outils',
          title: 'Outils Web',
          icon: '🔧',
          description: 'Accès rapide',
          details: 'Tous vos outils de développement en un clic.',
          color: 'from-pink-500 to-pink-600',
          link: '/admin/outils',
          order: 10
        },
        {
          id: 'export',
          title: 'Export Excel',
          icon: '📊',
          description: 'Exporter toutes vos données',
          details: 'Téléchargez vos données clients, factures, projets au format Excel.',
          color: 'from-purple-500 to-purple-600',
          link: '/admin/export',
          order: 11
        },
        {
          id: 'parametres',
          title: 'Paramètres',
          icon: '⚙️',
          description: 'Configuration',
          details: 'Gérez les paramètres de votre entreprise et facturation.',
          color: 'from-gray-500 to-gray-600',
          link: '/admin/parametres',
          order: 12
        }
      ]
      setModules(defaultModules)
      
      if (moduleOrder.length === 0) {
        const defaultOrder = defaultModules.map(m => m.id)
        setModuleOrder(defaultOrder)
        localStorage.setItem('moduleOrder', JSON.stringify(defaultOrder))
      }
      
      setLoading(false)
    }
  }

  // Obtenir les modules dans l'ordre personnalisé
  const getOrderedModules = () => {
    if (moduleOrder.length === 0) return modules
    
    const moduleMap = new Map(modules.map(m => [m.id, m]))
    const orderedModules = []
    
    // D'abord ajouter les modules dans l'ordre sauvegardé
    moduleOrder.forEach(moduleId => {
      const module = moduleMap.get(moduleId)
      if (module) {
        orderedModules.push(module)
        moduleMap.delete(moduleId)
      }
    })
    
    // Ajouter les nouveaux modules à la fin
    const newModules = Array.from(moduleMap.values())
    return [...orderedModules, ...newModules]
  }

  // Gestion du drag & drop
  const handleDragStart = (e, moduleId) => {
    setDraggedModule(moduleId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetModuleId) => {
    e.preventDefault()
    
    if (draggedModule === targetModuleId) return
    
    const currentOrder = [...moduleOrder]
    const draggedIndex = currentOrder.indexOf(draggedModule)
    const targetIndex = currentOrder.indexOf(targetModuleId)
    
    if (draggedIndex === -1 || targetIndex === -1) {
      // Si l'un des modules n'est pas dans l'ordre, reconstruire l'ordre complet
      const allModuleIds = getOrderedModules().map(m => m.id)
      const newDraggedIndex = allModuleIds.indexOf(draggedModule)
      const newTargetIndex = allModuleIds.indexOf(targetModuleId)
      
      if (newDraggedIndex !== -1 && newTargetIndex !== -1) {
        allModuleIds.splice(newDraggedIndex, 1)
        allModuleIds.splice(newTargetIndex, 0, draggedModule)
        setModuleOrder(allModuleIds)
        localStorage.setItem('moduleOrder', JSON.stringify(allModuleIds))
      }
    } else {
      // Retirer l'élément déplacé
      currentOrder.splice(draggedIndex, 1)
      // L'insérer à la nouvelle position
      currentOrder.splice(targetIndex, 0, draggedModule)
      
      setModuleOrder(currentOrder)
      localStorage.setItem('moduleOrder', JSON.stringify(currentOrder))
    }
    
    setDraggedModule(null)
  }

  const handleDragEnd = () => {
    setDraggedModule(null)
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const handleAddModule = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleForm)
      })
      
      if (response.ok) {
        await fetchModules()
        
        // Ajouter le nouveau module à l'ordre
        const newOrder = [...moduleOrder, moduleForm.id]
        setModuleOrder(newOrder)
        localStorage.setItem('moduleOrder', JSON.stringify(newOrder))
        
        setModuleForm({
          id: '',
          title: '',
          icon: '📦',
          description: '',
          details: '',
          color: 'from-blue-500 to-blue-600',
          link: ''
        })
        setShowAddForm(false)
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleEditModule = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/modules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingModule.id,
          moduleData: moduleForm
        })
      })
      
      if (response.ok) {
        await fetchModules()
        setEditingModule(null)
        setModuleForm({
          id: '',
          title: '',
          icon: '📦',
          description: '',
          details: '',
          color: 'from-blue-500 to-blue-600',
          link: ''
        })
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleDeleteModule = async (moduleId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) return
    
    try {
      const response = await fetch('/api/admin/modules', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: moduleId })
      })
      
      if (response.ok) {
        // Retirer de l'ordre aussi
        const newOrder = moduleOrder.filter(id => id !== moduleId)
        setModuleOrder(newOrder)
        localStorage.setItem('moduleOrder', JSON.stringify(newOrder))
        
        await fetchModules()
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

  const orderedModules = getOrderedModules()

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-100 pt-[100px]">
        {/* Barre d'admin */}
        <div className="bg-[#0073a8] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-lg font-semibold">
                  🔒 Tableau de Bord Administrateur
                </span>
              </div>
              <div className="flex items-center gap-2">
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
                <button
                  onClick={handleLogout}
                  className="text-sm text-white/90 hover:text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Titre et stats */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenue dans votre espace admin
            </h1>
            <p className="text-gray-600">
              Gérez votre activité en toute simplicité
            </p>
          </div>

          {/* Notifications urgentes */}
          {stats.facturesEnRetard > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-red-600 mr-2">⚠️</span>
                <p className="text-red-800">
                  <strong>{stats.facturesEnRetard} facture{stats.facturesEnRetard > 1 ? 's' : ''} en retard</strong>
                  {' - '}
                  <Link href="/admin/facturation" className="underline hover:text-red-900">
                    Voir les factures
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Barre combinée Actions rapides + Aperçu rapide */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Actions rapides */}
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900 mb-2">
                  Actions rapides
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Link
                    href="/admin/facturation?action=nouveau-devis"
                    className="flex items-center justify-center px-2 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                  >
                    <span className="mr-1 text-sm">📄</span>
                    Nouveau devis
                  </Link>
                  <Link
                    href="/admin/depenses?action=nouvelle-depense"
                    className="flex items-center justify-center px-2 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium"
                  >
                    <span className="mr-1 text-sm">💸</span>
                    Nouvelle dépense
                  </Link>
                  <Link
                    href="/admin/emails?action=nouveau-message"
                    className="flex items-center justify-center px-2 py-1.5 bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100 transition-colors text-xs font-medium"
                  >
                    <span className="mr-1 text-sm">📧</span>
                    Envoyer email
                  </Link>
                  <Link
                    href="/admin/agenda?action=nouveau-projet"
                    className="flex items-center justify-center px-2 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-xs font-medium"
                  >
                    <span className="mr-1 text-sm">📅</span>
                    Nouveau projet
                  </Link>
                </div>
              </div>

              {/* Séparateur vertical sur desktop */}
              <div className="hidden lg:block w-px h-16 bg-gray-200"></div>

              {/* Aperçu rapide */}
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900 mb-2">
                  Aperçu rapide
                </h2>
                <div className="grid grid-cols-5 gap-2">
                  <div className="text-center">
                    <p className="text-xl font-bold text-[#0073a8] leading-none">{stats.sitesActifs}</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">Sites actifs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-600 leading-none">{stats.devisEnCours}</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">Devis en cours</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-purple-600 leading-none">{stats.projetsCeMois}</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">Projets/mois</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-orange-600 leading-none">{stats.tachesActives}</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">Tâches actives</p>
                  </div>
                  {stats.caMonth > 0 && (
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-700 leading-none">{stats.caMonth.toFixed(0)}€</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">CA du mois</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Grille de modules */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {orderedModules.map((module) => (
              editingModule?.id === module.id ? (
                // Formulaire d'édition
                <form key={module.id} onSubmit={handleEditModule} className="bg-white rounded-xl shadow-sm border-2 border-[#0073a8] overflow-hidden">
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Modifier le module</h3>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Titre"
                        value={moduleForm.title}
                        onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        required
                      />
                      
                      <div className="relative icon-picker-container">
                        <button
                          type="button"
                          onClick={() => setShowEditIconPicker(!showEditIconPicker)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8] flex items-center justify-between hover:bg-gray-50"
                        >
                          <span className="text-2xl">{moduleForm.icon}</span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {/* Sélecteur d'icônes */}
                        {showEditIconPicker && (
                          <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-h-64 overflow-y-auto">
                            <div className="grid grid-cols-8 gap-1">
                              {popularIcons.map((icon, index) => (
                                <button
                                  key={`edit-icon-${index}`}
                                  type="button"
                                  onClick={() => {
                                    setModuleForm({ ...moduleForm, icon })
                                    setShowEditIconPicker(false)
                                  }}
                                  className="text-2xl p-2 hover:bg-gray-100 rounded transition-colors"
                                >
                                  {icon}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <input
                        type="text"
                        placeholder="Description courte"
                        value={moduleForm.description}
                        onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        required
                      />
                      
                      <textarea
                        placeholder="Détails"
                        value={moduleForm.details}
                        onChange={(e) => setModuleForm({ ...moduleForm, details: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        rows="2"
                        required
                      />
                      
                      <input
                        type="text"
                        placeholder="Lien (/admin/...)"
                        value={moduleForm.link}
                        onChange={(e) => setModuleForm({ ...moduleForm, link: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        required
                      />
                      
                      <select
                        value={moduleForm.color}
                        onChange={(e) => setModuleForm({ ...moduleForm, color: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      >
                        {availableColors.map((color) => (
                          <option key={color.value} value={color.value}>
                            {color.name}
                          </option>
                        ))}
                      </select>
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
                          setEditingModule(null)
                          setModuleForm({
                            id: '',
                            title: '',
                            icon: '📦',
                            description: '',
                            details: '',
                            color: 'from-blue-500 to-blue-600',
                            link: ''
                          })
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div 
                  key={module.id} 
                  className={`relative ${editMode ? 'cursor-move' : ''} ${draggedModule === module.id ? 'opacity-50' : ''}`}
                  draggable={editMode}
                  onDragStart={(e) => handleDragStart(e, module.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, module.id)}
                  onDragEnd={handleDragEnd}
                >
                  {/* Indicateur de glisser-déposer */}
                  {editMode && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 bg-gray-200 rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  )}
                  
                  <Link
                    href={editMode ? '#' : module.link}
                    onClick={(e) => editMode && e.preventDefault()}
                    className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-200 group"
                  >
                    {/* Header coloré avec icône */}
                    <div className={`bg-gradient-to-r ${module.color} p-4 text-white`}>
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{module.icon}</div>
                        <h3 className="text-lg font-bold">{module.title}</h3>
                      </div>
                    </div>
                    
                    {/* Contenu */}
                    <div className="p-4">
                      <p className="text-gray-800 font-medium mb-1 text-sm">
                        {module.description}
                      </p>
                      <p className="text-xs text-gray-600 mb-3">
                        {module.details}
                      </p>
                      
                      {/* Call to action */}
                      {!editMode && (
                        <div className="flex items-center text-[#0073a8] font-medium group-hover:translate-x-2 transition-transform text-sm">
                          <span>Accéder</span>
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  {/* Boutons d'édition */}
                  {editMode && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingModule(module)
                          setModuleForm({
                            id: module.id,
                            title: module.title,
                            icon: module.icon,
                            description: module.description,
                            details: module.details,
                            color: module.color,
                            link: module.link
                          })
                        }}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
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
            {editMode && !showAddForm && !editingModule && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-[#0073a8] hover:bg-gray-100 transition-all group flex flex-col items-center justify-center min-h-[200px]"
              >
                <svg className="w-12 h-12 text-gray-400 group-hover:text-[#0073a8] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-gray-600 group-hover:text-[#0073a8] font-medium">
                  Ajouter un module
                </span>
              </button>
            )}
            
            {/* Formulaire d'ajout */}
            {showAddForm && (
              <form onSubmit={handleAddModule} className="bg-white rounded-xl shadow-sm border-2 border-[#0073a8] overflow-hidden">
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Nouveau module</h3>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="ID unique (ex: crm)"
                      value={moduleForm.id}
                      onChange={(e) => setModuleForm({ ...moduleForm, id: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      required
                    />
                    
                    <input
                      type="text"
                      placeholder="Titre"
                      value={moduleForm.title}
                      onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      required
                    />
                    
                    <div className="relative icon-picker-container">
                      <button
                        type="button"
                        onClick={() => setShowIconPicker(!showIconPicker)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8] flex items-center justify-between hover:bg-gray-50"
                      >
                        <span className="text-2xl">{moduleForm.icon}</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Sélecteur d'icônes */}
                      {showIconPicker && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-h-64 overflow-y-auto">
                          <div className="grid grid-cols-8 gap-1">
                            {popularIcons.map((icon, index) => (
                              <button
                                key={`add-icon-${index}`}
                                type="button"
                                onClick={() => {
                                  setModuleForm({ ...moduleForm, icon })
                                  setShowIconPicker(false)
                                }}
                                className="text-2xl p-2 hover:bg-gray-100 rounded transition-colors"
                              >
                                {icon}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Description courte"
                      value={moduleForm.description}
                      onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      required
                    />
                    
                    <textarea
                      placeholder="Détails"
                      value={moduleForm.details}
                      onChange={(e) => setModuleForm({ ...moduleForm, details: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      rows="2"
                      required
                    />
                    
                    <input
                      type="text"
                      placeholder="Lien (/admin/...)"
                      value={moduleForm.link}
                      onChange={(e) => setModuleForm({ ...moduleForm, link: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      required
                    />
                    
                    <select
                      value={moduleForm.color}
                      onChange={(e) => setModuleForm({ ...moduleForm, color: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    >
                      {availableColors.map((color) => (
                        <option key={color.value} value={color.value}>
                          {color.name}
                        </option>
                      ))}
                    </select>
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