'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDevis() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  
  // État pour les devis
  const [devis, setDevis] = useState([])
  const [filteredDevis, setFilteredDevis] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedDevis, setSelectedDevis] = useState(null)
  
  // Filtres
  const [search, setSearch] = useState('')
  const [statutFilter, setStatutFilter] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [sortBy, setSortBy] = useState('date_creation')
  const [sortOrder, setSortOrder] = useState('DESC')

  // Vérifier l'authentification et charger les devis
  useEffect(() => {
    checkAuth()
  }, [])

  // Appliquer les filtres quand ils changent
  useEffect(() => {
    if (isAuthenticated) {
      loadDevis()
    }
  }, [isAuthenticated, currentPage, statutFilter, sortBy, sortOrder])

  // Recherche avec délai
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        setCurrentPage(1)
        loadDevis()
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [search, dateDebut, dateFin])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/devis-list', {
        credentials: 'include'
      })
      if (res.ok) {
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Erreur auth:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include'
      })
      
      if (res.ok) {
        setIsAuthenticated(true)
        checkAuth()
      } else {
        setMessage('Mot de passe incorrect')
      }
    } catch (error) {
      setMessage('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      setIsAuthenticated(false)
      setPassword('')
      setMessage('')
      setDevis([])
    } catch (error) {
      console.error('Erreur déconnexion:', error)
    }
  }

  const loadDevis = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...(search && { search }),
        ...(statutFilter && { statut: statutFilter }),
        ...(dateDebut && { dateDebut }),
        ...(dateFin && { dateFin }),
        sortBy,
        sortOrder
      })

      const res = await fetch(`/api/devis-list?${params}`, {
        credentials: 'include'
      })

      if (res.ok) {
        const data = await res.json()
        setDevis(data.devis)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Erreur chargement devis:', error)
    }
  }

  const loadDevisDetail = async (devisId) => {
    try {
      const res = await fetch(`/api/devis/${devisId}`, {
        credentials: 'include'
      })

      if (res.ok) {
        const data = await res.json()
        setSelectedDevis(data)
      }
    } catch (error) {
      console.error('Erreur chargement détail:', error)
    }
  }

  const updateStatut = async (devisId, newStatut) => {
    try {
      const res = await fetch('/api/devis-list', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: devisId, statut: newStatut }),
        credentials: 'include'
      })

      if (res.ok) {
        loadDevis()
        setMessage('✓ Statut mis à jour')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error)
    }
  }

  const deleteDevis = async (devisId, numero) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le devis ${numero} ?`)) {
      try {
        const res = await fetch(`/api/devis/${devisId}`, {
          method: 'DELETE',
          credentials: 'include'
        })

        if (res.ok) {
          loadDevis()
          setMessage('✓ Devis supprimé')
          setTimeout(() => setMessage(''), 3000)
        } else {
          setMessage('Erreur lors de la suppression')
        }
      } catch (error) {
        console.error('Erreur suppression:', error)
        setMessage('Erreur lors de la suppression')
      }
    }
  }

  const downloadPDF = (devisId) => {
    window.open(`/api/devis/${devisId}/pdf`, '_blank')
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatutColor = (statut) => {
    switch(statut) {
      case 'envoyé': return 'bg-blue-100 text-blue-800'
      case 'accepté': return 'bg-green-100 text-green-800'
      case 'refusé': return 'bg-red-100 text-red-800'
      case 'facturé': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Administration Devis</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              required
            />
            {message && (
              <p className="text-red-500 text-sm mb-4">{message}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestion des Devis</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/admin-devis')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg"
            >
              Gestion des Devis
            </button>
            <button
              onClick={() => router.push('/admin-realisations')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Gestion des Réalisations
            </button>
            <button
              onClick={() => router.push('/admin-tarifs')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Gestion des Tarifs
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rechercher</label>
              <input
                type="text"
                placeholder="Nom, email, numéro..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Statut</label>
              <select
                value={statutFilter}
                onChange={(e) => setStatutFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Tous</option>
                <option value="envoyé">Envoyé</option>
                <option value="accepté">Accepté</option>
                <option value="refusé">Refusé</option>
                <option value="facturé">Facturé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date début</label>
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date fin</label>
              <input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Liste des devis */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <button
                    onClick={() => {
                      setSortBy('date_creation')
                      setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')
                    }}
                    className="flex items-center hover:text-gray-700"
                  >
                    Date
                    {sortBy === 'date_creation' && (
                      <span className="ml-1">{sortOrder === 'DESC' ? '↓' : '↑'}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <button
                    onClick={() => {
                      setSortBy('total_ht')
                      setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')
                    }}
                    className="flex items-center hover:text-gray-700"
                  >
                    Total HT
                    {sortBy === 'total_ht' && (
                      <span className="ml-1">{sortOrder === 'DESC' ? '↓' : '↑'}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {devis.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{formatDate(item.date_creation)}</td>
                  <td className="px-4 py-3 text-sm font-medium">{item.numero}</td>
                  <td className="px-4 py-3 text-sm">{item.client_nom}</td>
                  <td className="px-4 py-3 text-sm">{item.client_email}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{item.total_ht}€</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatutColor(item.statut)}`}>
                      {item.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadDevisDetail(item.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Voir détails"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => downloadPDF(item.id)}
                        className="text-green-600 hover:text-green-800"
                        title="Télécharger PDF"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteDevis(item.id, item.numero)}
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

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>

        {/* Modal détails devis */}
        {selectedDevis && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold">Détails du devis {selectedDevis.numero}</h2>
                  <button
                    onClick={() => setSelectedDevis(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">Informations client</h3>
                    <p><strong>Nom :</strong> {selectedDevis.client_nom}</p>
                    <p><strong>Email :</strong> {selectedDevis.client_email}</p>
                    <p><strong>Téléphone :</strong> {selectedDevis.client_telephone}</p>
                    {selectedDevis.client_entreprise && (
                      <p><strong>Entreprise :</strong> {selectedDevis.client_entreprise}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Informations devis</h3>
                    <p><strong>Date :</strong> {formatDate(selectedDevis.date_creation)}</p>
                    <p><strong>Total HT :</strong> {selectedDevis.total_ht}€</p>
                    <p><strong>TVA (0%) :</strong> 0.00€</p>
                    <p><strong>Total :</strong> {selectedDevis.total_ht}€</p>
                    {selectedDevis.code_promo && (
                      <p><strong>Code promo :</strong> {selectedDevis.code_promo} (-{selectedDevis.reduction}€)</p>
                    )}
                  </div>
                </div>

                {selectedDevis.message_client && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Message du client</h3>
                    <p className="bg-gray-50 p-3 rounded">{selectedDevis.message_client}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Changer le statut</h3>
                  <select
                    value={selectedDevis.statut}
                    onChange={(e) => {
                      updateStatut(selectedDevis.id, e.target.value)
                      setSelectedDevis({...selectedDevis, statut: e.target.value})
                    }}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="envoyé">Envoyé</option>
                    <option value="accepté">Accepté</option>
                    <option value="refusé">Refusé</option>
                    <option value="facturé">Facturé</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => downloadPDF(selectedDevis.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Télécharger PDF
                  </button>
                  <button
                    onClick={() => setSelectedDevis(null)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}