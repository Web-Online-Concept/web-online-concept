"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DemandeDevis() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tarifs, setTarifs] = useState(null)
  
  // État du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    entreprise: '',
    email: '',
    telephone: '',
    siteActuel: '',
    adresse: '',
    codePostal: '',
    ville: '',
    typeProjet: 'nouveau', // 'nouveau' ou 'remplacement' ou 'client-existant'
    siteWeb: true,
    options: {},
    codePromo: '',
    commentaire: ''
  })
  
  const [promoInfo, setPromoInfo] = useState(null)
  const [total, setTotal] = useState(500) // Prix de base

  // Charger les tarifs
  useEffect(() => {
    fetch('/api/tarifs')
      .then(res => res.json())
      .then(data => setTarifs(data))
      .catch(err => console.error('Erreur chargement tarifs:', err))
  }, [])

  // Calculer le total
  useEffect(() => {
    if (!tarifs) return

    let newTotal = 0
    
    // Formule de base
    if (formData.siteWeb) {
      newTotal += tarifs.formuleBase.prix
    }

    // Options
    Object.entries(formData.options).forEach(([optionId, quantity]) => {
      if (quantity > 0) {
        const option = tarifs.options.find(o => o.id === optionId)
        if (option) {
          newTotal += option.prix * quantity
        }
      }
    })

    // Appliquer la promotion
    if (promoInfo) {
      if (promoInfo.type === 'pourcentage') {
        newTotal = newTotal * (1 - promoInfo.reduction / 100)
      } else {
        newTotal = Math.max(0, newTotal - promoInfo.reduction)
      }
    }

    setTotal(Math.round(newTotal))
  }, [formData.siteWeb, formData.options, promoInfo, tarifs])

  // Vérifier le code promo
  const verifyPromoCode = async () => {
    if (!formData.codePromo) {
      setPromoInfo(null)
      return
    }

    try {
      const res = await fetch('/api/codes-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: formData.codePromo })
      })
      
      const data = await res.json()
      if (data.valid) {
        setPromoInfo(data)
        setError('')
      } else {
        setPromoInfo(null)
        setError('Code promo invalide')
      }
    } catch (err) {
      setError('Erreur lors de la vérification du code')
    }
  }

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Préparer les données avec les options sélectionnées
    const selectedOptions = []
    Object.entries(formData.options).forEach(([optionId, quantity]) => {
      if (quantity > 0) {
        const option = tarifs.options.find(o => o.id === optionId)
        if (option) {
          selectedOptions.push({
            nom: option.nom,
            prix: option.prix,
            quantite: quantity,
            total: option.prix * quantity
          })
        }
      }
    })

    // Calculer la remise
    let remise = null
    if (promoInfo) {
      const totalAvantRemise = formData.siteWeb ? tarifs.formuleBase.prix : 0
      const totalOptions = selectedOptions.reduce((acc, opt) => acc + opt.total, 0)
      const totalBrut = totalAvantRemise + totalOptions

      if (promoInfo.type === 'pourcentage') {
        remise = {
          description: promoInfo.description,
          montant: Math.round(totalBrut * promoInfo.reduction / 100)
        }
      } else {
        remise = {
          description: promoInfo.description,
          montant: promoInfo.reduction
        }
      }
    }

    const dataToSend = {
      ...formData,
      options: selectedOptions,
      remise,
      total
    }

    try {
      const res = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })

      const result = await res.json()

      if (res.ok) {
        router.push(`/devis/confirmation?numero=${result.quoteNumber}`)
      } else {
        setError(result.error || 'Erreur lors de l\'envoi')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  if (!tarifs) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[100px]">
        <div className="text-xl">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[120px] pb-20">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Demande de Devis Gratuit
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Type de projet */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Type de projet</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#0073a8] transition-colors">
                <input
                  type="radio"
                  name="typeProjet"
                  value="nouveau"
                  checked={formData.typeProjet === 'nouveau'}
                  onChange={(e) => setFormData({...formData, typeProjet: e.target.value})}
                  className="w-4 h-4 text-[#0073a8] focus:ring-[#0073a8]"
                />
                <div className="ml-3">
                  <span className="font-medium">Créer un nouveau site</span>
                  <p className="text-sm text-gray-600">Je n'ai pas encore de site internet</p>
                </div>
              </label>
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#0073a8] transition-colors">
                <input
                  type="radio"
                  name="typeProjet"
                  value="remplacement"
                  checked={formData.typeProjet === 'remplacement'}
                  onChange={(e) => setFormData({...formData, typeProjet: e.target.value})}
                  className="w-4 h-4 text-[#0073a8] focus:ring-[#0073a8]"
                />
                <div className="ml-3">
                  <span className="font-medium">Remplacer un site existant</span>
                  <p className="text-sm text-gray-600">J'ai déjà un site à refaire</p>
                </div>
              </label>
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#0073a8] transition-colors">
                <input
                  type="radio"
                  name="typeProjet"
                  value="client-existant"
                  checked={formData.typeProjet === 'client-existant'}
                  onChange={(e) => setFormData({...formData, typeProjet: e.target.value})}
                  className="w-4 h-4 text-[#0073a8] focus:ring-[#0073a8]"
                />
                <div className="ml-3">
                  <span className="font-medium">Je suis déjà client</span>
                  <p className="text-sm text-gray-600">Rajouter des options à mon site actuel</p>
                </div>
              </label>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Vos informations</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom et Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={`${formData.prenom} ${formData.nom}`.trim()}
                  onChange={(e) => {
                    const parts = e.target.value.split(' ')
                    if (parts.length >= 2) {
                      setFormData({
                        ...formData,
                        prenom: parts[0],
                        nom: parts.slice(1).join(' ')
                      })
                    } else {
                      setFormData({
                        ...formData,
                        prenom: parts[0] || '',
                        nom: ''
                      })
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entreprise
                </label>
                <input
                  type="text"
                  value={formData.entreprise}
                  onChange={(e) => setFormData({...formData, entreprise: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site web actuel
                </label>
                <input
                  type="url"
                  placeholder="https://www.mon-site.fr"
                  value={formData.siteActuel}
                  onChange={(e) => setFormData({...formData, siteActuel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <input
                  type="text"
                  value={formData.codePostal}
                  onChange={(e) => setFormData({...formData, codePostal: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  value={formData.ville}
                  onChange={(e) => setFormData({...formData, ville: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                />
              </div>
            </div>
          </div>

          {/* Prestations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Vos besoins</h2>
            
            {/* Formule de base */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <label className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.siteWeb}
                    onChange={(e) => setFormData({...formData, siteWeb: e.target.checked})}
                    className="w-5 h-5 text-[#0073a8] rounded focus:ring-[#0073a8]"
                  />
                  <div className="ml-3">
                    <span className="font-semibold text-lg">{tarifs.formuleBase.nom}</span>
                    <p className="text-sm text-gray-600 mt-1">{tarifs.formuleBase.description}</p>
                  </div>
                </div>
                <span className="text-[#0073a8] font-bold text-xl ml-4">{tarifs.formuleBase.prix}€</span>
              </label>
            </div>

            {/* Options */}
            <h3 className="font-semibold text-lg mb-4">Options supplémentaires</h3>
            <div className="space-y-3">
              {tarifs.options.map((option) => (
                <div key={option.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="font-medium">{option.nom}</span>
                      {option.description && (
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#0073a8] font-semibold whitespace-nowrap">
                        {option.prix}€ {option.unite || ''}
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={formData.options[option.id] || 0}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0
                          setFormData({
                            ...formData,
                            options: {
                              ...formData.options,
                              [option.id]: value
                            }
                          })
                        }}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description du projet */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Votre projet</h2>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Décrivez votre projet, vos besoins, vos questions...
            </label>
            <textarea
              rows={6}
              value={formData.commentaire}
              onChange={(e) => setFormData({...formData, commentaire: e.target.value})}
              placeholder="Parlez-nous de votre projet : objectifs, cible, fonctionnalités souhaitées, design préféré, délais..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
            />
          </div>

          {/* Code promo et total */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code promo
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.codePromo}
                    onChange={(e) => setFormData({...formData, codePromo: e.target.value.toUpperCase()})}
                    placeholder="Entrez votre code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                  />
                  <button
                    type="button"
                    onClick={verifyPromoCode}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Vérifier
                  </button>
                </div>
                {promoInfo && (
                  <p className="text-green-600 text-sm mt-1">
                    ✔ {promoInfo.description}
                  </p>
                )}
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-600">Total estimé</p>
                <p className="text-3xl font-bold text-[#0073a8]">{total}€ HT</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#0073a8] hover:bg-[#005580] transform hover:scale-[1.02]'
              }`}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer ma demande de devis'}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Vous recevrez votre devis par email dans les plus brefs délais
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}