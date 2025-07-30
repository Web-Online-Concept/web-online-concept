import { NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

// Charger la configuration complète
async function loadConfig() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'data', 'parametres.json')
    const data = await readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return null
  }
}

// POST - Envoyer un email
export async function POST(request) {
  try {
    const body = await request.json()
    const { destinataire, objet, message, pieceJointe, clientId, documentId } = body

    // Charger la config
    const config = await loadConfig()
    const smtp = config?.smtp
    const signature = config?.signature
    
    if (!smtp || !smtp.user || !smtp.pass) {
      return NextResponse.json({ 
        error: 'Configuration email non trouvée. Configurez vos paramètres SMTP.' 
      }, { status: 400 })
    }

    // Import de nodemailer
    const nodemailer = require('nodemailer')

    // Créer le transporteur avec createTransport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtp.user,
        pass: smtp.pass
      }
    })

    // Charger les infos du client si nécessaire
    let client = null
    if (clientId || destinataire) {
      try {
        const clientsPath = path.join(process.cwd(), 'app', 'data', 'clients.json')
        const clientsData = await readFile(clientsPath, 'utf8')
        const clients = JSON.parse(clientsData)
        client = clients.find(c => c.id === clientId || c.email === destinataire)
      } catch (error) {
        console.error('Erreur chargement client:', error)
      }
    }

    // Charger les infos du document si nécessaire
    let document = null
    if (documentId || pieceJointe?.id) {
      try {
        const docsPath = path.join(process.cwd(), 'app', 'data', 'facturation.json')
        const docsData = await readFile(docsPath, 'utf8')
        const docs = JSON.parse(docsData)
        const allDocs = [...(docs.factures || []), ...(docs.devis || [])]
        document = allDocs.find(d => d.id === (documentId || pieceJointe?.id))
      } catch (error) {
        console.error('Erreur chargement document:', error)
      }
    }

    // Fonction pour remplacer les variables
    const replaceVariables = (text) => {
      if (!text) return text
      
      let result = text
      
      // Variables client
      if (client) {
        result = result.replace(/{prenom}/g, client.contact?.split(' ')[0] || '')
        result = result.replace(/{entreprise}/g, client.entreprise || '')
        result = result.replace(/{contact}/g, client.contact || '')
      }
      
      // Variables document
      if (document) {
        result = result.replace(/{numero}/g, document.numero || '')
        result = result.replace(/{montant}/g, document.montantTTC || '')
        result = result.replace(/{date_echeance}/g, document.dateEcheance ? new Date(document.dateEcheance).toLocaleDateString('fr-FR') : '')
        result = result.replace(/{type}/g, document.type || '')
      }
      
      // Variables générales
      result = result.replace(/{date}/g, new Date().toLocaleDateString('fr-FR'))
      result = result.replace(/{entreprise_nom}/g, config?.entreprise?.nom || 'Web Online Concept')
      
      return result
    }

    // Appliquer les remplacements
    const objetFinal = replaceVariables(objet)
    const messageFinal = replaceVariables(message)

    // Ajouter la signature si activée
    let messageWithSignature = messageFinal
    if (signature?.active && signature?.text) {
      messageWithSignature = messageFinal + replaceVariables(signature.text)
    }

    // Options de l'email
    const mailOptions = {
      from: smtp.fromName ? `"${smtp.fromName}" <${smtp.user}>` : smtp.user,
      to: destinataire,
      subject: objetFinal,
      text: messageWithSignature,
      html: messageWithSignature.replace(/\n/g, '<br>')
    }

    // Ajouter la pièce jointe si nécessaire
    if (pieceJointe) {
      mailOptions.attachments = []
      
      if (pieceJointe.type === 'document' && pieceJointe.id) {
        // Générer le PDF du document
        try {
          const pdfResponse = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/admin/facturation/pdf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documentId: pieceJointe.id })
          })

          if (pdfResponse.ok) {
            const pdfHtml = await pdfResponse.text()
            
            // Pour un vrai PDF, on pourrait utiliser Puppeteer
            // Pour l'instant, on envoie en HTML avec extension .html
            mailOptions.attachments.push({
              filename: pieceJointe.nom.replace('.pdf', '.html'),
              content: pdfHtml,
              contentType: 'text/html'
            })
            
            // Note dans le message
            mailOptions.html += `<br><br><p style="color: #6b7280; font-size: 12px;">📎 Document joint : ${pieceJointe.nom}</p>`
          }
        } catch (error) {
          console.error('Erreur génération PDF:', error)
        }
      } else if (pieceJointe.type === 'fichier' && pieceJointe.url) {
        // Fichier uploadé - ajouter le lien
        mailOptions.html += `<br><br><p style="color: #6b7280; font-size: 12px;">📎 Fichier joint : <a href="${pieceJointe.url}">${pieceJointe.nom}</a></p>`
      }
    }

    // Si l'email est programmé, ne pas l'envoyer maintenant
    if (body.dateProgrammee) {
      // Créer une tâche programmée
      const scheduledTask = {
        type: 'email',
        scheduledFor: body.dateProgrammee,
        data: {
          destinataire,
          objet: objetFinal,
          message: messageFinal,
          pieceJointe: body.pieceJointe,
          clientId: body.clientId
        }
      }
      
      // Sauvegarder la tâche
      const taskResponse = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/admin/scheduled-tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduledTask)
      })
      
      if (taskResponse.ok) {
        const taskData = await taskResponse.json()
        
        // Sauvegarder dans l'historique avec statut programmé
        const emailRecord = {
          id: Date.now().toString(),
          destinataire,
          objet: objetFinal,
          message: messageFinal,
          dateEnvoi: body.dateProgrammee,
          statut: 'programme',
          taskId: taskData.task.id,
          ...body
        }
        
        await saveEmailRecord(emailRecord)
        
        return NextResponse.json({ 
          success: true, 
          message: 'Email programmé',
          email: emailRecord,
          task: taskData.task
        })
      }
    }

    // Envoyer l'email immédiatement
    const info = await transporter.sendMail(mailOptions)
    
    // Sauvegarder dans l'historique (envoi immédiat)
    const emailRecord = {
      id: Date.now().toString(),
      destinataire,
      objet: objetFinal,
      message: messageFinal,
      dateEnvoi: new Date().toISOString(),
      statut: 'envoye',
      messageId: info.messageId,
      ...body
    }

    // Sauvegarder l'enregistrement
    await saveEmailRecord(emailRecord)

    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId,
      email: emailRecord 
    })

  } catch (error) {
    console.error('Erreur envoi email:', error)
    return NextResponse.json({ 
      error: error.message || 'Erreur lors de l\'envoi de l\'email' 
    }, { status: 500 })
  }
}

// Sauvegarder l'email dans l'historique
async function saveEmailRecord(email) {
  try {
    const dirPath = path.join(process.cwd(), 'app', 'data')
    const filePath = path.join(dirPath, 'emails.json')
    let data = { emails: [] }
    
    try {
      const content = await readFile(filePath, 'utf8')
      data = JSON.parse(content)
    } catch (e) {
      // Le fichier n'existe pas encore
    }

    data.emails.unshift(email)
    
    await writeFile(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Erreur sauvegarde email:', error)
  }
}