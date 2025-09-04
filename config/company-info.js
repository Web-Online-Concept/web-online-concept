// Configuration centralisée des informations de Web Online Concept
// Fichier : /config/company-info.js

export const companyInfo = {
  // Informations générales
  general: {
    name: "Web Online Concept",
    legalName: "Auto-Entreprise Web Online Concept",
    siret: "510 583 800 00048",
    email: "web.online.concept@gmail.com",
    address: "Rue Paul Estival, 31200 Toulouse",
    country: "France",
    website: "https://www.web-online-concept.com",
    baseline: "Sites Web Clés en Main à Prix Malins"
  },

  // Équipe
  team: {
    size: "+10 spécialistes freelance",
    expertise: [
      "Webmasters",
      "Webdesigners",
      "Développeurs",
      "Spécialistes SEO",
      "Marketing digital & Stratégique"
    ],
    approach: "Un interlocuteur unique dédié pour simplifier vos échanges"
  },

  // Services principaux
  services: {
    formuleBase: {
      nom: "Site Web - Formule de Base",
      prix: 500,
      description: "Site 5 pages personnalisé avec design professionnel",
      inclus: [
        "Design moderne et personnalisé",
        "Site responsive (mobile, tablette, PC)",
        "5 pages personnalisées + pages légales incluses",
        "SEO de base inclus",
        "Hébergement & nom de domaine inclus la 1ère année",
        "Formation 1h à la prise en main",
        "Support technique 30 jours",
        "Certificat SSL (https)",
        "Sites conformes RGPD",
        "Conseils divers"
      ]
    }
  },

  // Options disponibles
  options: [
    {
      id: 1,
      nom: "Page supplémentaire",
      prix: 25,
      unite: "par page",
      description: "Augmentez la taille de votre site selon vos besoins"
    },
    {
      id: 2,
      nom: "Pack 10 photos/vidéos au choix",
      prix: 50,
      description: "Photos & Vidéos libres de droit"
    },
    {
      id: 3,
      nom: "Nom de domaine & Hébergement 1 an",
      prix: 60,
      unite: "par an",
      description: "Renouvellement annuel hébergement et nom de domaine"
    },
    {
      id: 4,
      nom: "Rédaction de contenu",
      prix: 15,
      unite: "par page",
      description: "Nous créons le contenu de vos pages à votre demande"
    },
    {
      id: 5,
      nom: "Blog professionnel avec back office",
      prix: 300,
      description: "Module blog complet avec interface de gestion des articles"
    },
    {
      id: 6,
      nom: "Maintenance Annuelle",
      prix: 120,
      unite: "par an",
      description: "jusqu'à 4 modifications par mois incluses"
    },
    {
      id: 7,
      nom: "Back Office / Interface d'administration",
      prix: 200,
      description: "Modifiez vous-même vos textes et images - Formation incluse"
    },
    {
      id: 8,
      nom: "Module E-commerce",
      prix: 500,
      description: "Boutique en ligne complète avec paiement sécurisé"
    },
    {
      id: 9,
      nom: "Pack Référencement SEO",
      prix: 100,
      description: "Optimisation complète pour les moteurs de recherche"
    },
    {
      id: 10,
      nom: "Création de logo",
      prix: 100,
      description: "Logo professionnel avec 3 propositions"
    },
    {
      id: 11,
      nom: "Site multilingue",
      prix: 100,
      unite: "par langue",
      description: "Toutes langues disponibles"
    },
    {
      id: 12,
      nom: "Système de réservation",
      prix: 300,
      description: "Calendrier et réservation en ligne"
    },
    {
      id: 13,
      nom: "Emails professionnels",
      prix: 60,
      unite: "par an",
      description: "Adresses email professionnelles @votredomaine.fr"
    },
    {
      id: 14,
      nom: "Module Newsletter",
      prix: 200,
      description: "Gestion des abonnés et envoi d'emails"
    }
  ],

  // Processus de création
  processus: {
    etapes: [
      { num: 1, titre: "Demande de devis", delai: "Immédiat", description: "Vous remplissez le formulaire en ligne" },
      { num: 2, titre: "Devis personnalisé", delai: "Sous 24-48h", description: "Nous analysons votre demande et créons votre devis" },
      { num: 3, titre: "Validation", delai: "À votre rythme", description: "Signature du devis et versement acompte (50%)" },
      { num: 4, titre: "Brief créatif", delai: "1h par téléphone", description: "Nous définissons ensemble vos besoins exacts" },
      { num: 5, titre: "Envoi des contenus", delai: "Sous 1 semaine", description: "Vous nous transmettez textes, images et logo" },
      { num: 6, titre: "Création", delai: "2-3 semaines", description: "Nous développons votre site web" },
      { num: 7, titre: "Révisions", delai: "2h incluses", description: "1 session de modifications incluse" },
      { num: 8, titre: "Mise en ligne", delai: "1h", description: "Formation à la gestion du site" }
    ]
  },

  // Conditions commerciales
  conditions: {
    paiement: {
      modalites: "Virement bancaire uniquement",
      acompte: "50% à la commande",
      solde: "50% avant la mise en ligne"
    },
    delais: {
      devis: "24-48h ouvrées",
      siteVitrine: "2-3 semaines après réception des éléments",
      modifications: "4 par mois avec maintenance"
    },
    garanties: [
      "Site conforme RGPD",
      "Compatible tous navigateurs",
      "Formation incluse",
      "Support 30 jours offert"
    ]
  },

  // Avantages compétitifs
  avantages: [
    "Prix transparents et accessibles",
    "Équipe de +10 spécialistes",
    "Un interlocuteur unique dédié",
    "Délais rapides garantis",
    "Formation et support inclus",
    "Satisfaction garantie",
    "TVA non applicable"
  ],

  // SEO et marketing
  seo: {
    services: [
      "Audit SEO complet",
      "Optimisation technique et contenu",
      "Suivi et amélioration continue",
      "Référencement local ciblé"
    ],
    promesse: "Améliorez votre visibilité dans les résultats des moteurs de recherche"
  }
}

// Fonction pour obtenir le prix total avec options
export function calculerPrix(optionsSelectionnees = []) {
  let total = companyInfo.services.formuleBase.prix
  
  optionsSelectionnees.forEach(optionId => {
    const option = companyInfo.options.find(o => o.id === optionId)
    if (option) {
      total += option.prix
    }
  })
  
  return total
}

// Fonction pour formater le prix
export function formatPrix(prix) {
  return `${prix}€ HT`
}