import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

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
- Réponds de manière concise mais complète (maximum 3-4 paragraphes)
- Utilise des exemples concrets quand c'est pertinent
- Si on te pose une question hors web, réponds brièvement puis ramène vers nos services
- Propose naturellement un devis gratuit quand c'est approprié
- Reste professionnel mais chaleureux
- Évite les longs monologues, privilégie les réponses directes`

// Initialiser le client Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
})

export async function POST(request) {
  try {
    const { message } = await request.json()

    // Vérifier que la clé API existe
    if (!process.env.CLAUDE_API_KEY) {
      console.error('CLAUDE_API_KEY manquante')
      
      // Fallback sur les réponses simulées si pas de clé
      return NextResponse.json({
        response: "Je suis désolé, je rencontre un problème de configuration. Permettez-moi de vous présenter nos services : nous créons des sites web professionnels à partir de 497€, avec un design moderne et une livraison rapide. Souhaitez-vous en savoir plus sur nos offres ?"
      })
    }

    try {
      // Appel à Claude API
      const completion = await anthropic.messages.create({
        model: "claude-3-haiku-20240307", // Modèle rapide et économique
        max_tokens: 500,
        temperature: 0.7,
        system: FLORENT_CONTEXT,
        messages: [
          {
            role: "user",
            content: message
          }
        ]
      })

      // Extraire la réponse
      const responseText = completion.content[0].text

      return NextResponse.json({
        response: responseText,
        // audioUrl: null // Sera ajouté avec ElevenLabs
      })

    } catch (apiError) {
      console.error('Erreur Claude API:', apiError)
      
      // Si l'API échoue, utiliser une réponse de fallback intelligente
      const fallbackResponses = {
        'tarif': `Nos tarifs sont très compétitifs :
• Site Vitrine : 497€
• Site E-commerce : 997€  
• Site Sur Mesure : à partir de 1497€

Tous incluent l'hébergement 1 an et 3 mois de support. Voulez-vous un devis personnalisé gratuit ?`,
        
        'service': `Nous proposons 3 formules principales :
1. Site Vitrine pour présenter votre activité
2. Site E-commerce pour vendre en ligne
3. Site Sur Mesure pour des besoins spécifiques

Quelle solution vous intéresse ?`,
        
        'default': `Je suis Florent de Web Online Concept. Nous créons des sites web professionnels adaptés à vos besoins et votre budget. Comment puis-je vous aider dans votre projet web ?`
      }
      
      // Chercher un mot-clé dans le message
      const lowerMessage = message.toLowerCase()
      let response = fallbackResponses.default
      
      if (lowerMessage.includes('tarif') || lowerMessage.includes('prix') || lowerMessage.includes('coût')) {
        response = fallbackResponses.tarif
      } else if (lowerMessage.includes('service') || lowerMessage.includes('offre')) {
        response = fallbackResponses.service
      }
      
      return NextResponse.json({ response })
    }
    
  } catch (error) {
    console.error('Erreur générale:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}