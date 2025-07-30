// test-email.js - À exécuter avec: node test-email.js

async function testEmail() {
  try {
    console.log('1. Import de nodemailer...')
    const nodemailer = require('nodemailer')
    console.log('✅ Nodemailer importé')
    
    console.log('2. Création du transporteur...')
    // UTILISER createTransport et non createTransporter !
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
      from: '"Web Online Concept" <web.online.concept@gmail.com>',
      to: 'web.online.concept@gmail.com',
      subject: 'Test Email Fonctionnel ✅',
      text: 'Si vous recevez cet email, votre configuration fonctionne !',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #10b981;">✅ Test réussi !</h2>
          <p>Si vous recevez cet email, votre configuration fonctionne correctement.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">
            Email envoyé depuis votre système de gestion<br>
            Web Online Concept
          </p>
        </div>
      `
    })
    console.log('✅ Email envoyé ! Message ID:', info.messageId)
    console.log('✅ Réponse:', info.response)
    
  } catch (error) {
    console.error('❌ Erreur :', error.message)
    if (error.code === 'EAUTH') {
      console.error('\n⚠️  Erreur d\'authentification Gmail:')
      console.error('1. Vérifiez que la validation en 2 étapes est activée')
      console.error('2. Créez un mot de passe d\'application sur:')
      console.error('   https://myaccount.google.com/apppasswords')
      console.error('3. Utilisez ce mot de passe (sans espaces) dans le code')
    }
  }
}

console.log('Test d\'envoi d\'email avec Nodemailer\n')
console.log('Configuration:')
console.log('- Email:', 'web.online.concept@gmail.com')
console.log('- Service:', 'Gmail')
console.log('- Mot de passe:', '****' + '\n')

testEmail()