import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { Pool } from 'pg'

// Configuration de la base de données
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Configuration de l'envoi d'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export async function POST(request) {
  try {
    const body = await request.json()
    const { nom, entreprise, email, objet, message } = body

    // Validation
    if (!nom || !email || !objet || !message) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      )
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    // Récupérer l'IP (pour sécurité)
    const ip = request.headers.get('x-forwarded-for') || 'Unknown'

    // Enregistrer temporairement dans la base
    const insertQuery = `
      INSERT INTO messages_contact (nom, entreprise, email, objet, message, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `
    
    const result = await pool.query(insertQuery, [nom, entreprise || null, email, objet, message, ip])
    const messageId = result.rows[0].id

    // Email pour vous
    const mailOptionsAdmin = {
      from: process.env.EMAIL_USER,
      to: 'web.online.concept@gmail.com',
      subject: `[Contact Site] ${objet}`,
      html: `
        <h2>Nouveau message depuis le site web</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Nom :</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${nom}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Entreprise :</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${entreprise || 'Non renseignée'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email :</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Objet :</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${objet}</td>
          </tr>
        </table>
        <h3>Message :</h3>
        <div style="padding: 15px; background-color: #f5f5f5; border-radius: 5px; margin-top: 10px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          ID Message : ${messageId}<br>
          IP : ${ip}<br>
          Date : ${new Date().toLocaleString('fr-FR')}
        </p>
      `
    }

    // Email de confirmation pour le client
    const mailOptionsClient = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmation de votre message - Web Online Concept',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0073a8; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Web Online Concept</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f8f9fa;">
            <h2 style="color: #333;">Bonjour ${nom},</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Nous avons bien reçu votre message et nous vous en remercions. 
              Notre équipe vous répondra dans les plus brefs délais.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0073a8; margin-top: 0;">Récapitulatif de votre message :</h3>
              <p><strong>Objet :</strong> ${objet}</p>
              <p><strong>Message :</strong></p>
              <div style="padding: 10px; background-color: #f5f5f5; border-left: 4px solid #0073a8;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              En attendant, n'hésitez pas à consulter notre site pour découvrir nos services :
              <a href="https://www.web-online-concept.com" style="color: #0073a8;">www.web-online-concept.com</a>
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Cordialement,<br>
              <strong>L'équipe Web Online Concept</strong>
            </p>
          </div>
          
          <div style="background-color: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 5px 0;">Web Online Concept - Création de sites web</p>
            <p style="margin: 5px 0;">Rue Paul Estival, 31200 Toulouse</p>
            <p style="margin: 5px 0;">Email : web.online.concept@gmail.com</p>
          </div>
        </div>
      `
    }

    // Envoyer les emails
    await transporter.sendMail(mailOptionsAdmin)
    await transporter.sendMail(mailOptionsClient)

    // Mettre à jour le statut
    await pool.query(
      'UPDATE messages_contact SET statut = $1 WHERE id = $2',
      ['envoyé', messageId]
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Message envoyé avec succès'
    })

  } catch (error) {
    console.error('Erreur envoi message:', error)
    
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}