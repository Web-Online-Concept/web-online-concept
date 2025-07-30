'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function ProjetCollecte() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { token } = params
  const paymentSuccess = searchParams.get('payment') === 'success'
  
  const [devis, setDevis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  
  // État du formulaire de contenu
  const [contenu, setContenu] = useState({
    // Informations générales
    general: {
      nomEntreprise: '',
      slogan: '',
      description: '',
      historiqueEntreprise: '',
      valeursEntreprise: '',
      completed: false
    },
    
    // Page d'accueil
    accueil: {
      titrePrincipal: '',
      sousTitre: '',
      texteAccroche: '',
      appelsAction: ['', '', ''],
      completed: false
    },
    
    // Services/Produits
    services: {
      liste: [
        { nom: '', description: '', prix: '', image: null }
      ],
      completed: false
    },
    
    // À propos
    apropos: {
      histoire: '',
      equipe: [
        { nom: '', poste: '', bio: '', photo: null }
      ],
      completed: false
    },
    
    // Contact
    contact: {
      adresse: '',
      telephone: '',
      email: '',
      horaires: '',
      reseauxSociaux: {
        facebook: '',
        instagram: '',
        linkedin: '',
        twitter: ''
      },
      completed: false
    },
    
    // Médias
    medias: {
      logo: null,
      favicon: null,
      images: [],
      documents: [],
      completed: false
    },
    
    // Notes
    notes: {
      inspirations: '',
      concurrents: '',
      remarques: '',
      completed: false
    }
  })
  
  // Sections du formulaire
  const sections = [
    { id: 'general', nom: 'Informations générales', icon: '🏢' },
    { id: 'accueil', nom: 'Page d\'accueil', icon: '🏠' },
    { id: 'services', nom: 'Services / Produits', icon: '📦' },
    { id: 'apropos', nom: 'À propos', icon: '👥' },
    { id: 'contact', nom: 'Contact', icon: '📞' },
    { id: 'medias', nom: 'Médias', icon: '🖼️' },
    { id: 'notes', nom: 'Notes & Inspirations', icon: '💡' }
  ]
  
  useEffect(() => {
    if (token) {
      loadDevis()
      loadSavedContent()
    }
  }, [token])
  
  const loadDevis = async () => {
    try {
      const response = await fetch(`/api/devis/${token}`)
      
      if (!response.ok) {
        setError('Projet introuvable')
        return
      }
      
      const data = await response.json()
      
      // Vérifier que le devis est accepté et payé
      if (data.statut !== 'accepte') {
        setError('Ce projet n\'est pas encore actif.')
        return
      }
      
      if (data.statut_paiement !== 'acompte_paye' && data.statut_paiement !== 'paye') {
        setError('L\'acompte doit être payé avant de pouvoir envoyer les contenus.')
        return
      }
      
      setDevis(data)
      
      // Pré-remplir certains champs si disponibles
      setContenu(prev => ({
        ...prev,
        general: {
          ...prev.general,
          nomEntreprise: data.client.entreprise || ''
        },
        contact: {
          ...prev.contact,
          adresse: data.client.adresse || '',
          telephone: data.client.telephone || '',
          email: data.client.email || ''
        }
      }))
      
    } catch (error) {
      console.error('Erreur:', error)
      setError('Impossible de charger le projet.')
    } finally {
      setLoading(false)
    }
  }
  
  const loadSavedContent = async () => {
    // Charger le contenu sauvegardé depuis localStorage
    const saved = localStorage.getItem(`projet-${token}`)
    if (saved) {
      try {
        const savedContent = JSON.parse(saved)
        setContenu(savedContent)
      } catch (e) {
        console.error('Erreur chargement contenu sauvegardé:', e)
      }
    }
  }
  
  const saveContent = () => {
    // Sauvegarder en localStorage
    localStorage.setItem(`projet-${token}`, JSON.stringify(contenu))
  }
  
  const handleInputChange = (section, field, value) => {
    setContenu(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    saveContent()
  }
  
  const handleServiceChange = (index, field, value) => {
    const newServices = [...contenu.services.liste]
    newServices[index] = { ...newServices[index], [field]: value }
    setContenu(prev => ({
      ...prev,
      services: { ...prev.services, liste: newServices }
    }))
    saveContent()
  }
  
  const addService = () => {
    setContenu(prev => ({
      ...prev,
      services: {
        ...prev.services,
        liste: [...prev.services.liste, { nom: '', description: '', prix: '', image: null }]
      }
    }))
  }
  
  const removeService = (index) => {
    setContenu(prev => ({
      ...prev,
      services: {
        ...prev.services,
        liste: prev.services.liste.filter((_, i) => i !== index)
      }
    }))
    saveContent()
  }
  
  const handleTeamChange = (index, field, value) => {
    const newTeam = [...contenu.apropos.equipe]
    newTeam[index] = { ...newTeam[index], [field]: value }
    setContenu(prev => ({
      ...prev,
      apropos: { ...prev.apropos, equipe: newTeam }
    }))
    saveContent()
  }
  
  const addTeamMember = () => {
    setContenu(prev => ({
      ...prev,
      apropos: {
        ...prev.apropos,
        equipe: [...prev.apropos.equipe, { nom: '', poste: '', bio: '', photo: null }]
      }
    }))
  }
  
  const removeTeamMember = (index) => {
    setContenu(prev => ({
      ...prev,
      apropos: {
        ...prev.apropos,
        equipe: prev.apropos.equipe.filter((_, i) => i !== index)
      }
    }))
    saveContent()
  }
  
  const handleFileUpload = async (section, field, files, multiple = false) => {
    if (!files || files.length === 0) return
    
    const uploadedFiles = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'projet')
      formData.append('projet', token)
      
      try {
        setUploadProgress(prev => ({ ...prev, [`${section}-${field}`]: 0 }))
        
        // Simuler l'upload (en production, utiliser l'API réelle)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // En production : const response = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        // const data = await response.json()
        // uploadedFiles.push(data.url)
        
        // Pour la démo, on utilise une URL fictive
        uploadedFiles.push(`/uploads/projet/${token}/${file.name}`)
        
        setUploadProgress(prev => ({ ...prev, [`${section}-${field}`]: 100 }))
        
      } catch (error) {
        console.error('Erreur upload:', error)
        alert(`Erreur lors de l'upload de ${file.name}`)
      }
    }
    
    // Mettre à jour le contenu
    if (multiple) {
      setContenu(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: [...(prev[section][field] || []), ...uploadedFiles]
        }
      }))
    } else {
      setContenu(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: uploadedFiles[0]
        }
      }))
    }
    
    setTimeout(() => {
      setUploadProgress(prev => {
        const newProgress = { ...prev }
        delete newProgress[`${section}-${field}`]
        return newProgress
      })
    }, 2000)
    
    saveContent()
  }
  
  const validateSection = (sectionId) => {
    const section = contenu[sectionId]
    let isValid = true
    
    switch (sectionId) {
      case 'general':
        isValid = section.nomEntreprise && section.description
        break
      case 'accueil':
        isValid = section.titrePrincipal && section.texteAccroche
        break
      case 'services':
        isValid = section.liste.some(s => s.nom && s.description)
        break
      case 'contact':
        isValid = section.email || section.telephone
        break
      case 'medias':
        isValid = section.logo !== null
        break
      default:
        isValid = true
    }
    
    setContenu(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], completed: isValid }
    }))
    
    return isValid
  }
  
  const calculateProgress = () => {
    const completed = sections.filter(s => contenu[s.id].completed).length
    return Math.round((completed / sections.length) * 100)
  }
  
  const handleSubmit = async () => {
    setSaving(true)
    
    try {
      // Valider toutes les sections
      let allValid = true
      sections.forEach(section => {
        if (!validateSection(section.id)) {
          allValid = false
        }
      })
      
      if (!allValid) {
        alert('Veuillez compléter les sections obligatoires')
        setSaving(false)
        return
      }
      
      // Envoyer le contenu
      // En production : await fetch('/api/projet/submit', { ... })
      
      // Simuler l'envoi
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Marquer le devis comme "contenu collecté" via la nouvelle API
      await fetch(`/api/admin/devis/${devis.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'collecte_contenu',
          contenus: contenu
        })
      })
      
      // Envoyer email de confirmation via la nouvelle API
      await fetch('/api/admin/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          data: {
            to: devis.client.email,
            template: 'collecte_complete',
            variables: devis
          }
        })
      })
      
      // Nettoyer le localStorage
      localStorage.removeItem(`projet-${token}`)
      
      setShowSuccessModal(true)
      
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-[100px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0073a8] mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }
  
  if (error || !devis) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-[100px] flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h1>
            <p className="text-gray-600">{error || 'Une erreur est survenue'}</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }
  
  const progress = calculateProgress()
  const currentSection = sections[currentStep - 1]
  
  // Type de site pour l'affichage
  const typesSites = {
    vitrine: 'Site Vitrine',
    catalogue: 'Site Catalogue',
    ecommerce: 'Site E-commerce'
  }
  
  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50 pt-[100px]">
        {/* Message de succès paiement */}
        {paymentSuccess && (
          <div className="bg-green-50 border-b border-green-200">
            <div className="max-w-6xl mx-auto px-4 py-4">
              <div className="flex items-center">
                <span className="text-green-600 text-2xl mr-3">✅</span>
                <p className="text-green-800">
                  Paiement confirmé ! Vous pouvez maintenant nous envoyer vos contenus.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* En-tête */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Collecte des contenus - {typesSites[devis.projet.type_site] || devis.projet.type_site}
                </h1>
                <p className="text-gray-600 mt-1">
                  Projet {devis.id} - {devis.client.entreprise || `${devis.client.prenom} ${devis.client.nom}`}
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#0073a8]">{progress}%</div>
                <p className="text-sm text-gray-600">Complété</p>
              </div>
            </div>
            
            {/* Barre de progression */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-[#0073a8] to-[#005a87] h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h2 className="font-semibold text-gray-900 mb-4">Sections</h2>
                <nav className="space-y-2">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => setCurrentStep(index + 1)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                        currentStep === index + 1
                          ? 'bg-[#0073a8] text-white'
                          : contenu[section.id].completed
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="flex items-center">
                        <span className="mr-3 text-xl">{section.icon}</span>
                        <span className="font-medium">{section.nom}</span>
                      </span>
                      {contenu[section.id].completed && (
                        <span className="text-green-600">✓</span>
                      )}
                    </button>
                  ))}
                </nav>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-2">💡 Conseil</p>
                  <p className="text-xs text-blue-700">
                    Prenez votre temps pour bien remplir chaque section. 
                    Vos réponses sont sauvegardées automatiquement.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contenu principal */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <span className="text-2xl mr-3">{currentSection.icon}</span>
                  {currentSection.nom}
                </h2>
                
                {/* Section Informations générales */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de l'entreprise *
                      </label>
                      <input
                        type="text"
                        value={contenu.general.nomEntreprise}
                        onChange={(e) => handleInputChange('general', 'nomEntreprise', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                        placeholder="Web Online Concept"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slogan / Accroche
                      </label>
                      <input
                        type="text"
                        value={contenu.general.slogan}
                        onChange={(e) => handleInputChange('general', 'slogan', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                        placeholder="Votre partenaire digital de confiance"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description de l'entreprise *
                      </label>
                      <textarea
                        value={contenu.general.description}
                        onChange={(e) => handleInputChange('general', 'description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                        placeholder="Décrivez votre activité, vos services principaux..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Histoire de l'entreprise
                      </label>
                      <textarea
                        value={contenu.general.historiqueEntreprise}
                        onChange={(e) => handleInputChange('general', 'historiqueEntreprise', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                        placeholder="Racontez votre histoire, vos débuts..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valeurs de l'entreprise
                      </label>
                      <textarea
                        value={contenu.general.valeursEntreprise}
                        onChange={(e) => handleInputChange('general', 'valeursEntreprise', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                        placeholder="Qualité, Innovation, Service client..."
                      />
                    </div>
                  </div>
                )}
                
                {/* Section Page d'accueil */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre principal *
                      </label>
                      <input
                        type="text"
                        value={contenu.accueil.titrePrincipal}
                        onChange={(e) => handleInputChange('accueil', 'titrePrincipal', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                        placeholder="Bienvenue chez [Votre entreprise]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sous-titre
                      </label>
                      <input
                        type="text"
                        value={contenu.accueil.sousTitre}
                        onChange={(e) => handleInputChange('accueil', 'sousTitre', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                        placeholder="Votre partenaire pour..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texte d'accroche *
                      </label>
                      <textarea
                        value={contenu.accueil.texteAccroche}
                        onChange={(e) => handleInputChange('accueil', 'texteAccroche', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                        placeholder="Un texte court et percutant qui donne envie d'en savoir plus..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Boutons d'action (Call-to-Action)
                      </label>
                      <div className="space-y-2">
                        {contenu.accueil.appelsAction.map((cta, index) => (
                          <input
                            key={index}
                            type="text"
                            value={cta}
                            onChange={(e) => {
                              const newCtas = [...contenu.accueil.appelsAction]
                              newCtas[index] = e.target.value
                              handleInputChange('accueil', 'appelsAction', newCtas)
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                            placeholder={`Bouton ${index + 1} (ex: Découvrir nos services)`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Section Services/Produits */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-gray-600">
                        Listez vos services ou produits principaux
                      </p>
                      <button
                        onClick={addService}
                        className="px-4 py-2 bg-[#0073a8] text-white rounded-lg hover:bg-[#006a87] transition-colors text-sm"
                      >
                        + Ajouter un service
                      </button>
                    </div>
                    
                    {contenu.services.liste.map((service, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Service {index + 1}</h4>
                          {contenu.services.liste.length > 1 && (
                            <button
                              onClick={() => removeService(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Supprimer
                            </button>
                          )}
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nom du service *
                            </label>
                            <input
                              type="text"
                              value={service.nom}
                              onChange={(e) => handleServiceChange(index, 'nom', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                              placeholder="Ex: Création de site web"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Prix (optionnel)
                            </label>
                            <input
                              type="text"
                              value={service.prix}
                              onChange={(e) => handleServiceChange(index, 'prix', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                              placeholder="Ex: À partir de 1200€"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                          </label>
                          <textarea
                            value={service.description}
                            onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                            placeholder="Décrivez ce service en détail..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image (optionnel)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload('services', `liste[${index}].image`, e.target.files)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                          />
                          {uploadProgress[`services-liste[${index}].image`] !== undefined && (
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-[#0073a8] h-2 rounded-full transition-all"
                                  style={{ width: `${uploadProgress[`services-liste[${index}].image`]}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Section À propos */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notre histoire
                      </label>
                      <textarea
                        value={contenu.apropos.histoire}
                        onChange={(e) => handleInputChange('apropos', 'histoire', e.target.value)}
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                        placeholder="Racontez l'histoire de votre entreprise, vos motivations..."
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">L'équipe</h3>
                        <button
                          onClick={addTeamMember}
                          className="px-4 py-2 bg-[#0073a8] text-white rounded-lg hover:bg-[#006a87] transition-colors text-sm"
                        >
                          + Ajouter un membre
                        </button>
                      </div>
                      
                      {contenu.apropos.equipe.map((membre, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4 mb-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">Membre {index + 1}</h4>
                            {contenu.apropos.equipe.length > 1 && (
                              <button
                                onClick={() => removeTeamMember(index)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Supprimer
                              </button>
                            )}
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom
                              </label>
                              <input
                                type="text"
                                value={membre.nom}
                                onChange={(e) => handleTeamChange(index, 'nom', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Poste
                              </label>
                              <input
                                type="text"
                                value={membre.poste}
                                onChange={(e) => handleTeamChange(index, 'poste', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Biographie
                            </label>
                            <textarea
                              value={membre.bio}
                              onChange={(e) => handleTeamChange(index, 'bio', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Photo
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload('apropos', `equipe[${index}].photo`, e.target.files)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Section Contact */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse
                        </label>
                        <input
                          type="text"
                          value={contenu.contact.adresse}
                          onChange={(e) => handleInputChange('contact', 'adresse', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={contenu.contact.telephone}
                          onChange={(e) => handleInputChange('contact', 'telephone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={contenu.contact.email}
                          onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Horaires
                        </label>
                        <input
                          type="text"
                          value={contenu.contact.horaires}
                          onChange={(e) => handleInputChange('contact', 'horaires', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                          placeholder="Lun-Ven : 9h-18h"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-4">Réseaux sociaux</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Facebook
                          </label>
                          <input
                            type="url"
                            value={contenu.contact.reseauxSociaux.facebook}
                            onChange={(e) => setContenu(prev => ({
                              ...prev,
                              contact: {
                                ...prev.contact,
                                reseauxSociaux: {
                                  ...prev.contact.reseauxSociaux,
                                  facebook: e.target.value
                                }
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                            placeholder="https://facebook.com/..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Instagram
                          </label>
                          <input
                            type="url"
                            value={contenu.contact.reseauxSociaux.instagram}
                            onChange={(e) => setContenu(prev => ({
                              ...prev,
                              contact: {
                                ...prev.contact,
                                reseauxSociaux: {
                                  ...prev.contact.reseauxSociaux,
                                  instagram: e.target.value
                                }
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                            placeholder="https://instagram.com/..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            LinkedIn
                          </label>
                          <input
                            type="url"
                            value={contenu.contact.reseauxSociaux.linkedin}
                            onChange={(e) => setContenu(prev => ({
                              ...prev,
                              contact: {
                                ...prev.contact,
                                reseauxSociaux: {
                                  ...prev.contact.reseauxSociaux,
                                  linkedin: e.target.value
                                }
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                            placeholder="https://linkedin.com/..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Twitter/X
                          </label>
                          <input
                            type="url"
                            value={contenu.contact.reseauxSociaux.twitter}
                            onChange={(e) => setContenu(prev => ({
                              ...prev,
                              contact: {
                                ...prev.contact,
                                reseauxSociaux: {
                                  ...prev.contact.reseauxSociaux,
                                  twitter: e.target.value
                                }
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                            placeholder="https://twitter.com/..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Section Médias */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo de l'entreprise *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('medias', 'logo', e.target.files)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                      />
                      {contenu.medias.logo && (
                        <p className="text-sm text-green-600 mt-2">✅ Logo uploadé</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Favicon (icône du site)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('medias', 'favicon', e.target.files)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Format carré recommandé (512x512px)</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Images supplémentaires
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload('medias', 'images', e.target.files, true)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Vous pouvez sélectionner plusieurs images
                      </p>
                      {contenu.medias.images.length > 0 && (
                        <p className="text-sm text-green-600 mt-2">
                          ✅ {contenu.medias.images.length} image(s) uploadée(s)
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Documents (PDF, Word...)
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        multiple
                        onChange={(e) => handleFileUpload('medias', 'documents', e.target.files, true)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Brochures, catalogues, mentions légales...
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Section Notes */}
                {currentStep === 7 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sites d'inspiration
                      </label>
                      <textarea
                        value={contenu.notes.inspirations}
                        onChange={(e) => handleInputChange('notes', 'inspirations', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                        placeholder="Listez des sites web que vous aimez avec les URLs..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Concurrents
                      </label>
                      <textarea
                        value={contenu.notes.concurrents}
                        onChange={(e) => handleInputChange('notes', 'concurrents', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                        placeholder="Listez vos principaux concurrents et leurs sites web..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Remarques supplémentaires
                      </label>
                      <textarea
                        value={contenu.notes.remarques}
                        onChange={(e) => handleInputChange('notes', 'remarques', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                        placeholder="Toute information supplémentaire qui pourrait nous aider..."
                      />
                    </div>
                  </div>
                )}
                
                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  
                  {currentStep < sections.length ? (
                    <button
                      onClick={() => {
                        validateSection(currentSection.id)
                        setCurrentStep(currentStep + 1)
                      }}
                      className="px-6 py-3 bg-[#0073a8] text-white rounded-lg font-medium hover:bg-[#006a87] transition-colors"
                    >
                      Suivant
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={saving || progress < 70}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Envoi en cours...' : 'Envoyer tous les contenus'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal de succès */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
              <div className="text-green-500 text-6xl mb-6">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Contenus envoyés avec succès !
              </h2>
              <p className="text-gray-600 mb-6">
                Nous avons bien reçu tous vos contenus. 
                Notre équipe va maintenant commencer la création de votre site web.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Vous recevrez un email de confirmation et nous vous tiendrons 
                informé de l'avancement du projet.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-[#0073a8] text-white rounded-lg font-medium hover:bg-[#006a87] transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  )
}