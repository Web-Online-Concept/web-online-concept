"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'

export default function AdminTarifs() {
  const router = useRouter()
  const [tarifs, setTarifs] = useState({
    siteWeb: 500,
    pageSupp: 50,
    hebergement: 40,
    emailPro: 120,
    maintenance: 120,
    redactionSiteComplet: 150,
    redactionPageSupp: 20,
    packImages: 50,
    backOffice: 150
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadTarifs()
  }, [])

  const loadTarifs = async () => {
    try {
      const response = await fetch('/api/admin/tarifs')
      if (response.ok) {
        const data = await response.json()
        // Fusionner avec les valeurs par défaut pour éviter les undefined
        setTarifs({
          siteWeb: data.siteWeb || 500,
          pageSupp: data.pageSupp || 50,
          hebergement: data.hebergement || 40,
          emailPro: data.emailPro || 120,
          maintenance: data.maintenance || 120,
          redactionSiteComplet: data.redactionSiteComplet || 150,
          redactionPageSupp: data.redactionPageSupp || 20,
          packImages: data.packImages || 50,
          backOffice: data.backOffice || 150
        })
      }
      setLoading(false)
    } catch (error) {
      console.error('Erreur chargement tarifs:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/tarifs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tarifs)
      })

      if (response.ok) {
        setMessage('Tarifs mis à jour avec succès !')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setMessage('Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    // Convertir en nombre et s'assurer que c'est positif
    const numValue = Math.max(0, parseInt(value) || 0)
    setTarifs(prev => ({ ...prev, [field]: numValue }))
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-[100px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0073a8] mx-auto"></div>
            <p className="text-gray-600 mt-4">Chargement des tarifs...</p>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/admin" className="text-[#0073a8] hover:underline">
              ← Retour au tableau de bord
            </Link>
          </div>

          {/* Titre */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              💰 Gestion des Tarifs
            </h1>
            <p className="text-gray-600">
              Modifiez vos tarifs ici. Ils seront automatiquement mis à jour sur la page publique et dans le générateur de devis.
            </p>
          </div>

          {/* Message de confirmation */}
          {message && (
            <div className={`rounded-lg p-4 mb-6 ${
              message.includes('succès') 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Offre principale */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                <span className="text-2xl mr-2">🌟</span>
                Notre offre principale
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Web Professionnel (5 pages + légales + hébergement 1 an)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={tarifs.siteWeb}
                    onChange={(e) => handleChange('siteWeb', e.target.value)}
                    className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                    required
                  />
                  <span className="absolute right-3 top-2 text-gray-500">€</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Prix tout compris pour un site 5 pages</p>
              </div>
            </div>

            {/* Options disponibles */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                <span className="text-2xl mr-2">📦</span>
                Options disponibles
              </h2>
              
              <div className="space-y-4">
                {/* Page supplémentaire */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📄 Page supplémentaire
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tarifs.pageSupp}
                      onChange={(e) => handleChange('pageSupp', e.target.value)}
                      className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                      required
                    />
                    <span className="absolute right-3 top-2 text-gray-500">€</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Prix par page au-delà des 5 incluses</p>
                </div>

                {/* Pack images/vidéos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📸 Pack images/vidéos professionnelles (10 médias)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tarifs.packImages}
                      onChange={(e) => handleChange('packImages', e.target.value)}
                      className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                      required
                    />
                    <span className="absolute right-3 top-2 text-gray-500">€</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">10 images/vidéos libres de droits</p>
                </div>

                {/* Forfait maintenance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🛠️ Forfait Maintenance (12 interventions/an)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tarifs.maintenance}
                      onChange={(e) => handleChange('maintenance', e.target.value)}
                      className="w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                      required
                    />
                    <span className="absolute right-3 top-2 text-gray-500">€/an</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Modifications techniques effectuées par nos soins</p>
                </div>

                {/* Rédaction complète */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ✍️ Rédaction complète (5 pages de base)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tarifs.redactionSiteComplet}
                      onChange={(e) => handleChange('redactionSiteComplet', e.target.value)}
                      className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                      required
                    />
                    <span className="absolute right-3 top-2 text-gray-500">€</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Forfait pour la rédaction des 5 pages (2 sessions de corrections incluses)</p>
                </div>

                {/* Rédaction page supplémentaire */}
                <div className="ml-8 border-l-2 border-gray-200 pl-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    → Rédaction page supplémentaire
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tarifs.redactionPageSupp}
                      onChange={(e) => handleChange('redactionPageSupp', e.target.value)}
                      className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                      required
                    />
                    <span className="absolute right-3 top-2 text-gray-500">€</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Par page au-delà des 5 de base</p>
                </div>

                {/* Back Office */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔐 Back Office
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tarifs.backOffice}
                      onChange={(e) => handleChange('backOffice', e.target.value)}
                      className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                      required
                    />
                    <span className="absolute right-3 top-2 text-gray-500">€</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Interface d'administration pour modifier textes et images (formation incluse)</p>
                </div>
              </div>
            </div>

            {/* Services annuels */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                <span className="text-2xl mr-2">📅</span>
                Services annuels (à partir de la 2e année)
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🌐 Hébergement & Domaine
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tarifs.hebergement}
                      onChange={(e) => handleChange('hebergement', e.target.value)}
                      className="w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                      required
                    />
                    <span className="absolute right-3 top-2 text-gray-500">€/an</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Hébergement haute performance + nom de domaine + SSL + sauvegardes</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📧 Email professionnel
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tarifs.emailPro}
                      onChange={(e) => handleChange('emailPro', e.target.value)}
                      className="w-full pl-3 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073a8] focus:border-transparent"
                      required
                    />
                    <span className="absolute right-3 top-2 text-gray-500">€/an</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Par adresse email ({(tarifs.emailPro/12).toFixed(2)}€/mois) • 10 Go • Interface pro</p>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-between items-center">
              <Link
                href="/infos-tarifs"
                target="_blank"
                className="text-[#0073a8] hover:underline flex items-center"
              >
                <span className="mr-1">👁️</span>
                Voir la page publique
              </Link>

              <button
                type="submit"
                disabled={saving}
                className={`px-8 py-3 rounded-lg font-medium text-white transition-all ${
                  saving 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#0073a8] hover:bg-[#005580] transform hover:scale-105'
                }`}
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les tarifs'}
              </button>
            </div>
          </form>

          {/* Informations */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Bon à savoir</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Les tarifs sont mis à jour instantanément sur la page publique</li>
              <li>• Le générateur de devis utilisera automatiquement ces tarifs</li>
              <li>• Les prix s'affichent en TTC (pas de TVA en micro-entreprise)</li>
              <li>• Pensez à informer vos clients en cours si vous augmentez les prix</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}