'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    clients: { total: 0, actifs: 0, nouveaux: 0 },
    factures: { total: 0, enAttente: 0, montantEnAttente: 0 },
    projets: { total: 0, enCours: 0, enRetard: 0 },
    ca: { mois: 0, annee: 0, evolution: 0 }
  })
  const [notifications, setNotifications] = useState([])
  const [activiteRecente, setActiviteRecente] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Charger toutes les données en parallèle
      const [clientsRes, facturesRes, projetsRes, depensesRes] = await Promise.all([
        fetch('/api/admin/crm'),
        fetch('/api/admin/facturation'),
        fetch('/api/admin/agenda'),
        fetch('/api/admin/depenses')
      ])

      const clients = await clientsRes.json()
      const factures = await facturesRes.json()
      const projets = await projetsRes.json()
      const depenses = await depensesRes.json()

      // Calcul des statistiques
      const now = new Date()
      const debutMois = new Date(now.getFullYear(), now.getMonth(), 1)
      const debutAnnee = new Date(now.getFullYear(), 0, 1)
      const moisDernier = new Date(now.getFullYear(), now.getMonth() - 1, 1)

      // Stats clients
      const clientsActifs = clients.clients?.filter(c => c.statut === 'actif').length || 0
      const clientsNouveaux = clients.clients?.filter(c => {
        const dateCreation = new Date(c.dateCreation)
        return dateCreation >= debutMois
      }).length || 0

      // Stats factures
      const facturesEnAttente = factures.documents?.filter(f => 
        f.type === 'facture' && f.statut !== 'paye'
      ) || []
      const montantEnAttente = facturesEnAttente.reduce((sum, f) => sum + (f.montantTTC || 0), 0)

      // Stats projets
      const projetsEnCours = projets.projets?.filter(p => p.statut === 'en_cours').length || 0
      const projetsEnRetard = projets.projets?.filter(p => {
        if (p.statut === 'termine') return false
        const dateFin = new Date(p.dateFin)
        return dateFin < now
      }).length || 0

      // CA du mois et de l'année
      const facturesPayees = factures.documents?.filter(f => 
        f.type === 'facture' && f.statut === 'paye'
      ) || []
      
      const caMois = facturesPayees
        .filter(f => new Date(f.datePaiement) >= debutMois)
        .reduce((sum, f) => sum + (f.montantTTC || 0), 0)
      
      const caAnnee = facturesPayees
        .filter(f => new Date(f.datePaiement) >= debutAnnee)
        .reduce((sum, f) => sum + (f.montantTTC || 0), 0)

      // Évolution par rapport au mois dernier
      const caMoisDernier = facturesPayees
        .filter(f => {
          const date = new Date(f.datePaiement)
          return date >= moisDernier && date < debutMois
        })
        .reduce((sum, f) => sum + (f.montantTTC || 0), 0)
      
      const evolution = caMoisDernier > 0 
        ? Math.round(((caMois - caMoisDernier) / caMoisDernier) * 100)
        : 0

      // Générer les notifications
      const notifs = []
      
      // Factures en retard
      facturesEnAttente.forEach(f => {
        const dateEcheance = new Date(f.dateEcheance)
        if (dateEcheance < now) {
          const client = clients.clients?.find(c => c.id === f.clientId)
          notifs.push({
            id: `facture-${f.id}`,
            type: 'danger',
            icon: '⚠️',
            titre: 'Facture en retard',
            message: `${f.numero} - ${client?.entreprise || 'Client inconnu'} - ${f.montantTTC}€`,
            lien: `/admin/facturation/${f.id}`,
            date: dateEcheance
          })
        }
      })

      // Projets en retard
      projets.projets?.forEach(p => {
        if (p.statut !== 'termine') {
          const dateFin = new Date(p.dateFin)
          if (dateFin < now) {
            const client = clients.clients?.find(c => c.id === p.clientId)
            notifs.push({
              id: `projet-${p.id}`,
              type: 'warning',
              icon: '🕒',
              titre: 'Projet en retard',
              message: `${p.titre} - ${client?.entreprise || 'Client inconnu'}`,
              lien: '/admin/agenda',
              date: dateFin
            })
          }
        }
      })

      // Trier les notifications par date
      notifs.sort((a, b) => a.date - b.date)

      // Activité récente (dernières actions)
      const activites = []
      
      // Dernières factures
      factures.documents?.slice(0, 3).forEach(f => {
        const client = clients.clients?.find(c => c.id === f.clientId)
        activites.push({
          id: `facture-${f.id}`,
          type: 'facture',
          icon: f.type === 'devis' ? '📋' : '📄',
          titre: `${f.type === 'devis' ? 'Devis' : 'Facture'} ${f.numero}`,
          description: client?.entreprise || 'Client inconnu',
          montant: f.montantTTC,
          date: new Date(f.dateCreation),
          lien: `/admin/facturation/${f.id}`
        })
      })

      // Derniers projets
      projets.projets?.slice(0, 2).forEach(p => {
        const client = clients.clients?.find(c => c.id === p.clientId)
        activites.push({
          id: `projet-${p.id}`,
          type: 'projet',
          icon: '📁',
          titre: p.titre,
          description: client?.entreprise || 'Client inconnu',
          statut: p.statut,
          date: new Date(p.dateCreation),
          lien: '/admin/agenda'
        })
      })

      // Trier par date décroissante
      activites.sort((a, b) => b.date - a.date)

      setStats({
        clients: { total: clients.clients?.length || 0, actifs: clientsActifs, nouveaux: clientsNouveaux },
        factures: { total: facturesEnAttente.length, enAttente: facturesEnAttente.length, montantEnAttente },
        projets: { total: projets.projets?.length || 0, enCours: projetsEnCours, enRetard: projetsEnRetard },
        ca: { mois: caMois, annee: caAnnee, evolution }
      })

      setNotifications(notifs.slice(0, 5)) // Limiter à 5 notifications
      setActiviteRecente(activites.slice(0, 5)) // Limiter à 5 activités

    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(montant)
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }

  const formatDateRelative = (date) => {
    const now = new Date()
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    
    if (diff === 0) return "Aujourd'hui"
    if (diff === 1) return "Hier"
    if (diff < 7) return `Il y a ${diff} jours`
    if (diff < 30) return `Il y a ${Math.floor(diff / 7)} semaines`
    return formatDate(date)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-sm text-gray-500 mt-1">
                Bienvenue ! Voici un aperçu de votre activité
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/admin/facturation/nouveau" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                + Nouvelle facture
              </Link>
              <Link href="/admin/agenda" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                + Nouveau projet
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications urgentes */}
        {notifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">⚡ Notifications urgentes</h2>
            <div className="space-y-3">
              {notifications.map(notif => (
                <Link key={notif.id} href={notif.lien} className="block">
                  <div className={`p-4 rounded-lg border-l-4 ${
                    notif.type === 'danger' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
                  } hover:shadow-md transition`}>
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">{notif.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{notif.titre}</h3>
                        <p className="text-sm text-gray-600">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">Échéance : {formatDate(notif.date)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* CA du mois */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">CA du mois</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatMontant(stats.ca.mois)}
                </p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stats.ca.evolution >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.ca.evolution >= 0 ? '↑' : '↓'} {Math.abs(stats.ca.evolution)}%
                  </span>
                  <span className="text-xs text-gray-500 ml-2">vs mois dernier</span>
                </div>
              </div>
              <span className="text-3xl">💰</span>
            </div>
          </div>

          {/* Factures en attente */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Factures en attente</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.factures.total}
                </p>
                <p className="text-sm text-orange-600 mt-2">
                  {formatMontant(stats.factures.montantEnAttente)}
                </p>
              </div>
              <span className="text-3xl">📄</span>
            </div>
          </div>

          {/* Projets en cours */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Projets en cours</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.projets.enCours}
                </p>
                {stats.projets.enRetard > 0 && (
                  <p className="text-sm text-red-600 mt-2">
                    {stats.projets.enRetard} en retard
                  </p>
                )}
              </div>
              <span className="text-3xl">📁</span>
            </div>
          </div>

          {/* Clients actifs */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Clients actifs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.clients.actifs}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  +{stats.clients.nouveaux} ce mois
                </p>
              </div>
              <span className="text-3xl">👥</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activité récente */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">📊 Activité récente</h2>
            </div>
            <div className="divide-y">
              {activiteRecente.map(activite => (
                <Link key={activite.id} href={activite.lien} className="block p-4 hover:bg-gray-50 transition">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">{activite.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{activite.titre}</h3>
                          <p className="text-sm text-gray-600">{activite.description}</p>
                        </div>
                        {activite.montant && (
                          <span className="text-sm font-medium text-gray-900">
                            {formatMontant(activite.montant)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateRelative(activite.date)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Accès rapide */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">⚡ Accès rapide</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link href="/admin/crm" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                  <span className="text-3xl block mb-2">👥</span>
                  <span className="text-sm font-medium text-gray-700">Fiches Clients</span>
                </Link>
                <Link href="/admin/facturation" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                  <span className="text-3xl block mb-2">📄</span>
                  <span className="text-sm font-medium text-gray-700">Facturation</span>
                </Link>
                <Link href="/admin/agenda" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                  <span className="text-3xl block mb-2">📅</span>
                  <span className="text-sm font-medium text-gray-700">Agenda</span>
                </Link>
                <Link href="/admin/comptabilite" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-center">
                  <span className="text-3xl block mb-2">📊</span>
                  <span className="text-sm font-medium text-gray-700">Comptabilité</span>
                </Link>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Actions fréquentes</h3>
                <div className="space-y-2">
                  <Link href="/admin/facturation/nouveau" className="block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition text-sm font-medium text-center">
                    + Créer une facture
                  </Link>
                  <Link href="/admin/depenses" className="block px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium text-center">
                    + Ajouter une dépense
                  </Link>
                  <Link href="/admin/sites" className="block px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-sm font-medium text-center">
                    + Gérer les sites
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Résumé financier */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">💼 Résumé financier de l'année</h2>
              <p className="text-3xl font-bold">{formatMontant(stats.ca.annee)}</p>
              <p className="text-indigo-100 mt-1">Chiffre d'affaires {new Date().getFullYear()}</p>
            </div>
            <Link href="/admin/comptabilite" className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur rounded-lg hover:bg-opacity-30 transition font-medium">
              Voir le détail →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}