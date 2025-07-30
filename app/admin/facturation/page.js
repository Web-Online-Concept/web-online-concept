"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function Facturation() {
  const searchParams = useSearchParams()
  const clientId = searchParams.get('client')
  
  const [documents, setDocuments] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('tous')
  const [filterStatus, setFilterStatus] = useState('tous')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState(clientId || '')
  
  // Charger les données
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Charger les documents
      const docsResponse = await fetch('/api/admin/facturation')
      const docsData = await docsResponse.json()
      setDocuments(docsData.documents || [])
      
      // Charger les clients pour le filtre
      const clientsResponse = await fetch('/api/admin/crm')
      const clientsData = await clientsResponse.json()
      setClients(clientsData.clients || [])
      
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      // Données de démonstration
      setDocuments([
        {
          id: 'FAC-2025-001',
          type: 'facture',
          numero: 'FAC-2025-001',
          clientId: 'CLI-001',
          clientNom: 'Restaurant Le Gourmet',
          date: '2025-01-15',
          dateEcheance: '2025-02-15',
          montantHT: 1200,
          montantTTC: 1440,
          statut: 'envoyee',
          lignes: [
            { description: 'Maintenance mensuelle site web', quantite: 1, prixUnitaire: 200, total: 200 },
            { description: 'Modifications menu restaurant', quantite: 5, prixUnitaire: 200, total: 1000 }
          ]
        },
        {
          id: 'DEV-2025-001',
          type: 'devis',
          numero: 'DEV-2025-001',
          clientId: 'CLI-003',
          clientNom: 'Cabinet Médical Santé+',
          date: '2025-01-20',
          dateValidite: '2025-02-20',
          montantHT: 4500,
          montantTTC: 5400,
          statut: 'envoye',
          lignes: [
            { description: 'Création site web médical', quantite: 1, prixUnitaire: 3500, total: 3500 },
            { description: 'Module prise de RDV en ligne', quantite: 1, prixUnitaire: 1000, total: 1000 }
          ]
        }
      ])
      setClients([
        { id: 'CLI-001', entreprise: 'Restaurant Le Gourmet', contact: { email: 'contact@legourmet.fr' } },
        { id: 'CLI-002', entreprise: 'Boutique Mode & Style', contact: { email: 'info@modestyle.fr' } },
        { id: 'CLI-003', entreprise: 'Cabinet Médical Santé+', contact: { email: 'cabinet@santeplus.fr' } }
      ])
      setLoading(false)
    }
  }

  // Supprimer un document
  const handleDeleteDocument = async (docId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return
    
    try {
      const response = await fetch('/api/admin/facturation', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: docId })
      })
      
      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Dupliquer un document
  const handleDuplicateDocument = async (doc) => {
    try {
      const response = await fetch('/api/admin/facturation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'duplicate',
          documentId: doc.id
        })
      })
      
      if (response.ok) {
        await fetchData()
        alert('Document dupliqué avec succès !')
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Convertir devis en facture
  const handleConvertToInvoice = async (doc) => {
    if (!confirm('Convertir ce devis en facture ?')) return
    
    try {
      const response = await fetch('/api/admin/facturation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'convert',
          documentId: doc.id
        })
      })
      
      if (response.ok) {
        await fetchData()
        alert('Devis converti en facture !')
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Télécharger le PDF
  const handleDownloadPDF = async (docId) => {
    try {
      const response = await fetch('/api/admin/facturation/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docId })
      })
      
      if (response.ok) {
        const html = await response.text()
        
        // Ouvrir dans un nouvel onglet pour impression
        const newWindow = window.open('', '_blank')
        newWindow.document.write(html)
        newWindow.document.close()
        
        // Déclencher l'impression après chargement
        newWindow.onload = () => {
          newWindow.print()
        }
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la génération du PDF')
    }
  }

  // NOUVELLE FONCTION : Envoyer par email
  const handleSendEmail = async (doc) => {
    const client = clients.find(c => c.id === doc.clientId)
    if (!client || !client.contact?.email) {
      alert('Aucun email trouvé pour ce client')
      return
    }

    if (confirm(`Envoyer le ${doc.type} ${doc.numero} à ${client.contact.email} ?`)) {
      try {
        // Récupérer les paramètres pour les templates
        const paramsRes = await fetch('/api/admin/parametres')
        const params = await paramsRes.json()
        
        // Préparer le template
        let template = doc.type === 'devis' ? params.templates?.devis : params.templates?.facture
        if (!template) {
          template = {
            objet: `${doc.type === 'devis' ? 'Devis' : 'Facture'} ${doc.numero}`,
            message: `Bonjour,\n\nVeuillez trouver ci-joint votre ${doc.type} ${doc.numero}.\n\nCordialement`
          }
        }

        // Remplacer les variables
        const objet = template.objet
          .replace('{numero}', doc.numero)
          .replace('{entreprise}', client.entreprise)
        
        const message = template.message
          .replace('{prenom}', client.contact.prenom || '')
          .replace('{numero}', doc.numero)
          .replace('{montant}', new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(doc.montantTTC))
          .replace('{entreprise}', params.entreprise?.nom || 'Notre entreprise')
          .replace('{date_echeance}', doc.dateEcheance ? new Date(doc.dateEcheance).toLocaleDateString('fr-FR') : '')

        // Envoyer l'email
        const response = await fetch('/api/admin/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destinataire: client.contact.email,
            objet: objet,
            message: message,
            pieceJointe: {
              type: 'document',
              id: doc.id,
              nom: `${doc.type}-${doc.numero}.pdf`
            },
            type: 'automatique',
            documentId: doc.id,
            clientId: client.id
          })
        })

        if (response.ok) {
          alert('Email envoyé avec succès !')
        } else {
          alert('Erreur lors de l\'envoi')
        }
      } catch (error) {
        console.error('Erreur:', error)
        alert('Erreur lors de l\'envoi')
      }
    }
  }

  // Filtrer les documents
  const filteredDocuments = documents.filter(doc => {
    const matchesType = filterType === 'tous' || doc.type === filterType
    const matchesStatus = filterStatus === 'tous' || doc.statut === filterStatus
    const matchesClient = !selectedClient || doc.clientId === selectedClient
    const matchesSearch = 
      doc.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.clientNom.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesType && matchesStatus && matchesClient && matchesSearch
  })

  // Calculer les statistiques
  const stats = {
    total: documents.length,
    devis: documents.filter(d => d.type === 'devis').length,
    factures: documents.filter(d => d.type === 'facture').length,
    enAttente: documents.filter(d => d.statut === 'brouillon').length,
    montantTotal: documents
      .filter(d => d.type === 'facture' && d.statut === 'paye')
      .reduce((sum, d) => sum + d.montantTTC, 0)
  }

  // Obtenir le statut avec style
  const getStatusBadge = (statut, type) => {
    const styles = {
      brouillon: 'bg-gray-100 text-gray-800',
      envoye: type === 'devis' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800',
      envoyee: 'bg-blue-100 text-blue-800',
      accepte: 'bg-green-100 text-green-800',
      paye: 'bg-green-100 text-green-800',
      annule: 'bg-red-100 text-red-800',
      expire: 'bg-orange-100 text-orange-800'
    }
    
    const labels = {
      brouillon: 'Brouillon',
      envoye: 'Envoyé',
      envoyee: 'Envoyée',
      accepte: 'Accepté',
      paye: 'Payée',
      annule: 'Annulé',
      expire: 'Expiré'
    }
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[statut] || styles.brouillon}`}>
        {labels[statut] || statut}
      </span>
    )
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
                  📄 Facturation
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/admin/facturation/nouveau?type=devis"
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  + Nouveau devis
                </Link>
                <Link
                  href="/admin/facturation/nouveau?type=facture"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  + Nouvelle facture
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Titre */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion de la Facturation
            </h1>
            <p className="text-gray-600">
              Créez et gérez vos devis et factures
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-[#0073a8]">{stats.total}</p>
              <p className="text-sm text-gray-600">Documents total</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.devis}</p>
              <p className="text-sm text-gray-600">Devis</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.factures}</p>
              <p className="text-sm text-gray-600">Factures</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.enAttente}</p>
              <p className="text-sm text-gray-600">En attente</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.montantTotal.toLocaleString()} €</p>
              <p className="text-sm text-gray-600">CA facturé</p>
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher par numéro ou client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
              >
                <option value="tous">Tous types</option>
                <option value="devis">Devis</option>
                <option value="facture">Factures</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
              >
                <option value="tous">Tous statuts</option>
                <option value="brouillon">Brouillon</option>
                <option value="envoye">Envoyé</option>
                <option value="paye">Payé</option>
                <option value="annule">Annulé</option>
              </select>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
              >
                <option value="">Tous les clients</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.entreprise}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Liste des documents */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">
                            {doc.type === 'devis' ? '📋' : '📄'}
                          </span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {doc.numero}
                            </div>
                            <div className="text-sm text-gray-500">
                              {doc.type === 'devis' ? 'Devis' : 'Facture'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          href={`/admin/crm/${doc.clientId}`}
                          className="text-sm text-[#0073a8] hover:underline"
                        >
                          {doc.clientNom}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(doc.date).toLocaleDateString('fr-FR')}
                        {doc.dateEcheance && (
                          <div className="text-xs text-gray-500">
                            Échéance: {new Date(doc.dateEcheance).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {doc.montantTTC.toLocaleString()} €
                        </div>
                        <div className="text-xs text-gray-500">
                          HT: {doc.montantHT.toLocaleString()} €
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(doc.statut, doc.type)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/facturation/${doc.id}`}
                            className="text-[#0073a8] hover:text-[#006a87]"
                            title="Voir/Modifier"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          
                          <button
                            onClick={() => handleDuplicateDocument(doc)}
                            className="text-gray-600 hover:text-gray-800"
                            title="Dupliquer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          
                          {doc.type === 'devis' && doc.statut !== 'annule' && (
                            <button
                              onClick={() => handleConvertToInvoice(doc)}
                              className="text-green-600 hover:text-green-800"
                              title="Convertir en facture"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDownloadPDF(doc.id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Télécharger PDF"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => handleSendEmail(doc)}
                            className="text-orange-600 hover:text-orange-800"
                            title="Envoyer par email"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Supprimer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredDocuments.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucun document trouvé</p>
                  <Link
                    href="/admin/facturation/nouveau"
                    className="inline-block mt-4 text-[#0073a8] hover:text-[#006a87] font-medium"
                  >
                    Créer votre premier document →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Raccourcis */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Link
              href="/admin/facturation/nouveau?type=devis"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0073a8]">
                    Créer un devis
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Nouveau devis pour un client
                  </p>
                </div>
                <span className="text-3xl">📋</span>
              </div>
            </Link>
            
            <Link
              href="/admin/facturation/nouveau?type=facture"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0073a8]">
                    Créer une facture
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Nouvelle facture directe
                  </p>
                </div>
                <span className="text-3xl">📄</span>
              </div>
            </Link>
            
            <Link
              href="/admin/parametres#facturation"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0073a8]">
                    Paramètres
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Configurer vos infos de facturation
                  </p>
                </div>
                <span className="text-3xl">⚙️</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}