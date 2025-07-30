import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { smtp } = await request.json()
    
    if (!smtp || !smtp.user || !smtp.pass) {
      return NextResponse.json({ 
        error: 'Configuration incomplète'
      }, { status: 400 })
    }

    // Import de nodemailer
    const nodemailer = require('nodemailer')
    
    // Créer le transporteur avec createTransport (pas createTransporter!)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtp.user,
        pass: smtp.pass
      }
    })
    
    // Vérifier la connexion
    await transporter.verify()
    
    // Envoyer un email de test
    const info = await transporter.sendMail({
      from: smtp.fromName ? `"${smtp.fromName}" <${smtp.user}>` : smtp.user,
      to: smtp.user,
      subject: '✅ Test de configuration email réussi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Configuration email validée !</h2>
          <p>Votre configuration SMTP est correcte et fonctionnelle.</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            <strong>Serveur :</strong> Gmail<br>
            <strong>Email :</strong> ${smtp.user}<br>
            <strong>Nom d'affichage :</strong> ${smtp.fromName || 'Non défini'}
          </p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            Cet email a été envoyé depuis votre système de gestion.
          </p>
        </div>
      `
    })

    return NextResponse.json({ 
      success: true,
      messageId: info.messageId
    })

  } catch (error) {
    console.error('Erreur test email:', error)
    return NextResponse.json({ 
      error: error.message || 'Erreur lors du test de configuration'
    }, { status: 500 })
  }
}