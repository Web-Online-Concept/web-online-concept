"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import * as XLSX from 'xlsx'

export default function ExportData() {
  const [loading, setLoading] = useState(false)
  const [exportStats, setExportStats] = useState({
    clients: 0,
    sites: 0,
    factures: 0,
    projets: 0,
    emails: 0
  })
  
  // Charger les statistiques
  useEffect(() => {
    loadStats()
  }, [])
  
  const loadStats = async () => {
    try {
      // Charger les stats de chaque section avec gestion d'erreur
      const stats = {
        clients: 0,
        sites: 0,
        factures: 0,
        projets: 0,
        emails: 0
      }

      // Clients
      try {
        const clientsRes = await fetch('/api/admin/crm')
        if (clientsRes.ok) {
          const clients = await clientsRes.json()
          stats.clients = Array.isArray(clients) ? clients.length : 0
        }
      } catch (e) {
        console.log('API CRM non disponible')
      }

      // Sites
      try {
        const sitesRes = await fetch('/api/admin/sites')
        if (sitesRes.ok) {
          const sites = await sitesRes.json()
          stats.sites = Array.isArray(sites) ? sites.length : 0
        }
      } catch (e) {
        console.log('API Sites non disponible')
      }

      // Factures
      try {
        const facturesRes = await fetch('/api/admin/facturation')
        if (facturesRes.ok) {
          const data = await facturesRes.json()
          const factures = [...(data.factures || []), ...(data.devis || [])]
          stats.factures = factures.length
        }
      } catch (e) {
        console.log('API Facturation non disponible')
      }

      // Projets
      try {
        const projetsRes = await fetch('/api/admin/agenda')
        if (projetsRes.ok) {
          const data = await projetsRes.json()
          stats.projets = Array.isArray(data.projets) ? data.projets.length : 0
        }
      } catch (e) {
        console.log('API Agenda non disponible')
      }

      // Emails
      try {
        const emailsRes = await fetch('/api/admin/emails')
        if (emailsRes.ok) {
          const data = await emailsRes.json()
          stats.emails = Array.isArray(data.emails) ? data.emails.length : 0
        }
      } catch (e) {
        console.log('API Emails non disponible')
      }

      setExportStats(stats)
    } catch (error) {
      console.error('Erreur chargement stats:', error)
    }
  }
  
  // Export des clients
  const exportClients = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/crm')
      const clients = await response.json()
      
      // Préparer les données pour Excel
      const data = clients.map(client => ({
        'ID': client.id,
        'Entreprise': client.entreprise,
        'Contact': client.contact,
        'Email': client.email,
        'Téléphone': client.telephone,
        'Adresse': client.adresse,
        'Site Web': client.siteWeb,
        'Type': client.type,
        'Statut': client.statut,
        'Date de création': new Date(client.dateCreation).toLocaleDateString('fr-FR'),
        'Dernière activité': client.derniereActivite ? new Date(client.derniereActivite).toLocaleDateString('fr-FR') : '',
        'CA Total': client.caTotal || 0,
        'Notes': client.notes || ''
      }))
      
      // Créer le workbook
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Clients')
      
      // Style pour l'en-tête
      const range = XLSX.utils.decode_range(ws['!ref'])
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "1"
        if (!ws[address]) continue
        ws[address].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "0073a8" } },
          alignment: { horizontal: "center" }
        }
      }
      
      // Ajuster la largeur des colonnes
      const colWidths = [
        { wch: 10 }, // ID
        { wch: 30 }, // Entreprise
        { wch: 25 }, // Contact
        { wch: 30 }, // Email
        { wch: 15 }, // Téléphone
        { wch: 40 }, // Adresse
        { wch: 30 }, // Site Web
        { wch: 15 }, // Type
        { wch: 10 }, // Statut
        { wch: 15 }, // Date création
        { wch: 15 }, // Dernière activité
        { wch: 12 }, // CA Total
        { wch: 40 }  // Notes
      ]
      ws['!cols'] = colWidths
      
      // Télécharger le fichier
      XLSX.writeFile(wb, `clients_export_${new Date().toISOString().split('T')[0]}.xlsx`)
      
    } catch (error) {
      console.error('Erreur export clients:', error)
      alert('Erreur lors de l\'export des clients')
    }
    setLoading(false)
  }
  
  // Export des sites
  const exportSites = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/sites')
      const sites = await response.json()
      
      const data = sites.map(site => ({
        'ID': site.id,
        'Nom du site': site.nom,
        'URL': site.url,
        'Client': site.clientNom,
        'Type': site.type,
        'Statut': site.statut,
        'Hébergeur': site.hebergeur,
        'Date expiration': site.dateExpiration ? new Date(site.dateExpiration).toLocaleDateString('fr-FR') : '',
        'SSL': site.ssl ? 'Oui' : 'Non',
        'Maintenance': site.maintenance ? 'Oui' : 'Non',
        'Dernière MAJ': site.derniereMAJ ? new Date(site.derniereMAJ).toLocaleDateString('fr-FR') : '',
        'Notes': site.notes || ''
      }))
      
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sites')
      
      ws['!cols'] = [
        { wch: 10 }, { wch: 30 }, { wch: 40 }, { wch: 30 },
        { wch: 15 }, { wch: 10 }, { wch: 20 }, { wch: 15 },
        { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 40 }
      ]
      
      XLSX.writeFile(wb, `sites_export_${new Date().toISOString().split('T')[0]}.xlsx`)
      
    } catch (error) {
      console.error('Erreur export sites:', error)
      alert('Erreur lors de l\'export des sites')
    }
    setLoading(false)
  }
  
  // Export des factures
  const exportFactures = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/facturation')
      if (!response.ok) {
        throw new Error('API non disponible')
      }
      
      const data = await response.json()
      const allDocuments = [...(data.factures || []), ...(data.devis || [])]
      
      const exportData = allDocuments.map(doc => ({
        'Type': doc.status === 'devis' ? 'Devis' : 'Facture',
        'Numéro': doc.number,
        'Date': new Date(doc.date).toLocaleDateString('fr-FR'),
        'Client': doc.client?.name || doc.clientName || 'Non défini',
        'Objet': doc.subject || '',
        'Montant HT': doc.total || 0,
        'TVA (20%)': (doc.total || 0) * 0.20,
        'Montant TTC': (doc.total || 0) * 1.20,
        'Statut': doc.status === 'devis' ? 'Devis' : (doc.paymentStatus === 'paid' ? 'Payée' : 'En attente'),
        'Date paiement': doc.paymentDate ? new Date(doc.paymentDate).toLocaleDateString('fr-FR') : '',
        'Notes': doc.notes || ''
      }))
      
      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Factures et Devis')
      
      // Ajouter une feuille récapitulative
      const stats = {
        'Total documents': allDocuments.length,
        'Devis': allDocuments.filter(d => d.status === 'devis').length,
        'Factures': allDocuments.filter(d => d.status === 'facture').length,
        'Factures payées': allDocuments.filter(d => d.status === 'facture' && d.paymentStatus === 'paid').length,
        'Montant total HT': allDocuments.reduce((sum, d) => sum + (d.total || 0), 0),
        'Montant total TTC': allDocuments.reduce((sum, d) => sum + ((d.total || 0) * 1.20), 0)
      }
      
      const wsStats = XLSX.utils.json_to_sheet([stats])
      XLSX.utils.book_append_sheet(wb, wsStats, 'Statistiques')
      
      ws['!cols'] = [
        { wch: 10 }, { wch: 15 }, { wch: 12 }, { wch: 30 }, { wch: 40 },
        { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
        { wch: 15 }, { wch: 40 }
      ]
      
      XLSX.writeFile(wb, `factures_export_${new Date().toISOString().split('T')[0]}.xlsx`)
      
    } catch (error) {
      console.error('Erreur export factures:', error)
      alert('Erreur lors de l\'export des factures. L\'API n\'est peut-être pas disponible.')
    }
    setLoading(false)
  }
  
  // Export des projets
  const exportProjets = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/agenda')
      const data = await response.json()
      const projets = data.projets || []
      
      const exportData = projets.map(projet => ({
        'ID': projet.id,
        'Titre': projet.titre,
        'Client': projet.clientNom,
        'Statut': projet.status,
        'Priorité': projet.priorite,
        'Date début': new Date(projet.dateDebut).toLocaleDateString('fr-FR'),
        'Date fin': projet.dateFin ? new Date(projet.dateFin).toLocaleDateString('fr-FR') : '',
        'Budget': projet.budget || 0,
        'Progression': projet.progression + '%',
        'Description': projet.description || '',
        'Notes': projet.notes || ''
      }))
      
      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Projets')
      
      ws['!cols'] = [
        { wch: 10 }, { wch: 40 }, { wch: 30 }, { wch: 12 },
        { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 10 },
        { wch: 12 }, { wch: 50 }, { wch: 50 }
      ]
      
      XLSX.writeFile(wb, `projets_export_${new Date().toISOString().split('T')[0]}.xlsx`)
      
    } catch (error) {
      console.error('Erreur export projets:', error)
      alert('Erreur lors de l\'export des projets')
    }
    setLoading(false)
  }
  
  // Export des emails
  const exportEmails = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/emails')
      const data = await response.json()
      const emails = data.emails || []
      
      const exportData = emails.map(email => ({
        'ID': email.id,
        'Objet': email.subject,
        'Destinataire': email.to,
        'De': email.from,
        'Date envoi': new Date(email.date).toLocaleString('fr-FR'),
        'Statut': email.status,
        'Type': email.type || 'Manuel',
        'Campagne': email.campaignId || '',
        'Ouvert': email.opened ? 'Oui' : 'Non',
        'Cliqué': email.clicked ? 'Oui' : 'Non'
      }))
      
      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Emails')
      
      ws['!cols'] = [
        { wch: 10 }, { wch: 50 }, { wch: 30 }, { wch: 30 },
        { wch: 20 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
        { wch: 10 }, { wch: 10 }
      ]
      
      XLSX.writeFile(wb, `emails_export_${new Date().toISOString().split('T')[0]}.xlsx`)
      
    } catch (error) {
      console.error('Erreur export emails:', error)
      alert('Erreur lors de l\'export des emails')
    }
    setLoading(false)
  }
  
  // Export complet (toutes les données)
  const exportAll = async () => {
    setLoading(true)
    try {
      const wb = XLSX.utils.book_new()
      let hasData = false
      
      // Charger et exporter les clients
      try {
        const clientsRes = await fetch('/api/admin/crm')
        if (clientsRes.ok) {
          const clients = await clientsRes.json()
          if (Array.isArray(clients) && clients.length > 0) {
            const clientsData = clients.map(client => ({
              'ID': client.id,
              'Entreprise': client.entreprise,
              'Contact': client.contact,
              'Email': client.email,
              'Téléphone': client.telephone,
              'Type': client.type,
              'Statut': client.statut,
              'CA Total': client.caTotal || 0
            }))
            const wsClients = XLSX.utils.json_to_sheet(clientsData)
            XLSX.utils.book_append_sheet(wb, wsClients, 'Clients')
            hasData = true
          }
        }
      } catch (e) {
        console.log('Erreur export clients:', e)
      }
      
      // Charger et exporter les sites
      try {
        const sitesRes = await fetch('/api/admin/sites')
        if (sitesRes.ok) {
          const sites = await sitesRes.json()
          if (Array.isArray(sites) && sites.length > 0) {
            const sitesData = sites.map(site => ({
              'Nom': site.nom,
              'URL': site.url,
              'Client': site.clientNom,
              'Statut': site.statut,
              'Maintenance': site.maintenance ? 'Oui' : 'Non'
            }))
            const wsSites = XLSX.utils.json_to_sheet(sitesData)
            XLSX.utils.book_append_sheet(wb, wsSites, 'Sites')
            hasData = true
          }
        }
      } catch (e) {
        console.log('Erreur export sites:', e)
      }
      
      // Charger et exporter les factures
      try {
        const facturesRes = await fetch('/api/admin/facturation')
        if (facturesRes.ok) {
          const data = await facturesRes.json()
          const allDocs = [...(data.factures || []), ...(data.devis || [])]
          if (allDocs.length > 0) {
            const facturesExport = allDocs.map(doc => ({
              'Type': doc.status === 'devis' ? 'Devis' : 'Facture',
              'Numéro': doc.number,
              'Date': new Date(doc.date).toLocaleDateString('fr-FR'),
              'Client': doc.client?.name || doc.clientName || 'Non défini',
              'Montant TTC': (doc.total || 0) * 1.20,
              'Statut': doc.status === 'devis' ? 'Devis' : (doc.paymentStatus === 'paid' ? 'Payée' : 'En attente')
            }))
            const wsFactures = XLSX.utils.json_to_sheet(facturesExport)
            XLSX.utils.book_append_sheet(wb, wsFactures, 'Factures')
            hasData = true
          }
        }
      } catch (e) {
        console.log('Erreur export factures:', e)
      }
      
      // Charger et exporter les projets
      try {
        const projetsRes = await fetch('/api/admin/agenda')
        if (projetsRes.ok) {
          const data = await projetsRes.json()
          const projets = data.projets || []
          if (projets.length > 0) {
            const projetsExport = projets.map(projet => ({
              'Titre': projet.titre,
              'Client': projet.clientNom,
              'Statut': projet.status,
              'Progression': projet.progression + '%',
              'Budget': projet.budget || 0
            }))
            const wsProjets = XLSX.utils.json_to_sheet(projetsExport)
            XLSX.utils.book_append_sheet(wb, wsProjets, 'Projets')
            hasData = true
          }
        }
      } catch (e) {
        console.log('Erreur export projets:', e)
      }
      
      // Si aucune donnée n'a été trouvée
      if (!hasData) {
        alert('Aucune donnée disponible pour l\'export. Vérifiez que vous avez des données dans au moins une section.')
        setLoading(false)
        return
      }
      
      // Télécharger le fichier
      XLSX.writeFile(wb, `export_complet_${new Date().toISOString().split('T')[0]}.xlsx`)
      
    } catch (error) {
      console.error('Erreur export complet:', error)
      alert('Erreur lors de l\'export complet. Certaines données peuvent être manquantes.')
    }
    setLoading(false)
  }
  
  const exportOptions = [
    {
      title: 'Clients',
      description: 'Export de tous vos clients avec leurs informations complètes',
      icon: '👥',
      count: exportStats.clients,
      action: exportClients,
      color: 'blue'
    },
    {
      title: 'Sites Web',
      description: 'Liste de tous les sites en gestion avec leur statut',
      icon: '🌐',
      count: exportStats.sites,
      action: exportSites,
      color: 'green'
    },
    {
      title: 'Factures',
      description: 'Historique complet des factures avec statistiques',
      icon: '💰',
      count: exportStats.factures,
      action: exportFactures,
      color: 'yellow'
    },
    {
      title: 'Projets',
      description: 'Tous vos projets avec leur état d\'avancement',
      icon: '📅',
      count: exportStats.projets,
      action: exportProjets,
      color: 'purple'
    },
    {
      title: 'Emails',
      description: 'Historique des emails envoyés et leurs statistiques',
      icon: '📧',
      count: exportStats.emails,
      action: exportEmails,
      color: 'pink'
    }
  ]
  
  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      green: 'bg-green-100 text-green-800 hover:bg-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      pink: 'bg-pink-100 text-pink-800 hover:bg-pink-200'
    }
    return colors[color] || colors.blue
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
                  📊 Export de données
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Titre */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Export Excel
            </h1>
            <p className="text-gray-600">
              Exportez toutes vos données au format Excel pour analyse ou sauvegarde
            </p>
          </div>

          {/* Export complet */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">📦</div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Export complet</h2>
                  <p className="text-gray-600">
                    Téléchargez toutes vos données en un seul fichier Excel avec plusieurs feuilles
                  </p>
                </div>
              </div>
              <button
                onClick={exportAll}
                disabled={loading}
                className="px-6 py-3 bg-[#0073a8] text-white rounded-lg hover:bg-[#006a87] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Export en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Tout exporter
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Options d'export individuelles */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exportOptions.map((option) => (
              <div key={option.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{option.icon}</div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getColorClasses(option.color)}`}>
                    {option.count} entrées
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {option.description}
                </p>
                
                <button
                  onClick={option.action}
                  disabled={loading}
                  className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exporter
                </button>
              </div>
            ))}
          </div>

          {/* Informations */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Informations sur les exports</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Les fichiers sont au format Excel (.xlsx) compatible avec Microsoft Excel, Google Sheets, LibreOffice</li>
                  <li>Les dates sont formatées en français (JJ/MM/AAAA)</li>
                  <li>Les montants sont en euros (€)</li>
                  <li>L'export complet contient plusieurs feuilles avec un récapitulatif des statistiques</li>
                  <li>Les exports sont datés automatiquement pour faciliter l'archivage</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}