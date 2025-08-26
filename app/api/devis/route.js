import { NextResponse } from 'next/server'
import { query } from '@/app/lib/db'
import nodemailer from 'nodemailer'
import { jsPDF } from 'jspdf'

// Générer le PDF du devis
function genererPDF(devisData) {
  const doc = new jsPDF()
  const { formData, formuleBase, optionsSelectionnees, total, remise } = devisData
  
  // Configuration des polices et couleurs
  const bleuFonce = '#0073a8'
  const grisTexte = '#4a5568'
  
  // En-tête
  doc.setFillColor(0, 115, 168)
  doc.rect(0, 0, 210, 40, 'F')
  
  // Logo/Titre
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont(undefined, 'bold')
  doc.text('Web Online Concept', 105, 20, { align: 'center' })
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text('Création de Sites Web Professionnels', 105, 30, { align: 'center' })
  
  // Informations de l'entreprise
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(9)
  doc.text([
    'Web Online Concept',
    'SIRET : 510 583 800 00048',
    'Email : web.online.concept@gmail.com'
  ], 15, 50)
  
  // Numéro et date du devis
  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  doc.text(`DEVIS N° ${devisData.numero}`, 105, 70, { align: 'center' })
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 105, 78, { align: 'center' })
  
  // Informations client
  doc.setFillColor(240, 240, 240)
  doc.rect(110, 85, 85, 35, 'F')
  doc.setFontSize(10)
  doc.setFont(undefined, 'bold')
  doc.text('CLIENT', 115, 93)
  doc.setFont(undefined, 'normal')
  doc.setFontSize(9)
  const clientInfo = [
    formData.nom,
    formData.entreprise || '',
    formData.email,
    formData.telephone || ''
  ].filter(Boolean)
  doc.text(clientInfo, 115, 101)
  
  // Tableau des prestations
  let yPosition = 135
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('DÉTAIL DES PRESTATIONS', 15, yPosition)
  
  yPosition += 10
  // En-tête du tableau
  doc.setFillColor(0, 115, 168)
  doc.rect(15, yPosition, 180, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.text('Désignation', 20, yPosition + 6)
  doc.text('Prix HT', 175, yPosition + 6, { align: 'right' })
  
  yPosition += 12
  doc.setTextColor(0, 0, 0)
  doc.setFont(undefined, 'normal')
  
  // Formule de base
  doc.setFont(undefined, 'bold')
  doc.text(formuleBase.nom, 20, yPosition)
  doc.text(`${formuleBase.prix.toFixed(2)} €`, 175, yPosition, { align: 'right' })
  yPosition += 6
  doc.setFont(undefined, 'normal')
  doc.setFontSize(8)
  doc.text(formuleBase.description, 20, yPosition, { maxWidth: 150 })
  yPosition += 10
  
  // Options sélectionnées
  if (optionsSelectionnees.length > 0) {
    doc.setFontSize(9)
    optionsSelectionnees.forEach(option => {
      if (option.quantite > 0) {
        doc.setFont(undefined, 'bold')
        const designation = option.quantite > 1 
          ? `${option.nom} (x${option.quantite})`
          : option.nom
        doc.text(designation, 20, yPosition)
        doc.text(`${option.prixTotal.toFixed(2)} €`, 175, yPosition, { align: 'right' })
        yPosition += 6
        
        if (option.description) {
          doc.setFont(undefined, 'normal')
          doc.setFontSize(8)
          doc.text(option.description, 20, yPosition, { maxWidth: 150 })
          yPosition += 8
        }
      }
    })
  }
  
  // Ligne de séparation
  yPosition += 5
  doc.setDrawColor(200, 200, 200)
  doc.line(15, yPosition, 195, yPosition)
  
  // Totaux
  yPosition += 10
  doc.setFontSize(10)
  
  // Sous-total
  doc.text('Sous-total HT :', 140, yPosition)
  doc.text(`${total.toFixed(2)} €`, 175, yPosition, { align: 'right' })
  yPosition += 8
  
  // Remise
  if (remise && remise.montant > 0) {
    doc.setTextColor(0, 150, 0)
    doc.text(`Remise ${remise.code} :`, 140, yPosition)
    doc.text(`-${remise.montant.toFixed(2)} €`, 175, yPosition, { align: 'right' })
    yPosition += 8
    doc.setTextColor(0, 0, 0)
  }
  
  // TVA
  doc.text('TVA (0%) :', 140, yPosition)
  doc.text('0.00 €', 175, yPosition, { align: 'right' })
  yPosition += 8
  
  // Total
  const montantTotal = total - (remise?.montant || 0)
  doc.setFillColor(0, 115, 168)
  doc.rect(135, yPosition - 5, 60, 10, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont(undefined, 'bold')
  doc.text('TOTAL :', 140, yPosition + 2)
  doc.text(`${montantTotal.toFixed(2)} €`, 175, yPosition + 2, { align: 'right' })
  
  // Conditions et mentions légales
  doc.setTextColor(0, 0, 0)
  doc.setFont(undefined, 'normal')
  doc.setFontSize(8)
  const mentions = [
    'Devis valable 30 jours',
    'Acompte de 50% à la commande',
    'Solde à la livraison',
    'Prix en euros, TVA non applicable - Article 293 B du CGI'
  ]
  doc.text(mentions, 15, 240)
  
  // Signature
  doc.setFontSize(9)
  doc.text('Bon pour accord :', 15, 270)
  doc.text('Date et signature :', 110, 270)
  doc.setDrawColor(200, 200, 200)
  doc.rect(15, 275, 80, 15, 'S')
  doc.rect(110, 275, 80, 15, 'S')
  
  return doc.output('arraybuffer')
}

export async function POST(request) {
  try {
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 30) + '...')

    const data = await request.json()
    const { formData, formuleBase, optionsSelectionnees, total, remise } = data

    // Obtenir la date du jour au format YYYYMMDD
    const aujourd_hui = new Date().toISOString().slice(0,10).replace(/-/g,'')
    
    // Compter le nombre de devis créés aujourd'hui
    const countResult = await query(
      `SELECT COUNT(*) FROM devis WHERE numero LIKE $1`,
      [`DEV-${aujourd_hui}-%`]
    )
    const devisCount = parseInt(countResult.rows[0].count) || 0
    
    // Générer le numéro avec le compteur incrémenté
    const numeroJour = (devisCount + 1).toString().padStart(3, '0')
    const numero = `DEV-${aujourd_hui}-${numeroJour}`

    // Générer le PDF
    const pdfBuffer = genererPDF({ ...data, numero })
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64')

    // Préparer les données pour l'insertion
    const formuleBaseJson = JSON.stringify({
      nom: formuleBase.nom,
      prix: formuleBase.prix,
      description: formuleBase.description
    })

    const optionsJson = JSON.stringify(
      optionsSelectionnees
        .filter(opt => opt.quantite > 0)
        .map(opt => ({
          id: opt.id,
          nom: opt.nom,
          prix: opt.prix,
          quantite: opt.quantite,
          prixTotal: opt.prixTotal,
          unite: opt.unite,
          description: opt.description
        }))
    )

    // Insérer dans la base de données
    const insertQuery = `
      INSERT INTO devis (
        numero, client_nom, client_email, client_telephone, client_entreprise,
        formule_base, options_selectionnees, 
        total_ht, tva, total_ttc,
        code_promo, reduction, type_reduction,
        statut, pdf_content, message_client,
        ip_client, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    `

    console.log('Executing query:', insertQuery.trim())

    const insertResult = await query(insertQuery, [
      numero,
      formData.nom,
      formData.email,
      formData.telephone || null,
      formData.entreprise || null,
      formuleBaseJson,
      optionsJson,
      total,
      0, // TVA à 0 pour micro-entreprise
      total - (remise?.montant || 0),
      remise?.code || null,
      remise?.montant || 0,
      remise?.type || null,
      'envoyé',
      pdfBase64,
      formData.message || null,
      formData.ip || null,
      formData.userAgent || null
    ])

    console.log('Query executed successfully', { duration: Date.now() - Date.now(), rows: insertResult.rows.length })

    // Configuration du transporteur email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    // Email au client (sans PDF)
    const mailOptionsClient = {
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: `Votre demande de devis - ${numero}`,
      html: `
        <h2>Bonjour ${formData.nom},</h2>
        <p>Nous avons bien reçu votre demande de devis.</p>
        <p><strong>Référence :</strong> ${numero}</p>
        
        <h3>Prochaines étapes :</h3>
        <ol>
          <li>Nous allons étudier votre demande et vous enverrons dans les 24/48h un devis personnalisé</li>
          <li>Si vous acceptez le devis, faites rapidement le paiement des 50% du solde (infos sur le devis)</li>
          <li>Une fois votre paiement reçu, nous vous contacterons rapidement par téléphone afin de faire le point sur le projet</li>
        </ol>
        
        <p>Pour toute question, contactez-nous à : web.online.concept@gmail.com</p>
        
        <p>Cordialement,<br>L'équipe Web Online Concept</p>
      `
    }

    // Email à l'administrateur (avec PDF)
    const mailOptionsAdmin = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Nouveau devis ${numero} - ${formData.nom}`,
      html: `
        <h2>Nouveau devis reçu</h2>
        <p><strong>Numéro :</strong> ${numero}</p>
        <p><strong>Client :</strong> ${formData.nom}</p>
        <p><strong>Email :</strong> ${formData.email}</p>
        <p><strong>Téléphone :</strong> ${formData.telephone || 'Non renseigné'}</p>
        <p><strong>Entreprise :</strong> ${formData.entreprise || 'Non renseignée'}</p>
        <p><strong>Total HT :</strong> ${total.toFixed(2)} €</p>
        ${remise ? `<p><strong>Remise :</strong> ${remise.montant.toFixed(2)} € (${remise.code})</p>` : ''}
        <p><strong>Total final :</strong> ${(total - (remise?.montant || 0)).toFixed(2)} €</p>
        ${formData.message ? `<p><strong>Message :</strong> ${formData.message}</p>` : ''}
      `,
      attachments: [{
        filename: `devis-${numero}.pdf`,
        content: pdfBase64,
        encoding: 'base64'
      }]
    }

    // Envoyer les emails
    await transporter.sendMail(mailOptionsClient)
    await transporter.sendMail(mailOptionsAdmin)

    return NextResponse.json({
      success: true,
      numero,
      message: 'Devis envoyé avec succès'
    })

  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création du devis' },
      { status: 500 }
    )
  }
}