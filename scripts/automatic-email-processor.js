const fs = require('fs').promises
const path = require('path')
const nodemailer = require('nodemailer')

// Chemins des fichiers
const rulesPath = path.join(__dirname, '../app/data/automatic-rules.json')
const emailsPath = path.join(__dirname, '../app/data/emails.json')
const facturationPath = path.join(__dirname, '../app/data/facturation.json')
const clientsPath = path.join(__dirname, '../app/data/clients.json')
const parametresPath = path.join(__dirname, '../app/data/parametres.json')
const eventsPath = path.join(__dirname, '../app/data/email-events.json')

// Vérifier et créer le fichier events s'il n'existe pas
async function ensureEventsFile() {
  try {
    await fs.access(eventsPath)
  } catch {
    await fs.writeFile(eventsPath, JSON.stringify([], null, 2))
  }
}

// Charger les données
async function loadData(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Erreur lecture ${filePath}:`, error)
    return null
  }
}

// Sauvegarder les données
async function saveData(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

// Obtenir les événements à traiter
async function getUnprocessedEvents() {
  await ensureEventsFile()
  const events = await loadData(eventsPath) || []
  return events.filter(e => !e.processed)
}

// Marquer un événement comme traité
async function markEventProcessed(eventId) {
  const events = await loadData(eventsPath) || []
  const event = events.find(e => e.id === eventId)
  if (event) {
    event.processed = true
    event.processedAt = new Date().toISOString()
    await saveData(eventsPath, events)
  }
}

// Vérifier si une règle doit être déclenchée
async function shouldTriggerRule(rule, event) {
  // Vérifier le type d'événement
  if (rule.trigger !== event.type) return false
  
  // Vérifier les conditions
  const conditions = rule.conditions || {}
  
  // Condition de montant
  if (event.amount !== undefined) {
    if (conditions.minAmount && event.amount < parseFloat(conditions.minAmount)) return false
    if (conditions.maxAmount && event.amount > parseFloat(conditions.maxAmount)) return false
  }
  
  // Condition de statut
  if (conditions.status && conditions.status !== 'all') {
    if (event.status && event.status !== conditions.status) return false
  }
  
  return true
}

// Calculer le délai en millisecondes
function calculateDelay(delay, unit) {
  const multipliers = {
    minutes: 60 * 1000,
    heures: 60 * 60 * 1000,
    jours: 24 * 60 * 60 * 1000
  }
  return delay * (multipliers[unit] || multipliers.heures)
}

// Remplacer les variables dans le texte
function replaceVariables(text, data) {
  let result = text
  
  // Remplacer les variables
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{${key}}`, 'g')
    result = result.replace(regex, data[key] || '')
  })
  
  return result
}

// Envoyer un email
async function sendEmail(emailData, smtpConfig) {
  // Créer le transporteur
  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass
    }
  })
  
  // Envoyer l'email
  const info = await transporter.sendMail({
    from: `"${smtpConfig.fromName}" <${smtpConfig.fromEmail}>`,
    to: emailData.to,
    subject: emailData.subject,
    text: emailData.message,
    html: emailData.message.replace(/\n/g, '<br>')
  })
  
  return info.messageId
}

