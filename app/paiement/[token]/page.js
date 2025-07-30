'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function Paiement() {
  const params = useParams()
  const router = useRouter()
  const { token } = params
  
  const [devis, setDevis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [virementInfo, setVirementInfo] = useState(null)
  
  // Informations de paiement par carte (simulé)
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  })
  
  useEffect(() => {
    if (token) {
      loadDevis()
    }
  }, [token])
  
  const loadDevis = async () => {
    try {
      const response = await fetch(`/api/devis/${token}`)
      
      if (!response.ok) {
        setError('Devis introuvable')
        return
      }
      
      const data = await response.json()
      
      // Vérifier que le devis est accepté
      if (data.statut !== 'accepte') {
        setError('Ce devis n\'est pas encore accepté ou n\'est plus valide.')
        return
      }
      
      // Vérifier que les CGV ont été signées
      if (!data.signature_cgv || !data.signature_cgv.accepte) {
        // Rediriger vers la page de signature
        router.push(`/devis/${token}/signature`)
        return
      }
      
      // Vérifier que l'acompte n'a pas déjà été payé
      if (data.statut_paiement === 'acompte_paye' || data.statut_paiement === 'paye') {
        setError('L\'acompte pour ce devis a déjà été payé.')
        return
      }
      
      setDevis(data)
      
    } catch (error) {
      console.error('Erreur:', error)
      setError('Impossible de charger les informations de paiement.')
    } finally {
      setLoading(false)
    }
  }
  
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }
  
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '')
    }
    return v
  }
  
  const handleCardPayment = async (e) => {
    e.preventDefault()
    
    // Validation basique
    if (!cardInfo.number || !cardInfo.name || !cardInfo.expiry || !cardInfo.cvv) {
      alert('Veuillez remplir tous les champs')
      return
    }
    
    setProcessing(true)
    
    try {
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // En production, ici on appellerait l'API Stripe
      // const response = await fetch('/api/stripe/process', {...})
      
      // Mettre à jour le statut du devis via l'API admin
      await fetch(`/api/admin/devis/${devis.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'paiement_acompte',
          methode: 'carte',
          montant: devis.montants.acompte,
          reference: `CB-${Date.now()}`
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
            template: 'confirmation_paiement',
            variables: {
              ...devis,
              montant_paye: devis.montants.acompte,
              methode_paiement: 'carte bancaire'
            }
          }
        })
      })
      
      // Rediriger vers la page de collecte de contenu
      router.push(`/projet/${token}?payment=success`)
      
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors du paiement. Veuillez réessayer.')
    } finally {
      setProcessing(false)
    }
  }
  
  const handleVirementPayment = async () => {
    setProcessing(true)
    
    try {
      // Coordonnées bancaires Monabanq
      const iban = 'FR76 1469 0000 0154 0005 4469 827'
      const bic = 'CMCIFRP1MON'
      const reference = `${devis.id}-${Date.now().toString().slice(-6)}`
      
      setVirementInfo({
        iban,
        bic,
        reference,
        montant: devis.montants.acompte.toFixed(2),
        beneficiaire: 'Web Online Concept'
      })
      
      // Envoyer email avec instructions via la nouvelle API
      await fetch('/api/admin/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          data: {
            to: devis.client.email,
            template: 'instructions_virement',
            variables: {
              ...devis,
              reference: reference,
              iban: iban,
              bic: bic,
              beneficiaire: 'Web Online Concept'
            }
          }
        })
      })
      
      // Enregistrer le choix de virement dans le devis
      await fetch(`/api/admin/devis/${devis.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'choix_paiement',
          methode: 'virement',
          reference: reference
        })
      })
      
      setShowConfirmation(true)
      
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setProcessing(false)
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
            <a href="/" className="inline-block mt-6 px-6 py-2 bg-[#0073a8] text-white rounded-lg hover:bg-[#006a87] transition-colors">
              Retour à l'accueil
            </a>
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          {!showConfirmation ? (
            <>
              {/* En-tête */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-[#0073a8] to-[#005a87] text-white p-6">
                  <h1 className="text-2xl font-bold mb-2">Paiement de l'acompte</h1>
                  <p className="opacity-90">Devis {devis.id}</p>
                </div>
                
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Montant total du projet</p>
                      <p className="text-2xl font-bold text-gray-900">{devis.montants.ttc.toFixed(2)} € TTC</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                      <p className="text-sm text-blue-600 mb-1">Acompte à payer (50%)</p>
                      <p className="text-2xl font-bold text-blue-600">{devis.montants.acompte.toFixed(2)} €</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>✅ Acompte : {devis.montants.acompte.toFixed(2)} € à payer maintenant</p>
                    <p>📅 Solde : {devis.montants.solde.toFixed(2)} € à la livraison du projet</p>
                  </div>
                </div>
              </div>
              
              {/* Méthodes de paiement */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Choisissez votre mode de paiement</h2>
                
                {/* Sélection de la méthode */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#0073a8] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-3xl">💳</span>
                    </div>
                    <p className="font-medium">Carte bancaire</p>
                    <p className="text-sm text-gray-600">Paiement immédiat et sécurisé</p>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('virement')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'virement'
                        ? 'border-[#0073a8] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-3xl">🏦</span>
                    </div>
                    <p className="font-medium">Virement bancaire</p>
                    <p className="text-sm text-gray-600">Délai de 2-3 jours ouvrés</p>
                  </button>
                </div>
                
                {/* Formulaire de paiement par carte */}
                {paymentMethod === 'card' && (
                  <form onSubmit={handleCardPayment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro de carte
                      </label>
                      <input
                        type="text"
                        value={cardInfo.number}
                        onChange={(e) => setCardInfo({ 
                          ...cardInfo, 
                          number: formatCardNumber(e.target.value) 
                        })}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du titulaire
                      </label>
                      <input
                        type="text"
                        value={cardInfo.name}
                        onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value.toUpperCase() })}
                        placeholder="DUPONT JEAN"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date d'expiration
                        </label>
                        <input
                          type="text"
                          value={cardInfo.expiry}
                          onChange={(e) => setCardInfo({ 
                            ...cardInfo, 
                            expiry: formatExpiry(e.target.value) 
                          })}
                          placeholder="MM/AA"
                          maxLength="5"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardInfo.cvv}
                          onChange={(e) => setCardInfo({ 
                            ...cardInfo, 
                            cvv: e.target.value.replace(/\D/g, '').slice(0, 3) 
                          })}
                          placeholder="123"
                          maxLength="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Badges de sécurité */}
                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                      <div className="flex items-center justify-center gap-4">
                        <span>🔒 Paiement 100% sécurisé</span>
                        <span>✅ SSL/TLS</span>
                        <span>🛡️ 3D Secure</span>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {processing ? 'Traitement en cours...' : `Payer ${devis.montants.acompte.toFixed(2)} €`}
                    </button>
                  </form>
                )}
                
                {/* Instructions pour virement */}
                {paymentMethod === 'virement' && !virementInfo && (
                  <div className="text-center">
                    <p className="text-gray-600 mb-6">
                      Vous allez recevoir par email les instructions pour effectuer le virement bancaire.
                    </p>
                    <button
                      onClick={handleVirementPayment}
                      disabled={processing}
                      className="px-8 py-3 bg-[#0073a8] text-white rounded-lg font-medium hover:bg-[#006a87] transition-colors disabled:opacity-50"
                    >
                      {processing ? 'Génération des informations...' : 'Recevoir les instructions de virement'}
                    </button>
                  </div>
                )}
                
                {/* Informations de virement */}
                {virementInfo && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">Informations de virement</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-600">Montant :</span>
                        <p className="font-mono font-bold text-lg">{virementInfo.montant} €</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Référence (IMPORTANT) :</span>
                        <p className="font-mono font-bold">{virementInfo.reference}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Bénéficiaire :</span>
                        <p className="font-mono">{virementInfo.beneficiaire}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">IBAN :</span>
                        <p className="font-mono">{virementInfo.iban}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">BIC :</span>
                        <p className="font-mono">{virementInfo.bic}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        ⚠️ N'oubliez pas d'indiquer la référence <strong>{virementInfo.reference}</strong> dans le libellé du virement.
                      </p>
                    </div>
                    
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg text-xs text-gray-600">
                      <p>Web Online Concept - Auto-Entrepreneur</p>
                      <p>SIRET : 510 583 800 00048</p>
                      <p>Dispensé d'immatriculation au RCS et au RM</p>
                    </div>
                    
                    <button
                      onClick={() => setShowConfirmation(true)}
                      className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      J'ai effectué le virement
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Page de confirmation */
            <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-2xl mx-auto">
              <div className="text-green-500 text-6xl mb-6">✅</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {paymentMethod === 'card' ? 'Paiement effectué !' : 'Instructions envoyées !'}
              </h1>
              
              {paymentMethod === 'card' ? (
                <>
                  <p className="text-lg text-gray-600 mb-6">
                    Nous avons bien reçu votre paiement de {devis.montants.acompte.toFixed(2)} €.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-6 text-left mb-6">
                    <h2 className="font-semibold mb-3">Prochaines étapes :</h2>
                    <ol className="space-y-2 text-sm">
                      <li>1️⃣ Vous allez recevoir un email de confirmation</li>
                      <li>2️⃣ Nous vous enverrons un lien pour collecter vos contenus</li>
                      <li>3️⃣ Une fois les contenus reçus, nous commencerons la création</li>
                      <li>4️⃣ Livraison sous 4-6 semaines</li>
                    </ol>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg text-gray-600 mb-6">
                    Les instructions de virement ont été envoyées à {devis.client.email}.
                  </p>
                  <div className="bg-yellow-50 rounded-lg p-6 text-left mb-6">
                    <h2 className="font-semibold mb-3">Important :</h2>
                    <ul className="space-y-2 text-sm">
                      <li>• Effectuez le virement dans les 5 jours ouvrés</li>
                      <li>• Indiquez bien la référence dans le libellé</li>
                      <li>• Vous recevrez une confirmation sous 2-3 jours</li>
                      <li>• Le projet démarrera dès réception du paiement</li>
                    </ul>
                  </div>
                </>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/"
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Retour à l'accueil
                </a>
                <a
                  href="/contact"
                  className="px-6 py-3 bg-[#0073a8] text-white rounded-lg font-medium hover:bg-[#006a87] transition-colors"
                >
                  Nous contacter
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  )
}