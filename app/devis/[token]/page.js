'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function ConsultationDevis({ params }) {
  const router = useRouter()
  const [devis, setDevis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showRefusModal, setShowRefusModal] = useState(false)
  const [refusRaison, setRefusRaison] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadDevis()
  }, [params.token])

  const loadDevis = async () => {
    try {
      const response = await fetch(`/api/devis?token=${params.token}`)
      
      if (!response.ok) {
        throw new Error('Devis introuvable')
      }
      
      const data = await response.json()
      setDevis(data)
      
      // Marquer comme consulté si c'est la première fois
      if (data.statut === 'valide') {
        await fetch('/api/devis', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: params.token,
            action: 'marquer_consulte'
          })
        })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAccepter = () => {
    // Rediriger vers la page de signature
    router.push(`/devis/${params.token}/signature`)
  }

  const handleRefuser = async () => {
    setSubmitting(true)
    
    try {
      const response = await fetch('/api/devis', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: params.token,
          action: 'refuser_client',
          motif: refusRaison || 'Non précisé'
        })
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors du refus')
      }
      
      // Recharger le devis
      await loadDevis()
      setShowRefusModal(false)
      setRefusRaison('')
      
    } catch (err) {
      alert('Erreur lors du refus du devis')
    } finally {
      setSubmitting(false)
    }
  }

  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(montant)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getJoursRestants = () => {
    if (!devis || !devis.date_creation) return 0
    const dateCreation = new Date(devis.date_creation)
    const dateExpiration = new Date(dateCreation)
    dateExpiration.setDate(dateExpiration.getDate() + 8)
    const joursRestants = Math.ceil((dateExpiration - new Date()) / (1000 * 60 * 60 * 24))
    return Math.max(0, joursRestants)
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0073a8] mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du devis...</p>
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Devis introuvable</h1>
            <p className="text-gray-600 mb-8">
              Le lien que vous avez suivi n'est pas valide ou a expiré.
            </p>
            <Link href="/" className="text-[#0073a8] hover:underline">
              Retour à l'accueil
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // Vérifier si le devis est expiré
  const isExpired = devis.statut === 'expire' || getJoursRestants() === 0

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* En-tête avec statut */}
          <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Devis {devis.id}
                </h1>
                <p className="text-gray-600">
                  Créé le {formatDate(devis.date_creation)}
                </p>
              </div>
              
              <div className="text-right">
                {/* Statut du devis */}
                {devis.statut === 'accepte' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✅ Devis accepté
                  </span>
                )}
                {devis.statut === 'refuse_client' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    ❌ Devis refusé
                  </span>
                )}
                {isExpired && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    ⏰ Devis expiré
                  </span>
                )}
                {(devis.statut === 'valide' || devis.statut === 'consulte') && !isExpired && (
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      ⏳ En attente de votre réponse
                    </span>
                    <p className="text-sm text-orange-600 mt-2">
                      Expire dans {getJoursRestants()} jour{getJoursRestants() > 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Alerte si bientôt expiré */}
            {!isExpired && getJoursRestants() <= 2 && (devis.statut === 'valide' || devis.statut === 'consulte') && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-orange-800 font-medium">
                  ⚠️ Attention : Ce devis expire bientôt !
                </p>
                <p className="text-orange-700 text-sm mt-1">
                  Il ne vous reste que {getJoursRestants()} jour{getJoursRestants() > 1 ? 's' : ''} pour accepter cette offre.
                </p>
              </div>
            )}
          </div>

          {/* Informations client */}
          <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informations client</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Entreprise</p>
                <p className="font-medium">{devis.client.entreprise || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact</p>
                <p className="font-medium">{devis.client.prenom} {devis.client.nom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{devis.client.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-medium">{devis.client.telephone || '-'}</p>
              </div>
            </div>
          </div>

          {/* Détails du projet */}
          <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Détails du projet</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Type de projet</p>
                <p className="font-medium">
                  Site Web Professionnel ({devis.projet.nb_pages_total || devis.projet.nb_pages || 5} pages)
                </p>
              </div>

              {/* Liste des services */}
              {devis.montants.details && devis.montants.details.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Services inclus</p>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {devis.montants.details.map((detail, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{detail.libelle}</span>
                        <span className="font-medium">{formatMontant(detail.prix)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Réduction affilié */}
              {devis.montants.reduction > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="text-green-800">Réduction affilié ({devis.reduction_affilie}%)</span>
                    <span className="font-medium text-green-800">-{formatMontant(devis.montants.reduction)}</span>
                  </div>
                </div>
              )}

              {/* Totaux */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Total HT</span>
                  <span className="font-medium">{formatMontant(devis.montants.ht)}</span>
                </div>
                {devis.montants.tva > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>TVA (20%)</span>
                    <span>{formatMontant(devis.montants.tva)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-[#0073a8]">
                  <span>Total TTC</span>
                  <span>{formatMontant(devis.montants.ttc)}</span>
                </div>
              </div>

              {/* Modalités de paiement */}
              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <h3 className="font-semibold mb-2">Modalités de paiement</h3>
                <ul className="text-sm space-y-1">
                  <li>• Acompte de 50% à la commande : {formatMontant(devis.montants.acompte)}</li>
                  <li>• Solde à la livraison : {formatMontant(devis.montants.ttc - devis.montants.acompte)}</li>
                  <li>• Paiement par virement bancaire ou carte bancaire</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          {(devis.statut === 'valide' || devis.statut === 'consulte') && !isExpired && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Votre décision</h2>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  Ce devis est valable jusqu'au {formatDate(new Date(new Date(devis.date_creation).getTime() + 8 * 24 * 60 * 60 * 1000))}.
                  Passé ce délai, une nouvelle étude tarifaire pourra être nécessaire.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAccepter}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
                  >
                    ✅ Accepter le devis
                  </button>
                  <button
                    onClick={() => setShowRefusModal(true)}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-center"
                  >
                    ❌ Refuser le devis
                  </button>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  En acceptant ce devis, vous serez redirigé vers la page de signature et de paiement.
                </p>
              </div>
            </div>
          )}

          {/* Message si expiré */}
          {isExpired && (
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-4">
                Ce devis a expiré. Si vous êtes toujours intéressé par notre offre, 
                n'hésitez pas à nous contacter pour obtenir un nouveau devis.
              </p>
              <Link
                href="/demande-devis"
                className="inline-block bg-[#0073a8] text-white px-6 py-3 rounded-lg hover:bg-[#005a87] transition-colors"
              >
                Demander un nouveau devis
              </Link>
            </div>
          )}

          {/* Message si accepté */}
          {devis.statut === 'accepte' && (
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <p className="text-green-800 font-medium mb-4">
                ✅ Vous avez accepté ce devis le {formatDate(devis.date_acceptation)}.
              </p>
              {devis.statut_paiement === 'en_attente' && (
                <p className="text-green-700">
                  Nous attendons la réception de votre acompte pour démarrer le projet.
                </p>
              )}
              {devis.statut_paiement === 'acompte_paye' && (
                <p className="text-green-700">
                  Votre projet est en cours de réalisation.
                </p>
              )}
            </div>
          )}

          {/* Message si refusé */}
          {devis.statut === 'refuse_client' && (
            <div className="bg-red-50 rounded-lg p-6 text-center">
              <p className="text-red-800 font-medium mb-4">
                ❌ Vous avez refusé ce devis le {formatDate(devis.date_refus)}.
              </p>
              <p className="text-red-700">
                Si vous changez d'avis, n'hésitez pas à nous contacter pour discuter d'une nouvelle proposition.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de refus */}
      {showRefusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Refuser le devis</h3>
            
            <p className="text-gray-600 mb-4">
              Nous sommes désolés que notre offre ne vous convienne pas. 
              Pourriez-vous nous indiquer la raison de votre refus ?
            </p>

            <div className="space-y-3 mb-4">
              {[
                { value: 'budget', label: 'Budget trop élevé' },
                { value: 'delai', label: 'Délais trop longs' },
                { value: 'perimetre', label: 'Ne correspond pas à mes besoins' },
                { value: 'concurrent', label: 'J\'ai choisi un autre prestataire' },
                { value: 'abandon', label: 'J\'abandonne mon projet' },
                { value: 'autre', label: 'Autre raison' }
              ].map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="refusRaison"
                    value={option.value}
                    onChange={(e) => setRefusRaison(e.target.value)}
                    className="mr-3"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRefusModal(false)
                  setRefusRaison('')
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={submitting}
              >
                Annuler
              </button>
              <button
                onClick={handleRefuser}
                disabled={!refusRaison || submitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Envoi...' : 'Confirmer le refus'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}