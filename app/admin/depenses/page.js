"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function Depenses() {
  const [depenses, setDepenses] = useState([])
  const [categories, setCategories] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDepense, setEditingDepense] = useState(null)
  const [filterMonth, setFilterMonth] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterType, setFilterType] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Formulaire
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    categorie: '',
    montant: '',
    tva: 20,
    fournisseur: '',
    numeroFacture: '',
    modePaiement: 'virement',
    notes: '',
    clientId: '',
    type: 'entreprise' // 'entreprise' ou 'client'
  })

  // Catégories par défaut
  const defaultCategories = [
    { id: 'hebergement', nom: 'Hébergement & Domaines', icon: '🌐' },
    { id: 'logiciels', nom: 'Logiciels & Abonnements', icon: '💻' },
    { id: 'materiel', nom: 'Matériel informatique', icon: '🖥️' },
    { id: 'formation', nom: 'Formation', icon: '🎓' },
    { id: 'marketing', nom: 'Marketing & Publicité', icon: '📣' },
    { id: 'comptable', nom: 'Frais comptables', icon: '📊' },
    { id: 'bancaire', nom: 'Frais bancaires', icon: '🏦' },
    { id: 'bureau', nom: 'Fournitures bureau', icon: '📎' },
    { id: 'transport', nom: 'Transport & Déplacements', icon: '🚗' },
    { id: 'autres', nom: 'Autres', icon: '📦' }
  ]

  // Charger les données
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/depenses')
      const data = await response.json()
      setDepenses(data.depenses || [])
      setCategories(data.categories || defaultCategories)
      
      // Charger aussi les clients
      const clientsResponse = await fetch('/api/admin/crm')
      const clientsData = await clientsResponse.json()
      setClients(clientsData)
      
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      setCategories(defaultCategories)
      setLoading(false)
    }
  }

  // Ajouter/Modifier une dépense
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const method = editingDepense ? 'PUT' : 'POST'
      const body = editingDepense 
        ? { id: editingDepense.id, ...formData }
        : formData
      
      const response = await fetch('/api/admin/depenses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      if (response.ok) {
        await fetchData()
        resetForm()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Supprimer une dépense
  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) return
    
    try {
      const response = await fetch('/api/admin/depenses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      
      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      categorie: '',
      montant: '',
      tva: 20,
      fournisseur: '',
      numeroFacture: '',
      modePaiement: 'virement',
      notes: '',
      clientId: '',
      type: 'entreprise'
    })
    setShowAddForm(false)
    setEditingDepense(null)
  }

  // Éditer une dépense
  const handleEdit = (depense) => {
    setEditingDepense(depense)
    setFormData({
      date: depense.date,
      description: depense.description,
      categorie: depense.categorie,
      montant: depense.montant,
      tva: depense.tva || 20,
      fournisseur: depense.fournisseur || '',
      numeroFacture: depense.numeroFacture || '',
      modePaiement: depense.modePaiement || 'virement',
      notes: depense.notes || '',
      clientId: depense.clientId || '',
      type: depense.type || 'entreprise'
    })
    setShowAddForm(true)
  }

  // Filtrer les dépenses
  const getFilteredDepenses = () => {
    return depenses.filter(depense => {
      const matchesMonth = !filterMonth || depense.date.startsWith(filterMonth)
      const matchesCategory = !filterCategory || depense.categorie === filterCategory
      const matchesType = !filterType || 
        (filterType === 'entreprise' && depense.type !== 'client') ||
        (filterType === 'client' && depense.type === 'client')
      const matchesSearch = !searchTerm || 
        depense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        depense.fournisseur?.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesMonth && matchesCategory && matchesType && matchesSearch
    })
  }

  // Calculer les statistiques
  const getStats = () => {
    const filtered = getFilteredDepenses()
    const total = filtered.reduce((sum, d) => sum + parseFloat(d.montant || 0), 0)
    const totalTVA = filtered.reduce((sum, d) => {
      const montantHT = parseFloat(d.montant || 0) / (1 + (d.tva || 20) / 100)
      return sum + (parseFloat(d.montant || 0) - montantHT)
    }, 0)
    
    // Répartition par catégorie
    const parCategorie = {}
    filtered.forEach(d => {
      if (!parCategorie[d.categorie]) {
        parCategorie[d.categorie] = 0
      }
      parCategorie[d.categorie] += parseFloat(d.montant || 0)
    })
    
    return { total, totalTVA, parCategorie }
  }

  // Obtenir l'icône de la catégorie
  const getCategoryIcon = (catId) => {
    const cat = categories.find(c => c.id === catId)
    return cat?.icon || '📦'
  }

  // Obtenir le nom de la catégorie
  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId)
    return cat?.nom || catId
  }

  // Formater les montants
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0)
  }

  // Générer les options de mois
  const getMonthOptions = () => {
    const months = new Set()
    depenses.forEach(d => {
      months.add(d.date.substring(0, 7))
    })
    return Array.from(months).sort((a, b) => b.localeCompare(a))
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
                  💸 Gestion des Dépenses
                </span>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                {showAddForm ? '✕ Fermer' : '+ Nouvelle dépense'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Titre */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Suivi des Dépenses
            </h1>
            <p className="text-gray-600">
              Gérez toutes vos charges et dépenses professionnelles
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total TTC</span>
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {formatMoney(stats.total)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {getFilteredDepenses().length} dépense{getFilteredDepenses().length > 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">TVA récupérable</span>
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {formatMoney(stats.totalTVA)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Sur les dépenses filtrées
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Catégorie principale</span>
                <span className="text-2xl">📈</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {Object.entries(stats.parCategorie).length > 0 
                  ? getCategoryName(
                      Object.entries(stats.parCategorie).reduce((a, b) => 
                        b[1] > a[1] ? b : a
                      )[0]
                    )
                  : 'Aucune'
                }
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Plus grosse dépense
              </p>
            </div>
          </div>

          {/* Formulaire d'ajout/édition */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingDepense ? 'Modifier la dépense' : 'Nouvelle dépense'}
              </h2>
              
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de dépense *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="entreprise"
                        checked={formData.type === 'entreprise'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value, clientId: '' })}
                        className="mr-2"
                      />
                      <span className="text-sm">💼 Dépense entreprise</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="client"
                        checked={formData.type === 'client'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="mr-2"
                      />
                      <span className="text-sm">👥 Dépense client</span>
                    </label>
                  </div>
                </div>
                
                {formData.type === 'client' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client associé *
                    </label>
                    <select
                      value={formData.clientId}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      required={formData.type === 'client'}
                    >
                      <option value="">Sélectionner un client...</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.entreprise}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={formData.categorie}
                    onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    required
                  >
                    <option value="">Sélectionner...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.nom}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    placeholder="Ex: Abonnement mensuel OVH"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant TTC (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.montant}
                    onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    TVA (%)
                  </label>
                  <select
                    value={formData.tva}
                    onChange={(e) => setFormData({ ...formData, tva: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                  >
                    <option value="0">0%</option>
                    <option value="5.5">5.5%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fournisseur
                  </label>
                  <input
                    type="text"
                    value={formData.fournisseur}
                    onChange={(e) => setFormData({ ...formData, fournisseur: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    placeholder="Nom du fournisseur"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    N° Facture
                  </label>
                  <input
                    type="text"
                    value={formData.numeroFacture}
                    onChange={(e) => setFormData({ ...formData, numeroFacture: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    placeholder="Référence facture"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mode de paiement
                  </label>
                  <select
                    value={formData.modePaiement}
                    onChange={(e) => setFormData({ ...formData, modePaiement: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                  >
                    <option value="virement">Virement</option>
                    <option value="cb">Carte bancaire</option>
                    <option value="prelevement">Prélèvement</option>
                    <option value="cheque">Chèque</option>
                    <option value="especes">Espèces</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    rows="2"
                    placeholder="Informations complémentaires..."
                  />
                </div>
                
                <div className="md:col-span-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0073a8] text-white rounded-lg hover:bg-[#006a87] transition-colors"
                  >
                    {editingDepense ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filtres */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher..."
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
                <option value="">Tous types</option>
                <option value="entreprise">Dépenses entreprise</option>
                <option value="client">Dépenses client</option>
              </select>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
              >
                <option value="">Tous les mois</option>
                {getMonthOptions().map(month => (
                  <option key={month} value={month}>
                    {new Date(month + '-01').toLocaleDateString('fr-FR', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </option>
                ))}
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
              >
                <option value="">Toutes catégories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Liste des dépenses */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fournisseur
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant TTC
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredDepenses().map((depense) => (
                    <tr key={depense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(depense.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">
                          {depense.description}
                        </div>
                        {depense.numeroFacture && (
                          <div className="text-xs text-gray-500">
                            N° {depense.numeroFacture}
                          </div>
                        )}
                        {depense.type === 'client' && depense.clientId && (
                          <div className="text-xs text-blue-600 mt-1">
                            👥 Client: {clients.find(c => c.id === depense.clientId)?.entreprise || depense.clientId}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          <span className="text-base">{getCategoryIcon(depense.categorie)}</span>
                          {getCategoryName(depense.categorie)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {depense.fournisseur || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600 text-right">
                        {formatMoney(depense.montant)}
                        {depense.tva > 0 && (
                          <div className="text-xs text-gray-500 font-normal">
                            TVA {depense.tva}%
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(depense)}
                            className="text-[#0073a8] hover:text-[#006a87]"
                            title="Modifier"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(depense.id)}
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
              
              {getFilteredDepenses().length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucune dépense trouvée</p>
                </div>
              )}
            </div>
          </div>

          {/* Répartition par catégorie */}
          {Object.keys(stats.parCategorie).length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Répartition par catégorie
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.parCategorie)
                  .sort((a, b) => b[1] - a[1])
                  .map(([catId, montant]) => (
                    <div key={catId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCategoryIcon(catId)}</span>
                        <span className="font-medium text-gray-900">
                          {getCategoryName(catId)}
                        </span>
                      </div>
                      <span className="font-semibold text-red-600">
                        {formatMoney(montant)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  )
}