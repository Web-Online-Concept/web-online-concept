'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function AdminDevis() {
  const [devis, setDevis] = useState([])
  const [filteredDevis, setFilteredDevis] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('tous')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDevis, setSelectedDevis] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [showRefusModal, setShowRefusModal] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const [refusRaison, setRefusRaison] = useState('')
  const [refusCommentaire, setRefusCommentaire] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  
  // Raisons de refus prédéfinies
  const raisonsRefus = [
    { value: 'arnaque', label: '🚫 Arnaque / Spam' },
    { value: 'test', label: '🎭 Test / Farce' },
    { value: 'hors_perimetre', label: '📏 Hors périmètre' },
    { value: 'budget', label: '💰 Budget insuffisant' },
    { value: 'concurrent', label: '🏢 Parti chez un concurrent' },
    { value: 'abandon', label: '🚪 Abandon du projet' },
    { value: 'autre', label: '📝 Autre raison' }
  ]
  
  // Statistiques
  const [stats, setStats] = useState({
    total: 0,
    parStatut: {},
    montantTotal: 0,
    montantAccepte: 0,
    montantEnAttente: 0,
    montantEnCours: 0,
    tauxConversion: 0,
    tauxRefus: {},
    raisonsRefus: {}
  })
  
  useEffect(() => {
    loadDevis()
  }, [])
  
  useEffect(() => {
    filterDevis()
  }, [devis, activeTab, searchTerm])
  
  const loadDevis = async () => {
    try {
      const response = await fetch('/api/admin/devis')
      const data = await response.json()
      setDevis(data.devis || [])
      setStats(data.stats || {})
    } catch (error) {
      console.error('Erreur chargement devis:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const filterDevis = () => {
    let filtered = [...devis]
    
    // Filtrer par statut
    if (activeTab !== 'tous') {
      filtered = filtered.filter(d => d.statut === activeTab)
    }
    
    // Filtrer par recherche
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(d => 
        d.id.toLowerCase().includes(search) ||
        d.client.nom.toLowerCase().includes(search) ||
        d.client.email.toLowerCase().includes(search) ||
        (d.client.entreprise && d.client.entreprise.toLowerCase().includes(search))
      )
    }
    
    // Trier par date décroissante
    filtered.sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation))
    
    setFilteredDevis(filtered)
  }
  
  const handleValidate = async () => {
    if (!selectedDevis) return
    
    setSendingEmail(true)
    
    try {
      // 1. Mettre à jour le statut
      const response = await fetch('/api/admin/devis', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedDevis.id,
          action: 'valider',
          details: validationMessage
        })
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la validation')
      }
      
      // 2. Envoyer l'email au client
      const emailResponse = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          data: {
            to: selectedDevis.client.email,
            template: 'devis_valide',
            variables: {
              ...selectedDevis,
              lienDevis: `${window.location.origin}/devis/${selectedDevis.token}`,
              messagePersonnalise: validationMessage
            }
          }
        })
      })
      
      if (!emailResponse.ok) {
        console.error('Erreur envoi email')
      }
      
      alert('Devis validé et envoyé au client avec succès !')
      setShowValidationModal(false)
      setValidationMessage('')
      setSelectedDevis(null)
      
      // Recharger les devis
      await loadDevis()
      
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'envoi. Le devis a été validé mais l\'email n\'a pas pu être envoyé.')
    } finally {
      setSendingEmail(false)
    }
  }
  
  const handleRefuser = async () => {
    if (!selectedDevis || !refusRaison) {
      alert('Veuillez sélectionner une raison de refus')
      return
    }
    
    setSendingEmail(true)
    
    try {
      // 1. Mettre à jour le statut
      const response = await fetch('/api/admin/devis', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedDevis.id,
          action: 'refuser',
          motif: refusRaison,
          details: refusCommentaire || `Refusé pour : ${raisonsRefus.find(r => r.value === refusRaison)?.label}`
        })
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors du refus')
      }
      
      // 2. Préparer le message personnalisé selon la raison
      let messagePersonnalise = ''
      switch(refusRaison) {
        case 'arnaque':
          messagePersonnalise = 'Votre demande ne correspond pas à nos critères de projets professionnels.'
          break
        case 'test':
          messagePersonnalise = 'Votre demande semble être un test et non un projet réel.'
          break
        case 'hors_perimetre':
          messagePersonnalise = 'Votre projet sort du cadre de nos compétences ou de nos services habituels.'
          break
        case 'budget':
          messagePersonnalise = 'Le budget alloué ne permet pas de réaliser le projet dans les conditions souhaitées.'
          break
        case 'concurrent':
          messagePersonnalise = 'Nous comprenons que vous ayez choisi un autre prestataire pour votre projet.'
          break
        case 'abandon':
          messagePersonnalise = 'Nous comprenons que votre projet soit reporté ou annulé.'
          break
        default:
          messagePersonnalise = refusCommentaire || 'Malheureusement, nous ne pouvons pas réaliser votre projet.'
      }
      
      // Ajouter le commentaire personnalisé si présent
      if (refusCommentaire && refusRaison !== 'autre') {
        messagePersonnalise += '\n\n' + refusCommentaire
      }
      
      // 3. Envoyer l'email au client
      const emailResponse = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          data: {
            to: selectedDevis.client.email,
            template: 'devis_refuse',
            variables: {
              ...selectedDevis,
              message_perso: messagePersonnalise
            }
          }
        })
      })
      
      if (!emailResponse.ok) {
        console.error('Erreur envoi email de refus')
      }
      
      alert('Devis refusé et client notifié par email')
      setShowRefusModal(false)
      setRefusRaison('')
      setRefusCommentaire('')
      setSelectedDevis(null)
      await loadDevis()
      
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors du refus du devis')
    } finally {
      setSendingEmail(false)
    }
  }
  
  const handleAccepter = async (devisId) => {
    if (!confirm('Marquer ce devis comme accepté ?')) return
    
    try {
      const response = await fetch('/api/admin/devis', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: devisId,
          action: 'accepter',
          details: 'Accepté depuis l\'administration'
        })
      })
      
      if (response.ok) {
        alert('Devis marqué comme accepté')
        await loadDevis()
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'acceptation')
    }
  }
  
  const handleDuplicate = async (devisId) => {
    try {
      const response = await fetch('/api/admin/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'duplicate',
          devisId: devisId
        })
      })
      
      if (response.ok) {
        await loadDevis()
        alert('Devis dupliqué avec succès')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la duplication')
    }
  }
  
  const handleDelete = async (devisId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) return
    
    try {
      const response = await fetch(`/api/admin/devis?id=${devisId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await loadDevis()
        alert('Devis supprimé avec succès')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }
  
  const copyDevisLink = (token) => {
    const link = `${window.location.origin}/devis/${token}`
    navigator.clipboard.writeText(link)
    alert('Lien copié dans le presse-papier !')
  }
  
  const getStatusBadge = (statut) => {
    const badges = {
      brouillon: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '📝' },
      en_attente: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
      consulte: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '👁️' },
      valide: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '📧' },
      accepte: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅' },
      refuse_admin: { bg: 'bg-red-100', text: 'text-red-800', icon: '🚫' },
      refuse_client: { bg: 'bg-orange-100', text: 'text-orange-800', icon: '👎' },
      expire: { bg: 'bg-gray-400', text: 'text-gray-800', icon: '⏰' },
      termine: { bg: 'bg-purple-100', text: 'text-purple-800', icon: '🎉' }
    }
    
    const badge = badges[statut] || badges.brouillon
    const labels = {
      brouillon: 'Brouillon',
      en_attente: 'En attente',
      consulte: 'Consulté',
      valide: 'Envoyé',
      accepte: 'Accepté',
      refuse_admin: 'Refusé (admin)',
      refuse_client: 'Refusé (client)',
      expire: 'Expiré',
      termine: 'Terminé'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <span className="mr-1">{badge.icon}</span>
        {labels[statut] || statut}
      </span>
    )
  }
  
  const getPaymentBadge = (statutPaiement) => {
    const badges = {
      en_attente: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'En attente' },
      acompte_paye: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Acompte payé' },
      paye: { bg: 'bg-green-100', text: 'text-green-800', label: 'Payé' }
    }
    
    const badge = badges[statutPaiement] || badges.en_attente
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    )
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(montant)
  }
  
  // Obtenir le type de projet formaté
  const getTypeProjet = (projet) => {
    if (projet.type === 'site_web_pro') {
      return `Site Web Pro (${projet.nb_pages_total || projet.nb_pages || 5} pages)`
    }
    // Ancien système
    const types = {
      'vitrine': 'Site Vitrine',
      'catalogue': 'Site Catalogue',
      'ecommerce': 'Site E-commerce'
    }
    return types[projet.type_site] || 'Site Web'
  }
  
  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50 pt-[100px]">
        {/* Header Admin */}
        <div className="bg-[#0073a8] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/admin" className="text-white hover:text-gray-200 mr-4">
                  ← Retour
                </Link>
                <span className="text-lg font-semibold">
                  📋 Gestion des Devis
                </span>
              </div>
              <Link
                href="/demande-devis"
                target="_blank"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
              >
                Voir le formulaire public
              </Link>
            </div>
          </div>
        </div>
        
        {/* Statistiques */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total devis</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <span className="text-3xl">📊</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Acceptés</p>
                  <p className="text-2xl font-bold text-green-600">{stats.parStatut?.accepte || 0}</p>
                </div>
                <span className="text-3xl">✅</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux conversion</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.tauxConversion || 0}%</p>
                </div>
                <span className="text-3xl">📈</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En cours</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatMontant(stats.montantEnCours || 0)}
                  </p>
                </div>
                <span className="text-3xl">🚧</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">CA réalisé</p>
                  <p className="text-2xl font-bold text-[#0073a8]">
                    {formatMontant(stats.montantAccepte || 0)}
                  </p>
                </div>
                <span className="text-3xl">💰</span>
              </div>
            </div>
          </div>
          
          {/* Filtres et recherche */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'tous', label: 'Tous', count: stats.total },
                    { id: 'brouillon', label: 'Brouillons', count: stats.parStatut?.brouillon || 0 },
                    { id: 'en_attente', label: 'En attente', count: stats.parStatut?.en_attente || 0 },
                    { id: 'valide', label: 'Envoyés', count: stats.parStatut?.valide || 0 },
                    { id: 'consulte', label: 'Consultés', count: stats.parStatut?.consulte || 0 },
                    { id: 'accepte', label: 'Acceptés', count: stats.parStatut?.accepte || 0 },
                    { id: 'refuse_admin', label: 'Refusés (admin)', count: stats.parStatut?.refuse_admin || 0 },
                    { id: 'refuse_client', label: 'Refusés (client)', count: stats.parStatut?.refuse_client || 0 },
                    { id: 'expire', label: 'Expirés', count: stats.parStatut?.expire || 0 },
                    { id: 'termine', label: 'Terminés', count: stats.parStatut?.termine || 0 }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[#0073a8] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tab.label}
                      {tab.count > 0 && (
                        <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Recherche */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
              </div>
            </div>
            
            {/* Liste des devis */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  Chargement...
                </div>
              ) : filteredDevis.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Aucun devis trouvé
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Numéro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paiement
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDevis.map((devis, index) => (
                      <tr key={`${devis.id}-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {devis.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(devis.date_creation)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {devis.client.entreprise || `${devis.client.prenom} ${devis.client.nom}`}
                            </div>
                            <div className="text-gray-500">{devis.client.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getTypeProjet(devis.projet)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatMontant(devis.montants.ttc)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(devis.statut)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPaymentBadge(devis.statut_paiement)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedDevis(devis)
                                setShowDetailModal(true)
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="Voir détails"
                            >
                              👁️
                            </button>
                            
                            {/* Boutons pour brouillon et en_attente */}
                            {(devis.statut === 'brouillon' || devis.statut === 'en_attente') && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedDevis(devis)
                                    setShowValidationModal(true)
                                  }}
                                  className="text-green-600 hover:text-green-900"
                                  title="Valider et envoyer"
                                >
                                  ✉️
                                </button>
                                <button
                                  onClick={() => handleAccepter(devis.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Marquer comme accepté"
                                >
                                  ✅
                                </button>
                              </>
                            )}
                            
                            {/* Boutons pour valide et consulte */}
                            {(devis.statut === 'valide' || devis.statut === 'consulte') && (
                              <>
                                <button
                                  onClick={() => copyDevisLink(devis.token)}
                                  className="text-purple-600 hover:text-purple-900"
                                  title="Copier le lien"
                                >
                                  🔗
                                </button>
                                <button
                                  onClick={() => handleAccepter(devis.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Marquer comme accepté"
                                >
                                  ✅
                                </button>
                              </>
                            )}
                            
                            {/* Bouton refuser pour tous sauf accepte, refuse et expire */}
                            {devis.statut !== 'accepte' && !devis.statut.startsWith('refuse') && devis.statut !== 'expire' && devis.statut !== 'termine' && (
                              <button
                                onClick={() => {
                                  setSelectedDevis(devis)
                                  setShowRefusModal(true)
                                }}
                                className="text-red-600 hover:text-red-900"
                                title="Refuser"
                              >
                                ❌
                              </button>
                            )}
                            
                            {/* Bouton dupliquer toujours visible */}
                            <button
                              onClick={() => handleDuplicate(devis.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Dupliquer"
                            >
                              📋
                            </button>
                            
                            {/* Bouton supprimer pour refuse et expire */}
                            {(devis.statut.startsWith('refuse') || devis.statut === 'expire') && (
                              <button
                                onClick={() => handleDelete(devis.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Supprimer"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        
        {/* Modal Détails */}
        {showDetailModal && selectedDevis && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  Détails du devis {selectedDevis.id}
                </h2>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedDevis(null)
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Infos client */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Informations client</h3>
                  <div className="bg-gray-50 rounded-lg p-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Type :</span>
                      <p className="font-medium">{selectedDevis.client.type}</p>
                    </div>
                    {selectedDevis.client.entreprise && (
                      <div>
                        <span className="text-sm text-gray-600">Entreprise :</span>
                        <p className="font-medium">{selectedDevis.client.entreprise}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">Contact :</span>
                      <p className="font-medium">
                        {selectedDevis.client.prenom} {selectedDevis.client.nom}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Email :</span>
                      <p className="font-medium">{selectedDevis.client.email}</p>
                    </div>
                    {selectedDevis.client.telephone && (
                      <div>
                        <span className="text-sm text-gray-600">Téléphone :</span>
                        <p className="font-medium">{selectedDevis.client.telephone}</p>
                      </div>
                    )}
                    {selectedDevis.client.adresse && (
                      <div className="md:col-span-2">
                        <span className="text-sm text-gray-600">Adresse :</span>
                        <p className="font-medium">
                          {selectedDevis.client.adresse}
                          {selectedDevis.client.code_postal && `, ${selectedDevis.client.code_postal}`}
                          {selectedDevis.client.ville && ` ${selectedDevis.client.ville}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Détails du projet */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Détails du projet</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Type de site :</span>
                      <p className="font-medium">{getTypeProjet(selectedDevis.projet)}</p>
                    </div>
                    
                    {selectedDevis.projet.options && selectedDevis.projet.options.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">Options :</span>
                        <ul className="mt-1">
                          {selectedDevis.projet.options.map((option, idx) => {
                            const optionLabels = {
                              pack_images: '📸 Pack images/vidéos professionnelles',
                              maintenance: '🛠️ Forfait Maintenance',
                              redaction: '✍️ Rédaction complète',
                              back_office: '💼 Back Office'
                            }
                            return (
                              <li key={idx} className="text-sm">
                                • {optionLabels[option] || option}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )}
                    
                    {selectedDevis.projet.description && (
                      <div>
                        <span className="text-sm text-gray-600">Description :</span>
                        <p className="mt-1 whitespace-pre-wrap">{selectedDevis.projet.description}</p>
                      </div>
                    )}
                    
                    {selectedDevis.code_affilie && (
                      <div>
                        <span className="text-sm text-gray-600">Code affilié utilisé :</span>
                        <p className="font-medium">
                          {selectedDevis.code_affilie} 
                          <span className="text-green-600 ml-2">(-{selectedDevis.reduction_affilie}%)</span>
                        </p>
                      </div>
                    )}
                    
                    <div className="border-t pt-3 space-y-2">
                      {selectedDevis.montants.details && selectedDevis.montants.details.map((detail, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{detail.libelle}</span>
                          <span>{formatMontant(detail.prix)}</span>
                        </div>
                      ))}
                      {selectedDevis.montants.reduction > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Réduction affilié</span>
                          <span>-{formatMontant(selectedDevis.montants.reduction)}</span>
                        </div>
                      )}
                      <div className="border-t pt-2">
                        <div className="flex justify-between">
                          <span>Total HT</span>
                          <span className="font-medium">{formatMontant(selectedDevis.montants.ht)}</span>
                        </div>
                        {selectedDevis.montants.tva > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>TVA (20%)</span>
                            <span>{formatMontant(selectedDevis.montants.tva)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold text-[#0073a8]">
                          <span>Total TTC</span>
                          <span>{formatMontant(selectedDevis.montants.ttc)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Historique */}
                {selectedDevis.historique && selectedDevis.historique.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Historique</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2">
                        {selectedDevis.historique.map((hist, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <span className="text-gray-400 text-sm">
                              {formatDate(hist.date)}
                            </span>
                            <div>
                              <span className="font-medium text-sm">{hist.action}</span>
                              {hist.details && (
                                <p className="text-sm text-gray-600">{hist.details}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Informations techniques */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Informations techniques</h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                    <p><span className="text-gray-600">Token :</span> <code className="bg-gray-200 px-1 rounded">{selectedDevis.token}</code></p>
                    {selectedDevis.date_signature_cgv && (
                      <p><span className="text-gray-600">CGV signées :</span> ✅ Le {formatDate(selectedDevis.date_signature_cgv)} par {selectedDevis.signature_nom}</p>
                    )}
                    <p className="text-yellow-600 font-medium mt-2">⚠️ Validité : 8 jours maximum</p>
                    {selectedDevis.date_consultation && (
                      <p><span className="text-gray-600">Première consultation :</span> {formatDate(selectedDevis.date_consultation)}</p>
                    )}
                    {selectedDevis.date_acceptation && (
                      <p><span className="text-gray-600">Date d'acceptation :</span> {formatDate(selectedDevis.date_acceptation)}</p>
                    )}
                    {selectedDevis.date_refus && (
                      <p><span className="text-gray-600">Date de refus :</span> {formatDate(selectedDevis.date_refus)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal Validation */}
        {showValidationModal && selectedDevis && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">
                  Valider et envoyer le devis
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm">
                    Vous êtes sur le point d'envoyer le devis <strong>{selectedDevis.id}</strong> à{' '}
                    <strong>{selectedDevis.client.email}</strong>
                  </p>
                  <p className="text-sm mt-2">
                    Montant : <strong>{formatMontant(selectedDevis.montants.ttc)}</strong>
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message personnalisé (optionnel)
                  </label>
                  <textarea
                    value={validationMessage}
                    onChange={(e) => setValidationMessage(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                    placeholder="Ajoutez un message personnalisé qui sera inclus dans l'email..."
                  />
                </div>
              </div>
              
              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowValidationModal(false)
                    setValidationMessage('')
                    setSelectedDevis(null)
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={sendingEmail}
                >
                  Annuler
                </button>
                <button
                  onClick={handleValidate}
                  disabled={sendingEmail}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {sendingEmail ? 'Envoi en cours...' : 'Valider et envoyer'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal Refus */}
        {showRefusModal && selectedDevis && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-red-600">
                  Refuser le devis
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm">
                    Vous êtes sur le point de refuser le devis <strong>{selectedDevis.id}</strong>
                  </p>
                  <p className="text-sm mt-2">
                    Client : <strong>{selectedDevis.client.entreprise || `${selectedDevis.client.prenom} ${selectedDevis.client.nom}`}</strong>
                  </p>
                  <p className="text-sm">
                    Montant : <strong>{formatMontant(selectedDevis.montants.ttc)}</strong>
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raison du refus *
                  </label>
                  <select
                    value={refusRaison}
                    onChange={(e) => setRefusRaison(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionnez une raison</option>
                    {raisonsRefus.map(raison => (
                      <option key={raison.value} value={raison.value}>
                        {raison.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commentaire (optionnel)
                  </label>
                  <textarea
                    value={refusCommentaire}
                    onChange={(e) => setRefusCommentaire(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Précisions supplémentaires..."
                  />
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                  <p>📧 Un email sera envoyé au client pour l'informer du refus.</p>
                  <p>📊 Cette information sera conservée dans l'historique pour vos statistiques.</p>
                </div>
              </div>
              
              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRefusModal(false)
                    setRefusRaison('')
                    setRefusCommentaire('')
                    setSelectedDevis(null)
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleRefuser}
                  disabled={!refusRaison || sendingEmail}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {sendingEmail ? 'Envoi en cours...' : 'Confirmer le refus'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  )
}