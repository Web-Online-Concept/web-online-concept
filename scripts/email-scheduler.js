// Serveur qui vérifie et envoie les emails programmés toutes les minutes
// Lancer avec : node scripts/email-scheduler.js

const fs = require('fs').promises
const path = require('path')
const nodemailer = require('nodemailer')

async function processScheduledEmails() {
  console.log(`[${new Date().toLocaleTimeString()}] 🔄 Vérification des emails programmés...`)
  
  try {
    // Charger les tâches
    const tasksPath = path.join(process.cwd(), 'app', 'data', 'scheduled-tasks.json')
    let tasks = []
    try {
      const tasksData = await fs.readFile(tasksPath, 'utf8')
      const data = JSON.parse(tasksData)
      tasks = data.tasks || []
    } catch (e) {
      console.log('Aucune tâche programmée trouvée')
      return
    }
    
    // Charger la config SMTP
    const configPath = path.join(process.cwd(), 'app', 'data', 'parametres.json')
    const configData = await fs.readFile(configPath, 'utf8')
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
    
    // Filtrer les tâches email en attente dont l'heure est passée
    const now = new Date()
    const emailTasks = tasks.filter(task => 
      task.type === 'email' && 
      task.status === 'pending' &&
      new Date(task.scheduledFor) <= now
    )
    
    if (emailTasks.length > 0) {
      console.log(`📧 ${emailTasks.length} email(s) à envoyer`)
    }
    
    // Traiter chaque email
    for (const task of emailTasks) {
      try {
        console.log(`📤 Envoi à ${task.data.destinataire}...`)
        
        // Charger les infos client si nécessaire pour remplacer les variables
        let objetFinal = task.data.objet
        let messageFinal = task.data.message
        
        if (task.data.clientId || task.data.destinataire) {
          try {
            const clientsPath = path.join(process.cwd(), 'app', 'data', 'clients.json')
            const clientsData = await fs.readFile(clientsPath, 'utf8')
            const clients = JSON.parse(clientsData)
            const client = clients.find(c => c.id === task.data.clientId || c.email === task.data.destinataire)
            
            if (client) {
              // Remplacer les variables client
              objetFinal = objetFinal.replace(/{prenom}/g, client.contact?.split(' ')[0] || '')
              objetFinal = objetFinal.replace(/{entreprise}/g, client.entreprise || '')
              messageFinal = messageFinal.replace(/{prenom}/g, client.contact?.split(' ')[0] || '')
              messageFinal = messageFinal.replace(/{entreprise}/g, client.entreprise || '')
              messageFinal = messageFinal.replace(/{contact}/g, client.contact || '')
            }
          } catch (e) {
            console.log('Client non trouvé')
          }
        }
        
        // Variables générales
        objetFinal = objetFinal.replace(/{date}/g, new Date().toLocaleDateString('fr-FR'))
        messageFinal = messageFinal.replace(/{date}/g, new Date().toLocaleDateString('fr-FR'))
        objetFinal = objetFinal.replace(/{entreprise_nom}/g, config.entreprise?.nom || 'Web Online Concept')
        messageFinal = messageFinal.replace(/{entreprise_nom}/g, config.entreprise?.nom || 'Web Online Concept')
        
        // Préparer l'email
        const mailOptions = {
          from: config.smtp.fromName ? `"${config.smtp.fromName}" <${config.smtp.user}>` : config.smtp.user,
          to: task.data.destinataire,
          subject: objetFinal,
          text: messageFinal,
          html: messageFinal.replace(/\n/g, '<br>')
        }
        
        // Ajouter la signature si active
        if (config.signature?.active && config.signature?.text) {
          mailOptions.text += config.signature.text
          mailOptions.html += config.signature.text.replace(/\n/g, '<br>')
        }
        
        // Gérer les pièces jointes
        if (task.data.pieceJointe) {
          // Ici vous pourriez ajouter la logique pour les pièces jointes
          mailOptions.html += `<br><br><p style="color: #6b7280; font-size: 12px;">📎 Document joint : ${task.data.pieceJointe.nom || 'Document'}</p>`
        }
        
        // Envoyer l'email
        const info = await transporter.sendMail(mailOptions)
        console.log(`✅ Email envoyé ! ID: ${info.messageId}`)
        
        // Marquer la tâche comme complétée
        task.status = 'completed'
        task.completedAt = new Date().toISOString()
        task.messageId = info.messageId
        
        // Mettre à jour l'historique des emails
        const emailsPath = path.join(process.cwd(), 'app', 'data', 'emails.json')
        let emailsData = { emails: [] }
        try {
          const content = await fs.readFile(emailsPath, 'utf8')
          emailsData = JSON.parse(content)
        } catch (e) {}
        
        // Trouver et mettre à jour l'email dans l'historique
        const emailIndex = emailsData.emails.findIndex(e => e.taskId === task.id)
        if (emailIndex !== -1) {
          emailsData.emails[emailIndex].statut = 'envoye'
          emailsData.emails[emailIndex].dateEnvoi = new Date().toISOString()
          emailsData.emails[emailIndex].messageId = info.messageId
        }
        
        await fs.writeFile(emailsPath, JSON.stringify(emailsData, null, 2))
        
      } catch (error) {
        console.error(`❌ Erreur envoi:`, error.message)
        task.status = 'failed'
        task.error = error.message
        task.failedAt = new Date().toISOString()
      }
    }
    
    // Sauvegarder les tâches mises à jour
    if (emailTasks.length > 0) {
      await fs.writeFile(tasksPath, JSON.stringify({ tasks }, null, 2))
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

// Démarrer le scheduler
console.log('🚀 Serveur d\'emails programmés démarré')
console.log('📧 Vérification toutes les minutes...')
console.log('💡 Appuyez sur Ctrl+C pour arrêter\n')

// Vérifier immédiatement au démarrage
processScheduledEmails()

// Puis vérifier toutes les 60 secondes
setInterval(processScheduledEmails, 60 * 1000)

// Gérer l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n\n👋 Arrêt du serveur d\'emails programmés')
  process.exit(0)
})