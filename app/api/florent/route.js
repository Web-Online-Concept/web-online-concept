import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { companyInfo } from '@/config/company-info'

// Configuration de l'assistant Florent
const FLORENT_CONTEXT = `Tu es Florent, consultant digital senior chez ${companyInfo.general.name}. Voici les informations complètes sur l'entreprise :

PROFIL :
- Homme de 38 ans, expert en transformation digitale
- Consultant passionné et professionnel
- Tu peux répondre à TOUTES les questions, pas seulement sur le web
- Tu es cultivé et peux discuter de nombreux sujets
- Quand c'est pertinent, tu peux mentionner nos services

ENTREPRISE :
- Nom : ${companyInfo.general.name}
- Forme juridique : ${companyInfo.general.legalName}
- SIRET : ${companyInfo.general.siret}
- Email : ${companyInfo.general.email}
- Localisation : ${companyInfo.general.address}
- Baseline : "${companyInfo.general.baseline}"
- SITE WEB OFFICIEL : ${companyInfo.general.website} (ATTENTION : c'est .COM, pas .FR !)

IMPORTANT - INFORMATIONS CRITIQUES À NE JAMAIS CONFONDRE :
- Notre site : www.web-online-concept.com (AVEC tirets, domaine .COM)
- Email : web.online.concept@gmail.com
- Localisation : TOULOUSE (31200), PAS une autre ville

ÉQUIPE :
- ${companyInfo.team.size} : ${companyInfo.team.expertise.join(', ')}
- ${companyInfo.team.approach}

SERVICE PRINCIPAL - ${companyInfo.services.formuleBase.nom} :
- Prix : ${companyInfo.services.formuleBase.prix}€ HT (TVA non applicable)
- Description : ${companyInfo.services.formuleBase.description}
Inclus :
${companyInfo.services.formuleBase.inclus.map(item => `• ${item}`).join('\n')}

OPTIONS DISPONIBLES :
${companyInfo.options.map(opt => 
  `• ${opt.nom} : ${opt.prix}€ ${opt.unite || ''} - ${opt.description}`
).join('\n')}

PROCESSUS DE CRÉATION :
${companyInfo.processus.etapes.map(e => 
  `${e.num}. ${e.titre} (${e.delai}) : ${e.description}`
).join('\n')}

CONDITIONS :
- Paiement : ${companyInfo.conditions.paiement.acompte}, puis ${companyInfo.conditions.paiement.solde}
- Mode : ${companyInfo.conditions.paiement.modalites}
- Délai devis : ${companyInfo.conditions.delais.devis}
- Délai création : ${companyInfo.conditions.delais.siteVitrine}

AVANTAGES :
${companyInfo.avantages.map(a => `• ${a}`).join('\n')}

DIRECTIVES CRITIQUES :
- SOIS CONCIS : 1-2 phrases max pour les questions simples
- Tu as des connaissances jusqu'en janvier 2025, donc tu CONNAIS les événements de 2022, 2023, 2024
- Exemple Coupe du Monde 2022 : "La France a perdu en finale contre l'Argentine 4-2 aux tirs au but après un match nul 3-3"
- Pour la météo actuelle : dis le climat typique de la saison
- Mentionne Web Online Concept UNIQUEMENT si on te parle de sites web
- Ne dis JAMAIS que tu n'as pas accès aux données, dis ce que tu sais
- Reste naturel et direct, comme une vraie conversation`

// Initialiser le client Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
})

// Fonction pour générer l'audio avec ElevenLabs
async function generateAudio(text) {
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error('ELEVENLABS_API_KEY manquante')
    return null
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/onwK4e9ZLuTAKqWW03F9', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true
        }
      })
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`)
    }

    // Convertir la réponse en base64
    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')
    
    return `data:audio/mpeg;base64,${base64Audio}`
  } catch (error) {
    console.error('Erreur ElevenLabs:', error)
    return null
  }
}

export async function POST(request) {
  try {
    const { message } = await request.json()

    // Vérifier que la clé API existe
    if (!process.env.CLAUDE_API_KEY) {
      console.error('CLAUDE_API_KEY manquante')
      
      // Fallback sur les réponses simulées si pas de clé
      return NextResponse.json({
        response: "Je suis désolé, je rencontre un problème de configuration. Permettez-moi de vous présenter nos services : nous créons des sites web professionnels à partir de 500€, avec un design moderne et une livraison rapide. Souhaitez-vous en savoir plus sur nos offres ?"
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

      // Générer l'audio avec ElevenLabs
      const audioUrl = await generateAudio(responseText)

      return NextResponse.json({
        response: responseText,
        audioUrl: audioUrl // URL audio ou null si erreur
      })

    } catch (apiError) {
      console.error('Erreur Claude API:', apiError)
      
      // Si l'API échoue, utiliser une réponse de fallback intelligente
      const fallbackResponses = {
        'tarif': `Nos tarifs sont très compétitifs :
• Site Vitrine : 500€ HT
• Options disponibles selon vos besoins
• Maintenance annuelle : 120€

Tous incluent l'hébergement 1 an et 3 mois de support. Voulez-vous un devis personnalisé gratuit ?`,
        
        'service': `Nous proposons une formule de base à 500€ comprenant :
- Site 5 pages personnalisé
- Design responsive moderne
- Hébergement 1 an inclus
- Formation et support

Plus de nombreuses options (e-commerce, blog, multilingue...). Quelle solution vous intéresse ?`,
        
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