"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminTarifs() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [tarifs, setTarifs] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuthentication()
  }, [])

  // Charger les tarifs si authentifié
  useEffect(() => {
    if (isAuthenticated) {
      fetchTarifs()
    }
  }, [isAuthenticated])

  const checkAuthentication = async () => {
    try {
      // Essayer de charger les tarifs pour vérifier si on est authentifié
      const res = await fetch('/api/tarifs')
      if (res.ok) {
        setIsAuthenticated(true)
        const data = await res.json()
        setTarifs(data)
      }
    } catch (error) {
      console.error('Erreur vérification auth:', error)
    } finally {
      setCheckingAuth(false)
    }
  }

  const fetchTarifs = async () => {
    try {
      const res = await fetch('/api/tarifs')
      const data = await res.json()
      setTarifs(data)
    } catch (error) {
      setError('Erreur lors du chargement des tarifs')
    }
  }

  // Connexion
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await res.json()

      if (res.ok) {
        setIsAuthenticated(true)
        setPassword('')
        // Charger les tarifs après connexion
        fetchTarifs()
      } else {
        setError(data.error || 'Erreur de connexion')
      }
    } catch (error) {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  // Déconnexion
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' })
      setIsAuthenticated(false)
      setTarifs(null)
    } catch (error) {
      console.error('Erreur déconnexion:', error)
    }
  }

  // Sauvegarder les modifications
  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/tarifs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tarifs })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess('Tarifs mis à jour avec succès !')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Erreur lors de la mise à jour')
        if (res.status === 401) {
          // Session expirée
          setIsAuthenticated(false)
        }
      }
    } catch (error) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  // Mettre à jour la formule de base
  const updateFormuleBase = (field, value) => {
    setTarifs({
      ...tarifs,
      formuleBase: {
        ...tarifs.formuleBase,
        [field]: field === 'prix' ? Number(value) : value
      }
    })
  }

  // Mettre à jour une option
  const updateOption = (index, field, value) => {
    const newOptions = [...tarifs.options]
    newOptions[index] = {
      ...newOptions[index],
      [field]: field === 'prix' ? Number(value) : value
    }
    setTarifs({ ...tarifs, options: newOptions })
  }

  // Ajouter une option
  const addOption = () => {
    const newOption = {
      id: `option-${Date.now()}`,
      nom: 'Nouvelle option',
      prix: 100,
      description: ''
    }
    setTarifs({
      ...tarifs,
      options: [...tarifs.options, newOption]
    })
  }

  // Supprimer une option
  const deleteOption = (index) => {
    const newOptions = tarifs.options.filter((_, i) => i !== index)
    setTarifs({ ...tarifs, options: newOptions })
  }

  // Mettre à jour un code promo
  const updateRemise = (index, field, value) => {
    const newRemises = [...tarifs.remises]
    newRemises[index] = {
      ...newRemises[index],
      [field]: field === 'reduction' ? Number(value) : value
    }
    setTarifs({ ...tarifs, remises: newRemises })
  }

  // Ajouter un code promo
  const addRemise = () => {
    const newRemise = {
      code: 'NOUVEAU',
      reduction: 10,
      type: 'pourcentage',
      description: 'Nouvelle remise'
    }
    setTarifs({
      ...tarifs,
      remises: [...tarifs.remises, newRemise]
    })
  }

  // Supprimer un code promo
  const deleteRemise = (index) => {
    const newRemises = tarifs.remises.filter((_, i) => i !== index)
    setTarifs({ ...tarifs, remises: newRemises })
  }

  // Écran de chargement initial
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[100px]">
        <div className="text-xl">Vérification...</div>
      </div>
    )
  }

  // Page de connexion
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[100px]">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-900">
              Administration des Tarifs
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Entrez le mot de passe administrateur
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#0073a8] focus:border-[#0073a8]"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0073a8] text-white py-2 px-4 rounded-lg hover:bg-[#005580] transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Page d'administration
  if (!tarifs) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[100px]">
        <div className="text-xl">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[120px] pb-20">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Administration des Tarifs
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="text-gray-600 hover:text-gray-900"
            >
              Retour admin
            </button>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Formule de base */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Formule de Base</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                value={tarifs.formuleBase.nom}
                onChange={(e) => updateFormuleBase('nom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (€)
              </label>
              <input
                type="number"
                value={tarifs.formuleBase.prix}
                onChange={(e) => updateFormuleBase('prix', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={tarifs.formuleBase.description}
                onChange={(e) => updateFormuleBase('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Options</h2>
            <button
              onClick={addOption}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              + Ajouter une option
            </button>
          </div>
          <div className="space-y-4">
            {tarifs.options.map((option, index) => (
              <div key={option.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={option.nom}
                      onChange={(e) => updateOption(index, 'nom', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix (€)
                    </label>
                    <input
                      type="number"
                      value={option.prix}
                      onChange={(e) => updateOption(index, 'prix', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unité (optionnel)
                    </label>
                    <input
                      type="text"
                      value={option.unite || ''}
                      onChange={(e) => updateOption(index, 'unite', e.target.value)}
                      placeholder="par page, par mois..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (optionnel)
                    </label>
                    <input
                      type="text"
                      value={option.description || ''}
                      onChange={(e) => updateOption(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => deleteOption(index)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors w-full"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Codes promo */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Codes Promo</h2>
            <button
              onClick={addRemise}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              + Ajouter un code
            </button>
          </div>
          <div className="space-y-4">
            {tarifs.remises.map((remise, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code
                    </label>
                    <input
                      type="text"
                      value={remise.code}
                      onChange={(e) => updateRemise(index, 'code', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Réduction
                    </label>
                    <input
                      type="number"
                      value={remise.reduction}
                      onChange={(e) => updateRemise(index, 'reduction', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={remise.type}
                      onChange={(e) => updateRemise(index, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                    >
                      <option value="pourcentage">Pourcentage (%)</option>
                      <option value="fixe">Montant fixe (€)</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => deleteRemise(index)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors w-full"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={remise.description}
                    onChange={(e) => updateRemise(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton sauvegarder */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#0073a8] hover:bg-[#005580] transform hover:scale-105'
            }`}
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
          </button>
        </div>
      </div>
    </div>
  )
}