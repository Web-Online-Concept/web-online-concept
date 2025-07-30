// Script à exécuter régulièrement pour envoyer les emails programmés
// Peut être lancé avec : node scripts/email-cron.js

import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import nodemailer from 'nodemailer'

async function processScheduledEmails() {
  console.log('🔄 Vérification des emails programmés...')
  
  try {
    // Charger les tâches
    const tasksPath = path.join(process.cwd(), 'app', 'data', 'scheduled-tasks.json')
    const tasksData = await readFile(tasksPath, 'utf8')
    const { tasks } = JSON.parse(tasksData)
    
    // Charger la config SMTP
    const configPath = path.join(process.cwd(), 'app', 'data', 'parametres.json')
    const configData = await readFile(configPath, 'utf8')
    const config = JSON.parse(configData)
    
    if (!config.smtp) {
      console.error('❌ Configuration SMTP manquante')
      return
    }
    
    // Créer le transporteur
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass
      }
    })
    
    // Filtrer les tâches email en attente
    const now = new Date()
    const emailTasks = tasks.filter(task => 
      task.type === 'email' && 
      task.status === 'pending' &&
      new Date(task.scheduledFor) <= now
    )
    
    console.log(`📧 ${emailTasks.length} emails à envoyer`)
    
    // Traiter chaque email
    for (const task of emailTasks) {
      try {
        console.log(`📤 Envoi de l'email à ${task.data.destinataire}...`)
        
        // Préparer l'email
        const mailOptions = {
          from: config.smtp.fromName ? `"${config.smtp.fromName}" <${config.smtp.user}>` : config.smtp.user,
          to: task.data.destinataire,
          subject: task.data.objet,
          text: task.data.message,
          html: task.data.message.replace(/\n/g, '<br>')
        }
        
        // Ajouter la signature si active
        if (config.signature?.active && config.signature?.text) {
          mailOptions.text += config.signature.text
          mailOptions.html += config.signature.text.replace(/\n/g, '<br>')
        }
        
        // Envoyer l'email
        const info = await transporter.sendMail(mailOptions)
        console.log(`✅ Email envoyé ! Message ID: ${info.messageId}`)
        
        // Marquer la tâche comme complétée
        task.status = 'completed'
        task.completedAt = new Date().toISOString()
        task.messageId = info.messageId
        
        // Mettre à jour l'historique des emails
        const emailsPath = path.join(process.cwd(), 'app', 'data', 'emails.json')
        let emailsData = { emails: [] }
        try {
          const content = await readFile(emailsPath, 'utf8')
          emailsData = JSON.parse(content)
        } catch (e) {}
        
        // Trouver et mettre à jour l'email dans l'historique
        const emailIndex = emailsData.emails.findIndex(e => e.taskId === task.id)
        if (emailIndex !== -1) {
          emailsData.emails[emailIndex].statut = 'envoye'
          emailsData.emails[emailIndex].dateEnvoi = new Date().toISOString()
          emailsData.emails[emailIndex].messageId = info.messageId
        }
        
        await writeFile(emailsPath, JSON.stringify(emailsData, null, 2))
        
      } catch (error) {
        console.error(`❌ Erreur envoi email ${task.id}:`, error.message)
        task.status = 'failed'
        task.error = error.message
      }
    }
    
    // Sauvegarder les tâches mises à jour
    await writeFile(tasksPath, JSON.stringify({ tasks }, null, 2))
    
    console.log('✅ Traitement terminé')
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

// Exécuter immédiatement
processScheduledEmails()

// Pour une exécution régulière, vous pouvez :
// 1. Utiliser un cron job système (Linux/Mac)
// 2. Utiliser le planificateur de tâches Windows
// 3. Utiliser un service comme node-cron
// 4. L'intégrer dans votre API Next.js avec une route spéciale