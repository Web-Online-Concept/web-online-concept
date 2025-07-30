"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function Parametres() {
  const [activeTab, setActiveTab] = useState('entreprise')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingSignature, setUploadingSignature] = useState(false)
  
  // État des paramètres
  const [settings, setSettings] = useState({
    entreprise: {
      nom: '',
      adresse: '',
      codePostal: '',
      ville: '',
      pays: 'France',
      telephone: '',
      email: '',
      siteWeb: '',
      siret: '',
      numeroTVA: '',
      formeJuridique: '',
      capital: '',
      logo: '',
      couleurPrincipale: '#0073a8'
    },
    facturation: {
      prefixeDevis: 'DEV',
      prefixeFacture: 'FAC',
      prochainNumeroDevis: 1,
      prochainNumeroFacture: 1,
      delaiPaiement: 30,
      tauxTVADefaut: 20,
      mentionsLegales: '',
      conditionsPaiement: 'Paiement à 30 jours par virement bancaire',
      piedPage: '',
      signature: ''
    },
    bancaire: {
      titulaire: '',
      iban: '',
      bic: '',
      banque: '',
      afficherRIB: true
    },
    email: {
      expediteur: '',
      replyTo: '',
      sujetDevis: 'Votre devis n°{numero}',
      sujetFacture: 'Votre facture n°{numero}',
      messageDevis: 'Bonjour,\n\nVeuillez trouver ci-joint votre devis.\n\nCordialement',
      messageFacture: 'Bonjour,\n\nVeuillez trouver ci-joint votre facture.\n\nCordialement'
    },
    smtp: {
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      user: 'web.online.concept@gmail.com',
      pass: '',
      fromName: 'Web Online Concept'
    },
    signature: {
      active: true,
      text: '\n\n--\nWeb Online Concept\nCréation de sites web & Solutions digitales\n📧 web.online.concept@gmail.com\n🌐 www.web-online-concept.com'
    }
  })

  // Charger les paramètres
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/parametres')
      const data = await response.json()
      setSettings(prev => ({
        ...prev,
        ...data,
        smtp: data.smtp || prev.smtp,
        signature: data.signature || prev.signature
      }))
      setLoading(false)
    } catch (error) {
      console.error('Erreur:', error)
      // Utiliser les valeurs par défaut
      setLoading(false)
    }
  }

  // Sauvegarder les paramètres
  const handleSave = async () => {
    setSaving(true)
    
    try {
      const response = await fetch('/api/admin/parametres', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      if (response.ok) {
        alert('Paramètres sauvegardés avec succès !')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  // Upload logo
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image')
      return
    }
    
    if (file.size > 2 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 2MB')
      return
    }
    
    setUploadingLogo(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const data = await response.json()
        setSettings({
          ...settings,
          entreprise: { ...settings.entreprise, logo: data.url }
        })
      }
    } catch (error) {
      console.error('Erreur upload:', error)
      alert('Erreur lors de l\'upload')
    } finally {
      setUploadingLogo(false)
    }
  }

  // Upload signature
  const handleSignatureUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image')
      return
    }
    
    if (file.size > 1 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 1MB')
      return
    }
    
    setUploadingSignature(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const data = await response.json()
        setSettings({
          ...settings,
          facturation: { ...settings.facturation, signature: data.url }
        })
      }
    } catch (error) {
      console.error('Erreur upload:', error)
      alert('Erreur lors de l\'upload')
    } finally {
      setUploadingSignature(false)
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
                  ⚙️ Paramètres
                </span>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : '💾 Sauvegarder'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Titre */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Paramètres de l'Application
            </h1>
            <p className="text-gray-600">
              Configurez vos informations d'entreprise et préférences
            </p>
          </div>

          {/* Tabs et contenu */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Navigation tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: 'entreprise', label: '🏢 Entreprise' },
                  { id: 'facturation', label: '📄 Facturation' },
                  { id: 'bancaire', label: '💳 Coordonnées bancaires' },
                  { id: 'email', label: '📧 Templates email' },
                  { id: 'smtp', label: '⚙️ Configuration email' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-[#0073a8] border-b-2 border-[#0073a8] bg-blue-50/50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Tab Entreprise */}
              {activeTab === 'entreprise' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Logo */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo de l'entreprise
                      </label>
                      <div className="flex items-center gap-4">
                        {settings.entreprise.logo ? (
                          <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                            <Image
                              src={settings.entreprise.logo}
                              alt="Logo"
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <label className="cursor-pointer bg-[#0073a8] text-white px-4 py-2 rounded-lg hover:bg-[#006a87] transition-colors inline-block">
                            {uploadingLogo ? 'Upload...' : 'Choisir un logo'}
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              disabled={uploadingLogo}
                            />
                          </label>
                          <p className="text-sm text-gray-500 mt-1">PNG, JPG jusqu'à 2MB</p>
                        </div>
                      </div>
                    </div>

                    {/* Informations de base */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom de l'entreprise *
                      </label>
                      <input
                        type="text"
                        value={settings.entreprise.nom}
                        onChange={(e) => setSettings({
                          ...settings,
                          entreprise: { ...settings.entreprise, nom: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Forme juridique
                      </label>
                      <select
                        value={settings.entreprise.formeJuridique}
                        onChange={(e) => setSettings({
                          ...settings,
                          entreprise: { ...settings.entreprise, formeJuridique: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      >
                        <option value="">Sélectionner</option>
                        <option value="EI">Entreprise Individuelle</option>
                        <option value="EURL">EURL</option>
                        <option value="SARL">SARL</option>
                        <option value="SAS">SAS</option>
                        <option value="SASU">SASU</option>
                        <option value="SA">SA</option>
                        <option value="Auto">Auto-entrepreneur</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SIRET
                      </label>
                      <input
                        type="text"
                        value={settings.entreprise.siret}
                        onChange={(e) => setSettings({
                          ...settings,
                          entreprise: { ...settings.entreprise, siret: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        placeholder="123 456 789 00012"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        N° TVA Intracommunautaire
                      </label>
                      <input
                        type="text"
                        value={settings.entreprise.numeroTVA}
                        onChange={(e) => setSettings({
                          ...settings,
                          entreprise: { ...settings.entreprise, numeroTVA: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        placeholder="FR 12 345678901"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capital social
                      </label>
                      <input
                        type="text"
                        value={settings.entreprise.capital}
                        onChange={(e) => setSettings({
                          ...settings,
                          entreprise: { ...settings.entreprise, capital: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        placeholder="10 000 €"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Couleur principale
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={settings.entreprise.couleurPrincipale}
                          onChange={(e) => setSettings({
                            ...settings,
                            entreprise: { ...settings.entreprise, couleurPrincipale: e.target.value }
                          })}
                          className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.entreprise.couleurPrincipale}
                          onChange={(e) => setSettings({
                            ...settings,
                            entreprise: { ...settings.entreprise, couleurPrincipale: e.target.value }
                          })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Coordonnées */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Coordonnées</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Adresse
                        </label>
                        <input
                          type="text"
                          value={settings.entreprise.adresse}
                          onChange={(e) => setSettings({
                            ...settings,
                            entreprise: { ...settings.entreprise, adresse: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Code postal
                        </label>
                        <input
                          type="text"
                          value={settings.entreprise.codePostal}
                          onChange={(e) => setSettings({
                            ...settings,
                            entreprise: { ...settings.entreprise, codePostal: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ville
                        </label>
                        <input
                          type="text"
                          value={settings.entreprise.ville}
                          onChange={(e) => setSettings({
                            ...settings,
                            entreprise: { ...settings.entreprise, ville: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={settings.entreprise.telephone}
                          onChange={(e) => setSettings({
                            ...settings,
                            entreprise: { ...settings.entreprise, telephone: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={settings.entreprise.email}
                          onChange={(e) => setSettings({
                            ...settings,
                            entreprise: { ...settings.entreprise, email: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Site web
                        </label>
                        <input
                          type="url"
                          value={settings.entreprise.siteWeb}
                          onChange={(e) => setSettings({
                            ...settings,
                            entreprise: { ...settings.entreprise, siteWeb: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Facturation */}
              {activeTab === 'facturation' && (
                <div className="space-y-6">
                  {/* Numérotation */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Format de numérotation</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Préfixe devis
                        </label>
                        <input
                          type="text"
                          value={settings.facturation.prefixeDevis}
                          onChange={(e) => setSettings({
                            ...settings,
                            facturation: { ...settings.facturation, prefixeDevis: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prochain numéro devis
                        </label>
                        <input
                          type="number"
                          value={settings.facturation.prochainNumeroDevis}
                          onChange={(e) => setSettings({
                            ...settings,
                            facturation: { ...settings.facturation, prochainNumeroDevis: parseInt(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Préfixe facture
                        </label>
                        <input
                          type="text"
                          value={settings.facturation.prefixeFacture}
                          onChange={(e) => setSettings({
                            ...settings,
                            facturation: { ...settings.facturation, prefixeFacture: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prochain numéro facture
                        </label>
                        <input
                          type="number"
                          value={settings.facturation.prochainNumeroFacture}
                          onChange={(e) => setSettings({
                            ...settings,
                            facturation: { ...settings.facturation, prochainNumeroFacture: parseInt(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                          min="1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Paramètres par défaut */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Paramètres par défaut</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Délai de paiement (jours)
                        </label>
                        <input
                          type="number"
                          value={settings.facturation.delaiPaiement}
                          onChange={(e) => setSettings({
                            ...settings,
                            facturation: { ...settings.facturation, delaiPaiement: parseInt(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Taux de TVA par défaut (%)
                        </label>
                        <select
                          value={settings.facturation.tauxTVADefaut}
                          onChange={(e) => setSettings({
                            ...settings,
                            facturation: { ...settings.facturation, tauxTVADefaut: parseFloat(e.target.value) }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        >
                          <option value="0">0%</option>
                          <option value="5.5">5.5%</option>
                          <option value="10">10%</option>
                          <option value="20">20%</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Textes et mentions */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Textes et mentions</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Conditions de paiement
                        </label>
                        <textarea
                          value={settings.facturation.conditionsPaiement}
                          onChange={(e) => setSettings({
                            ...settings,
                            facturation: { ...settings.facturation, conditionsPaiement: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                          rows="2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mentions légales
                        </label>
                        <textarea
                          value={settings.facturation.mentionsLegales}
                          onChange={(e) => setSettings({
                            ...settings,
                            facturation: { ...settings.facturation, mentionsLegales: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                          rows="3"
                          placeholder="Ex: Pas d'escompte pour paiement anticipé. Pénalités de retard: 3 fois le taux d'intérêt légal..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pied de page documents
                        </label>
                        <textarea
                          value={settings.facturation.piedPage}
                          onChange={(e) => setSettings({
                            ...settings,
                            facturation: { ...settings.facturation, piedPage: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                          rows="2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Signature */}
                  <div className="border-t pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Signature
                    </label>
                    <div className="flex items-center gap-4">
                      {settings.facturation.signature ? (
                        <div className="relative w-64 h-24 border border-gray-300 rounded-lg overflow-hidden bg-white">
                          <Image
                            src={settings.facturation.signature}
                            alt="Signature"
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-64 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                          <span className="text-sm">Aucune signature</span>
                        </div>
                      )}
                      <div>
                        <label className="cursor-pointer bg-[#0073a8] text-white px-4 py-2 rounded-lg hover:bg-[#006a87] transition-colors inline-block">
                          {uploadingSignature ? 'Upload...' : 'Choisir une signature'}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleSignatureUpload}
                            disabled={uploadingSignature}
                          />
                        </label>
                        <p className="text-sm text-gray-500 mt-1">PNG transparent recommandé</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Bancaire */}
              {activeTab === 'bancaire' && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-yellow-800">
                      <strong>🔒 Sécurité :</strong> Ces informations sont stockées localement et ne sont utilisées que pour l'affichage sur vos factures.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titulaire du compte
                      </label>
                      <input
                        type="text"
                        value={settings.bancaire.titulaire}
                        onChange={(e) => setSettings({
                          ...settings,
                          bancaire: { ...settings.bancaire, titulaire: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IBAN
                      </label>
                      <input
                        type="text"
                        value={settings.bancaire.iban}
                        onChange={(e) => setSettings({
                          ...settings,
                          bancaire: { ...settings.bancaire, iban: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8] font-mono"
                        placeholder="FR76 1234 5678 9012 3456 7890 123"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        BIC
                      </label>
                      <input
                        type="text"
                        value={settings.bancaire.bic}
                        onChange={(e) => setSettings({
                          ...settings,
                          bancaire: { ...settings.bancaire, bic: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8] font-mono"
                        placeholder="BNPAFRPPXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Banque
                      </label>
                      <input
                        type="text"
                        value={settings.bancaire.banque}
                        onChange={(e) => setSettings({
                          ...settings,
                          bancaire: { ...settings.bancaire, banque: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.bancaire.afficherRIB}
                        onChange={(e) => setSettings({
                          ...settings,
                          bancaire: { ...settings.bancaire, afficherRIB: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-[#0073a8] focus:ring-[#0073a8]"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Afficher le RIB sur les factures
                      </span>
                    </label>
                  </div>

                  {/* Aperçu RIB */}
                  {settings.bancaire.iban && (
                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Aperçu du RIB</h3>
                      <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                        <p><strong>Titulaire :</strong> {settings.bancaire.titulaire || 'Non renseigné'}</p>
                        <p><strong>IBAN :</strong> {settings.bancaire.iban}</p>
                        <p><strong>BIC :</strong> {settings.bancaire.bic || 'Non renseigné'}</p>
                        <p><strong>Banque :</strong> {settings.bancaire.banque || 'Non renseignée'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab Email */}
              {activeTab === 'email' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>ℹ️ Info :</strong> Ces templates seront utilisés lors de l'envoi de vos documents par email. Utilisez {'{numero}'} pour insérer automatiquement le numéro du document.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email expéditeur
                      </label>
                      <input
                        type="email"
                        value={settings.email.expediteur}
                        onChange={(e) => setSettings({
                          ...settings,
                          email: { ...settings.email, expediteur: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email de réponse
                      </label>
                      <input
                        type="email"
                        value={settings.email.replyTo}
                        onChange={(e) => setSettings({
                          ...settings,
                          email: { ...settings.email, replyTo: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Template pour les devis</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sujet de l'email
                        </label>
                        <input
                          type="text"
                          value={settings.email.sujetDevis}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: { ...settings.email, sujetDevis: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <textarea
                          value={settings.email.messageDevis}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: { ...settings.email, messageDevis: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                          rows="4"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Template pour les factures</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sujet de l'email
                        </label>
                        <input
                          type="text"
                          value={settings.email.sujetFacture}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: { ...settings.email, sujetFacture: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <textarea
                          value={settings.email.messageFacture}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: { ...settings.email, messageFacture: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0073a8] focus:border-[#0073a8]"
                          rows="4"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Configuration SMTP */}
              {activeTab === 'smtp' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration du serveur email</h3>
                    
                    {/* Service email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service email
                        </label>
                        <select
                          value={settings.smtp?.service || 'gmail'}
                          onChange={(e) => {
                            const service = e.target.value
                            let config = {}
                            if (service === 'gmail') {
                              config = { host: 'smtp.gmail.com', port: 587, secure: false }
                            } else if (service === 'outlook') {
                              config = { host: 'smtp-mail.outlook.com', port: 587, secure: false }
                            } else if (service === 'custom') {
                              config = { host: '', port: 587, secure: false }
                            }
                            setSettings(prev => ({
                              ...prev,
                              smtp: { ...prev.smtp, service, ...config }
                            }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="gmail">Gmail</option>
                          <option value="outlook">Outlook/Hotmail</option>
                          <option value="custom">Personnalisé</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email expéditeur
                        </label>
                        <input
                          type="email"
                          value={settings.smtp?.user || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            smtp: { ...prev.smtp, user: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="web.online.concept@gmail.com"
                        />
                      </div>
                    </div>

                    {/* Configuration serveur (si personnalisé) */}
                    {settings.smtp?.service === 'custom' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Serveur SMTP
                          </label>
                          <input
                            type="text"
                            value={settings.smtp?.host || ''}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              smtp: { ...prev.smtp, host: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="smtp.exemple.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Port
                          </label>
                          <input
                            type="number"
                            value={settings.smtp?.port || 587}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              smtp: { ...prev.smtp, port: parseInt(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sécurité
                          </label>
                          <select
                            value={settings.smtp?.secure ? 'ssl' : 'tls'}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              smtp: { ...prev.smtp, secure: e.target.value === 'ssl' }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="tls">TLS</option>
                            <option value="ssl">SSL</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Mot de passe */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe d'application
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={settings.smtp?.pass || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            smtp: { ...prev.smtp, pass: e.target.value }
                          }))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="••••••••••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Pour Gmail : utilisez un mot de passe d'application, pas votre mot de passe habituel
                      </p>
                    </div>

                    {/* Nom d'affichage */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom d'affichage
                      </label>
                      <input
                        type="text"
                        value={settings.smtp?.fromName || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          smtp: { ...prev.smtp, fromName: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Web Online Concept"
                      />
                    </div>

                    {/* Signature */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Signature email
                      </label>
                      <div className="mb-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.signature?.active || false}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              signature: { ...prev.signature, active: e.target.checked }
                            }))}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Ajouter automatiquement la signature aux emails</span>
                        </label>
                      </div>
                      <textarea
                        value={settings.signature?.text || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          signature: { ...prev.signature, text: e.target.value }
                        }))}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                        placeholder="--
Web Online Concept
Création de sites web
📧 web.online.concept@gmail.com"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Cette signature sera ajoutée automatiquement à tous vos emails
                      </p>
                    </div>

                    {/* Test de connexion */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Test de configuration</h4>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={async () => {
                            try {
                              // Vérifier d'abord que les données sont bien présentes
                              console.log('Configuration à envoyer:', settings.smtp)
                              
                              if (!settings.smtp?.pass) {
                                alert('Veuillez entrer le mot de passe d\'application')
                                return
                              }
                              
                              const response = await fetch('/api/admin/emails/test', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ smtp: settings.smtp })
                              })
                              
                              const text = await response.text()
                              console.log('Réponse brute:', text)
                              
                              try {
                                const data = JSON.parse(text)
                                if (response.ok) {
                                  alert('Configuration valide ! Un email de test a été envoyé.')
                                } else {
                                  console.error('Erreur détaillée:', data)
                                  alert(`Erreur: ${data.error}\n\nDétails: ${data.details || 'Aucun détail'}`)
                                }
                              } catch (e) {
                                console.error('Erreur de parsing:', e)
                                alert('Erreur serveur: ' + text)
                              }
                            } catch (error) {
                              console.error('Erreur complète:', error)
                              alert('Erreur lors du test: ' + error.message)
                            }
                          }}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                          Tester la configuration
                        </button>
                        <span className="text-sm text-gray-600">
                          Un email de test sera envoyé à votre adresse
                        </span>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-6 bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">📘 Instructions pour Gmail</h4>
                      <ol className="text-sm text-blue-800 space-y-1">
                        <li>1. Activez la validation en 2 étapes sur votre compte Google</li>
                        <li>2. Allez sur <a href="https://myaccount.google.com/apppasswords" target="_blank" className="underline">myaccount.google.com/apppasswords</a></li>
                        <li>3. Créez un mot de passe d'application pour "Mail"</li>
                        <li>4. Copiez le code à 16 caractères et collez-le ici</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bouton de sauvegarde flottant */}
          <div className="fixed bottom-8 right-8">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg transition-all hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}