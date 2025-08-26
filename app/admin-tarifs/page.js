'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminTarifs() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  
  const [tarifs, setTarifs] = useState({
    formuleBase: { nom: '', prix: 0, description: '' },
    options: [],
    remises: []
  })

  // Vérifier l'authentification
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/tarifs', {
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        console.log('Données reçues:', data)  // DEBUG: voir les données
        setTarifs(data)
        setIsAuthenticated(true)
      } else {
        // Si erreur 401 ou autre, forcer la déconnexion
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Erreur vérification auth:', error)
      setIsAuthenticated(false)
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
      const res = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      if (res.ok) {
        // Réinitialiser l'état
        setIsAuthenticated(false)
        setPassword('')
        setMessage('')
        setTarifs({
          formuleBase: { nom: '', prix: 0, description: '' },
          options: [],
          remises: []
        })
      }
    } catch (error) {
      console.error('Erreur déconnexion:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      const res = await fetch('/api/tarifs', {
        method: 'POST',  // Changé de PUT à POST
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tarifs),
        credentials: 'include'
      })
      
      if (res.ok) {
        setMessage('✓ Tarifs sauvegardés avec succès')
      } else if (res.status === 401) {
        setMessage('Session expirée, veuillez vous reconnecter')
        setIsAuthenticated(false)
      } else {
        setMessage('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      setMessage('Erreur de connexion')
    } finally {
      setSaving(false)
    }
  }

  const updateFormuleBase = (field, value) => {
    setTarifs(prev => ({
      ...prev,
      formuleBase: {
        ...prev.formuleBase,
        [field]: field === 'prix' ? Number(value) : value
      }
    }))
  }

  const updateOption = (index, field, value) => {
    const newOptions = [...tarifs.options]
    newOptions[index] = {
      ...newOptions[index],
      [field]: field === 'prix' || field === 'ordre' ? Number(value) : value
    }
    setTarifs(prev => ({ ...prev, options: newOptions }))
  }

  const addOption = () => {
    const newOption = {
      id: `option-${Date.now()}`,
      nom: 'Nouvelle option',
      prix: 0,
      unite: '',
      description: '',
      ordre: tarifs.options.length + 1,
      active: true
    }
    setTarifs(prev => ({
      ...prev,
      options: [...prev.options, newOption]
    }))
  }

  const removeOption = (index) => {
    const newOptions = tarifs.options.filter((_, i) => i !== index)
    setTarifs(prev => ({ ...prev, options: newOptions }))
  }

  const updateRemise = (index, field, value) => {
    const newRemises = [...tarifs.remises]
    newRemises[index] = {
      ...newRemises[index],
      [field]: field === 'reduction' ? Number(value) : value
    }
    setTarifs(prev => ({ ...prev, remises: newRemises }))
  }

  const addRemise = () => {
    const newRemise = {
      code: '',
      reduction: 0,
      type: 'pourcentage',
      description: '',
      active: true
    }
    setTarifs(prev => ({
      ...prev,
      remises: [...prev.remises, newRemise]
    }))
  }

  const removeRemise = (index) => {
    const newRemises = tarifs.remises.filter((_, i) => i !== index)
    setTarifs(prev => ({ ...prev, remises: newRemises }))
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
          <h1 className="text-3xl font-bold">Gestion des Tarifs</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/admin-devis')}
              className="bg-blue-600 text-white px-4 py-3 text-sm rounded-lg hover:bg-blue-700"
            >
              Gestion des Devis
            </button>
            <button
              onClick={() => router.push('/admin-realisations')}
              className="bg-blue-600 text-white px-4 py-3 text-sm rounded-lg hover:bg-blue-700"
            >
              Gestion des Réalisations
            </button>
            <button
              onClick={() => router.push('/admin-tarifs')}
              className="bg-gray-600 text-white px-4 py-3 text-sm rounded-lg"
            >
              Gestion des Tarifs
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 text-white px-4 py-3 text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : 'Sauvegarder'}
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
            message.includes('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Formule de base */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Formule de Base</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                type="text"
                value={tarifs.formuleBase.nom}
                onChange={(e) => updateFormuleBase('nom', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prix (€)</label>
              <input
                type="number"
                value={tarifs.formuleBase.prix}
                onChange={(e) => updateFormuleBase('prix', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                value={tarifs.formuleBase.description}
                onChange={(e) => updateFormuleBase('description', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Options</h2>
            <button
              onClick={addOption}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Ajouter une option
            </button>
          </div>
          
          <div className="space-y-4">
            {tarifs.options.map((option, index) => (
              <div key={option.id} className="border rounded-lg p-4">
                <div className="grid md:grid-cols-6 gap-3 items-end">
                  <div>
                    <label className="block text-sm font-medium mb-1">ID</label>
                    <input
                      type="text"
                      value={option.id}
                      onChange={(e) => updateOption(index, 'id', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom</label>
                    <input
                      type="text"
                      value={option.nom}
                      onChange={(e) => updateOption(index, 'nom', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Prix (€)</label>
                    <input
                      type="number"
                      value={option.prix}
                      onChange={(e) => updateOption(index, 'prix', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Unité</label>
                    <input
                      type="text"
                      value={option.unite || ''}
                      onChange={(e) => updateOption(index, 'unite', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="par an, par mois..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ordre</label>
                    <input
                      type="number"
                      value={option.ordre || 0}
                      onChange={(e) => updateOption(index, 'ordre', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={option.active !== false}
                        onChange={(e) => updateOption(index, 'active', e.target.checked)}
                        className="mr-1"
                      />
                      Actif
                    </label>
                    <button
                      onClick={() => removeOption(index)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={option.description || ''}
                    onChange={(e) => updateOption(index, 'description', e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Codes Promo */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Codes Promo</h2>
            <button
              onClick={addRemise}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Ajouter un code
            </button>
          </div>
          
          <div className="space-y-4">
            {tarifs.remises.map((remise, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="grid md:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="block text-sm font-medium mb-1">Code</label>
                    <input
                      type="text"
                      value={remise.code}
                      onChange={(e) => updateRemise(index, 'code', e.target.value.toUpperCase())}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Réduction</label>
                    <input
                      type="number"
                      value={remise.reduction}
                      onChange={(e) => updateRemise(index, 'reduction', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={remise.type}
                      onChange={(e) => updateRemise(index, 'type', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="pourcentage">Pourcentage</option>
                      <option value="fixe">Montant fixe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <input
                      type="text"
                      value={remise.description}
                      onChange={(e) => updateRemise(index, 'description', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </div>
                  <button
                    onClick={() => removeRemise(index)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}