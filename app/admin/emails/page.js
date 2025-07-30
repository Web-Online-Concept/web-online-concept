'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function EmailsPage() {
  const [activeTab, setActiveTab] = useState('tous')
  const [emails, setEmails] = useState([])
  const [automaticRules, setAutomaticRules] = useState([])
  const [clients, setClients] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showAutomaticModal, setShowAutomaticModal] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [parametres, setParametres] = useState(null)
  const [documents, setDocuments] = useState({ factures: [], devis: [] })
  const [editingRule, setEditingRule] = useState(null)
  
  const [emailForm, setEmailForm] = useState({
    to: '',
    clientId: '',
    subject: '',
    message: '',
    attachmentType: '',
    attachmentId: '',
    scheduledDate: '',
    scheduledTime: '',
    isScheduled: false,
    template: ''
  })
  
  const [automaticForm, setAutomaticForm] = useState({
    name: '',
    trigger: 'facture_creee',
    delay: 0,
    delayUnit: 'heures',
    template: '',
    active: true,
    conditions: {
      status: 'all',
      minAmount: '',
      maxAmount: ''
    }
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [emailsRes, clientsRes, paramsRes, docsRes, rulesRes] = await Promise.all([
        fetch('/api/admin/emails'),
        fetch('/api/admin/clients'),
        fetch('/api/admin/parametres'),
        fetch('/api/admin/facturation'),
        fetch('/api/admin/emails/automatic-rules')
      ])
      
      // Gestion des erreurs pour chaque requête
      if (emailsRes.ok) {
        const emailsData = await emailsRes.json()
        // L'API retourne un objet avec une propriété emails
        setEmails(emailsData.emails || [])
      }
      
      if (clientsRes.ok) {
        const clientsData = await clientsRes.json()
        // Vérifier si c'est un tableau ou un objet
        setClients(Array.isArray(clientsData) ? clientsData : (clientsData.clients || []))
      }
      
      if (paramsRes.ok) {
        const paramsData = await paramsRes.json()
        setParametres(paramsData)
      }
      
      if (docsRes.ok) {
        const docsData = await docsRes.json()
        setDocuments(docsData)
      }
      
      if (rulesRes.ok) {
        const rulesData = await rulesRes.json()
        // Vérifier si c'est un tableau ou un objet
        setAutomaticRules(Array.isArray(rulesData) ? rulesData : (rulesData.rules || []))
      } else if (rulesRes.status === 404) {
        // Si l'API n'existe pas encore, initialiser avec des règles par défaut
        setAutomaticRules([])
      }
      
    } catch (error) {
      console.error('Erreur chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Déterminer l'adresse email du destinataire
      let clientEmail = ''
      
      if (emailForm.clientId === 'other') {
        // Si "Autre" est sélectionné, utiliser l'email saisi
        clientEmail = emailForm.to
      } else if (emailForm.clientId) {
        // Si un client est sélectionné, trouver son email
        const selectedClient = clients.find(c => c.id === emailForm.clientId)
        clientEmail = selectedClient ? selectedClient.email : ''
      }
      
      // Validation de base
      if (!clientEmail) {
        throw new Error('Veuillez sélectionner un destinataire ou saisir une adresse email')
      }
      
      // Validation de base
      if (!clientEmail) {
        throw new Error('Veuillez sélectionner un destinataire ou saisir une adresse email')
      }
      
      // Préparer les données avec les bons noms de champs
      const emailData = {
        destinataire: clientEmail,  // Changé de 'to' à 'destinataire'
        objet: emailForm.subject,   // Changé de 'subject' à 'objet'
        message: emailForm.message,
        clientId: emailForm.clientId === 'other' ? null : emailForm.clientId,
        documentId: emailForm.attachmentId,
        documentType: emailForm.attachmentType
      }
      
      console.log('Envoi email vers:', clientEmail)
      console.log('Données complètes:', emailData)
      
      // Logs de debug
      console.log('emailForm:', emailForm)
      console.log('clientEmail final:', clientEmail)
      console.log('emailData à envoyer:', emailData)
      
      // Si programmé, ajouter les infos de programmation
      if (emailForm.isScheduled) {
        emailData.scheduledFor = `${emailForm.scheduledDate}T${emailForm.scheduledTime}`
      }
      
      console.log('Appel API avec:', JSON.stringify(emailData, null, 2))
      
      const response = await fetch('/api/admin/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erreur API:', errorData)
        throw new Error(errorData.error || 'Erreur envoi')
      }
      
      alert(emailForm.isScheduled ? 'Email programmé avec succès !' : 'Email envoyé avec succès !')
      setShowModal(false)
      resetForm()
      loadData()
      
    } catch (error) {
      console.error('Erreur complète:', error)
      alert(`Erreur lors de l'envoi: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAutomaticRule = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const method = editingRule ? 'PUT' : 'POST'
      const url = editingRule 
        ? `/api/admin/emails/automatic-rules/${editingRule.id}`
        : '/api/admin/emails/automatic-rules'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(automaticForm)
      })
      
      if (!response.ok) throw new Error('Erreur sauvegarde')
      
      alert(editingRule ? 'Règle modifiée avec succès !' : 'Règle créée avec succès !')
      setShowAutomaticModal(false)
      resetAutomaticForm()
      loadData()
      
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRule = async (ruleId, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/emails/automatic-rules/${ruleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus })
      })
      
      if (!response.ok) throw new Error('Erreur toggle')
      
      loadData()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la modification')
    }
  }

  const handleDeleteRule = async (ruleId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette règle ?')) return
    
    try {
      const response = await fetch(`/api/admin/emails/automatic-rules/${ruleId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Erreur suppression')
      
      loadData()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleEditRule = (rule) => {
    setAutomaticForm(rule)
    setEditingRule(rule)
    setShowAutomaticModal(true)
  }

  const handleDeleteEmail = async (emailId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet email ?')) return
    
    try {
      const response = await fetch('/api/admin/emails', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: emailId })
      })
      
      if (!response.ok) throw new Error('Erreur suppression')
      
      loadData()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleViewEmail = (email) => {
    setSelectedEmail(email)
  }

  const handleResendEmail = async (email) => {
    if (!confirm('Renvoyer cet email ?')) return
    
    try {
      const response = await fetch('/api/admin/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinataire: email.to,
          objet: email.subject,
          message: email.message,
          clientId: email.clientId,
          documentId: email.attachmentId,
          documentType: email.attachmentType
        })
      })
      
      if (!response.ok) throw new Error('Erreur renvoi')
      
      alert('Email renvoyé avec succès !')
      loadData()
      
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors du renvoi')
    }
  }

  const resetForm = () => {
    setEmailForm({
      to: '',
      clientId: '',
      subject: '',
      message: '',
      attachmentType: '',
      attachmentId: '',
      scheduledDate: '',
      scheduledTime: '',
      isScheduled: false,
      template: ''
    })
  }

  const resetAutomaticForm = () => {
    setAutomaticForm({
      name: '',
      trigger: 'facture_creee',
      delay: 0,
      delayUnit: 'heures',
      template: '',
      active: true,
      conditions: {
        status: 'all',
        minAmount: '',
        maxAmount: ''
      }
    })
    setEditingRule(null)
  }

  const handleTemplateSelect = (templateId) => {
    const template = parametres?.templates?.find(t => t.id === templateId)
    if (template) {
      setEmailForm({
        ...emailForm,
        template: templateId,
        subject: template.subject,
        message: template.message
      })
    }
  }

  const getFilteredEmails = () => {
    // Vérifier que emails est un tableau
    const emailsArray = Array.isArray(emails) ? emails : []
    
    switch (activeTab) {
      case 'envoyes':
        return emailsArray.filter(e => 
          (e.status === 'sent' || e.statut === 'envoye') && 
          !e.scheduledFor && !e.dateEnvoiPrevue
        )
      case 'programmes':
        return emailsArray.filter(e => 
          e.status === 'scheduled' || e.statut === 'programme' || 
          e.scheduledFor || e.dateEnvoiPrevue
        )
      case 'automatiques':
        return emailsArray.filter(e => 
          e.automatic === true || e.automatique === true || e.type === 'automatique'
        )
      default:
        return emailsArray
    }
  }

  const getEmailStats = () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    // Vérifier que emails est un tableau
    const emailsArray = Array.isArray(emails) ? emails : []
    
    const emailsThisMonth = emailsArray.filter(e => {
      const emailDate = new Date(e.date || e.dateEnvoi)
      return emailDate >= startOfMonth && 
        (e.status === 'sent' || e.statut === 'envoye')
    })
    
    const automaticEmails = emailsArray.filter(e => 
      (e.automatic === true || e.automatique === true || e.type === 'automatique') && 
      (e.status === 'sent' || e.statut === 'envoye')
    )
    
    return {
      monthlyCount: emailsThisMonth.length,
      automaticCount: automaticEmails.length
    }
  }

  const stats = getEmailStats()
  const filteredEmails = getFilteredEmails()
  
  // Triggers disponibles
  const triggers = [
    { value: 'facture_creee', label: 'Facture créée' },
    { value: 'facture_payee', label: 'Facture payée' },
    { value: 'facture_en_retard', label: 'Facture en retard' },
    { value: 'devis_cree', label: 'Devis créé' },
    { value: 'devis_accepte', label: 'Devis accepté' },
    { value: 'devis_expire', label: 'Devis expiré' },
    { value: 'rappel_paiement', label: 'Rappel de paiement' },
    { value: 'relance_devis', label: 'Relance devis' }
  ]

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50 pt-[100px]">
        {/* Barre d'admin */}
        <div className="bg-[#0073a8] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <a href="/admin" className="text-white hover:text-gray-200 mr-4">
                  ← Retour au tableau de bord
                </a>
                <span className="text-lg font-semibold">
                  📧 Gestion des Emails
                </span>
              </div>
            </div>
          </div>
        </div>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Emails</h1>
              <p className="text-gray-600 mt-1">Envoyez et programmez vos emails clients</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="mr-2">➕</span>
              Nouveau message
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emails envoyés ce mois</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.monthlyCount}</p>
              </div>
              <div className="w-10 h-10 text-blue-500 flex items-center justify-center text-2xl">📤</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emails automatiques</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.automaticCount}</p>
              </div>
              <div className="w-10 h-10 text-yellow-500 flex items-center justify-center text-2xl">⚡</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <nav className="flex -mb-px">
              {[
                { id: 'tous', label: 'Tous', icon: '📧' },
                { id: 'envoyes', label: 'Envoyés', icon: '✅' },
                { id: 'programmes', label: 'Programmés', icon: '⏰' },
                { id: 'automatiques', label: 'Automatiques', icon: '⚡' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'automatiques' ? (
              // Onglet Automatiques
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Règles automatiques</h3>
                  <button
                    onClick={() => {
                      resetAutomaticForm()
                      setShowAutomaticModal(true)
                    }}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <span className="mr-1">➕</span>
                    Nouvelle règle
                  </button>
                </div>

                {automaticRules.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 text-gray-400 mx-auto mb-4 text-4xl">⚡</div>
                    <p className="text-gray-600">Aucune règle automatique configurée</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Créez des règles pour envoyer automatiquement des emails selon des événements
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {automaticRules.map(rule => (
                      <div key={rule.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h4 className="font-medium text-gray-900">{rule.name}</h4>
                              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                rule.active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {rule.active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Déclencheur : {triggers.find(t => t.value === rule.trigger)?.label}
                            </p>
                            <p className="text-sm text-gray-600">
                              Délai : {rule.delay} {rule.delayUnit} après l'événement
                            </p>
                            {rule.conditions.minAmount || rule.conditions.maxAmount ? (
                              <p className="text-sm text-gray-600">
                                Montant : {rule.conditions.minAmount && `Min ${rule.conditions.minAmount}€`}
                                {rule.conditions.minAmount && rule.conditions.maxAmount && ' - '}
                                {rule.conditions.maxAmount && `Max ${rule.conditions.maxAmount}€`}
                              </p>
                            ) : null}
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleToggleRule(rule.id, rule.active)}
                              className="text-gray-600 hover:text-gray-900"
                              title={rule.active ? 'Désactiver' : 'Activer'}
                            >
                              {rule.active ? 
                                <span className="text-green-600 text-2xl">🔘</span> : 
                                <span className="text-gray-400 text-2xl">⭕</span>
                              }
                            </button>
                            <button
                              onClick={() => handleEditRule(rule)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Modifier"
                            >
                              <span className="text-xl">✏️</span>
                            </button>
                            <button
                              onClick={() => handleDeleteRule(rule.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Supprimer"
                            >
                              <span className="text-xl">🗑️</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Autres onglets (emails)
              <div className="overflow-x-auto">
                {filteredEmails.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 text-gray-400 mx-auto mb-4 text-4xl">📧</div>
                    <p className="text-gray-600">Aucun email dans cette catégorie</p>
                  </div>
                ) : (
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Destinataire</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Objet</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmails.map(email => (
                        <tr key={email.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">
                            {email.date ? 
                              new Date(email.date).toLocaleDateString('fr-FR') + ' ' + 
                              new Date(email.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                              : email.dateEnvoi ? 
                              new Date(email.dateEnvoi).toLocaleDateString('fr-FR') + ' ' + 
                              new Date(email.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                              : 'Date inconnue'
                            }
                          </td>
                          <td className="py-3 px-4 text-sm">{email.to || email.destinataire || 'Inconnu'}</td>
                          <td className="py-3 px-4 text-sm">{email.subject || email.objet || 'Sans objet'}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              email.status === 'sent' || email.statut === 'envoye' ? 'bg-green-100 text-green-800' :
                              email.status === 'scheduled' || email.statut === 'programme' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {email.status === 'sent' || email.statut === 'envoye' ? '✅ Envoyé' :
                               email.status === 'scheduled' || email.statut === 'programme' ? '⏰ Programmé' :
                               email.status || email.statut || 'Inconnu'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-xs">
                              {email.automatic ? '⚡ Automatique' : '✋ Manuel'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewEmail(email)}
                                className="text-blue-600 hover:text-blue-700"
                                title="Voir"
                              >
                                <span title="Voir">👁️</span>
                              </button>
                              <button
                                onClick={() => handleResendEmail(email)}
                                className="text-green-600 hover:text-green-700"
                                title="Renvoyer"
                              >
                                <span title="Renvoyer">🔄</span>
                              </button>
                              <button
                                onClick={() => handleDeleteEmail(email.id)}
                                className="text-red-600 hover:text-red-700"
                                title="Supprimer"
                              >
                                <span title="Supprimer">🗑️</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal nouveau message */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Nouveau message</h2>
            </div>
            
            <form onSubmit={handleSendEmail} className="p-6">
              <div className="space-y-4">
                {/* Template */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template
                  </label>
                  <select
                    value={emailForm.template}
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Aucun template</option>
                    {parametres?.templates && Array.isArray(parametres.templates) ? 
                      parametres.templates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      )) : null
                    }
                  </select>
                </div>

                {/* Client */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destinataire
                  </label>
                  <select
                    value={emailForm.clientId}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === 'other') {
                        setEmailForm({ ...emailForm, clientId: 'other', to: '' })
                      } else {
                        setEmailForm({ ...emailForm, clientId: value, to: '' })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Sélectionner un destinataire</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.entreprise} - {client.email}
                      </option>
                    ))}
                    <option value="other">➕ Autre adresse email...</option>
                  </select>
                </div>

                {/* Email personnalisé si "Autre" est sélectionné */}
                {emailForm.clientId === 'other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      value={emailForm.to}
                      onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="exemple@email.com"
                      required
                    />
                  </div>
                )}

                {/* Objet */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Objet
                  </label>
                  <input
                    type="text"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={emailForm.message}
                    onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Variables disponibles : {'{prenom}'}, {'{entreprise}'}, {'{date}'}, {'{numero}'}, {'{montant}'}
                  </p>
                </div>

                {/* Pièce jointe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Joindre un document
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={emailForm.attachmentType}
                      onChange={(e) => setEmailForm({ ...emailForm, attachmentType: e.target.value, attachmentId: '' })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Aucun</option>
                      <option value="facture">Facture</option>
                      <option value="devis">Devis</option>
                    </select>
                    
                    {emailForm.attachmentType && (
                      <select
                        value={emailForm.attachmentId}
                        onChange={(e) => setEmailForm({ ...emailForm, attachmentId: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Sélectionner</option>
                        {documents[emailForm.attachmentType === 'facture' ? 'factures' : 'devis'].map(doc => (
                          <option key={doc.id} value={doc.id}>
                            {doc.numero} - {doc.client}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Programmation */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={emailForm.isScheduled}
                      onChange={(e) => {
                        const isScheduled = e.target.checked
                        if (isScheduled) {
                          const now = new Date()
                          now.setMinutes(now.getMinutes() + 5)
                          setEmailForm({
                            ...emailForm,
                            isScheduled,
                            scheduledDate: now.toISOString().split('T')[0],
                            scheduledTime: now.toTimeString().slice(0, 5)
                          })
                        } else {
                          setEmailForm({
                            ...emailForm,
                            isScheduled,
                            scheduledDate: '',
                            scheduledTime: ''
                          })
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Programmer l'envoi</span>
                  </label>
                </div>

                {emailForm.isScheduled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={emailForm.scheduledDate}
                        onChange={(e) => setEmailForm({ ...emailForm, scheduledDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Heure
                      </label>
                      <input
                        type="time"
                        value={emailForm.scheduledTime}
                        onChange={(e) => setEmailForm({ ...emailForm, scheduledTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Envoi...' : (emailForm.isScheduled ? 'Programmer' : 'Envoyer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal règle automatique */}
      {showAutomaticModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingRule ? 'Modifier la règle' : 'Nouvelle règle automatique'}
              </h2>
            </div>
            
            <form onSubmit={handleSaveAutomaticRule} className="p-6">
              <div className="space-y-4">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la règle
                  </label>
                  <input
                    type="text"
                    value={automaticForm.name}
                    onChange={(e) => setAutomaticForm({ ...automaticForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Remerciement après paiement"
                    required
                  />
                </div>

                {/* Déclencheur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Déclencheur
                  </label>
                  <select
                    value={automaticForm.trigger}
                    onChange={(e) => setAutomaticForm({ ...automaticForm, trigger: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {triggers.map(trigger => (
                      <option key={trigger.value} value={trigger.value}>
                        {trigger.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Délai */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Délai
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={automaticForm.delay}
                      onChange={(e) => setAutomaticForm({ ...automaticForm, delay: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unité
                    </label>
                    <select
                      value={automaticForm.delayUnit}
                      onChange={(e) => setAutomaticForm({ ...automaticForm, delayUnit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="minutes">Minutes</option>
                      <option value="heures">Heures</option>
                      <option value="jours">Jours</option>
                    </select>
                  </div>
                </div>

                {/* Template */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template à utiliser
                  </label>
                  <select
                    value={automaticForm.template}
                    onChange={(e) => setAutomaticForm({ ...automaticForm, template: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Sélectionner un template</option>
                    {parametres?.templates && Array.isArray(parametres.templates) ? 
                      parametres.templates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      )) : null
                    }
                  </select>
                </div>

                {/* Conditions */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Conditions (optionnel)</h3>
                  
                  <div className="space-y-3">
                    {/* Statut */}
                    {(automaticForm.trigger === 'facture_creee' || automaticForm.trigger === 'devis_cree') && (
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Statut du document
                        </label>
                        <select
                          value={automaticForm.conditions.status}
                          onChange={(e) => setAutomaticForm({
                            ...automaticForm,
                            conditions: { ...automaticForm.conditions, status: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="all">Tous</option>
                          <option value="nouveau">Nouveau seulement</option>
                        </select>
                      </div>
                    )}

                    {/* Montants */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Montant minimum (€)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={automaticForm.conditions.minAmount}
                          onChange={(e) => setAutomaticForm({
                            ...automaticForm,
                            conditions: { ...automaticForm.conditions, minAmount: e.target.value }
                          })}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Montant maximum (€)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={automaticForm.conditions.maxAmount}
                          onChange={(e) => setAutomaticForm({
                            ...automaticForm,
                            conditions: { ...automaticForm.conditions, maxAmount: e.target.value }
                          })}
                          placeholder="Illimité"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actif */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={automaticForm.active}
                      onChange={(e) => setAutomaticForm({ ...automaticForm, active: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Règle active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAutomaticModal(false)
                    resetAutomaticForm()
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Enregistrement...' : (editingRule ? 'Modifier' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal détails email */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Détails de l'email</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Date d'envoi</p>
                  <p className="text-gray-900">
                    {selectedEmail.date || selectedEmail.dateEnvoi ? 
                      new Date(selectedEmail.date || selectedEmail.dateEnvoi).toLocaleDateString('fr-FR') + ' à ' + 
                      new Date(selectedEmail.date || selectedEmail.dateEnvoi).toLocaleTimeString('fr-FR')
                      : 'Date inconnue'
                    }
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Destinataire</p>
                  <p className="text-gray-900">{selectedEmail.to || selectedEmail.destinataire || 'Inconnu'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Objet</p>
                  <p className="text-gray-900">{selectedEmail.subject || selectedEmail.objet || 'Sans objet'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Message</p>
                  <div className="bg-gray-50 p-4 rounded-lg mt-1">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedEmail.message}</p>
                  </div>
                </div>
                
                {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pièces jointes</p>
                    <ul className="mt-1 space-y-1">
                      {selectedEmail.attachments.map((attachment, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <span className="mr-2">📎</span>
                          {attachment}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    
    <Footer />
    </>
  )
}