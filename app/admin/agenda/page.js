"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function Agenda() {
  const [projets, setProjets] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('kanban') // kanban, calendar, list, week
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProjet, setEditingProjet] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const [filterClient, setFilterClient] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [draggedProjet, setDraggedProjet] = useState(null)
  const [showWeekends, setShowWeekends] = useState(true)
  const [showHolidays, setShowHolidays] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: false,
    daysBefore: 1
  })
  const [selectedDate, setSelectedDate] = useState(null)
  const [showProjetDetails, setShowProjetDetails] = useState(null)
  const [blockedDays, setBlockedDays] = useState({})
  const [showBlockDayModal, setShowBlockDayModal] = useState(false)
  const [blockDayForm, setBlockDayForm] = useState({
    dateDebut: '',
    dateFin: '',
    raison: ''
  })
  
  // Jours fériés français 2025
  const joursFeries = {
    '2025-01-01': 'Jour de l\'An',
    '2025-04-21': 'Lundi de Pâques',
    '2025-05-01': 'Fête du Travail',
    '2025-05-08': 'Victoire 1945',
    '2025-05-29': 'Ascension',
    '2025-06-09': 'Lundi de Pentecôte',
    '2025-07-14': 'Fête Nationale',
    '2025-08-15': 'Assomption',
    '2025-11-01': 'Toussaint',
    '2025-11-11': 'Armistice 1918',
    '2025-12-25': 'Noël'
  }
  
  // Formulaire
  const [formData, setFormData] = useState({
    titre: '',
    clientId: '',
    description: '',
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: '',
    status: 'a_faire',
    priorite: 'normale',
    budget: '',
    progression: 0,
    notes: '',
    taches: []
  })

  // Statuts des projets
  const statuts = {
    a_faire: { label: 'À faire', color: 'bg-gray-100 text-gray-800', emoji: '📋' },
    en_cours: { label: 'En cours', color: 'bg-blue-100 text-blue-800', emoji: '🚀' },
    en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', emoji: '⏸️' },
    termine: { label: 'Terminé', color: 'bg-green-100 text-green-800', emoji: '✅' }
  }

  // Priorités
  const priorites = {
    basse: { label: 'Basse', color: 'text-gray-600', emoji: '🔵' },
    normale: { label: 'Normale', color: 'text-blue-600', emoji: '🟡' },
    haute: { label: 'Haute', color: 'text-orange-600', emoji: '🟠' },
    urgente: { label: 'Urgente', color: 'text-red-600', emoji: '🔴' }
  }

  useEffect(() => {
    fetchData()
    loadNotificationSettings()
    checkNotifications()
    
    // Charger les jours bloqués depuis localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('blockedDays')
      if (saved) {
        setBlockedDays(JSON.parse(saved))
      }
    }
  }, [])

  // Charger les paramètres de notifications
  const loadNotificationSettings = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agendaNotifications')
      if (saved) {
        setNotificationSettings(JSON.parse(saved))
      }
    }
  }

  // Sauvegarder les paramètres de notifications
  const saveNotificationSettings = (settings) => {
    setNotificationSettings(settings)
    if (typeof window !== 'undefined') {
      localStorage.setItem('agendaNotifications', JSON.stringify(settings))
    }
  }

  // Vérifier les notifications
  const checkNotifications = () => {
    if (!notificationSettings.enabled) return
    
    const today = new Date()
    const upcomingProjets = projets.filter(projet => {
      if (projet.status === 'termine' || !projet.dateFin) return false
      
      const projetDate = new Date(projet.dateFin)
      const diffTime = projetDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      return diffDays >= 0 && diffDays <= notificationSettings.daysBefore
    })
    
    if (upcomingProjets.length > 0 && 'Notification' in window && Notification.permission === 'granted') {
      upcomingProjets.forEach(projet => {
        new Notification('Rappel Projet', {
          body: `${projet.titre} - Échéance dans ${getDaysRemaining(projet.dateFin)} jour(s)`,
          icon: '/favicon.ico'
        })
      })
    }
  }

  // Demander la permission pour les notifications
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        saveNotificationSettings({ ...notificationSettings, enabled: true })
        checkNotifications()
      }
    } else if (Notification.permission === 'granted') {
      saveNotificationSettings({ ...notificationSettings, enabled: true })
      checkNotifications()
    }
  }

  const fetchData = async () => {
    try {
      // Charger les projets
      const projetsResponse = await fetch('/api/admin/agenda')
      const projetsData = await projetsResponse.json()
      setProjets(projetsData.projets || [])
      
      // Charger les clients
      const clientsResponse = await fetch('/api/admin/crm')
      const clientsData = await clientsResponse.json()
      setClients(clientsData)
      
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      // Données de démonstration
      setProjets([
        {
          id: '1',
          titre: 'Refonte site Restaurant Le Gourmet',
          clientId: 'CLI-001',
          clientNom: 'Restaurant Le Gourmet',
          description: 'Refonte complète du site avec nouveau design et menu interactif',
          dateDebut: '2025-01-15',
          dateFin: '2025-02-15',
          status: 'en_cours',
          priorite: 'haute',
          budget: 3500,
          progression: 65,
          taches: [
            { id: '1', titre: 'Maquettes', complete: true },
            { id: '2', titre: 'Développement front', complete: true },
            { id: '3', titre: 'Intégration menu', complete: false },
            { id: '4', titre: 'Tests et mise en ligne', complete: false }
          ]
        },
        {
          id: '2',
          titre: 'Maintenance mensuelle Boutique Mode',
          clientId: 'CLI-002',
          clientNom: 'Boutique Mode & Style',
          description: 'Maintenance et mises à jour mensuelles',
          dateDebut: '2025-01-01',
          dateFin: '2025-01-31',
          status: 'en_cours',
          priorite: 'normale',
          budget: 200,
          progression: 80
        }
      ])
      setLoading(false)
    }
  }

  // Ajouter/Modifier un projet
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const method = editingProjet ? 'PUT' : 'POST'
      const body = editingProjet 
        ? { id: editingProjet.id, ...formData }
        : formData
      
      // Ajouter le nom du client
      const client = clients.find(c => c.id === formData.clientId)
      if (client) {
        body.clientNom = client.entreprise
      }
      
      const response = await fetch('/api/admin/agenda', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      if (response.ok) {
        await fetchData()
        resetForm()
        checkNotifications() // Vérifier les notifications après ajout
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Supprimer un projet
  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return
    
    try {
      const response = await fetch('/api/admin/agenda', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      
      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Changer le statut d'un projet
  const handleStatusChange = async (projetId, newStatus) => {
    const projet = projets.find(p => p.id === projetId)
    if (!projet) return
    
    try {
      const response = await fetch('/api/admin/agenda', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: projetId,
          ...projet,
          status: newStatus
        })
      })
      
      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Mettre à jour la progression
  const handleProgressionUpdate = async (projetId, progression) => {
    const projet = projets.find(p => p.id === projetId)
    if (!projet) return
    
    try {
      const response = await fetch('/api/admin/agenda', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: projetId,
          ...projet,
          progression: parseInt(progression)
        })
      })
      
      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Drag & Drop handlers
  const handleDragStart = (e, projet) => {
    setDraggedProjet(projet)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, newStatus) => {
    e.preventDefault()
    
    if (!draggedProjet || draggedProjet.status === newStatus) {
      setDraggedProjet(null)
      return
    }
    
    await handleStatusChange(draggedProjet.id, newStatus)
    setDraggedProjet(null)
  }

  // Drag & Drop pour le calendrier
  const handleCalendarDrop = async (e, date) => {
    e.preventDefault()
    
    if (!draggedProjet) return
    
    const newDateFin = new Date(date)
    newDateFin.setDate(newDateFin.getDate() + getDurationInDays(draggedProjet.dateDebut, draggedProjet.dateFin))
    
    try {
      const response = await fetch('/api/admin/agenda', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: draggedProjet.id,
          ...draggedProjet,
          dateDebut: date,
          dateFin: newDateFin.toISOString().split('T')[0]
        })
      })
      
      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
    
    setDraggedProjet(null)
  }

  // Calculer la durée en jours
  const getDurationInDays = (dateDebut, dateFin) => {
    if (!dateDebut || !dateFin) return 0
    const start = new Date(dateDebut)
    const end = new Date(dateFin)
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Sauvegarder les jours bloqués
  const saveBlockedDays = (days) => {
    setBlockedDays(days)
    if (typeof window !== 'undefined') {
      localStorage.setItem('blockedDays', JSON.stringify(days))
    }
  }

  // Ajouter des jours bloqués
  const handleBlockDays = (e) => {
    e.preventDefault()
    
    const start = new Date(blockDayForm.dateDebut)
    const end = new Date(blockDayForm.dateFin)
    const newBlockedDays = { ...blockedDays }
    
    // Ajouter chaque jour entre les dates
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]
      newBlockedDays[dateStr] = blockDayForm.raison
    }
    
    saveBlockedDays(newBlockedDays)
    setShowBlockDayModal(false)
    setBlockDayForm({ dateDebut: '', dateFin: '', raison: '' })
  }

  // Supprimer un jour bloqué
  const removeBlockedDay = (date) => {
    const newBlockedDays = { ...blockedDays }
    delete newBlockedDays[date]
    saveBlockedDays(newBlockedDays)
  }

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      titre: '',
      clientId: '',
      description: '',
      dateDebut: new Date().toISOString().split('T')[0],
      dateFin: '',
      status: 'a_faire',
      priorite: 'normale',
      budget: '',
      progression: 0,
      notes: '',
      taches: []
    })
    setShowAddForm(false)
    setEditingProjet(null)
  }

  // Éditer un projet
  const handleEdit = (projet) => {
    setEditingProjet(projet)
    setFormData({
      titre: projet.titre,
      clientId: projet.clientId,
      description: projet.description || '',
      dateDebut: projet.dateDebut,
      dateFin: projet.dateFin || '',
      status: projet.status,
      priorite: projet.priorite || 'normale',
      budget: projet.budget || '',
      progression: projet.progression || 0,
      notes: projet.notes || '',
      taches: projet.taches || []
    })
    setShowAddForm(true)
  }

  // Filtrer les projets avec recherche
  const getFilteredProjets = () => {
    return projets.filter(projet => {
      const matchesClient = !filterClient || projet.clientId === filterClient
      const matchesStatus = !filterStatus || projet.status === filterStatus
      const matchesSearch = !searchTerm || 
        projet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projet.clientNom.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesClient && matchesStatus && matchesSearch
    })
  }

  // Obtenir les projets par statut (pour Kanban)
  const getProjetsByStatus = () => {
    const filtered = getFilteredProjets()
    return {
      a_faire: filtered.filter(p => p.status === 'a_faire'),
      en_cours: filtered.filter(p => p.status === 'en_cours'),
      en_attente: filtered.filter(p => p.status === 'en_attente'),
      termine: filtered.filter(p => p.status === 'termine')
    }
  }

  // Obtenir les projets pour une date spécifique
  const getProjetsForDate = (date) => {
    return getFilteredProjets().filter(projet => {
      if (!projet.dateDebut || !projet.dateFin) return false
      
      const projetStart = new Date(projet.dateDebut)
      const projetEnd = new Date(projet.dateFin)
      const currentDate = new Date(date)
      
      // Le projet est affiché si la date est entre le début et la fin
      return currentDate >= projetStart && currentDate <= projetEnd
    })
  }

  // Calculer la charge de travail pour une date
  const getWorkloadForDate = (date) => {
    const dayProjets = getProjetsForDate(date)
    let workload = 0
    
    dayProjets.forEach(projet => {
      if (projet.priorite === 'urgente') workload += 4
      else if (projet.priorite === 'haute') workload += 3
      else if (projet.priorite === 'normale') workload += 2
      else workload += 1
    })
    
    return workload
  }

  // Obtenir la couleur de charge de travail
  const getWorkloadColor = (workload) => {
    if (workload === 0) return ''
    if (workload <= 3) return 'bg-green-200'
    if (workload <= 6) return 'bg-yellow-200'
    if (workload <= 9) return 'bg-orange-200'
    return 'bg-red-200'
  }

  // Générer les jours du calendrier
  const generateCalendarDays = () => {
    const year = selectedMonth.getFullYear()
    const month = selectedMonth.getMonth()
    
    // Premier jour du mois
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    // Jour de la semaine du premier jour (0 = dimanche, 1 = lundi, etc.)
    const firstDayOfWeek = firstDay.getDay()
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1 // Ajuster pour commencer lundi
    
    const days = []
    
    // Ajouter les jours du mois précédent pour remplir la première semaine
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i)
      days.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        isCurrentMonth: false,
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      })
    }
    
    // Ajouter les jours du mois actuel
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day)
      days.push({
        date: date.toISOString().split('T')[0],
        day: day,
        isCurrentMonth: true,
        isToday: isToday(date),
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      })
    }
    
    // Ajouter les jours du mois suivant pour compléter la dernière semaine
    const remainingDays = 42 - days.length // 6 semaines * 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({
        date: date.toISOString().split('T')[0],
        day: day,
        isCurrentMonth: false,
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      })
    }
    
    return days
  }

  // Générer les jours de la semaine
  const generateWeekDays = () => {
    const startOfWeek = new Date(selectedWeek)
    const dayOfWeek = startOfWeek.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Ajuster pour commencer lundi
    startOfWeek.setDate(startOfWeek.getDate() + diff)
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      days.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        month: date.getMonth(),
        isToday: isToday(date),
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      })
    }
    
    return days
  }

  // Vérifier si une date est aujourd'hui
  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // Navigation du calendrier
  const navigateMonth = (direction) => {
    const newMonth = new Date(selectedMonth)
    newMonth.setMonth(newMonth.getMonth() + direction)
    setSelectedMonth(newMonth)
  }

  // Navigation de la semaine
  const navigateWeek = (direction) => {
    const newWeek = new Date(selectedWeek)
    newWeek.setDate(newWeek.getDate() + (direction * 7))
    setSelectedWeek(newWeek)
  }

  // Export PDF du calendrier
  const exportCalendarPDF = () => {
    window.print()
  }

  // Calculer les stats
  const getStats = () => {
    const filtered = getFilteredProjets()
    return {
      total: filtered.length,
      enCours: filtered.filter(p => p.status === 'en_cours').length,
      enRetard: filtered.filter(p => {
        if (!p.dateFin || p.status === 'termine') return false
        return new Date(p.dateFin) < new Date()
      }).length,
      budgetTotal: filtered.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0)
    }
  }

  // Formater les montants
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0)
  }

  // Calculer le nombre de jours restants
  const getDaysRemaining = (dateFin) => {
    if (!dateFin) return null
    const today = new Date()
    const end = new Date(dateFin)
    const diffTime = end - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
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

  const stats = getStats()
  const projetsByStatus = getProjetsByStatus()
  const calendarDays = generateCalendarDays()
  const weekDays = generateWeekDays()

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-100 pt-[100px]">
        {/* Styles d'impression */}
        <style jsx>{`
          @media print {
            .no-print {
              display: none !important;
            }
            .print-only {
              display: block !important;
            }
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        `}</style>

        {/* Barre d'admin */}
        <div className="bg-[#0073a8] text-white no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <Link href="/admin" className="text-white/80 hover:text-white transition-colors">
                  ← Retour
                </Link>
                <span className="text-lg font-semibold">
                  📅 Gestion des Projets
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/10 rounded-lg p-1 flex">
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      viewMode === 'kanban' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Kanban
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Liste
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      viewMode === 'calendar' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Calendrier
                  </button>
                  <button
                    onClick={() => setViewMode('week')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      viewMode === 'week' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Semaine
                  </button>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  {showAddForm ? '✕ Fermer' : '+ Nouveau projet'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Titre et stats */}
          <div className="text-center mb-8 no-print">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion des Projets
            </h1>
            <p className="text-gray-600">
              Suivez l'avancement de tous vos projets clients
            </p>
          </div>

          {/* Titre pour l'impression */}
          <div className="hidden print-only text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Calendrier des Projets - {selectedMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h1>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 no-print">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔔</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Notifications de rappel</h3>
                  <p className="text-sm text-gray-600">
                    Recevez des rappels pour vos projets à venir
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={notificationSettings.daysBefore}
                  onChange={(e) => saveNotificationSettings({
                    ...notificationSettings,
                    daysBefore: parseInt(e.target.value)
                  })}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  disabled={!notificationSettings.enabled}
                >
                  <option value="0">Le jour même</option>
                  <option value="1">1 jour avant</option>
                  <option value="2">2 jours avant</option>
                  <option value="3">3 jours avant</option>
                  <option value="7">1 semaine avant</option>
                </select>
                <button
                  onClick={() => {
                    if (notificationSettings.enabled) {
                      saveNotificationSettings({ ...notificationSettings, enabled: false })
                    } else {
                      requestNotificationPermission()
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationSettings.enabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 no-print">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total projets</span>
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">En cours</span>
                <span className="text-2xl">🚀</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.enCours}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">En retard</span>
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.enRetard}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Budget total</span>
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{formatMoney(stats.budgetTotal)}</p>
            </div>
          </div>

          {/* Formulaire d'ajout/édition */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 no-print">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingProjet ? 'Modifier le projet' : 'Nouveau projet'}
              </h2>
              
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre du projet *
                  </label>
                  <input
                    type="text"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client *
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    required
                  >
                    <option value="">Sélectionner un client...</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.entreprise}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début *
                  </label>
                  <input
                    type="date"
                    value={formData.dateDebut}
                    onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin prévue
                  </label>
                  <input
                    type="date"
                    value={formData.dateFin}
                    onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                  >
                    {Object.entries(statuts).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.emoji} {value.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priorité
                  </label>
                  <select
                    value={formData.priorite}
                    onChange={(e) => setFormData({ ...formData, priorite: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                  >
                    {Object.entries(priorites).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.emoji} {value.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progression (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progression}
                    onChange={(e) => setFormData({ ...formData, progression: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    rows="3"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes internes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    rows="2"
                  />
                </div>
                
                <div className="md:col-span-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0073a8] text-white rounded-lg hover:bg-[#006a87] transition-colors"
                  >
                    {editingProjet ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filtres et recherche */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 no-print">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="🔍 Rechercher un projet..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                />
              </div>
              
              <select
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
              >
                <option value="">Tous les clients</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.entreprise}
                  </option>
                ))}
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
              >
                <option value="">Tous les statuts</option>
                {Object.entries(statuts).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.emoji} {value.label}
                  </option>
                ))}
              </select>

              {viewMode === 'calendar' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowWeekends(!showWeekends)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      showWeekends 
                        ? 'bg-[#0073a8] text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Week-ends
                  </button>
                  <button
                    onClick={() => setShowHolidays(!showHolidays)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      showHolidays 
                        ? 'bg-[#0073a8] text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Jours fériés
                  </button>
                  <button
                    onClick={() => setShowBlockDayModal(true)}
                    className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                  >
                    🚫 Bloquer des jours
                  </button>
                  <button
                    onClick={exportCalendarPDF}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                  >
                    📄 Export PDF
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Vue Kanban */}
          {viewMode === 'kanban' && (
            <div className="grid md:grid-cols-4 gap-4">
              {Object.entries(statuts).map(([statusKey, statusInfo]) => (
                <div 
                  key={statusKey} 
                  className="bg-gray-50 rounded-lg p-4"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, statusKey)}
                >
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                    <span>{statusInfo.emoji} {statusInfo.label}</span>
                    <span className="text-sm text-gray-500">
                      {projetsByStatus[statusKey]?.length || 0}
                    </span>
                  </h3>
                  
                  <div className="space-y-3">
                    {projetsByStatus[statusKey]?.map(projet => {
                      const daysRemaining = getDaysRemaining(projet.dateFin)
                      const isLate = daysRemaining !== null && daysRemaining < 0 && projet.status !== 'termine'
                      
                      return (
                        <div
                          key={projet.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, projet)}
                          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move"
                          onClick={() => handleEdit(projet)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {projet.titre}
                            </h4>
                            <span className={`text-xl ${priorites[projet.priorite]?.color}`}>
                              {priorites[projet.priorite]?.emoji}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-600 mb-2">
                            {projet.clientNom}
                          </p>
                          
                          {projet.dateFin && (
                            <p className={`text-xs mb-2 ${isLate ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                              {isLate ? `⚠️ En retard de ${Math.abs(daysRemaining)} jours` : 
                               daysRemaining === 0 ? "📅 Échéance aujourd'hui" :
                               `📅 ${daysRemaining} jours restants`}
                            </p>
                          )}
                          
                          {projet.budget && (
                            <p className="text-xs text-gray-600 mb-3">
                              💰 {formatMoney(projet.budget)}
                            </p>
                          )}
                          
                          {/* Barre de progression */}
                          <div className="mb-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-500">Progression</span>
                              <span className="text-xs font-medium">{projet.progression || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#0073a8] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${projet.progression || 0}%` }}
                              />
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex justify-between items-center mt-3">
                            <select
                              value={statusKey}
                              onChange={(e) => {
                                e.stopPropagation()
                                handleStatusChange(projet.id, e.target.value)
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-[#0073a8] focus:border-[#0073a8]"
                            >
                              {Object.entries(statuts).map(([key, value]) => (
                                <option key={key} value={key}>
                                  {value.label}
                                </option>
                              ))}
                            </select>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(projet.id)
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                    
                    {(!projetsByStatus[statusKey] || projetsByStatus[statusKey].length === 0) && (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        Aucun projet
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Vue Liste */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Projet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progression
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredProjets().map(projet => {
                      const daysRemaining = getDaysRemaining(projet.dateFin)
                      const isLate = daysRemaining !== null && daysRemaining < 0 && projet.status !== 'termine'
                      
                      return (
                        <tr key={projet.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {projet.titre}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <span className={priorites[projet.priorite]?.color}>
                                  {priorites[projet.priorite]?.emoji}
                                </span>
                                {priorites[projet.priorite]?.label}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <Link 
                              href={`/admin/crm/${projet.clientId}`}
                              className="text-[#0073a8] hover:underline"
                            >
                              {projet.clientNom}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {new Date(projet.dateDebut).toLocaleDateString('fr-FR')}
                            </div>
                            {projet.dateFin && (
                              <div className={`text-xs ${isLate ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                → {new Date(projet.dateFin).toLocaleDateString('fr-FR')}
                                {isLate && ' (En retard)'}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {projet.budget ? formatMoney(projet.budget) : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-[#0073a8] h-2 rounded-full"
                                    style={{ width: `${projet.progression || 0}%` }}
                                  />
                                </div>
                              </div>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={projet.progression || 0}
                                onChange={(e) => handleProgressionUpdate(projet.id, e.target.value)}
                                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                              />
                              <span className="text-xs text-gray-600">%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statuts[projet.status]?.color}`}>
                              <span>{statuts[projet.status]?.emoji}</span>
                              {statuts[projet.status]?.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(projet)}
                                className="text-[#0073a8] hover:text-[#006a87]"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(projet.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                
                {getFilteredProjets().length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Aucun projet trouvé</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vue Calendrier */}
          {viewMode === 'calendar' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* En-tête du calendrier */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <select
                    value={selectedMonth.getMonth()}
                    onChange={(e) => {
                      const newDate = new Date(selectedMonth)
                      newDate.setMonth(parseInt(e.target.value))
                      setSelectedMonth(newDate)
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8] font-semibold"
                  >
                    {[
                      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
                    ].map((month, index) => (
                      <option key={index} value={index}>{month}</option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedMonth.getFullYear()}
                    onChange={(e) => {
                      const newDate = new Date(selectedMonth)
                      newDate.setFullYear(parseInt(e.target.value))
                      setSelectedMonth(newDate)
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8] font-semibold"
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-2 no-print">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedMonth(new Date())}
                    className="px-3 py-1 text-sm bg-[#0073a8] text-white rounded-lg hover:bg-[#006a87] transition-colors"
                  >
                    Aujourd'hui
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Jours de la semaine */}
              <div className="grid grid-cols-7 gap-px bg-gray-200 mb-px">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
                  <div 
                    key={day} 
                    className={`p-2 text-center text-sm font-medium text-gray-700 ${
                      index >= 5 ? 'bg-blue-100' : 'bg-gray-50'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Grille du calendrier */}
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {calendarDays.map((dayInfo, index) => {
                  const dayProjets = getProjetsForDate(dayInfo.date)
                  const workload = getWorkloadForDate(dayInfo.date)
                  const workloadColor = getWorkloadColor(workload)
                  const isHoliday = joursFeries[dayInfo.date]
                  const isBlocked = blockedDays[dayInfo.date]
                  
                  return (
                    <div
                      key={index}
                      onDragOver={!isBlocked ? handleDragOver : undefined}
                      onDrop={!isBlocked ? (e) => handleCalendarDrop(e, dayInfo.date) : undefined}
                      className={`
                        bg-white p-2 min-h-[120px] relative
                        ${!dayInfo.isCurrentMonth ? 'bg-gray-50' : ''}
                        ${dayInfo.isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}
                        ${dayInfo.isWeekend && showWeekends && dayInfo.isCurrentMonth ? 'bg-blue-50' : ''}
                        ${isHoliday && showHolidays && dayInfo.isCurrentMonth ? 'bg-red-50' : ''}
                        ${isBlocked ? 'bg-gray-200 cursor-not-allowed' : ''}
                        ${!isBlocked ? 'hover:bg-gray-50' : ''} transition-colors
                      `}
                    >
                      {/* Indicateur de charge de travail */}
                      {workload > 0 && (
                        <div className={`absolute top-0 left-0 right-0 h-1 ${workloadColor}`} />
                      )}
                      
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-medium ${
                          !dayInfo.isCurrentMonth ? 'text-gray-400' : 
                          dayInfo.isToday ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {dayInfo.day}
                        </span>
                        {dayProjets.length > 0 && (
                          <span className="text-xs bg-[#0073a8] text-white px-1.5 py-0.5 rounded-full">
                            {dayProjets.length}
                          </span>
                        )}
                      </div>
                      
                      {/* Jour férié */}
                      {isHoliday && showHolidays && (
                        <div className="text-xs text-red-600 font-medium mb-1">
                          {isHoliday}
                        </div>
                      )}
                      
                      {/* Jour bloqué */}
                      {isBlocked && (
                        <div className="text-xs text-gray-600 font-medium mb-1 flex items-center justify-between">
                          <span>🚫 {isBlocked}</span>
                          <button
                            onClick={() => removeBlockedDay(dayInfo.date)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                      
                      {/* Projets du jour */}
                      {!isBlocked && (
                        <div className="space-y-1">
                          {dayProjets.slice(0, 3).map(projet => (
                            <div
                              key={projet.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, projet)}
                              onClick={() => setShowProjetDetails(projet)}
                              className={`
                                text-xs p-1 rounded cursor-pointer
                                ${statuts[projet.status]?.color}
                                hover:opacity-80 transition-opacity
                              `}
                            >
                              <div className="flex items-center gap-1">
                                <span>{statuts[projet.status]?.emoji}</span>
                                <span className="truncate font-medium">{projet.titre}</span>
                              </div>
                            </div>
                          ))}
                          {dayProjets.length > 3 && (
                            <button
                              onClick={() => {
                                setSelectedDate(dayInfo.date)
                                setFilterStatus('')
                                setFilterClient('')
                              }}
                              className="text-xs text-[#0073a8] hover:underline"
                            >
                              +{dayProjets.length - 3} autres
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Légende */}
              <div className="mt-6 flex flex-wrap gap-4 text-sm no-print">
                <div className="flex items-center gap-6">
                  <span className="font-medium text-gray-700">Légende :</span>
                  {Object.entries(statuts).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${value.color}`}>
                        {value.emoji} {value.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 ml-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-green-200"></div>
                    <span className="text-xs text-gray-600">Charge faible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-yellow-200"></div>
                    <span className="text-xs text-gray-600">Charge moyenne</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-red-200"></div>
                    <span className="text-xs text-gray-600">Charge élevée</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vue Semaine */}
          {viewMode === 'week' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* En-tête de la semaine */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Semaine du {weekDays[0].day} {['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'][weekDays[0].month]} au {weekDays[6].day} {['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'][weekDays[6].month]}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateWeek(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedWeek(new Date())}
                    className="px-3 py-1 text-sm bg-[#0073a8] text-white rounded-lg hover:bg-[#006a87] transition-colors"
                  >
                    Cette semaine
                  </button>
                  <button
                    onClick={() => navigateWeek(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Grille de la semaine */}
              <div className="grid grid-cols-7 gap-4">
                {weekDays.map((dayInfo, index) => {
                  const dayProjets = getProjetsForDate(dayInfo.date)
                  const workload = getWorkloadForDate(dayInfo.date)
                  const workloadColor = getWorkloadColor(workload)
                  const isHoliday = joursFeries[dayInfo.date]
                  const isBlocked = blockedDays[dayInfo.date]
                  const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
                  
                  return (
                    <div
                      key={index}
                      onDragOver={!isBlocked ? handleDragOver : undefined}
                      onDrop={!isBlocked ? (e) => handleCalendarDrop(e, dayInfo.date) : undefined}
                      className={`
                        border border-gray-200 rounded-lg p-3 min-h-[400px]
                        ${dayInfo.isToday ? 'ring-2 ring-blue-500' : ''}
                        ${dayInfo.isWeekend ? 'bg-blue-50' : 'bg-white'}
                        ${isHoliday ? 'bg-red-50' : ''}
                        ${isBlocked ? 'bg-gray-200 cursor-not-allowed' : ''}
                      `}
                    >
                      {/* Indicateur de charge */}
                      {workload > 0 && (
                        <div className={`h-2 -mx-3 -mt-3 mb-3 rounded-t-lg ${workloadColor}`} />
                      )}
                      
                      {/* En-tête du jour */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-semibold ${dayInfo.isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                            {dayNames[index]}
                          </h3>
                          <span className={`text-2xl font-bold ${dayInfo.isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                            {dayInfo.day}
                          </span>
                        </div>
                        {isHoliday && (
                          <p className="text-xs text-red-600 font-medium mt-1">{isHoliday}</p>
                        )}
                        {isBlocked && (
                          <div className="text-xs text-gray-600 font-medium mt-1 flex items-center justify-between">
                            <span>🚫 {isBlocked}</span>
                            <button
                              onClick={() => removeBlockedDay(dayInfo.date)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Projets du jour */}
                      {!isBlocked && (
                        <div className="space-y-2">
                          {dayProjets.map(projet => {
                            const daysRemaining = getDaysRemaining(projet.dateFin)
                            const isLate = daysRemaining !== null && daysRemaining < 0 && projet.status !== 'termine'
                            
                            return (
                              <div
                                key={projet.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, projet)}
                                onClick={() => setShowProjetDetails(projet)}
                                className={`
                                  p-2 rounded-lg cursor-pointer
                                  ${statuts[projet.status]?.color}
                                  hover:opacity-80 transition-opacity
                                `}
                              >
                                <div className="flex items-start justify-between mb-1">
                                  <span className="font-medium text-xs flex items-center gap-1">
                                    {statuts[projet.status]?.emoji}
                                    {projet.titre}
                                  </span>
                                  <span className={`text-xs ${priorites[projet.priorite]?.color}`}>
                                    {priorites[projet.priorite]?.emoji}
                                  </span>
                                </div>
                                <p className="text-xs opacity-75">{projet.clientNom}</p>
                                {isLate && (
                                  <p className="text-xs text-red-600 font-medium mt-1">
                                    ⚠️ En retard
                                  </p>
                                )}
                                <div className="mt-2">
                                  <div className="w-full bg-white/50 rounded-full h-1">
                                    <div 
                                      className="bg-gray-700 h-1 rounded-full"
                                      style={{ width: `${projet.progression || 0}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                          
                          {dayProjets.length === 0 && (
                            <p className="text-xs text-gray-400 text-center py-4">
                              Aucun projet
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Modal bloquer des jours */}
          {showBlockDayModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    🚫 Bloquer des jours
                  </h3>
                  
                  <form onSubmit={handleBlockDays} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de début *
                      </label>
                      <input
                        type="date"
                        value={blockDayForm.dateDebut}
                        onChange={(e) => setBlockDayForm({ ...blockDayForm, dateDebut: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de fin *
                      </label>
                      <input
                        type="date"
                        value={blockDayForm.dateFin}
                        onChange={(e) => setBlockDayForm({ ...blockDayForm, dateFin: e.target.value })}
                        min={blockDayForm.dateDebut}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Raison *
                      </label>
                      <select
                        value={blockDayForm.raison}
                        onChange={(e) => setBlockDayForm({ ...blockDayForm, raison: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        required
                      >
                        <option value="">Sélectionner une raison...</option>
                        <option value="Vacances">🏖️ Vacances</option>
                        <option value="Formation">📚 Formation</option>
                        <option value="Congé maladie">🏥 Congé maladie</option>
                        <option value="Déplacement">✈️ Déplacement</option>
                        <option value="Indisponible">🚫 Indisponible</option>
                        <option value="Férié entreprise">🏢 Férié entreprise</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowBlockDayModal(false)
                          setBlockDayForm({ dateDebut: '', dateFin: '', raison: '' })
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Bloquer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Modal détails projet (pour les vues calendrier) */}
          {showProjetDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {showProjetDetails.titre}
                    </h3>
                    <button
                      onClick={() => setShowProjetDetails(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full ${statuts[showProjetDetails.status]?.color}`}>
                        {statuts[showProjetDetails.status]?.emoji} {statuts[showProjetDetails.status]?.label}
                      </span>
                      <span className={`flex items-center gap-1 text-sm ${priorites[showProjetDetails.priorite]?.color}`}>
                        {priorites[showProjetDetails.priorite]?.emoji} Priorité {priorites[showProjetDetails.priorite]?.label}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Client :</span>
                        <p className="font-medium">{showProjetDetails.clientNom}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Budget :</span>
                        <p className="font-medium">{formatMoney(showProjetDetails.budget)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Début :</span>
                        <p className="font-medium">{new Date(showProjetDetails.dateDebut).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Fin :</span>
                        <p className="font-medium">{showProjetDetails.dateFin ? new Date(showProjetDetails.dateFin).toLocaleDateString('fr-FR') : '-'}</p>
                      </div>
                    </div>
                    
                    {showProjetDetails.description && (
                      <div>
                        <span className="text-sm text-gray-600">Description :</span>
                        <p className="text-sm mt-1">{showProjetDetails.description}</p>
                      </div>
                    )}
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Progression :</span>
                        <span className="text-sm font-medium">{showProjetDetails.progression || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#0073a8] h-2 rounded-full"
                          style={{ width: `${showProjetDetails.progression || 0}%` }}
                        />
                      </div>
                    </div>
                    
                    {showProjetDetails.taches && showProjetDetails.taches.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">Tâches :</span>
                        <ul className="mt-2 space-y-1">
                          {showProjetDetails.taches.map(tache => (
                            <li key={tache.id} className="flex items-center gap-2 text-sm">
                              <span className={tache.complete ? 'text-green-600' : 'text-gray-400'}>
                                {tache.complete ? '✓' : '○'}
                              </span>
                              <span className={tache.complete ? 'line-through text-gray-500' : ''}>
                                {tache.titre}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-2 pt-4">
                      <button
                        onClick={() => {
                          handleEdit(showProjetDetails)
                          setShowProjetDetails(null)
                        }}
                        className="px-4 py-2 bg-[#0073a8] text-white rounded-lg hover:bg-[#006a87] transition-colors"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => setShowProjetDetails(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Fermer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  )
}