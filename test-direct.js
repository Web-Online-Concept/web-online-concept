// test-direct.js - À exécuter avec: node test-direct.js

async function testEmail() {
  try {
    console.log('1. Import de nodemailer...')
    const nodemailer = require('nodemailer')
    console.log('Nodemailer importé, type:', typeof nodemailer)
    console.log('Propriétés disponibles:', Object.keys(nodemailer))
    
    // Pour nodemailer v7+, il faut peut-être utiliser .default
    const mailer = nodemailer.default || nodemailer
    console.log('Type de mailer:', typeof mailer)
    console.log('createTransporter existe?', typeof mailer.createTransporter)
    
    if (typeof mailer.createTransporter !== 'function') {
      console.error('❌ createTransporter n\'est pas une fonction')
      return
    }
    
    console.log('2. Création du transporteur...')
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'web.online.concept@gmail.com',
        pass: 'haecoeogifsdmqmg'
      }
    })
    console.log('✅ Transporteur créé')
    
    console.log('3. Vérification de la connexion...')
    await transporter.verify()
    console.log('✅ Connexion vérifiée !')
    
    console.log('4. Envoi de l\'email...')
    const info = await transporter.sendMail({
      from: 'web.online.concept@gmail.com',
      to: 'web.online.concept@gmail.com',
      subject: 'Test Direct ✅',
      text: 'Test réussi !'
    })
    console.log('✅ Email envoyé :', info.messageId)
    
  } catch (error) {
    console.error('❌ Erreur :', error.message)
    console.error('Détails :', error)
  }
}

testEmail()