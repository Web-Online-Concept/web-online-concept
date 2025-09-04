import { NextResponse } from 'next/server'

// Configuration de l'assistant Florent
const FLORENT_CONTEXT = `Tu es Florent, consultant digital senior chez Web Online Concept. Voici ton profil et tes connaissances :

PERSONNALITÉ :
- Homme de 38 ans, expert en transformation digitale
- Professionnel mais accessible, tu tutoies ou vouvoies selon le contexte
- Passionné par ton métier, tu aimes partager tes connaissances
- Tu es positif et orienté solutions

EXPERTISE WEB ONLINE CONCEPT :
- Spécialiste en création de sites web professionnels
- Expert en référencement SEO et performance web
- Maîtrise des technologies modernes : Next.js, React, Node.js
- Expérience en e-commerce, sites vitrines, applications web

NOS SERVICES ET TARIFS :
1. Site Vitrine (497€) :
   - 5 pages optimisées SEO
   - Design responsive moderne
   - Formulaire de contact
   - Hébergement 1 an inclus
   - Livraison en 7 jours

2. Site E-commerce (997€) :
   - Boutique complète WooCommerce/Shopify
   - Paiement sécurisé
   - Gestion des stocks
   - Formation incluse
   - Livraison en 14 jours

3. Site Sur Mesure (à partir de 1497€) :
   - Développement personnalisé
   - Fonctionnalités avancées
   - Intégrations API
   - Support prioritaire

AVANTAGES CLIENTS :
- Devis gratuit en 24h
- Satisfaction garantie
- Support technique inclus 3 mois
- Formation à la gestion du site
- Optimisation SEO de base incluse

DIRECTIVES :
- Réponds de manière concise mais complète
- Utilise des exemples concrets quand c'est pertinent
- Si on te pose une question hors web, réponds brièvement puis ramène vers nos services
- Propose naturellement un devis gratuit quand c'est approprié
- Reste professionnel mais chaleureux`

export async function POST(request) {
  try {
    const { message } = await request.json()

    // Pour le développement, on utilise une réponse simulée
    // En production, vous devrez intégrer l'API Claude ici
    
    // TODO: Remplacer par l'appel réel à Claude API
    /*
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages: [
          {
            role: 'system',
            content: FLORENT_CONTEXT
          },
          {
            role: 'user',
            content: message
          }
        ]
      })
    })
    
    const data = await response.json()
    const aiResponse = data.content[0].text
    */

    // Réponses simulées pour le développement
    const simulatedResponses = {
      'bonjour': `Bonjour ! Ravi de vous rencontrer. Je suis Florent, consultant digital chez Web Online Concept. Je suis là pour vous accompagner dans votre projet web. 

Que ce soit pour créer un site vitrine, une boutique en ligne ou une application sur mesure, je peux vous conseiller la meilleure solution adaptée à vos besoins et votre budget.

Quel type de projet avez-vous en tête ?`,
      
      'tarif': `Nos tarifs sont très compétitifs et transparents :

📱 Site Vitrine à 497€ : Parfait pour présenter votre activité, avec 5 pages optimisées et un design moderne.

🛍️ E-commerce à 997€ : Une boutique complète pour vendre en ligne, avec paiement sécurisé et gestion des stocks.

⚡ Sur Mesure dès 1497€ : Pour des besoins spécifiques avec des fonctionnalités avancées.

Tous nos sites incluent l'hébergement 1 an et 3 mois de support. Voulez-vous un devis personnalisé gratuit ?`,
      
      'délai': `Nos délais sont parmi les plus rapides du marché :

• Site Vitrine : 7 jours ouvrés
• Site E-commerce : 14 jours ouvrés  
• Site Sur Mesure : 21 à 30 jours selon la complexité

Nous respectons toujours nos engagements de délais. D'ailleurs, nous pouvons commencer votre projet dès cette semaine si vous le souhaitez !`
    }

    // Chercher une réponse correspondante ou réponse par défaut
    let responseText = simulatedResponses['bonjour'] // Réponse par défaut
    
    const lowerMessage = message.toLowerCase()
    for (const [key, value] of Object.entries(simulatedResponses)) {
      if (lowerMessage.includes(key)) {
        responseText = value
        break
      }
    }

    // TODO: Intégrer ElevenLabs pour la génération audio
    // Pour l'instant, on utilisera la synthèse vocale du navigateur
    
    return NextResponse.json({
      response: responseText,
      // audioUrl: null // Sera ajouté avec ElevenLabs
    })
    
  } catch (error) {
    console.error('Erreur API:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}