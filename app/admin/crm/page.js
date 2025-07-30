"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function CRMClients() {
  const [clients, setClients] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('tous')
  const [expandedClient, setExpandedClient] = useState(null)
  
  // Formulaire client
  const [clientForm, setClientForm] = useState({
    entreprise: '',
    contact: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: 'France',
    siteWeb: '',
    status: 'actif',
    notes: '',
    dateCreation: new Date().toISOString().split('T')[0]
  })

  // Charger les clients
  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/crm')
      const data = await response.json()
      setClients(data)
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      // Données de démonstration en cas d'erreur
      setClients([
        {
          id: 'CLI-001',
          entreprise: 'Restaurant Le Gourmet',
          contact: 'Jean Dupont',
          email: 'contact@legourmet.fr',
          telephone: '01 42 86 82 82',
          adresse: '12 rue de la Paix',
          ville: 'Paris',
          codePostal: '75002',
          pays: 'France',
          siteWeb: 'https://restaurant-legourmet.fr',
          status: 'actif',
          notes: 'Client depuis 2022. Site vitrine + réservation en ligne.',
          dateCreation: '2022-03-15',
          stats: {
            totalFacture: 5400,
            totalPaye: 5400,
            nombreProjets: 2,
            derniereInteraction: '2024-12-15'
          }
        },
        {
          id: 'CLI-002',
          entreprise: 'Boutique Mode & Style',
          contact: 'Marie Martin',
          email: 'contact@mode-style.com',
          telephone: '01 45 62 31 20',
          adresse: '45 avenue des Champs',
          ville: 'Paris',
          codePostal: '75008',
          pays: 'France',
          siteWeb: 'https://mode-et-style.com',
          status: 'actif',
          notes: 'E-commerce WooCommerce. Maintenance mensuelle.',
          dateCreation: '2023-01-10',
          stats: {
            totalFacture: 8200,
            totalPaye: 6700,
            nombreProjets: 3,
            derniereInteraction: '2025-01-20'
          }
        }
      ])
      setLoading(false)
    }
  }

  // Ajouter un client
  const handleAddClient = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientForm)
      })
      
      if (response.ok) {
        await fetchClients()
        resetForm()
        setShowAddForm(false)
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Modifier un client
  const handleEditClient = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/crm', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: editingClient.id,
          clientData: clientForm
        })
      })
      
      if (response.ok) {
        await fetchClients()
        setEditingClient(null)
        resetForm()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Supprimer un client
  const handleDeleteClient = async (clientId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ? Cette action supprimera également toutes les données associées.')) return
    
    try {
      const response = await fetch('/api/admin/crm', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId })
      })
      
      if (response.ok) {
        await fetchClients()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Réinitialiser le formulaire
  const resetForm = () => {
    setClientForm({
      entreprise: '',
      contact: '',
      email: '',
      telephone: '',
      adresse: '',
      ville: '',
      codePostal: '',
      pays: 'France',
      siteWeb: '',
      status: 'actif',
      notes: '',
      dateCreation: new Date().toISOString().split('T')[0]
    })
  }

  // Filtrer les clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'tous' || client.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  // Obtenir les statistiques
  const getStats = () => {
    const stats = {
      total: clients.length,
      actifs: clients.filter(c => c.status === 'actif').length,
      inactifs: clients.filter(c => c.status === 'inactif').length,
      prospects: clients.filter(c => c.status === 'prospect').length
    }
    return stats
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
                  👥 CRM Clients
                </span>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouveau client
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Titre et description */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion de la Relation Client
            </h1>
            <p className="text-gray-600">
              Centralisez toutes les informations de vos clients et prospects
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-[#0073a8]">{stats.total}</p>
              <p className="text-sm text-gray-600">Clients total</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.actifs}</p>
              <p className="text-sm text-gray-600">Clients actifs</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.prospects}</p>
              <p className="text-sm text-gray-600">Prospects</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-600">{stats.inactifs}</p>
              <p className="text-sm text-gray-600">Inactifs</p>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher par nom, contact ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
              >
                <option value="tous">Tous les statuts</option>
                <option value="actif">Actifs</option>
                <option value="prospect">Prospects</option>
                <option value="inactif">Inactifs</option>
              </select>
            </div>
          </div>

          {/* Liste des clients */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CA Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <React.Fragment key={client.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <Link href={`/admin/crm/${client.id}`} className="hover:text-[#0073a8]">
                            <div>
                              <div className="text-sm font-medium text-gray-900 hover:text-[#0073a8] transition-colors">
                                {client.entreprise}
                              </div>
                              <div className="text-sm text-gray-500">
                                {client.ville}, {client.pays}
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm text-gray-900">{client.contact}</div>
                            <div className="text-sm text-gray-500">
                              <a href={`mailto:${client.email}`} className="text-[#0073a8] hover:underline">
                                {client.email}
                              </a>
                            </div>
                            {client.telephone && (
                              <div className="text-sm text-gray-500">
                                <a href={`tel:${client.telephone}`} className="hover:underline">
                                  {client.telephone}
                                </a>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            client.status === 'actif' 
                              ? 'bg-green-100 text-green-800'
                              : client.status === 'prospect'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {client.status === 'actif' ? '🟢 Actif' : client.status === 'prospect' ? '🟡 Prospect' : '⚫ Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {client.stats?.totalFacture ? `${client.stats.totalFacture.toLocaleString()} €` : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/crm/${client.id}`}
                              className="text-[#0073a8] hover:text-[#006a87]"
                              title="Voir la fiche"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}
                              className="text-gray-600 hover:text-gray-800"
                              title="Aperçu rapide"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {expandedClient === client.id ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                )}
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                setEditingClient(client)
                                setClientForm({
                                  entreprise: client.entreprise,
                                  contact: client.contact,
                                  email: client.email,
                                  telephone: client.telephone,
                                  adresse: client.adresse,
                                  ville: client.ville,
                                  codePostal: client.codePostal,
                                  pays: client.pays,
                                  siteWeb: client.siteWeb,
                                  status: client.status,
                                  notes: client.notes,
                                  dateCreation: client.dateCreation
                                })
                              }}
                              className="text-blue-600 hover:text-blue-800"
                              title="Modifier"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteClient(client.id)}
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
                      
                      {/* Ligne de détails expandable */}
                      {expandedClient === client.id && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 bg-gray-50">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Informations détaillées</h4>
                                <dl className="space-y-2 text-sm">
                                  <div>
                                    <dt className="font-medium text-gray-500">Adresse complète :</dt>
                                    <dd className="text-gray-900">
                                      {client.adresse}<br />
                                      {client.codePostal} {client.ville}<br />
                                      {client.pays}
                                    </dd>
                                  </div>
                                  {client.siteWeb && (
                                    <div>
                                      <dt className="font-medium text-gray-500">Site web :</dt>
                                      <dd>
                                        <a href={client.siteWeb} target="_blank" rel="noopener noreferrer" 
                                           className="text-[#0073a8] hover:underline">
                                          {client.siteWeb}
                                        </a>
                                      </dd>
                                    </div>
                                  )}
                                  <div>
                                    <dt className="font-medium text-gray-500">Client depuis :</dt>
                                    <dd className="text-gray-900">
                                      {new Date(client.dateCreation).toLocaleDateString('fr-FR')}
                                    </dd>
                                  </div>
                                </dl>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Statistiques & Notes</h4>
                                {client.stats && (
                                  <dl className="space-y-2 text-sm mb-4">
                                    <div className="flex justify-between">
                                      <dt className="text-gray-500">Projets réalisés :</dt>
                                      <dd className="font-medium">{client.stats.nombreProjets || 0}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-gray-500">Total facturé :</dt>
                                      <dd className="font-medium">{client.stats.totalFacture?.toLocaleString() || 0} €</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-gray-500">Solde :</dt>
                                      <dd className={`font-medium ${
                                        (client.stats.totalFacture - client.stats.totalPaye) > 0 
                                          ? 'text-red-600' 
                                          : 'text-green-600'
                                      }`}>
                                        {((client.stats.totalFacture || 0) - (client.stats.totalPaye || 0)).toLocaleString()} €
                                      </dd>
                                    </div>
                                  </dl>
                                )}
                                {client.notes && (
                                  <div className="bg-yellow-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-700">{client.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Actions rapides */}
                            <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3">
                              <Link 
                                href={`/admin/crm/${client.id}`}
                                className="text-sm text-[#0073a8] hover:text-[#006a87] font-medium"
                              >
                                Voir la fiche complète →
                              </Link>
                              <Link 
                                href={`/admin/sites?client=${client.id}`}
                                className="text-sm text-[#0073a8] hover:text-[#006a87] font-medium"
                              >
                                Voir les sites →
                              </Link>
                              <Link 
                                href={`/admin/facturation?client=${client.id}`}
                                className="text-sm text-[#0073a8] hover:text-[#006a87] font-medium"
                              >
                                Créer une facture →
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              
              {filteredClients.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucun client trouvé</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal d'ajout/édition */}
        {(showAddForm || editingClient) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={editingClient ? handleEditClient : handleAddClient}>
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingClient ? 'Modifier le client' : 'Nouveau client'}
                  </h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Entreprise *
                      </label>
                      <input
                        type="text"
                        value={clientForm.entreprise}
                        onChange={(e) => setClientForm({ ...clientForm, entreprise: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact principal *
                      </label>
                      <input
                        type="text"
                        value={clientForm.contact}
                        onChange={(e) => setClientForm({ ...clientForm, contact: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={clientForm.email}
                        onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={clientForm.telephone}
                        onChange={(e) => setClientForm({ ...clientForm, telephone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site web
                      </label>
                      <input
                        type="url"
                        value={clientForm.siteWeb}
                        onChange={(e) => setClientForm({ ...clientForm, siteWeb: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        placeholder="https://..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Statut
                      </label>
                      <select
                        value={clientForm.status}
                        onChange={(e) => setClientForm({ ...clientForm, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      >
                        <option value="prospect">Prospect</option>
                        <option value="actif">Client actif</option>
                        <option value="inactif">Inactif</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Adresse</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Adresse
                        </label>
                        <input
                          type="text"
                          value={clientForm.adresse}
                          onChange={(e) => setClientForm({ ...clientForm, adresse: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Code postal
                        </label>
                        <input
                          type="text"
                          value={clientForm.codePostal}
                          onChange={(e) => setClientForm({ ...clientForm, codePostal: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ville
                        </label>
                        <input
                          type="text"
                          value={clientForm.ville}
                          onChange={(e) => setClientForm({ ...clientForm, ville: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pays
                        </label>
                        <input
                          type="text"
                          value={clientForm.pays}
                          onChange={(e) => setClientForm({ ...clientForm, pays: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={clientForm.notes}
                      onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      rows="3"
                    />
                  </div>
                </div>
                
                <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingClient(null)
                      resetForm()
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0073a8] text-white rounded-lg hover:bg-[#006a87] transition-colors"
                  >
                    {editingClient ? 'Enregistrer' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  )
}