"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function EditDocument() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const docId = params.docId
  const isNew = docId === 'nouveau'
  const defaultType = searchParams.get('type') || 'devis'
  const clientId = searchParams.get('client')
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [clients, setClients] = useState([])
  const [companyInfo, setCompanyInfo] = useState({})
  
  // État du document
  const [document, setDocument] = useState({
    type: defaultType,
    numero: '',
    clientId: clientId || '',
    clientNom: '',
    date: new Date().toISOString().split('T')[0],
    dateEcheance: '',
    dateValidite: '',
    status: 'brouillon',
    lignes: [
      { description: '', quantite: 1, prixUnitaire: 0, tva: 20, total: 0 }
    ],
    montantHT: 0,
    montantTVA: 0,
    montantTTC: 0,
    notes: '',
    conditions: ''
  })

  // Charger les données
  useEffect(() => {
    fetchData()
  }, [docId])

  const fetchData = async () => {
    try {
      // Charger les clients
      const clientsResponse = await fetch('/api/admin/crm')
      const clientsData = await clientsResponse.json()
      setClients(clientsData)
      
      // Charger les paramètres de l'entreprise
      const settingsResponse = await fetch('/api/admin/parametres')
      const settingsData = await settingsResponse.json()
      setCompanyInfo(settingsData.entreprise || {})
      
      // Si ce n'est pas un nouveau document, charger les données
      if (!isNew) {
        const docResponse = await fetch('/api/admin/facturation')
        const documents = await docResponse.json()
        const foundDoc = documents.find(d => d.id === docId)
        
        if (foundDoc) {
          setDocument(foundDoc)
        } else {
          router.push('/admin/facturation')
          return
        }
      } else {
        // Nouveau document - définir les dates par défaut
        const today = new Date()
        const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
        
        setDocument(prev => ({
          ...prev,
          dateEcheance: defaultType === 'facture' ? in30Days.toISOString().split('T')[0] : '',
          dateValidite: defaultType === 'devis' ? in30Days.toISOString().split('T')[0] : ''
        }))
        
        // Si un client est pré-sélectionné
        if (clientId) {
          const client = clientsData.find(c => c.id === clientId)
          if (client) {
            setDocument(prev => ({
              ...prev,
              clientId: client.id,
              clientNom: client.entreprise
            }))
          }
        }
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      setLoading(false)
    }
  }

  // Calculer les totaux
  const calculateTotals = (lignes) => {
    let montantHT = 0
    let montantTVA = 0
    
    lignes.forEach(ligne => {
      const total = ligne.quantite * ligne.prixUnitaire
      ligne.total = total
      montantHT += total
      montantTVA += total * (ligne.tva / 100)
    })
    
    return {
      montantHT,
      montantTVA,
      montantTTC: montantHT + montantTVA
    }
  }

  // Mettre à jour une ligne
  const updateLigne = (index, field, value) => {
    const newLignes = [...document.lignes]
    newLignes[index][field] = field === 'quantite' || field === 'prixUnitaire' || field === 'tva' 
      ? parseFloat(value) || 0 
      : value
    
    const totals = calculateTotals(newLignes)
    setDocument({
      ...document,
      lignes: newLignes,
      ...totals
    })
  }

  // Ajouter une ligne
  const addLigne = () => {
    const newLignes = [...document.lignes, { 
      description: '', 
      quantite: 1, 
      prixUnitaire: 0, 
      tva: 20, 
      total: 0 
    }]
    setDocument({ ...document, lignes: newLignes })
  }

  // Supprimer une ligne
  const removeLigne = (index) => {
    if (document.lignes.length === 1) return
    
    const newLignes = document.lignes.filter((_, i) => i !== index)
    const totals = calculateTotals(newLignes)
    setDocument({
      ...document,
      lignes: newLignes,
      ...totals
    })
  }

  // Changer le client
  const handleClientChange = (clientId) => {
    const client = clients.find(c => c.id === clientId)
    setDocument({
      ...document,
      clientId: clientId,
      clientNom: client ? client.entreprise : ''
    })
  }

  // Sauvegarder le document
  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const method = isNew ? 'POST' : 'PUT'
      const body = isNew 
        ? document
        : { id: docId, documentData: document }
      
      const response = await fetch('/api/admin/facturation', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      if (response.ok) {
        if (isNew) {
          const result = await response.json()
          router.push(`/admin/facturation/${result.document.id}`)
        } else {
          router.push('/admin/facturation')
        }
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  // Marquer comme envoyé
  const handleMarkAsSent = async () => {
    const newStatus = document.type === 'devis' ? 'envoye' : 'envoyee'
    setDocument({ ...document, status: newStatus })
    
    // Sauvegarder aussi
    if (!isNew) {
      try {
        await fetch('/api/admin/facturation', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: docId,
            documentData: { ...document, status: newStatus }
          })
        })
      } catch (error) {
        console.error('Erreur:', error)
      }
    }
  }

  // Marquer comme payé
  const handleMarkAsPaid = async () => {
    setDocument({ 
      ...document, 
      status: 'payee',
      datePaiement: new Date().toISOString().split('T')[0]
    })
    
    // Sauvegarder
    if (!isNew) {
      try {
        await fetch('/api/admin/facturation', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: docId,
            documentData: { 
              ...document, 
              status: 'payee',
              datePaiement: new Date().toISOString().split('T')[0]
            }
          })
        })
      } catch (error) {
        console.error('Erreur:', error)
      }
    }
  }

  // Télécharger le PDF
  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('/api/admin/facturation/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docId })
      })
      
      if (response.ok) {
        const html = await response.text()
        
        // Ouvrir dans un nouvel onglet pour impression
        const newWindow = window.open('', '_blank')
        newWindow.document.write(html)
        newWindow.document.close()
        
        // Déclencher l'impression après chargement
        newWindow.onload = () => {
          newWindow.print()
        }
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la génération du PDF')
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

  const isDevis = document.type === 'devis'

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-100 pt-[100px]">
        {/* Barre d'admin */}
        <div className="bg-[#0073a8] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <Link href="/admin/facturation" className="text-white/80 hover:text-white transition-colors">
                  ← Retour
                </Link>
                <span className="text-lg font-semibold">
                  {isNew ? `Nouveau ${isDevis ? 'devis' : 'facture'}` : `${isDevis ? 'Devis' : 'Facture'} ${document.numero}`}
                </span>
              </div>
              <div className="flex gap-2">
                {!isNew && (
                  <>
                    {document.status === 'brouillon' && (
                      <button
                        onClick={handleMarkAsSent}
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        📧 Marquer comme envoyé
                      </button>
                    )}
                    {document.type === 'facture' && document.status !== 'payee' && (
                      <button
                        onClick={handleMarkAsPaid}
                        className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        ✅ Marquer comme payé
                      </button>
                    )}
                    <button 
                      onClick={handleDownloadPDF}
                      className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      📄 Télécharger PDF
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              {/* En-tête du document */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations du document</h2>
                  
                  <div className="space-y-4">
                    {isNew && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type de document
                        </label>
                        <select
                          value={document.type}
                          onChange={(e) => {
                            const newType = e.target.value
                            const today = new Date()
                            const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
                            
                            setDocument({
                              ...document,
                              type: newType,
                              dateEcheance: newType === 'facture' ? in30Days.toISOString().split('T')[0] : '',
                              dateValidite: newType === 'devis' ? in30Days.toISOString().split('T')[0] : ''
                            })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        >
                          <option value="devis">Devis</option>
                          <option value="facture">Facture</option>
                        </select>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client *
                      </label>
                      <select
                        value={document.clientId}
                        onChange={(e) => handleClientChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        required
                      >
                        <option value="">Sélectionner un client</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>
                            {client.entreprise}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={document.date}
                        onChange={(e) => setDocument({ ...document, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        required
                      />
                    </div>
                    
                    {isDevis ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date de validité
                        </label>
                        <input
                          type="date"
                          value={document.dateValidite}
                          onChange={(e) => setDocument({ ...document, dateValidite: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date d'échéance
                        </label>
                        <input
                          type="date"
                          value={document.dateEcheance}
                          onChange={(e) => setDocument({ ...document, dateEcheance: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Aperçu</h2>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {isDevis ? 'DEVIS' : 'FACTURE'}
                      </h3>
                      {!isNew && (
                        <p className="text-lg text-gray-600">{document.numero}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Client :</span>
                        <span className="font-medium">{document.clientNom || 'Non sélectionné'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date :</span>
                        <span>{new Date(document.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {isDevis && document.dateValidite && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Validité :</span>
                          <span>{new Date(document.dateValidite).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                      {!isDevis && document.dateEcheance && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Échéance :</span>
                          <span>{new Date(document.dateEcheance).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                      
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total HT :</span>
                          <span>{document.montantHT.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">TVA :</span>
                          <span>{document.montantTVA.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-1">
                          <span>Total TTC :</span>
                          <span className="text-[#0073a8]">{document.montantTTC.toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lignes du document */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Lignes du document</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Description
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-24">
                          Qté
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-32">
                          Prix unitaire
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-24">
                          TVA %
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-32">
                          Total HT
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-16">
                          
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {document.lignes.map((ligne, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={ligne.description}
                              onChange={(e) => updateLigne(index, 'description', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-[#0073a8] focus:border-[#0073a8]"
                              placeholder="Description du produit ou service"
                              required
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={ligne.quantite}
                              onChange={(e) => updateLigne(index, 'quantite', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-[#0073a8] focus:border-[#0073a8] text-center"
                              min="0"
                              step="1"
                              required
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={ligne.prixUnitaire}
                              onChange={(e) => updateLigne(index, 'prixUnitaire', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-[#0073a8] focus:border-[#0073a8] text-center"
                              min="0"
                              step="0.01"
                              required
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={ligne.tva}
                              onChange={(e) => updateLigne(index, 'tva', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-[#0073a8] focus:border-[#0073a8] text-center"
                            >
                              <option value="0">0%</option>
                              <option value="5.5">5.5%</option>
                              <option value="10">10%</option>
                              <option value="20">20%</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-center font-medium">
                            {ligne.total.toFixed(2)} €
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeLigne(index)}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50"
                              disabled={document.lignes.length === 1}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <button
                  type="button"
                  onClick={addLigne}
                  className="mt-4 text-sm text-[#0073a8] hover:text-[#006a87] font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter une ligne
                </button>
              </div>

              {/* Notes et conditions */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (visibles sur le document)
                  </label>
                  <textarea
                    value={document.notes}
                    onChange={(e) => setDocument({ ...document, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    rows="3"
                    placeholder="Notes additionnelles..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conditions
                  </label>
                  <textarea
                    value={document.conditions}
                    onChange={(e) => setDocument({ ...document, conditions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                    rows="3"
                    placeholder="Conditions de paiement, livraison..."
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <Link
                href="/admin/facturation"
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </Link>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#0073a8] text-white rounded-lg hover:bg-[#006a87] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Enregistrement...' : (isNew ? 'Créer' : 'Enregistrer')}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <Footer />
    </>
  )
}