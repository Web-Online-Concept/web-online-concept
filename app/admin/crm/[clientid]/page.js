"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function ClientDetail() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.clientid
  
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('informations')
  const [editMode, setEditMode] = useState(false)
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [newNote, setNewNote] = useState('')
  
  // Formulaire d'édition
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
    notes: ''
  })

  // Charger les données du client
  useEffect(() => {
    if (clientId) {
      fetchClient()
    }
  }, [clientId])

  const fetchClient = async () => {
    try {
      const response = await fetch('/api/admin/crm')
      const allClients = await response.json()
      const foundClient = allClients.find(c => c.id === clientId)
      
      if (foundClient) {
        setClient(foundClient)
        setClientForm({
          entreprise: foundClient.entreprise,
          contact: foundClient.contact,
          email: foundClient.email,
          telephone: foundClient.telephone,
          adresse: foundClient.adresse,
          ville: foundClient.ville,
          codePostal: foundClient.codePostal,
          pays: foundClient.pays,
          siteWeb: foundClient.siteWeb,
          status: foundClient.status,
          notes: foundClient.notes
        })
      } else {
        // Client non trouvé
        router.push('/admin/crm')
      }
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      setLoading(false)
    }
  }

  // Sauvegarder les modifications
  const handleSaveEdit = async () => {
    try {
      const response = await fetch('/api/admin/crm', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          clientData: clientForm
        })
      })
      
      if (response.ok) {
        await fetchClient()
        setEditMode(false)
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Ajouter une note à l'historique
  const handleAddNote = async () => {
    if (!newNote.trim()) return
    
    try {
      const updatedHistorique = [
        ...(client.historique || []),
        {
          date: new Date().toISOString(),
          type: 'note',
          description: newNote
        }
      ]
      
      const response = await fetch('/api/admin/crm', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          clientData: {
            ...clientForm,
            historique: updatedHistorique
          }
        })
      })
      
      if (response.ok) {
        await fetchClient()
        setNewNote('')
        setShowNoteForm(false)
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Supprimer le client
  const handleDeleteClient = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.')) return
    
    try {
      const response = await fetch('/api/admin/crm', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: client.id })
      })
      
      if (response.ok) {
        router.push('/admin/crm')
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

  if (!client) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100 pt-[100px] flex items-center justify-center">
          <p className="text-gray-600">Client non trouvé</p>
        </div>
        <Footer />
      </>
    )
  }

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
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
                <Link href="/admin/crm" className="text-white/80 hover:text-white transition-colors">
                  ← Retour à la liste
                </Link>
                <span className="text-lg font-semibold">
                  Fiche Client #{client.id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {editMode ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      💾 Enregistrer
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false)
                        // Restaurer les valeurs originales
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
                          notes: client.notes
                        })
                      }}
                      className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      ✕ Annuler
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditMode(true)}
                      className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={handleDeleteClient}
                      className="bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      🗑️ Supprimer
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* En-tête du client */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {editMode ? (
                  <input
                    type="text"
                    value={clientForm.entreprise}
                    onChange={(e) => setClientForm({ ...clientForm, entreprise: e.target.value })}
                    className="text-3xl font-bold text-gray-900 mb-2 w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {client.entreprise}
                  </h1>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className={`inline-flex px-3 py-1 rounded-full font-medium ${
                    client.status === 'actif' 
                      ? 'bg-green-100 text-green-800'
                      : client.status === 'prospect'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {client.status === 'actif' ? '🟢 Client actif' : client.status === 'prospect' ? '🟡 Prospect' : '⚫ Inactif'}
                  </span>
                  <span>📅 Client depuis le {formatDate(client.dateCreation)}</span>
                </div>
              </div>
              
              {/* Actions rapides */}
              <div className="flex gap-2 ml-6">
                <Link
                  href={`/admin/sites?client=${client.id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  🌐 Voir les sites
                </Link>
                <Link
                  href={`/admin/facturation?client=${client.id}`}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  📄 Créer une facture
                </Link>
              </div>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-[#0073a8]">
                {client.stats?.nombreProjets || 0}
              </p>
              <p className="text-sm text-gray-600">Projets réalisés</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {client.stats?.totalFacture?.toLocaleString() || 0} €
              </p>
              <p className="text-sm text-gray-600">CA total</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <p className={`text-2xl font-bold ${
                (client.stats?.totalFacture - client.stats?.totalPaye) > 0 
                  ? 'text-red-600' 
                  : 'text-green-600'
              }`}>
                {((client.stats?.totalFacture || 0) - (client.stats?.totalPaye || 0)).toLocaleString()} €
              </p>
              <p className="text-sm text-gray-600">Solde</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {client.historique?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Interactions</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: 'informations', label: '📋 Informations', icon: '' },
                  { id: 'projets', label: '🌐 Projets & Sites', icon: '' },
                  { id: 'facturation', label: '💰 Facturation', icon: '' },
                  { id: 'historique', label: '📝 Historique & Notes', icon: '' },
                  { id: 'documents', label: '📁 Documents', icon: '' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-[#0073a8] border-b-2 border-[#0073a8] bg-blue-50/50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Tab Informations */}
              {activeTab === 'informations' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Contact principal</h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Nom du contact</dt>
                        <dd className="mt-1">
                          {editMode ? (
                            <input
                              type="text"
                              value={clientForm.contact}
                              onChange={(e) => setClientForm({ ...clientForm, contact: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          ) : (
                            <span className="text-gray-900">{client.contact}</span>
                          )}
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1">
                          {editMode ? (
                            <input
                              type="email"
                              value={clientForm.email}
                              onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          ) : (
                            <a href={`mailto:${client.email}`} className="text-[#0073a8] hover:underline">
                              {client.email}
                            </a>
                          )}
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                        <dd className="mt-1">
                          {editMode ? (
                            <input
                              type="tel"
                              value={clientForm.telephone}
                              onChange={(e) => setClientForm({ ...clientForm, telephone: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          ) : (
                            <a href={`tel:${client.telephone}`} className="text-[#0073a8] hover:underline">
                              {client.telephone}
                            </a>
                          )}
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Site web</dt>
                        <dd className="mt-1">
                          {editMode ? (
                            <input
                              type="url"
                              value={clientForm.siteWeb}
                              onChange={(e) => setClientForm({ ...clientForm, siteWeb: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          ) : client.siteWeb ? (
                            <a href={client.siteWeb} target="_blank" rel="noopener noreferrer" 
                               className="text-[#0073a8] hover:underline">
                              {client.siteWeb}
                            </a>
                          ) : (
                            <span className="text-gray-400">Non renseigné</span>
                          )}
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Statut</dt>
                        <dd className="mt-1">
                          {editMode ? (
                            <select
                              value={clientForm.status}
                              onChange={(e) => setClientForm({ ...clientForm, status: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="prospect">Prospect</option>
                              <option value="actif">Client actif</option>
                              <option value="inactif">Inactif</option>
                            </select>
                          ) : (
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              client.status === 'actif' 
                                ? 'bg-green-100 text-green-800'
                                : client.status === 'prospect'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {client.status}
                            </span>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Adresse</h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Adresse</dt>
                        <dd className="mt-1">
                          {editMode ? (
                            <input
                              type="text"
                              value={clientForm.adresse}
                              onChange={(e) => setClientForm({ ...clientForm, adresse: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          ) : (
                            <span className="text-gray-900">{client.adresse || 'Non renseignée'}</span>
                          )}
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Code postal</dt>
                        <dd className="mt-1">
                          {editMode ? (
                            <input
                              type="text"
                              value={clientForm.codePostal}
                              onChange={(e) => setClientForm({ ...clientForm, codePostal: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          ) : (
                            <span className="text-gray-900">{client.codePostal || 'Non renseigné'}</span>
                          )}
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Ville</dt>
                        <dd className="mt-1">
                          {editMode ? (
                            <input
                              type="text"
                              value={clientForm.ville}
                              onChange={(e) => setClientForm({ ...clientForm, ville: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          ) : (
                            <span className="text-gray-900">{client.ville || 'Non renseignée'}</span>
                          )}
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Pays</dt>
                        <dd className="mt-1">
                          {editMode ? (
                            <input
                              type="text"
                              value={clientForm.pays}
                              onChange={(e) => setClientForm({ ...clientForm, pays: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          ) : (
                            <span className="text-gray-900">{client.pays}</span>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-900 mb-4">Notes internes</h3>
                    {editMode ? (
                      <textarea
                        value={clientForm.notes}
                        onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows="4"
                      />
                    ) : (
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">
                          {client.notes || 'Aucune note pour le moment'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab Projets */}
              {activeTab === 'projets' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Sites et projets</h3>
                    <Link
                      href={`/admin/sites?client=${client.id}`}
                      className="text-sm text-[#0073a8] hover:text-[#006a87] font-medium"
                    >
                      Gérer les sites →
                    </Link>
                  </div>
                  
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <p className="text-gray-500">
                      Cette section sera connectée avec vos sites en gestion
                    </p>
                    <Link
                      href="/admin/sites"
                      className="inline-block mt-4 text-[#0073a8] hover:text-[#006a87] font-medium"
                    >
                      Aller aux sites →
                    </Link>
                  </div>
                </div>
              )}

              {/* Tab Facturation */}
              {activeTab === 'facturation' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Historique de facturation</h3>
                    <Link
                      href={`/admin/facturation?client=${client.id}`}
                      className="text-sm text-[#0073a8] hover:text-[#006a87] font-medium"
                    >
                      Créer une facture →
                    </Link>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Solde actuel :</span>
                      <span className={`text-xl font-bold ${
                        (client.stats?.totalFacture - client.stats?.totalPaye) > 0 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {((client.stats?.totalFacture || 0) - (client.stats?.totalPaye || 0)).toLocaleString()} €
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <p className="text-gray-500">
                      Cette section sera connectée avec votre module de facturation
                    </p>
                  </div>
                </div>
              )}

              {/* Tab Historique */}
              {activeTab === 'historique' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Historique des interactions</h3>
                    <button
                      onClick={() => setShowNoteForm(!showNoteForm)}
                      className="text-sm bg-[#0073a8] text-white px-4 py-2 rounded-lg hover:bg-[#006a87] transition-colors"
                    >
                      + Ajouter une note
                    </button>
                  </div>
                  
                  {/* Formulaire d'ajout de note */}
                  {showNoteForm && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Ajouter une note..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                        rows="3"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddNote}
                          className="bg-[#0073a8] text-white px-4 py-2 rounded-lg hover:bg-[#006a87] transition-colors text-sm"
                        >
                          Enregistrer
                        </button>
                        <button
                          onClick={() => {
                            setShowNoteForm(false)
                            setNewNote('')
                          }}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Timeline */}
                  <div className="space-y-4">
                    {client.historique && client.historique.length > 0 ? (
                      [...client.historique].reverse().map((event, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              event.type === 'creation' ? 'bg-green-100 text-green-600' :
                              event.type === 'modification' ? 'bg-blue-100 text-blue-600' :
                              event.type === 'facturation' ? 'bg-yellow-100 text-yellow-600' :
                              event.type === 'projet' ? 'bg-purple-100 text-purple-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {event.type === 'creation' ? '🎉' :
                               event.type === 'modification' ? '✏️' :
                               event.type === 'facturation' ? '💰' :
                               event.type === 'projet' ? '🚀' :
                               '📝'}
                            </div>
                          </div>
                          <div className="flex-1 bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-gray-900">
                                {event.type === 'creation' ? 'Création' :
                                 event.type === 'modification' ? 'Modification' :
                                 event.type === 'facturation' ? 'Facturation' :
                                 event.type === 'projet' ? 'Projet' :
                                 'Note'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(event.date).toLocaleString('fr-FR')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Aucun historique pour le moment
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab Documents */}
              {activeTab === 'documents' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Documents</h3>
                    <button className="text-sm bg-[#0073a8] text-white px-4 py-2 rounded-lg hover:bg-[#006a87] transition-colors">
                      + Ajouter un document
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <p className="text-gray-500">
                      Fonctionnalité à venir : stockage de devis, contrats, etc.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}