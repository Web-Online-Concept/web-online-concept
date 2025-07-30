'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function AdminAffilies() {
  const [affilies, setAffilies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' ou 'edit'
  const [selectedAffilie, setSelectedAffilie] = useState(null)
  const [showCommissions, setShowCommissions] = useState(null)
  
  // Formulaire affilié
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    prenom: '',
    societe: '',
    email: '',
    telephone: '',
    rib: '',
    infos: ''
  })

  // Charger les affiliés
  useEffect(() => {
    loadAffilies()
  }, [])

  const loadAffilies = async () => {
    try {
      const response = await fetch('/api/admin/affilies')
      const data = await response.json()
      setAffilies(data.affilies || [])
    } catch (error) {
      console.error('Erreur chargement affiliés:', error)
    } finally {
      setLoading(false)
    }
  }

  // Ouvrir le modal pour créer
  const handleCreate = () => {
    setModalMode('create')
    setFormData({
      code: '',
      nom: '',
      prenom: '',
      societe: '',
      email: '',
      telephone: '',
      rib: '',
      infos: ''
    })
    setShowModal(true)
  }

  // Ouvrir le modal pour éditer
  const handleEdit = (affilie) => {
    setModalMode('edit')
    setSelectedAffilie(affilie)
    setFormData({
      code: affilie.code,
      nom: affilie.nom,
      prenom: affilie.prenom,
      societe: affilie.societe,
      email: affilie.email,
      telephone: affilie.telephone || '',
      rib: affilie.rib,
      infos: affilie.infos || ''
    })
    setShowModal(true)
  }

  // Sauvegarder l'affilié
  const handleSave = async (e) => {
    e.preventDefault()
    
    try {
      const url = '/api/admin/affilies'
      const method = modalMode === 'create' ? 'POST' : 'PATCH'
      const body = modalMode === 'create' 
        ? formData 
        : { ...formData, id: selectedAffilie.id }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        setShowModal(false)
        loadAffilies()
      } else {
        const error = await response.json()
        alert(error.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  // Désactiver un affilié
  const handleToggleActive = async (affilie) => {
    try {
      const response = await fetch('/api/admin/affilies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: affilie.id,
          actif: !affilie.actif
        })
      })

      if (response.ok) {
        loadAffilies()
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Marquer une commission comme payée
  const handleMarkPaid = async (affilieId, devisId) => {
    try {
      // Cette fonctionnalité nécessite une API supplémentaire
      // Pour l'instant, on affiche juste un message
      alert('Fonctionnalité à implémenter : marquer la commission comme payée')
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Statistiques
  const stats = {
    total: affilies.length,
    actifs: affilies.filter(a => a.actif).length,
    commissions_dues: affilies.reduce((sum, a) => sum + (a.total_du || 0), 0),
    commissions_payees: affilies.reduce((sum, a) => sum + (a.total_paye || 0), 0)
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-[100px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-[100px]">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Gestion des Affiliés
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Gérez vos partenaires et leurs commissions
                  </p>
                </div>
                <button
                  onClick={handleCreate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Nouvel affilié
                </button>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total affiliés
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {stats.total}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-green-100 rounded-full">
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Affiliés actifs
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {stats.actifs}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Commissions dues
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {stats.commissions_dues}€
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Commissions payées
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {stats.commissions_payees}€
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des affiliés */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Affilié
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ventes
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commissions
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {affilies.map((affilie) => (
                      <tr key={affilie.id} className={!affilie.actif ? 'bg-gray-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {affilie.prenom} {affilie.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {affilie.societe}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {affilie.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{affilie.email}</div>
                          {affilie.telephone && (
                            <div className="text-sm text-gray-500">{affilie.telephone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm text-gray-900">
                            {affilie.nombre_ventes || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm">
                            <div className="text-gray-900 font-medium">
                              {affilie.total_du || 0}€ dus
                            </div>
                            <div className="text-gray-500">
                              {affilie.total_paye || 0}€ payés
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleToggleActive(affilie)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              affilie.actif
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {affilie.actif ? 'Actif' : 'Inactif'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setShowCommissions(showCommissions === affilie.id ? null : affilie.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            {showCommissions === affilie.id ? 'Masquer' : 'Commissions'}
                          </button>
                          <button
                            onClick={() => handleEdit(affilie)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Modifier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Détail des commissions */}
              {affilies.map((affilie) => (
                showCommissions === affilie.id && affilie.commissions && affilie.commissions.length > 0 && (
                  <div key={`comm-${affilie.id}`} className="mt-4 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Détail des commissions - {affilie.prenom} {affilie.nom}
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Devis
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Client
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Date
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                              Montant facture
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                              Commission (10%)
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                              Statut
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {affilie.commissions.map((comm) => (
                            <tr key={comm.devis_id}>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {comm.devis_id}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {comm.client}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-500">
                                {new Date(comm.date).toLocaleDateString('fr-FR')}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900 text-right">
                                {comm.montant_facture}€
                              </td>
                              <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                                {comm.commission}€
                              </td>
                              <td className="px-4 py-2 text-center">
                                {comm.paye ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Payée
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleMarkPaid(affilie.id, comm.devis_id)}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                  >
                                    Marquer payée
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {affilie.rib && (
                      <div className="mt-3 p-3 bg-blue-50 rounded">
                        <p className="text-sm">
                          <strong>RIB pour virement :</strong> {affilie.rib}
                        </p>
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Modal Création/Édition */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <form onSubmit={handleSave}>
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">
                    {modalMode === 'create' ? 'Nouvel affilié' : 'Modifier l\'affilié'}
                  </h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        value={formData.prenom}
                        onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom *
                      </label>
                      <input
                        type="text"
                        value={formData.nom}
                        onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code affilié *
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 uppercase"
                      placeholder="Ex: PROMO30"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ce code donnera -30% au client, vous toucherez 10% du total
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Société
                    </label>
                    <input
                      type="text"
                      value={formData.societe}
                      onChange={(e) => setFormData({...formData, societe: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RIB (pour les virements)
                    </label>
                    <input
                      type="text"
                      value={formData.rib}
                      onChange={(e) => setFormData({...formData, rib: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="FR76 ..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes / Informations
                    </label>
                    <textarea
                      value={formData.infos}
                      onChange={(e) => setFormData({...formData, infos: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Informations complémentaires..."
                    />
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    {modalMode === 'create' ? 'Créer' : 'Enregistrer'}
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