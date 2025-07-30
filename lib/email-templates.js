// Templates d'emails pour le système de devis

// Helper pour remplacer les variables dans les templates
export function replaceVariables(template, data) {
  let content = template
  
  // Variables disponibles adaptées à la nouvelle structure
  const variables = {
    '{prenom}': data.client?.prenom || '',
    '{nom}': data.client?.nom || '',
    '{entreprise}': data.client?.entreprise || '',
    '{email}': data.client?.email || '',
    '{telephone}': data.client?.telephone || '',
    '{numero_devis}': data.id || data.numero || '',
    '{date_devis}': data.date_creation ? new Date(data.date_creation).toLocaleDateString('fr-FR') : '',
    '{montant_ht}': data.montants?.ht ? `${data.montants.ht.toFixed(2)} €` : '',
    '{montant_ttc}': data.montants?.ttc ? `${data.montants.ttc.toFixed(2)} €` : '',
    '{montant_acompte}': data.montants?.acompte ? `${data.montants.acompte.toFixed(2)} €` : '',
    '{validite_jours}': '30',
    '{date_expiration}': data.date_validite ? new Date(data.date_validite).toLocaleDateString('fr-FR') : '',
    '{lien_devis}': data.lienDevis || '',
    '{lien_paiement}': data.lienPaiement || '',
    '{lien_contenu}': data.lienContenu || '',
    '{type_projet}': getTypeProjetLabel(data.projet),
    '{services}': formatServices(data),
    '{message_perso}': data.messagePersonnalise || data.message_perso || '',
    '{date_jour}': new Date().toLocaleDateString('fr-FR'),
    '{annee}': new Date().getFullYear().toString()
  }
  
  // Remplacer toutes les variables
  Object.entries(variables).forEach(([key, value]) => {
    content = content.replace(new RegExp(key, 'g'), value)
  })
  
  return content
}

// Helper pour obtenir le label du type de projet
function getTypeProjetLabel(projet) {
  if (!projet) return 'Site Web Professionnel'
  
  let label = 'Site Web Professionnel'
  if (projet.nb_pages_total) {
    label += ` (${projet.nb_pages_total} pages)`
  }
  return label
}

// Helper pour formater les services
function formatServices(data) {
  if (!data.projet) return ''
  
  const services = []
  
  // Site principal
  services.push(`• Site Web Professionnel (5 pages incluses)`)
  
  // Pages supplémentaires
  if (data.projet.nb_pages_supp > 0) {
    services.push(`• ${data.projet.nb_pages_supp} page(s) supplémentaire(s)`)
  }
  
  // Options
  const optionsLabels = {
    pack_images: 'Pack images/vidéos professionnelles',
    maintenance: 'Forfait Maintenance (12 interventions/an)',
    redaction: 'Rédaction complète des contenus',
    back_office: 'Back Office (interface d\'administration)'
  }
  
  if (data.projet.options && data.projet.options.length > 0) {
    data.projet.options.forEach(option => {
      if (optionsLabels[option]) {
        services.push(`• ${optionsLabels[option]}`)
      }
    })
  }
  
  // Emails professionnels
  if (data.projet.nb_emails > 0) {
    services.push(`• ${data.projet.nb_emails} adresse(s) email professionnelle(s)`)
  }
  
  return services.join('\n')
}

