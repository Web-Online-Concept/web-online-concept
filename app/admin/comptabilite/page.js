"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function Comptabilite() {
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState([])
  const [depenses, setDepenses] = useState([])
  const [clients, setClients] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [viewMode, setViewMode] = useState('dashboard') // dashboard, mensuel, annuel
  
  // États pour les statistiques
  const [stats, setStats] = useState({
    caTotal: 0,
    caEncaisse: 0,
    caEnAttente: 0,
    nombreFactures: 0,
    nombreDevis: 0,
    tauxConversion: 0,
    evolutionCA: [],
    topClients: [],
    repartitionCA: [],
    totalDepenses: 0,
    resultatNet: 0
  })

  // Charger les données
  useEffect(() => {
    fetchData()
  }, [selectedYear])

  const fetchData = async () => {
    try {
      // Charger les documents
      const docsResponse = await fetch('/api/admin/facturation')
      const docsData = await docsResponse.json()
      
      // Adapter le format des données
      const allDocs = []
      if (docsData.factures) allDocs.push(...docsData.factures)
      if (docsData.devis) allDocs.push(...docsData.devis)
      
      setDocuments(allDocs)
      
      // Charger les dépenses
      const depensesResponse = await fetch('/api/admin/depenses')
      const depensesData = await depensesResponse.json()
      setDepenses(depensesData.depenses || [])
      
      // Charger les clients
      const clientsResponse = await fetch('/api/admin/clients')
      const clientsData = await clientsResponse.json()
      setClients(Array.isArray(clientsData) ? clientsData : [])
      
      // Calculer les statistiques
      calculateStats(allDocs, depensesData.depenses || [], clientsData)
      
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      setLoading(false)
    }
  }

  // Calculer les statistiques
  const calculateStats = (docs, deps, clientsList) => {
    const yearDocs = docs.filter(doc => 
      new Date(doc.date).getFullYear() === selectedYear
    )
    const yearDeps = deps.filter(dep => 
      new Date(dep.date).getFullYear() === selectedYear
    )
    
    // CA Total et encaissé
    const factures = yearDocs.filter(doc => doc.type === 'facture')
    const caTotal = factures.reduce((sum, f) => sum + (f.montantTTC || 0), 0)
    const caEncaisse = factures
      .filter(f => f.status === 'payee' || f.status === 'paye')
      .reduce((sum, f) => sum + (f.montantTTC || 0), 0)
    const caEnAttente = caTotal - caEncaisse
    
    // Total des dépenses
    const totalDepenses = yearDeps.reduce((sum, d) => sum + parseFloat(d.montant || 0), 0)
    
    // Résultat net
    const resultatNet = caEncaisse - totalDepenses
    
    // Nombre de documents
    const nombreFactures = factures.length
    const nombreDevis = yearDocs.filter(doc => doc.type === 'devis').length
    
    // Taux de conversion devis -> factures
    const devisAcceptes = yearDocs.filter(doc => 
      doc.type === 'devis' && doc.status === 'accepte'
    ).length
    const tauxConversion = nombreDevis > 0 
      ? Math.round((devisAcceptes / nombreDevis) * 100) 
      : 0
    
    // Évolution mensuelle du CA et dépenses
    const evolutionCA = Array.from({ length: 12 }, (_, month) => {
      const monthFactures = factures.filter(f => 
        new Date(f.date).getMonth() === month
      )
      const monthDepenses = yearDeps.filter(d => 
        new Date(d.date).getMonth() === month
      )
      return {
        mois: new Date(2024, month).toLocaleDateString('fr-FR', { month: 'short' }),
        facture: monthFactures.reduce((sum, f) => sum + (f.montantTTC || 0), 0),
        encaisse: monthFactures
          .filter(f => f.status === 'payee' || f.status === 'paye')
          .reduce((sum, f) => sum + (f.montantTTC || 0), 0),
        depenses: monthDepenses.reduce((sum, d) => sum + parseFloat(d.montant || 0), 0)
      }
    })
    
    // Top clients par CA et rentabilité
    const clientCA = {}
    factures.forEach(f => {
      if (!clientCA[f.clientId]) {
        clientCA[f.clientId] = {
          id: f.clientId,
          nom: f.clientNom,
          montant: 0,
          nombreFactures: 0,
          depenses: 0,
          rentabilite: 0
        }
      }
      clientCA[f.clientId].montant += f.montantTTC || 0
      clientCA[f.clientId].nombreFactures += 1
    })
    
    // Ajouter les dépenses clients
    yearDeps.forEach(d => {
      if (d.type === 'client' && d.clientId && clientCA[d.clientId]) {
        clientCA[d.clientId].depenses += parseFloat(d.montant || 0)
      }
    })
    
    // Calculer la rentabilité
    Object.values(clientCA).forEach(client => {
      client.rentabilite = client.montant - client.depenses
    })
    
    const topClients = Object.values(clientCA)
      .sort((a, b) => b.montant - a.montant)
      .slice(0, 5)
    
    // Répartition du CA par type de service (basé sur les lignes)
    const serviceTypes = {}
    factures.forEach(f => {
      f.lignes?.forEach(ligne => {
        const type = detectServiceType(ligne.description)
        if (!serviceTypes[type]) {
          serviceTypes[type] = 0
        }
        serviceTypes[type] += ligne.total || (ligne.quantite * ligne.prixUnitaire) || 0
      })
    })
    
    const repartitionCA = Object.entries(serviceTypes).map(([type, montant]) => ({
      type,
      montant,
      pourcentage: caTotal > 0 ? Math.round((montant / caTotal) * 100) : 0
    }))
    
    setStats({
      caTotal,
      caEncaisse,
      caEnAttente,
      totalDepenses,
      resultatNet,
      nombreFactures,
      nombreDevis,
      tauxConversion,
      evolutionCA,
      topClients,
      repartitionCA
    })
  }

  // Détecter le type de service
  const detectServiceType = (description) => {
    const desc = description.toLowerCase()
    if (desc.includes('site') || desc.includes('création') || desc.includes('développement')) {
      return 'Création de sites'
    } else if (desc.includes('maintenance') || desc.includes('mensuel')) {
      return 'Maintenance'
    } else if (desc.includes('seo') || desc.includes('référencement')) {
      return 'SEO'
    } else if (desc.includes('formation')) {
      return 'Formation'
    } else {
      return 'Autres'
    }
  }

  // Formater les montants
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0)
  }

  // Obtenir les années disponibles
  const getAvailableYears = () => {
    const years = new Set()
    documents.forEach(doc => {
      years.add(new Date(doc.date).getFullYear())
    })
    return Array.from(years).sort((a, b) => b - a)
  }

  // Obtenir les stats du mois
  const getMonthStats = (month) => {
    const monthDocs = documents.filter(doc => {
      const docDate = new Date(doc.date)
      return docDate.getFullYear() === selectedYear && docDate.getMonth() === month
    })
    
    const factures = monthDocs.filter(doc => doc.type === 'facture')
    const caMonth = factures.reduce((sum, f) => sum + (f.montantTTC || 0), 0)
    const paidMonth = factures
      .filter(f => f.status === 'payee' || f.status === 'paye')
      .reduce((sum, f) => sum + (f.montantTTC || 0), 0)
    
    return {
      ca: caMonth,
      encaisse: paidMonth,
      nombreFactures: factures.length,
      nombreDevis: monthDocs.filter(doc => doc.type === 'devis').length
    }
  }

  // Gérer l'export comptable
  const handleExportComptable = async () => {
    try {
      const response = await fetch(`/api/admin/comptabilite/export?year=${selectedYear}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'export')
      }
      
      // Récupérer le blob
      const blob = await response.blob()
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `export-comptable-${selectedYear}.csv`
      document.body.appendChild(a)
      a.click()
      
      // Nettoyer
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      alert('Export téléchargé avec succès !')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'export')
    }
  }

  // Données pour le graphique en ligne
  const getLineChartData = () => {
    return {
      labels: stats.evolutionCA.map(m => m.mois),
      datasets: [
        {
          label: 'CA Facturé',
          data: stats.evolutionCA.map(m => m.facture),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4
        },
        {
          label: 'CA Encaissé',
          data: stats.evolutionCA.map(m => m.encaisse),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4
        },
        {
          label: 'Dépenses',
          data: stats.evolutionCA.map(m => m.depenses),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4
        }
      ]
    }
  }

  // Données pour le graphique en barres
  const getBarChartData = () => {
    return {
      labels: stats.topClients.map(c => c.nom),
      datasets: [
        {
          label: 'Chiffre d\'affaires',
          data: stats.topClients.map(c => c.montant),
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1
        },
        {
          label: 'Dépenses',
          data: stats.topClients.map(c => c.depenses),
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1
        }
      ]
    }
  }

  // Données pour le camembert
  const getDoughnutChartData = () => {
    return {
      labels: stats.repartitionCA.map(s => s.type),
      datasets: [{
        data: stats.repartitionCA.map(s => s.montant),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
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
                  📊 Comptabilité
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="bg-white/20 border border-white/30 text-white px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {getAvailableYears().map(year => (
                    <option key={year} value={year} className="text-gray-900">
                      {year}
                    </option>
                  ))}
                </select>
                <div className="bg-white/10 rounded-lg p-1 flex">
                  <button
                    onClick={() => setViewMode('dashboard')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      viewMode === 'dashboard' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setViewMode('mensuel')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      viewMode === 'mensuel' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Mensuel
                  </button>
                  <button
                    onClick={() => setViewMode('annuel')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      viewMode === 'annuel' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Annuel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Vue Dashboard */}
          {viewMode === 'dashboard' && (
            <>
              {/* Titre */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Tableau de Bord Comptable
                </h1>
                <p className="text-gray-600">
                  Vue d'ensemble de votre activité en {selectedYear}
                </p>
              </div>

              {/* Cartes de statistiques principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">💰</span>
                    <span className="text-sm text-gray-500">CA Total</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatMoney(stats.caTotal)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {stats.nombreFactures} factures émises
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">✅</span>
                    <span className="text-sm text-gray-500">Encaissé</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatMoney(stats.caEncaisse)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {Math.round((stats.caEncaisse / stats.caTotal) * 100) || 0}% du CA total
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">💸</span>
                    <span className="text-sm text-gray-500">Dépenses</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {formatMoney(stats.totalDepenses)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Charges totales
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">💎</span>
                    <span className="text-sm text-gray-500">Résultat net</span>
                  </div>
                  <p className={`text-2xl font-bold ${stats.resultatNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatMoney(stats.resultatNet)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Bénéfice/Perte
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">⏳</span>
                    <span className="text-sm text-gray-500">En attente</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatMoney(stats.caEnAttente)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    À relancer
                  </p>
                </div>
              </div>

              {/* Graphiques */}
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Évolution mensuelle */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Évolution mensuelle
                  </h3>
                  <Line
                    data={getLineChartData()}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return context.dataset.label + ': ' + formatMoney(context.parsed.y)
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return formatMoney(value)
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>

                {/* Top clients avec rentabilité */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Top 5 Clients - Rentabilité
                  </h3>
                  <Bar
                    data={getBarChartData()}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return context.dataset.label + ': ' + formatMoney(context.parsed.y)
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          stacked: false,
                          ticks: {
                            callback: function(value) {
                              return formatMoney(value)
                            }
                          }
                        },
                        x: {
                          stacked: false
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Répartition par type */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Répartition du CA par type de service
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex items-center justify-center">
                    <div style={{ maxWidth: '300px' }}>
                      <Doughnut
                        data={getDoughnutChartData()}
                        options={{
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {
                            legend: {
                              position: 'right',
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  const label = context.label || ''
                                  const value = formatMoney(context.parsed)
                                  const percentage = context.dataset.data.reduce((a, b) => a + b, 0)
                                  const percent = percentage > 0 ? Math.round((context.parsed / percentage) * 100) : 0
                                  return label + ': ' + value + ' (' + percent + '%)'
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {stats.repartitionCA.map((service) => (
                      <div key={service.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {service.type === 'Création de sites' ? '🌐' :
                             service.type === 'Maintenance' ? '🔧' :
                             service.type === 'SEO' ? '📈' :
                             service.type === 'Formation' ? '🎓' : '📦'}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">{service.type}</p>
                            <p className="text-sm text-gray-600">{formatMoney(service.montant)}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-900">{service.pourcentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Vue Mensuelle */}
          {viewMode === 'mensuel' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Vue Mensuelle - {selectedYear}
                </h1>
                <p className="text-gray-600">
                  Détail mois par mois de votre activité
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 12 }, (_, month) => {
                  const monthStats = getMonthStats(month)
                  const monthName = new Date(selectedYear, month).toLocaleDateString('fr-FR', { 
                    month: 'long' 
                  })
                  
                  return (
                    <div 
                      key={month}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedMonth(month)}
                    >
                      <h3 className="font-semibold text-gray-900 mb-4 capitalize">
                        {monthName}
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">CA Total</span>
                          <span className="font-semibold">{formatMoney(monthStats.ca)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Encaissé</span>
                          <span className="font-semibold text-green-600">
                            {formatMoney(monthStats.encaisse)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">En attente</span>
                          <span className="font-semibold text-orange-600">
                            {formatMoney(monthStats.ca - monthStats.encaisse)}
                          </span>
                        </div>
                        
                        <div className="pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-500">
                          <span>{monthStats.nombreFactures} factures</span>
                          <span>{monthStats.nombreDevis} devis</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* Vue Annuelle */}
          {viewMode === 'annuel' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Comparatif Annuel
                </h1>
                <p className="text-gray-600">
                  Évolution de votre activité sur plusieurs années
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Année
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                          CA Total
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                          Encaissé
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                          Nb Factures
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                          Nb Devis
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                          Évolution
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getAvailableYears().map((year, index) => {
                        const yearDocs = documents.filter(doc => 
                          new Date(doc.date).getFullYear() === year
                        )
                        const factures = yearDocs.filter(doc => doc.type === 'facture')
                        const ca = factures.reduce((sum, f) => sum + (f.montantTTC || 0), 0)
                        const encaisse = factures
                          .filter(f => f.status === 'payee' || f.status === 'paye')
                          .reduce((sum, f) => sum + (f.montantTTC || 0), 0)
                        
                        // Calcul évolution
                        let evolution = null
                        if (index < getAvailableYears().length - 1) {
                          const prevYear = getAvailableYears()[index + 1]
                          const prevYearDocs = documents.filter(doc => 
                            new Date(doc.date).getFullYear() === prevYear && 
                            doc.type === 'facture'
                          )
                          const prevCA = prevYearDocs.reduce((sum, f) => sum + (f.montantTTC || 0), 0)
                          if (prevCA > 0) {
                            evolution = Math.round(((ca - prevCA) / prevCA) * 100)
                          }
                        }
                        
                        return (
                          <tr key={year} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{year}</td>
                            <td className="px-4 py-3 text-right font-semibold">
                              {formatMoney(ca)}
                            </td>
                            <td className="px-4 py-3 text-right text-green-600">
                              {formatMoney(encaisse)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {factures.length}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {yearDocs.filter(doc => doc.type === 'devis').length}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {evolution !== null && (
                                <span className={`font-semibold ${
                                  evolution > 0 ? 'text-green-600' : 
                                  evolution < 0 ? 'text-red-600' : 
                                  'text-gray-600'
                                }`}>
                                  {evolution > 0 && '+'}
                                  {evolution}%
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Actions rapides */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Link
              href="/admin/facturation"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0073a8]">
                    Gérer la facturation
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Créer et gérer vos documents
                  </p>
                </div>
                <span className="text-3xl">📄</span>
              </div>
            </Link>
            
            <Link
              href="/admin/crm"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0073a8]">
                    Gérer les clients
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Accéder au CRM
                  </p>
                </div>
                <span className="text-3xl">👥</span>
              </div>
            </Link>
            
            <button
              onClick={handleExportComptable}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0073a8]">
                    Export comptable
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Télécharger les données
                  </p>
                </div>
                <span className="text-3xl">📊</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}