import { NextResponse } from 'next/server'
import { generateEmail, getTemplate, getAllTemplates } from '@/lib/email-templates'
import { generateDevisPDF, getPDFBase64 } from '@/lib/pdf-generator'

// Configuration email (à adapter selon votre service)
const EMAIL_CONFIG = {
  from: 'Web Online Concept <web.online.concept@gmail.com>',
  replyTo: 'web.online.concept@gmail.com'
}

// Fonction pour envoyer un email via votre API existante
async function sendEmailViaAPI(emailData) {
  try {
    // Utiliser votre API d'envoi existante
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/emails/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinataire: emailData.to,
        objet: emailData.subject,
        message: emailData.message,
        attachments: emailData.attachments || [],
        template: emailData.templateId || null,
        automatic: emailData.automatic || false
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erreur envoi email')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erreur envoi email:', error)
    throw error
  }
}

// GET - Récupérer les templates disponibles
export async function GET() {
  try {
    const templates = getAllTemplates()
    
    return NextResponse.json({
      success: true,
      templates: templates.map(t => ({
        id: t.id,
        nom: t.nom,
        objet: t.objet,
        description: t.message.substring(0, 100) + '...'
      }))
    })
  } catch (error) {
    console.error('Erreur GET templates:', error)
    return NextResponse.json({ error: 'Erreur lors du chargement des templates' }, { status: 500 })
  }
}

// POST - Envoyer un email
export async function POST(request) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    switch (action) {
      case 'send_devis_notification':
        return await sendDevisNotification(data)
        
      case 'send_devis_validated':
        return await sendDevisValidated(data)
        
      case 'send_payment_confirmation':
        return await sendPaymentConfirmation(data)
        
      case 'send_content_reminder':
        return await sendContentReminder(data)
        
      case 'send_custom':
        return await sendCustomEmail(data)
        
      default:
        return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 })
    }
  } catch (error) {
    console.error('Erreur POST email:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'envoi de l\'email' }, { status: 500 })
  }
}

// Envoyer notification de nouvelle demande de devis
async function sendDevisNotification(data) {
  const { devis, adminEmail } = data
  
  // Préparer les données pour le template
  const templateData = {
    ...devis,
    lienDevis: `${process.env.NEXT_PUBLIC_BASE_URL}/devis/${devis.token}`,
    messagePersonnalise: devis.projet.description || ''
  }
  
  // Email au client
  const clientEmail = generateEmail('demande_devis_client', templateData)
  await sendEmailViaAPI({
    to: devis.client.email,
    subject: clientEmail.objet,
    message: clientEmail.message,
    templateId: 'demande_devis_client'
  })
  
  // Email à l'admin
  const adminEmailContent = generateEmail('demande_devis_admin', templateData)
  await sendEmailViaAPI({
    to: adminEmail || 'web.online.concept@gmail.com',
    subject: adminEmailContent.objet,
    message: adminEmailContent.message,
    templateId: 'demande_devis_admin',
    automatic: true
  })
  
  return NextResponse.json({ success: true, message: 'Notifications envoyées' })
}

// Envoyer devis validé avec PDF
async function sendDevisValidated(data) {
  const { devis, messagePersonnalise } = data
  
  // Générer le PDF
  const pdfDoc = await generateDevisPDF(devis)
  const pdfBase64 = getPDFBase64(pdfDoc)
  
  // Préparer les données pour le template
  const templateData = {
    ...devis,
    lienDevis: `${process.env.NEXT_PUBLIC_BASE_URL}/devis/${devis.token}`,
    messagePersonnalise: messagePersonnalise || ''
  }
  
  // Générer l'email
  const email = generateEmail('devis_valide', templateData)
  
  // Envoyer avec pièce jointe
  await sendEmailViaAPI({
    to: devis.client.email,
    subject: email.objet,
    message: email.message,
    attachments: [{
      filename: `devis-${devis.id}.pdf`,
      content: pdfBase64,
      encoding: 'base64'
    }],
    templateId: 'devis_valide'
  })
  
  return NextResponse.json({ success: true, message: 'Devis envoyé avec PDF' })
}

// Envoyer confirmation de paiement
async function sendPaymentConfirmation(data) {
  const { devis, montantPaye, methodePaiement } = data
  
  // Préparer les données pour le template
  const templateData = {
    ...devis,
    montant_acompte: montantPaye,
    lienContenu: `${process.env.NEXT_PUBLIC_BASE_URL}/projet/${devis.token}`,
    methodePaiement
  }
  
  // Email au client
  const email = generateEmail('confirmation_paiement', templateData)
  await sendEmailViaAPI({
    to: devis.client.email,
    subject: email.objet,
    message: email.message,
    templateId: 'confirmation_paiement'
  })
  
  // Notification admin
  await sendEmailViaAPI({
    to: 'web.online.concept@gmail.com',
    subject: `💰 Paiement reçu - ${devis.id}`,
    message: `Paiement de ${montantPaye}€ reçu pour le devis ${devis.id} (${devis.client.entreprise || devis.client.nom})`,
    automatic: true
  })
  
  return NextResponse.json({ success: true, message: 'Confirmation de paiement envoyée' })
}

// Envoyer rappel collecte contenus
async function sendContentReminder(data) {
  const { devis, daysSincePayment } = data
  
  const templateData = {
    ...devis,
    lienContenu: `${process.env.NEXT_PUBLIC_BASE_URL}/projet/${devis.token}`,
    joursDepuisPaiement: daysSincePayment
  }
  
  const email = generateEmail('rappel_collecte_contenus', templateData)
  await sendEmailViaAPI({
    to: devis.client.email,
    subject: email.objet,
    message: email.message,
    templateId: 'rappel_collecte_contenus',
    automatic: true
  })
  
  return NextResponse.json({ success: true, message: 'Rappel envoyé' })
}

// Envoyer email personnalisé avec template
async function sendCustomEmail(data) {
  const { to, templateId, variables, attachments } = data
  
  // Vérifier que le template existe
  const template = getTemplate(templateId)
  if (!template) {
    return NextResponse.json({ error: 'Template non trouvé' }, { status: 404 })
  }
  
  // Générer l'email
  const email = generateEmail(templateId, variables)
  
  // Envoyer
  await sendEmailViaAPI({
    to,
    subject: email.objet,
    message: email.message,
    attachments: attachments || [],
    templateId
  })
  
  return NextResponse.json({ success: true, message: 'Email personnalisé envoyé' })
}

// Fonction utilitaire pour programmer des relances automatiques
export async function scheduleAutomaticReminders(devisId) {
  // Cette fonction pourrait être appelée par un cron job ou un système de queue
  
  const reminders = [
    { days: 3, template: 'relance_devis_non_consulte', condition: 'non_consulte' },
    { days: 7, template: 'relance_devis_consulte', condition: 'consulte' },
    { days: 25, template: 'devis_expire', condition: 'avant_expiration' }
  ]
  
  // Logique pour programmer les relances
  // À implémenter selon votre système de gestion des tâches
  
  return reminders
}