// Processeur principal
async function processAutomaticEmails() {
  console.log('[' + new Date().toLocaleTimeString() + '] 🤖 Vérification des emails automatiques...')
  
  try {
    // Charger les données
    const [rules, parametres, events] = await Promise.all([
      loadData(rulesPath),
      loadData(parametresPath),
      getUnprocessedEvents()
    ])
    
    if (!rules || !parametres || !parametres.smtp) {
      console.log('❌ Configuration manquante')
      return
    }
    
    // Règles actives uniquement
    const activeRules = rules.filter(r => r.active)
    
    if (activeRules.length === 0) {
      console.log('ℹ️ Aucune règle active')
      return
    }
    
    console.log(`📋 ${activeRules.length} règle(s) active(s), ${events.length} événement(s) à traiter`)
    
    // Traiter chaque événement
    for (const event of events) {
      console.log(`\n🔍 Traitement événement: ${event.type} (${event.id})`)
      
      // Vérifier chaque règle
      for (const rule of activeRules) {
        if (await shouldTriggerRule(rule, event)) {
          console.log(`✅ Règle "${rule.name}" déclenchée`)
          
          // Calculer le moment d'envoi
          const eventTime = new Date(event.timestamp)
          const sendTime = new Date(eventTime.getTime() + calculateDelay(rule.delay, rule.delayUnit))
          const now = new Date()
          
          if (sendTime <= now) {
            // Envoyer maintenant
            console.log(`📤 Envoi immédiat`)
            
            try {
              // Charger le template
              const template = parametres.templates?.find(t => t.id === rule.template)
              if (!template) {
                console.log(`❌ Template ${rule.template} non trouvé`)
                continue
              }
              
              // Préparer les variables
              const variables = {
                prenom: event.clientName?.split(' ')[0] || '',
                entreprise: event.clientCompany || '',
                contact: event.clientName || '',
                numero: event.documentNumber || '',
                montant: event.amount?.toFixed(2) || '',
                date: new Date().toLocaleDateString('fr-FR'),
                date_echeance: event.dueDate || '',
                ...event.customVariables
              }
              
              // Préparer l'email
              const emailData = {
                to: event.clientEmail,
                subject: replaceVariables(template.subject, variables),
                message: replaceVariables(template.message, variables) + '\n\n' + parametres.signature
              }
              
              // Envoyer
              const messageId = await sendEmail(emailData, parametres.smtp)
              
              // Sauvegarder dans l'historique
              const emails = await loadData(emailsPath) || []
              emails.push({
                id: `EMAIL-${Date.now()}`,
                date: new Date().toISOString(),
                to: emailData.to,
                subject: emailData.subject,
                message: emailData.message,
                status: 'sent',
                automatic: true,
                ruleId: rule.id,
                eventId: event.id,
                messageId
              })
              await saveData(emailsPath, emails)
              
              // Mettre à jour les stats de la règle
              rule.lastTriggered = new Date().toISOString()
              rule.emailsSent = (rule.emailsSent || 0) + 1
              await saveData(rulesPath, rules)
              
              console.log(`✅ Email envoyé à ${event.clientEmail}`)
              
            } catch (error) {
              console.error(`❌ Erreur envoi:`, error.message)
            }
          } else {
            // Programmer pour plus tard
            const delayMinutes = Math.round((sendTime - now) / (60 * 1000))
            console.log(`⏰ Email programmé dans ${delayMinutes} minutes`)
            
            // Créer une tâche programmée
            const scheduledTasks = await loadData(path.join(__dirname, '../app/data/scheduled-tasks.json')) || []
            scheduledTasks.push({
              id: `TASK-${Date.now()}`,
              type: 'automatic-email',
              scheduledFor: sendTime.toISOString(),
              ruleId: rule.id,
              eventId: event.id,
              template: rule.template,
              clientEmail: event.clientEmail,
              variables: {
                prenom: event.clientName?.split(' ')[0] || '',
                entreprise: event.clientCompany || '',
                contact: event.clientName || '',
                numero: event.documentNumber || '',
                montant: event.amount?.toFixed(2) || '',
                date: new Date().toLocaleDateString('fr-FR'),
                date_echeance: event.dueDate || '',
                ...event.customVariables
              }
            })
            await saveData(path.join(__dirname, '../app/data/scheduled-tasks.json'), scheduledTasks)
          }
        }
      }
      
      // Marquer l'événement comme traité
      await markEventProcessed(event.id)
    }
    
  } catch (error) {
    console.error('❌ Erreur processeur:', error)
  }
}

// Lancer le processeur toutes les minutes
console.log('🚀 Processeur d\'emails automatiques démarré')
console.log('🔄 Vérification toutes les minutes...')
console.log('💡 Appuyez sur Ctrl+C pour arrêter\n')

// Exécuter immédiatement
processAutomaticEmails()

// Puis toutes les minutes
const interval = setInterval(processAutomaticEmails, 60 * 1000)

// Gérer l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du processeur d\'emails automatiques')
  clearInterval(interval)
  process.exit(0)
})