// Templates d'emails
export const emailTemplates = {
  // 1. Confirmation de demande de devis (client)
  demande_devis_client: {
    id: 'demande_devis_client',
    nom: 'Confirmation demande de devis - Client',
    objet: 'Votre demande de devis a bien été reçue - Web Online Concept',
    message: `Bonjour {prenom} {nom},

Nous avons bien reçu votre demande de devis pour {type_projet}.

Récapitulatif de votre demande :
{services}

Notre équipe va étudier votre projet et vous transmettre un devis détaillé dans les plus brefs délais (généralement sous 24-48h).

Si vous avez des questions ou des informations complémentaires à nous communiquer, n'hésitez pas à nous contacter.

Cordialement,
L'équipe Web Online Concept

--
Web Online Concept
Tél : 06 03 36 93 42
Email : web.online.concept@gmail.com
Rue Paul Estival, 31200 Toulouse`
  },
  
  // 2. Notification de demande de devis (admin)
  demande_devis_admin: {
    id: 'demande_devis_admin',
    nom: 'Nouvelle demande de devis - Admin',
    objet: '🆕 Nouvelle demande de devis - {entreprise}',
    message: `Nouvelle demande de devis reçue !

📋 Informations client :
• Entreprise : {entreprise}
• Contact : {prenom} {nom}
• Email : {email}
• Téléphone : {telephone}

💼 Projet demandé :
• Type : {type_projet}
• Services :
{services}

💰 Estimation :
• Total HT : {montant_ht}
• Total TTC : {montant_ttc}

📝 Message du client :
{message_perso}

👉 Accéder au tableau de bord : [URL_ADMIN]/admin/devis

--
Notification automatique`
  },
  
  // 3. Envoi du devis validé (client)
  devis_valide: {
    id: 'devis_valide',
    nom: 'Devis validé - Client',
    objet: 'Votre devis {numero_devis} - Web Online Concept',
    message: `Bonjour {prenom} {nom},

Nous avons le plaisir de vous transmettre votre devis personnalisé pour {type_projet}.

📄 Devis N° : {numero_devis}
💰 Montant total : {montant_ttc} TTC
⏱️ Validité : {validite_jours} jours (jusqu'au {date_expiration})

{message_perso}

Pour consulter votre devis détaillé et l'accepter en ligne :
👉 {lien_devis}

Modalités de paiement :
• Acompte de 50% à la commande : {montant_acompte}
• Solde à la livraison du projet

Une fois le devis accepté et l'acompte réglé, nous pourrons démarrer votre projet sous 48h.

Pour toute question, n'hésitez pas à nous contacter.

Cordialement,
L'équipe Web Online Concept

--
Web Online Concept
Tél : 06 03 36 93 42
Email : web.online.concept@gmail.com
Rue Paul Estival, 31200 Toulouse`
  },
  
  // 4. Devis accepté (admin)
  devis_accepte_admin: {
    id: 'devis_accepte_admin',
    nom: 'Devis accepté - Admin',
    objet: '✅ Devis accepté - {entreprise}',
    message: `Excellente nouvelle ! Un devis vient d'être accepté.

📋 Devis N° : {numero_devis}
👤 Client : {entreprise} - {prenom} {nom}
💰 Montant : {montant_ttc} TTC
💳 Acompte attendu : {montant_acompte}

Le client a été redirigé vers la page de paiement.

⏳ Prochaines étapes :
1. Attendre la confirmation du paiement
2. Envoyer le lien de collecte des contenus
3. Démarrer le projet

👉 Voir le devis : [URL_ADMIN]/admin/devis

--
Notification automatique`
  },
  
  // 5. Confirmation de paiement (client)
  confirmation_paiement: {
    id: 'confirmation_paiement',
    nom: 'Confirmation de paiement - Client',
    objet: 'Paiement confirmé - Démarrage de votre projet',
    message: `Bonjour {prenom} {nom},

Nous avons bien reçu votre paiement de {montant_acompte} pour le devis {numero_devis}.

✅ Votre projet est maintenant confirmé !

📝 Prochaine étape : Collecte des contenus
Pour que nous puissions commencer la création de votre site, nous avons besoin de vos contenus (textes, images, logo, etc.).

Accédez à votre espace de collecte de contenus :
👉 {lien_contenu}

⏱️ Délai de réalisation : 4 à 6 semaines après réception de tous vos contenus.

📊 Suivi de votre projet :
Vous recevrez des notifications à chaque étape importante :
• Maquette prête pour validation
• Site en cours de développement
• Tests et mise en ligne

Si vous avez des questions, n'hésitez pas à nous contacter.

Cordialement,
L'équipe Web Online Concept

--
Web Online Concept
Tél : 06 03 36 93 42
Email : web.online.concept@gmail.com`
  },
  
  // 6. Instructions de virement (client)
  instructions_virement: {
    id: 'instructions_virement',
    nom: 'Instructions de virement - Client',
    objet: 'Instructions pour le paiement - Devis {numero_devis}',
    message: `Bonjour {prenom} {nom},

Suite à l'acceptation de votre devis {numero_devis}, voici les informations pour effectuer le virement de l'acompte.

💰 Montant à verser : {montant_acompte}
📝 Référence à indiquer : {numero_devis}

🏦 Coordonnées bancaires :
Bénéficiaire : Web Online Concept
IBAN : FR76 1469 0000 0154 0005 4469 827
BIC : CMCIFRP1MON

⚠️ IMPORTANT : Merci d'indiquer la référence {numero_devis} dans le libellé du virement.

Une fois le virement effectué, nous vous confirmerons sa réception sous 2-3 jours ouvrés et vous enverrons le lien pour collecter vos contenus.

Pour toute question, n'hésitez pas à nous contacter.

Cordialement,
L'équipe Web Online Concept

--
Web Online Concept - Auto-Entrepreneur
SIRET : 510 583 800 00048
Dispensé d'immatriculation au RCS et au RM`
  },
  
  // 7. Relance devis non consulté
  relance_devis_non_consulte: {
    id: 'relance_devis_non_consulte',
    nom: 'Relance devis non consulté',
    objet: 'Votre devis {numero_devis} vous attend',
    message: `Bonjour {prenom} {nom},

Nous vous avons envoyé un devis il y a quelques jours, mais il semble que vous n'ayez pas encore eu l'occasion de le consulter.

Pour rappel :
📄 Devis N° : {numero_devis}
💼 Projet : {type_projet}
💰 Montant : {montant_ttc} TTC
⏱️ Validité : jusqu'au {date_expiration}

Consultez votre devis en ligne :
👉 {lien_devis}

Si vous avez des questions ou souhaitez discuter de votre projet, n'hésitez pas à nous contacter. Nous sommes à votre disposition pour adapter notre proposition à vos besoins.

Cordialement,
L'équipe Web Online Concept`
  },
  
  // 8. Relance devis consulté mais non accepté
  relance_devis_consulte: {
    id: 'relance_devis_consulte',
    nom: 'Relance devis consulté',
    objet: 'Des questions sur votre devis {numero_devis} ?',
    message: `Bonjour {prenom} {nom},

Nous avons remarqué que vous avez consulté votre devis {numero_devis}, mais que vous ne l'avez pas encore validé.

Y a-t-il des points que vous souhaiteriez clarifier ou modifier ?

Nous sommes à votre écoute pour :
• Ajuster le périmètre du projet
• Revoir le budget
• Modifier les délais
• Répondre à toutes vos questions

N'hésitez pas à nous contacter :
📞 Par téléphone : 06 03 36 93 42
📧 Par email : web.online.concept@gmail.com

Pour rappel, votre devis est valable jusqu'au {date_expiration}.

👉 Consulter à nouveau votre devis : {lien_devis}

Cordialement,
L'équipe Web Online Concept`
  },
  
  // 9. Devis expiré
  devis_expire: {
    id: 'devis_expire',
    nom: 'Devis expiré',
    objet: 'Votre devis {numero_devis} a expiré',
    message: `Bonjour {prenom} {nom},

Votre devis {numero_devis} du {date_devis} a expiré.

Si vous êtes toujours intéressé par notre proposition, nous serions ravis de vous établir un nouveau devis actualisé.

N'hésitez pas à nous contacter pour :
• Obtenir un nouveau devis
• Discuter de modifications éventuelles
• Poser vos questions

Nous restons à votre disposition.

Cordialement,
L'équipe Web Online Concept`
  },
  
  // 10. Collecte complète
  collecte_complete: {
    id: 'collecte_complete',
    nom: 'Contenus reçus - Client',
    objet: 'Contenus bien reçus - Début de création',
    message: `Bonjour {prenom} {nom},

Excellente nouvelle ! Nous avons bien reçu tous les contenus pour votre projet.

✅ Contenus validés et complets

Notre équipe va maintenant commencer la création de votre site web.

📅 Planning prévisionnel :
• Semaine 1-2 : Analyse et organisation des contenus
• Semaine 2-3 : Création de la maquette
• Semaine 3-5 : Développement du site
• Semaine 5-6 : Tests et mise en ligne

Nous vous tiendrons informé à chaque étape importante et vous présenterons la maquette pour validation avant de passer au développement.

Si vous avez des éléments complémentaires à nous transmettre, c'est encore possible !

Cordialement,
L'équipe Web Online Concept`
  },
  
  // 11. Rappel collecte contenus
  rappel_collecte_contenus: {
    id: 'rappel_collecte_contenus',
    nom: 'Rappel collecte contenus',
    objet: 'Vos contenus nous manquent pour démarrer',
    message: `Bonjour {prenom} {nom},

Nous avons bien reçu votre acompte pour le projet {numero_devis}, merci !

Pour démarrer la création de votre site, nous attendons vos contenus.

👉 Accédez à votre espace de collecte : {lien_contenu}

Éléments à nous fournir :
✓ Textes de présentation
✓ Logo et images
✓ Coordonnées complètes
✓ Description des services/produits

💡 Conseils :
• Prenez votre temps pour bien remplir chaque section
• Vos réponses sont sauvegardées automatiquement
• Vous pouvez revenir compléter plus tard

Besoin d'aide ? N'hésitez pas à nous contacter !

Cordialement,
L'équipe Web Online Concept`
  },
  
  // 12. Facture d'acompte
  facture_acompte: {
    id: 'facture_acompte',
    nom: 'Facture acompte - Client',
    objet: 'Facture d\'acompte - Devis {numero_devis}',
    message: `Bonjour {prenom} {nom},

Suite au paiement de votre acompte, veuillez trouver ci-joint votre facture d'acompte.

📄 Facture N° : [NUMERO_FACTURE]
💰 Montant : {montant_acompte} TTC
📅 Date : {date_jour}

Cette facture fait suite à l'acceptation du devis {numero_devis}.

Le solde de {montant_ttc} sera à régler à la livraison du projet.

Cordialement,
L'équipe Web Online Concept

--
Web Online Concept - Auto-Entrepreneur
SIRET : 510 583 800 00048
Dispensé d'immatriculation au RCS et au RM`
  },
  
  // 13. Refus de devis
  devis_refuse: {
    id: 'devis_refuse',
    nom: 'Devis refusé - Client',
    objet: 'Votre demande de devis - Web Online Concept',
    message: `Bonjour {prenom} {nom},

Nous avons bien étudié votre demande de devis {numero_devis} pour {type_projet}.

Après analyse approfondie, nous sommes au regret de vous informer que nous ne pourrons pas donner suite à votre projet.

{message_perso}

Nous vous remercions de l'intérêt que vous avez porté à nos services et vous souhaitons pleine réussite dans votre projet.

Si votre situation évolue ou si vous avez un autre projet à l'avenir, n'hésitez pas à nous recontacter.

Cordialement,
L'équipe Web Online Concept

--
Web Online Concept
Tél : 06 03 36 93 42
Email : web.online.concept@gmail.com`
  }
}

// Fonction pour obtenir un template par ID
export function getTemplate(templateId) {
  return Object.values(emailTemplates).find(t => t.id === templateId)
}

// Fonction pour obtenir tous les templates
export function getAllTemplates() {
  return Object.values(emailTemplates)
}

// Fonction pour générer un email complet
export function generateEmail(templateId, data) {
  const template = getTemplate(templateId)
  
  if (!template) {
    throw new Error(`Template ${templateId} non trouvé`)
  }
  
  return {
    objet: replaceVariables(template.objet, data),
    message: replaceVariables(template.message, data)
  }
}