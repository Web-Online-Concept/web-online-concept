import { NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

// GET - Récupérer les paramètres
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'data', 'parametres.json')
    
    try {
      const data = await readFile(filePath, 'utf8')
      const parametres = JSON.parse(data)
      console.log('Paramètres chargés depuis le fichier')
      return NextResponse.json(parametres)
    } catch (error) {
      console.log('Fichier parametres.json non trouvé, utilisation des valeurs par défaut')
      // Si le fichier n'existe pas, retourner les paramètres par défaut
      const defaultParams = {
        entreprise: {
          nom: "Web Online Concept",
          email: "web.online.concept@gmail.com"
        },
        smtp: {
          service: "gmail",
          user: "web.online.concept@gmail.com",
          pass: "haecoeogifsdmqmg",
          fromName: "Web Online Concept"
        },
        signature: {
          active: true,
          text: "\n\n--\nCordialement,\n\nWeb Online Concept"
        },
        templates: {
          devis: {
            objet: "Devis {numero} - {entreprise}",
            message: "Bonjour {prenom},\n\nJe vous prie de trouver ci-joint le devis {numero}.\n\nCordialement,\n{entreprise_nom}"
          },
          facture: {
            objet: "Facture {numero} - {entreprise}",
            message: "Bonjour {prenom},\n\nJe vous prie de trouver ci-joint la facture {numero}.\n\nCordialement,\n{entreprise_nom}"
          },
          relance: {
            objet: "Relance - Facture {numero}",
            message: "Bonjour {prenom},\n\nLa facture {numero} reste impayée.\n\nCordialement,\n{entreprise_nom}"
          },
          remerciement: {
            objet: "Merci - {entreprise}",
            message: "Bonjour {prenom},\n\nMerci pour votre confiance.\n\nCordialement,\n{entreprise_nom}"
          }
        }
      }
      return NextResponse.json(defaultParams)
    }
  } catch (error) {
    console.error('Erreur GET parametres:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Sauvegarder les paramètres
export async function POST(request) {
  try {
    const body = await request.json()
    
    const dirPath = path.join(process.cwd(), 'app', 'data')
    const filePath = path.join(dirPath, 'parametres.json')
    
    // Créer le dossier s'il n'existe pas
    await mkdir(dirPath, { recursive: true })
    
    // Sauvegarder les paramètres
    await writeFile(filePath, JSON.stringify(body, null, 2))
    
    return NextResponse.json({ success: true, message: 'Paramètres sauvegardés' })
  } catch (error) {
    console.error('Erreur POST parametres:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}