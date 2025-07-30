'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function DemandeDevis() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [tarifs, setTarifs] = useState(null)
  
  // État du formulaire adapté à votre offre
  const [formData, setFormData] = useState({
    // Informations client
    type_client: 'particulier',
    entreprise: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    code_postal: '',
    ville: '',
    
    // Projet - Site Web Professionnel
    nb_pages_supp: 0, // Pages au-delà des 5 incluses
    nb_pages_redaction_supp: 0, // Pages supplémentaires à rédiger
    options: [],
    description: '',
    budget: 'standard',
    
    // Code affilié
    code_affilie: '',
    code_valide: false,
    reduction_affilie: 0
  })

  // Charger les tarifs depuis l'API
  useEffect(() => {
    fetch('/api/admin/tarifs')
      .then(res => res.json())
      .then(data => {
        // L'API renvoie directement les tarifs, pas un objet avec une propriété tarifs
        setTarifs(data)
      })
      .catch(err => {
        console.error('Erreur chargement tarifs:', err)
        // Tarifs par défaut si erreur
        setTarifs({
          siteWeb: 500,
          pageSupp: 50,
          packImages: 50,
          maintenance: 120,
          redactionSiteComplet: 150,
          redactionPageSupp: 20,
          backOffice: 150
        })
      })
  }, [])

  // Vérifier un code affilié
  const verifyAffiliateCode = async (code) => {
    if (!code) {
      setFormData(prev => ({
        ...prev,
        code_valide: false,
        reduction_affilie: 0
      }))
      return
    }

    try {
      const response = await fetch(`/api/affilies/verify?code=${encodeURIComponent(code)}`)
      const data = await response.json()
      
      if (data.valid) {
        setFormData(prev => ({
          ...prev,
          code_valide: true,
          reduction_affilie: data.reduction || 30
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          code_valide: false,
          reduction_affilie: 0
        }))
      }
    } catch (error) {
      console.error('Erreur vérification code:', error)
      setFormData(prev => ({
        ...prev,
        code_valide: false,
        reduction_affilie: 0
      }))
    }
  }

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        options: checked 
          ? [...prev.options, name]
          : prev.options.filter(opt => opt !== name)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
      
      // Vérifier le code affilié après la saisie
      if (name === 'code_affilie') {
        setTimeout(() => verifyAffiliateCode(value), 500)
      }
    }
  }

  // Calcul du prix total
  const calculateTotal = () => {
    if (!tarifs) return 0
    
    let total = tarifs.siteWeb // Site de base à 500€
    
    // Appliquer la réduction affilié UNIQUEMENT sur le site de base
    if (formData.code_valide && formData.reduction_affilie > 0) {
      const reduction = tarifs.siteWeb * (formData.reduction_affilie / 100)
      total = total - reduction
    }
    
    // Pages supplémentaires (pas de réduction)
    if (formData.nb_pages_supp > 0) {
      total += formData.nb_pages_supp * tarifs.pageSupp
    }
    
    // Options (pas de réduction)
    if (formData.options.includes('pack_images')) {
      total += tarifs.packImages
    }
    if (formData.options.includes('maintenance')) {
      total += tarifs.maintenance
    }
    if (formData.options.includes('redaction')) {
      total += tarifs.redactionSiteComplet
    }
    // Rédaction pages supplémentaires (toujours calculé, même si non coché)
    if (formData.nb_pages_redaction_supp > 0) {
      total += formData.nb_pages_redaction_supp * tarifs.redactionPageSupp
    }
    if (formData.options.includes('back_office')) {
      total += tarifs.backOffice
    }
    
    return Math.round(total)
  }

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Créer le devis
      const response = await fetch('/api/devis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type: 'site_web_pro', // Notre offre unique
          montant_base: tarifs.siteWeb
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du devis')
      }

      const devis = await response.json()

      // Envoyer les emails de notification via votre API existante
      try {
        // Email au client
        await fetch('/api/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'send',
            data: {
              to: formData.email,
              template: 'demande_devis_client',
              variables: {
                prenom: formData.prenom,
                numero: devis.id
              }
            }
          })
        })

        // Email à l'admin
        await fetch('/api/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'send',
            data: {
              to: 'web.online.concept@gmail.com',
              template: 'demande_devis_admin',
              variables: {
                client: `${formData.prenom} ${formData.nom}`,
                email: formData.email,
                telephone: formData.telephone,
                projet: 'Site Web Professionnel',
                budget: calculateTotal(),
                numero: devis.id
              }
            }
          })
        })
      } catch (emailError) {
        console.error('Erreur envoi emails:', emailError)
        // On continue même si l'email échoue
      }

      // Redirection vers la page de confirmation
      router.push('/devis/confirmation')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  // Navigation entre étapes
  const nextStep = () => {
    setCurrentStep(2)
  }

  const prevStep = () => {
    setCurrentStep(1)
  }

  // Si les tarifs ne sont pas encore chargés
  if (!tarifs) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p>Chargement des tarifs...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* En-tête */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Demande de Devis
              </h1>
              <p className="text-xl text-gray-600">
                Créons ensemble votre site web professionnel
              </p>
            </div>

            {/* Indicateur de progression */}
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    1
                  </div>
                  <div className={`w-32 h-1 ${
                    currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></div>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    2
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span className="flex-1 text-center">Configuration de votre devis</span>
                <span className="flex-1 text-center">Vos coordonnées</span>
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg">
              {/* Étape 1: Configuration complète du devis */}
              {currentStep === 1 && (
                <div className="p-8 space-y-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Configurez votre projet
                  </h2>

                  {/* Notre offre principale */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-2">
                      Site Web Professionnel
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Notre offre complète pour votre présence en ligne
                    </p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        5 pages personnalisées incluses
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Pages légales offertes (mentions légales, CGV, etc.)
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Hébergement 1 an inclus
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Design moderne et responsive
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Formation à la gestion du site
                      </li>
                    </ul>
                    <div className="mt-4 text-2xl font-bold text-blue-900">
                      {tarifs.siteWeb}€ HT
                    </div>
                  </div>

                  {/* Pages supplémentaires */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-lg mb-4">📄 Pages supplémentaires</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Besoin de plus de 5 pages ? Ajoutez des pages supplémentaires à votre site.
                    </p>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de pages supplémentaires :
                    </label>
                    <select
                      name="nb_pages_supp"
                      value={formData.nb_pages_supp}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="0">Aucune page supplémentaire</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map(num => (
                        <option key={num} value={num}>
                          {num} page{num > 1 ? 's' : ''} supplémentaire{num > 1 ? 's' : ''} (+{num * tarifs.pageSupp}€)
                        </option>
                      ))}
                    </select>
                    {formData.nb_pages_supp > 0 && (
                      <p className="mt-2 text-sm text-blue-600 font-medium">
                        Total pages du site : {5 + parseInt(formData.nb_pages_supp)} pages
                      </p>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Options supplémentaires</h3>

                    {/* Pack Images - Vert */}
                    <label className="flex items-start p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 hover:from-green-100 hover:to-green-200 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        name="pack_images"
                        checked={formData.options.includes('pack_images')}
                        onChange={handleChange}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium">📸 Pack images/vidéos professionnelles</div>
                        <div className="text-sm text-gray-600">10 médias libres de droits pour illustrer votre site</div>
                        <div className="text-sm font-medium text-green-700 mt-1">+{tarifs.packImages}€</div>
                      </div>
                    </label>

                    {/* Maintenance - Violet */}
                    <label className="flex items-start p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:from-purple-100 hover:to-purple-200 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        name="maintenance"
                        checked={formData.options.includes('maintenance')}
                        onChange={handleChange}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium">🛠️ Forfait Maintenance</div>
                        <div className="text-sm text-gray-600">12 interventions par an pour garder votre site à jour</div>
                        <div className="text-sm font-medium text-purple-700 mt-1">+{tarifs.maintenance}€/an</div>
                      </div>
                    </label>

                    {/* Rédaction Pages de base - Orange */}
                    <label className="flex items-start p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200 hover:from-orange-100 hover:to-orange-200 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        name="redaction"
                        checked={formData.options.includes('redaction')}
                        onChange={handleChange}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium">✍️ Rédaction complète (Pages de base)</div>
                        <div className="text-sm text-gray-600">
                          Textes professionnels (2 sessions de corrections incluses)
                          <div className="mt-2">
                            <div>• Forfait 5 pages de base : {tarifs.redactionSiteComplet}€</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-orange-700 mt-1">
                          +{tarifs.redactionSiteComplet}€
                        </div>
                      </div>
                    </label>

                    {/* Rédaction Pages supplémentaires - Orange clair */}
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                      <div className="font-medium">✍️ Rédaction complète (Pages supplémentaires)</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Textes professionnels (2 sessions de corrections incluses)
                        <div className="mt-2">
                          <div>• Forfait 1 page supplémentaire : {tarifs.redactionPageSupp}€</div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Choisissez votre nombre de pages supplémentaires :
                        </label>
                        <select
                          name="nb_pages_redaction_supp"
                          value={formData.nb_pages_redaction_supp}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-orange-300 rounded focus:ring-2 focus:ring-orange-500 bg-white"
                        >
                          <option value="0">0 page</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map(num => (
                            <option key={num} value={num}>
                              {num} page{num > 1 ? 's' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="text-sm font-medium text-orange-700 mt-3">
                        +{formData.nb_pages_redaction_supp * tarifs.redactionPageSupp}€
                      </div>
                    </div>

                    {/* Back Office - Indigo */}
                    <label className="flex items-start p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200 hover:from-indigo-100 hover:to-indigo-200 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        name="back_office"
                        checked={formData.options.includes('back_office')}
                        onChange={handleChange}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium">💼 Back Office</div>
                        <div className="text-sm text-gray-600">Interface d'administration pour gérer votre contenu + formation</div>
                        <div className="text-sm font-medium text-indigo-700 mt-1">+{tarifs.backOffice}€</div>
                      </div>
                    </label>
                  </div>

                  {/* Code affilié */}
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200">
                    <h4 className="font-semibold text-lg mb-4">🎁 Code promotionnel</h4>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          name="code_affilie"
                          value={formData.code_affilie}
                          onChange={handleChange}
                          placeholder="Entrez votre code promo"
                          className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent uppercase"
                        />
                      </div>
                      {formData.code_affilie && (
                        <div className="flex items-center">
                          {formData.code_valide ? (
                            <span className="flex items-center text-green-600 font-medium">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Code valide !
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600 font-medium">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Code invalide
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {formData.code_valide && (
                      <div className="mt-3 p-3 bg-green-100 rounded-lg">
                        <p className="text-green-800 font-medium">
                          🎉 Réduction de {formData.reduction_affilie}% appliquée sur l'offre principale !
                        </p>
                        <p className="text-green-700 text-sm mt-1">
                          Économie : -{Math.round(tarifs.siteWeb * (formData.reduction_affilie / 100))}€ sur le site web
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Description du projet */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Décrivez votre projet
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Parlez-nous de votre activité, vos objectifs, vos attentes..."
                    />
                  </div>

                  {/* Récapitulatif fixe */}
                  <div className="sticky bottom-0 bg-white pt-4 border-t">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                      <h3 className="font-bold text-lg mb-4">📊 Récapitulatif de votre devis</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between font-medium">
                          <span>Site Web Professionnel (5 pages incluses)</span>
                          <span className={formData.code_valide ? 'line-through text-gray-400' : ''}>{tarifs.siteWeb}€</span>
                        </div>
                        {formData.code_valide && (
                          <div className="flex justify-between text-green-600 font-medium">
                            <span className="ml-4">↳ Réduction {formData.reduction_affilie}%</span>
                            <span>-{Math.round(tarifs.siteWeb * (formData.reduction_affilie / 100))}€</span>
                          </div>
                        )}
                        {formData.code_valide && (
                          <div className="flex justify-between font-medium">
                            <span className="ml-4">↳ Prix après réduction</span>
                            <span>{tarifs.siteWeb - Math.round(tarifs.siteWeb * (formData.reduction_affilie / 100))}€</span>
                          </div>
                        )}
                        {formData.nb_pages_supp > 0 && (
                          <div className="flex justify-between text-gray-700">
                            <span className="ml-4">↳ {formData.nb_pages_supp} page{formData.nb_pages_supp > 1 ? 's' : ''} supplémentaire{formData.nb_pages_supp > 1 ? 's' : ''}</span>
                            <span>{formData.nb_pages_supp * tarifs.pageSupp}€</span>
                          </div>
                        )}
                        {formData.options.includes('pack_images') && (
                          <div className="flex justify-between text-gray-700">
                            <span>📸 Pack images/vidéos</span>
                            <span>{tarifs.packImages}€</span>
                          </div>
                        )}
                        {formData.options.includes('maintenance') && (
                          <div className="flex justify-between text-gray-700">
                            <span>🛠️ Forfait Maintenance (annuel)</span>
                            <span>{tarifs.maintenance}€</span>
                          </div>
                        )}
                        {formData.options.includes('redaction') && (
                          <div className="flex justify-between text-gray-700">
                            <span>✍️ Rédaction complète (5 pages de base)</span>
                            <span>{tarifs.redactionSiteComplet}€</span>
                          </div>
                        )}
                        {formData.nb_pages_redaction_supp > 0 && (
                          <div className="flex justify-between text-gray-700">
                            <span>✍️ Rédaction {formData.nb_pages_redaction_supp} page{formData.nb_pages_redaction_supp > 1 ? 's' : ''} supplémentaire{formData.nb_pages_redaction_supp > 1 ? 's' : ''}</span>
                            <span>{formData.nb_pages_redaction_supp * tarifs.redactionPageSupp}€</span>
                          </div>
                        )}
                        {formData.options.includes('back_office') && (
                          <div className="flex justify-between text-gray-700">
                            <span>💼 Back Office</span>
                            <span>{tarifs.backOffice}€</span>
                          </div>
                        )}
                        <div className="border-t pt-3 mt-3">
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total HT</span>
                            <span className="text-blue-600">{calculateTotal()}€</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">TVA non applicable - Auto-entrepreneur</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Suivant : Vos coordonnées
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 2: Coordonnées */}
              {currentStep === 2 && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Vos coordonnées
                  </h2>

                  <div className="space-y-6">
                    {/* Type de client */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vous êtes
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="type_client"
                            value="particulier"
                            checked={formData.type_client === 'particulier'}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <span>Particulier</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="type_client"
                            value="entreprise"
                            checked={formData.type_client === 'entreprise'}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <span>Entreprise</span>
                        </label>
                      </div>
                    </div>

                    {/* Nom de l'entreprise */}
                    {formData.type_client === 'entreprise' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom de l'entreprise *
                        </label>
                        <input
                          type="text"
                          name="entreprise"
                          value={formData.entreprise}
                          onChange={handleChange}
                          required={formData.type_client === 'entreprise'}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {/* Prénom et Nom */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Email et Téléphone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Adresse */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Code postal et Ville */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Code postal
                        </label>
                        <input
                          type="text"
                          name="code_postal"
                          value={formData.code_postal}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ville
                        </label>
                        <input
                          type="text"
                          name="ville"
                          value={formData.ville}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Récapitulatif final */}
                    <div className="bg-blue-50 rounded-lg p-6 mt-6">
                      <h3 className="font-bold text-lg mb-4">Votre devis</h3>
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        Total : {calculateTotal()}€ HT
                      </div>
                      <p className="text-sm text-gray-600">
                        Site de {5 + parseInt(formData.nb_pages_supp)} pages
                        {formData.options.includes('redaction') && formData.nb_pages_redaction_supp > 0 && 
                          ` • Rédaction de ${5 + parseInt(formData.nb_pages_redaction_supp)} pages`
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="text-gray-600 px-6 py-3 rounded-lg hover:text-gray-800 transition-colors"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-8 py-3 rounded-lg transition-colors font-medium ${
                        isLoading
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isLoading ? 'Envoi en cours...' : 'Envoyer la demande'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}