'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminRealisations() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  
  const [realisations, setRealisations] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  // Formulaire
  const [formData, setFormData] = useState({
    titre: '',
    url: '',
    image: '',
    description: ''
  })

  // Vérifier l'authentification et charger les réalisations
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/realisations', {
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        setRealisations(data)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Erreur vérification auth:', error)
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
      setRealisations([])
    } catch (error) {
      console.error('Erreur déconnexion:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    
    try {
      const method = editingId ? 'POST' : 'POST'
      const url = editingId ? `/api/realisations/${editingId}` : '/api/realisations'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      })
      
      if (res.ok) {
        setMessage(`✔ Réalisation ${editingId ? 'modifiée' : 'ajoutée'} avec succès`)
        resetForm()
        checkAuth()
      } else {
        setMessage('Erreur lors de l\'enregistrement')
      }
    } catch (error) {
      setMessage('Erreur de connexion')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (realisation) => {
    setFormData({
      titre: realisation.titre,
      url: realisation.url || '',
      image: realisation.image,
      description: realisation.description || ''
    })
    setEditingId(realisation.id)
    setShowForm(true)
  }

  const handleDelete = async (id, titre) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${titre}" ?`)) {
      try {
        const res = await fetch(`/api/realisations/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        
        if (res.ok) {
          setMessage('✔ Réalisation supprimée')
          checkAuth()
        } else {
          setMessage('Erreur lors de la suppression')
        }
      } catch (error) {
        setMessage('Erreur de connexion')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      titre: '',
      url: '',
      image: '',
      description: ''
    })
    setEditingId(null)
    setShowForm(false)
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
          <h1 className="text-2xl font-bold mb-6 text-center">Administration</h1>
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
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestion Réalisations</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/admin-tarifs')}
              className="bg-blue-600 text-white px-4 py-3 text-sm rounded-lg hover:bg-blue-700"
            >
              Gestion<br />Tarifs
            </button>
            <button
              onClick={() => router.push('/admin-realisations')}
              className="bg-gray-600 text-white px-4 py-3 text-sm rounded-lg"
            >
              Gestion<br />Réalisations
            </button>
            <button
              onClick={() => router.push('/admin-blog')}
              className="bg-blue-600 text-white px-4 py-3 text-sm rounded-lg hover:bg-blue-700"
            >
              Gestion du Blog
            </button>
            <button
              onClick={() => router.push('/admin-devis')}
              className="bg-blue-600 text-white px-4 py-3 text-sm rounded-lg hover:bg-blue-700"
            >
              Gestion<br />Devis
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-4 py-3 text-sm rounded-lg hover:bg-gray-700"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('✔') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Bouton ajouter */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            {showForm ? 'Annuler' : '+ Ajouter une réalisation'}
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Modifier la réalisation' : 'Nouvelle réalisation'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre *</label>
                  <input
                    type="text"
                    value={formData.titre}
                    onChange={(e) => setFormData({...formData, titre: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL du site</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://www.exemple.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image *</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">/images/</span>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="flex-1 px-3 py-2 border rounded-lg"
                      placeholder="nom-image.jpg"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Placez l'image dans /public/images/
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows="3"
                    placeholder="Description courte du projet..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'Enregistrement...' : editingId ? 'Modifier' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des réalisations */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {realisations.map((realisation) => (
                <tr key={realisation.id}>
                  <td className="px-4 py-3">
                    <img 
                      src={`/images/${realisation.image}`} 
                      alt={realisation.titre}
                      className="w-20 h-14 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg'
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{realisation.titre}</td>
                  <td className="px-4 py-3">
                    {realisation.url && (
                      <a 
                        href={realisation.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {realisation.url.replace('https://', '').replace('http://', '')}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {realisation.description?.substring(0, 60)}
                    {realisation.description?.length > 60 && '...'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(realisation)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Modifier"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(realisation.id, realisation.titre)}
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
          {realisations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune réalisation pour le moment
            </div>
          )}
        </div>
      </div>
    </div>
  )
}