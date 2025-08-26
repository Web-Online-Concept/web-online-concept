'use client'

import { useState } from 'react'
import Head from 'next/head'

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: '',
    entreprise: '',
    email: '',
    objet: '',
    message: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await res.json()

      if (res.ok) {
        setMessage('✓ Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.')
        setFormData({
          nom: '',
          entreprise: '',
          email: '',
          objet: '',
          message: ''
        })
      } else {
        setMessage(result.error || 'Erreur lors de l\'envoi du message')
      }
    } catch (error) {
      setMessage('Erreur de connexion. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Contact - Web Online Concept</title>
        <meta name="description" content="Contactez Web Online Concept pour discuter de votre projet de site web. Devis gratuit et réponse rapide garantie." />
        <meta name="keywords" content="contact web online concept, devis site web, création site internet toulouse" />
      </Head>

      <div className="min-h-screen bg-gray-50 pt-24">
        {/* Hero */}
        <section className="bg-gradient-to-r from-[#0073a8] to-[#005580] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Contactez-nous
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Parlons de votre projet web
              </p>
            </div>
          </div>
        </section>

        {/* Formulaire */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-8 text-center">Envoyez-nous un message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      value={formData.entreprise}
                      onChange={(e) => setFormData({...formData, entreprise: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objet *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.objet}
                    onChange={(e) => setFormData({...formData, objet: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073a8]"
                    placeholder="Décrivez votre projet, vos besoins..."
                  />
                </div>

                {message && (
                  <div className={`p-4 rounded-lg ${
                    message.includes('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#0073a8] hover:bg-[#005580] transform hover:scale-[1.02]'
                  }`}
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            </div>

            {/* Informations de contact */}
            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold mb-4">Autres moyens de nous contacter</h3>
              <p className="text-gray-600">
                Email : <a href="mailto:web.online.concept@gmail.com" className="text-[#0073a8] hover:underline">
                  web.online.concept@gmail.com
                </a>
              </p>
              <p className="text-gray-600 mt-2">
                Adresse : Rue Paul Estival, 31200 Toulouse
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}