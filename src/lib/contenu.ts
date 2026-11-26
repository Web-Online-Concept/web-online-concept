import type { NomIcone } from "@/components/site/Icones";

// Contenu éditorial du site (validé avec Florent, novembre 2026).

export const SITE = {
  nom: "Web Online Concept",
  url: "https://www.web-online-concept.com",
  email: "contact@web-online-concept.com",
  titre: "Vous l'imaginez. Nous le réalisons, au service de vos objectifs.",
  sousTitre:
    "Plus de quinze ans de développement web, démultipliés par l'IA : sites, applications et plateformes complètes, de la première idée à la mise en ligne.",
  // Signature de fin de page : le studio travaille sur recommandation, pas de démarchage
  phraseFinale: "Nous travaillons sur recommandation.",
};

export const NAVIGATION = [
  { href: "/realisations", libelle: "Réalisations" },
  { href: "/capacites", libelle: "Capacités" },
  { href: "/methode", libelle: "Méthode" },
  { href: "/a-propos", libelle: "À propos" },
  { href: "/blog", libelle: "Blog" },
  { href: "/faq", libelle: "FAQ" },
  { href: "/contact", libelle: "Contact" },
];

export const MANIFESTE = [
  "Hier, on se demandait : est-ce faisable ? En combien de temps ? Avec combien de développeurs ?",
  "Aujourd'hui, l'expertise technique alliée à l'IA a levé ces limites.",
  "Il reste les seules questions qui comptent : que voulez-vous accomplir, pour qui, et avec quels objectifs ?",
];

export type Chiffre = { valeur: string; libelle: string };

// Capture d'écran d'une réalisation (fichier dans public/realisations/<slug>/)
export type Visuel = { src: string; alt: string; l: number; h: number; format: "ordinateur" | "telephone" };
export type Lien = { href: string; libelle: string };

export type Realisation = {
  slug: string;
  nom: string;
  type: string;
  client?: string;
  accroche: string;
  besoin: string;
  realise: string[];
  technos?: string[];
  chiffres: Chiffre[];
  site: Lien;
  autresLiens?: Lien[];
  teinte: string; // couleur dominante de la carte
  visuels?: Visuel[]; // le premier sert de vignette
  categorie: "sur-mesure" | "client";
  // Pour la liste des sites clients : activité, ville et trois points forts
  resume?: { activite: string; lieu?: string; points: string[] };
};

export const REALISATIONS: Realisation[] = [
  {
    slug: "memoday",
    categorie: "sur-mesure",
    nom: "MemoDay",
    type: "Application web et mobile, produit maison",
    accroche: "Une mémoire personnelle pour tout ce qu'on ne veut pas oublier.",
    besoin:
      "Dépenses, rendez-vous, papiers, photos : le quotidien s'éparpille entre des dizaines d'applications. L'objectif était d'offrir un seul endroit où l'on confie une information en une phrase, une photo ou à la voix, et où on la retrouve pour toujours, sans rien classer soi-même.",
    realise: [
      "Une IA qui comprend chaque message et le classe toute seule : dépense, rendez-vous, tâche, document ou souvenir.",
      "La lecture automatique des factures et contrats photographiés, avec une alerte avant chaque échéance.",
      "Des rappels automatiques, la veille puis une heure avant chaque rendez-vous.",
      "Une recherche par le sens : on retrouve une information sans se souvenir des mots exacts.",
      "Le partage familial de listes et de rendez-vous choisis, tout le reste restant privé.",
      "La synchronisation avec Google Agenda, Outlook et l'iPhone, un mode hors ligne et l'import de centaines de documents d'un coup.",
      "Une connexion sans mot de passe et des abonnements gérés par Stripe, l'App Store et Google Play.",
    ],
    technos: ["Next.js", "TypeScript", "Supabase", "IA générative", "Stripe", "iOS et Android", "Application installable"],
    chiffres: [
      { valeur: "3", libelle: "plateformes : iPhone, Android et web" },
      { valeur: "3", libelle: "langues : français, anglais et espagnol" },
      { valeur: "70", libelle: "tables de données, chacune cloisonnée par utilisateur" },
    ],
    site: { href: "https://memoday.net", libelle: "memoday.net" },
    autresLiens: [
      { href: "https://apps.apple.com/us/app/memoday-your-memory-for-life/id6831483081", libelle: "App Store" },
      { href: "https://play.google.com/store/apps/details?id=net.memoday.app&hl=fr", libelle: "Google Play" },
    ],
    teinte: "#1F5EFF",
    visuels: [
      { src: "/realisations/memoday/site.webp", alt: "Page d'accueil du site de MemoDay", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/memoday/app-1.webp", alt: "Version mobile du site de MemoDay", l: 659, h: 1280, format: "telephone" },
      { src: "/realisations/memoday/app-2.webp", alt: "Écran « Ma mémoire » de l'application MemoDay", l: 659, h: 1280, format: "telephone" },
      { src: "/realisations/memoday/app-3.webp", alt: "Écran « Documents » de l'application MemoDay", l: 659, h: 1280, format: "telephone" },
    ],
  },
  {
    slug: "klart-concept",
    categorie: "sur-mesure",
    nom: "Klart Concept",
    type: "Site vitrine d'artisan de la rénovation",
    client: "Klart Concept, Argelès-Gazost",
    accroche: "Salles de bain, cuisines et agencements sur mesure dans les Hautes-Pyrénées.",
    besoin:
      "Klart Concept crée et rénove salles de bain, cuisines et agencements, et prend en charge tous les corps de métier d'une rénovation intérieure, clés en main. Le site devait montrer la qualité des réalisations, couvrir toute la zone d'intervention et générer des demandes de devis.",
    realise: [
      "Une page par spécialité : salles de bain, cuisines, agencements et conseils.",
      "Des pages métiers : isolation, électricité, plomberie, carrelage et peinture.",
      "Des galeries photos des réalisations.",
      "Une page zone d'activité couvrant une vingtaine de communes, dont Tarbes et Lourdes.",
      "Les avis clients Google, un blog bricolage et une page partenaires.",
      "Une demande de devis gratuit, ainsi que la création du site et sa gestion dans la durée.",
    ],
    chiffres: [
      { valeur: "15 ans", libelle: "d'expérience de l'entreprise" },
      { valeur: "20", libelle: "communes dans la zone d'intervention" },
      { valeur: "5", libelle: "corps de métier présentés" },
    ],
    site: { href: "https://www.klart-concept.com/", libelle: "klart-concept.com" },
    teinte: "#0B8E9E",
    visuels: [
      { src: "/realisations/klart-concept/accueil.webp", alt: "Page d'accueil du site de Klart Concept", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/klart-concept/concept.webp", alt: "Page « Notre concept » du site de Klart Concept", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/klart-concept/specialites.webp", alt: "Page « Nos spécialités » du site de Klart Concept", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/klart-concept/mobile.webp", alt: "Version mobile du site de Klart Concept", l: 659, h: 1187, format: "telephone" },
    ],
    resume: {
      activite: "Création et rénovation de salles de bain, cuisines et agencements",
      lieu: "Argelès-Gazost, Hautes-Pyrénées",
      points: ["Galeries de réalisations", "Avis clients et blog", "Référencement sur sa zone d'intervention"],
    },
  },
  {
    slug: "inspiration-et-meditation",
    categorie: "sur-mesure",
    nom: "Inspiration & Méditation",
    type: "Site de praticienne avec réservation en ligne",
    client: "Anne Brulard Labasse",
    accroche: "Méditations, ateliers et soins, avec réservation et paiement en ligne.",
    besoin:
      "Anne Brulard Labasse propose des méditations, des ateliers et des soins à domicile dans les Hautes-Pyrénées, ainsi qu'un livre et un espace numérique. Il fallait réunir toute son activité sur un seul site, et permettre de réserver et de payer en ligne.",
    realise: [
      "La présentation complète de l'activité : soins, ateliers, livre et presse.",
      "La réservation des soins et des ateliers, avec paiement en ligne par PayPal.",
      "Un espace client et « Le Sanctuaire », un espace numérique de méditation.",
      "Des e-mails automatiques envoyés chaque matin.",
      "Les avis Google intégrés et un référencement local sur une quarantaine de villes.",
      "Un espace d'administration pour faire vivre le site au quotidien.",
    ],
    technos: ["PHP", "MySQL", "PayPal", "OVH"],
    chiffres: [
      { valeur: "40", libelle: "villes couvertes par le référencement local" },
      { valeur: "24 h/24", libelle: "réservation et paiement en ligne" },
    ],
    site: { href: "https://inspirationetmeditation.com", libelle: "inspirationetmeditation.com" },
    teinte: "#2BD47D",
    visuels: [
      { src: "/realisations/inspiration-et-meditation/accueil.webp", alt: "Page d'accueil du site de Inspiration & Méditation", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/inspiration-et-meditation/livre.webp", alt: "Page « Le livre » du site de Inspiration & Méditation", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/inspiration-et-meditation/sanctuaire.webp", alt: "Page « Le Sanctuaire » du site de Inspiration & Méditation", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/inspiration-et-meditation/mobile.webp", alt: "Version mobile du site de Inspiration & Méditation", l: 659, h: 1280, format: "telephone" },
    ],
  },
  {
    slug: "menuiserie-gaudissard",
    categorie: "client",
    nom: "Menuiserie Gaudissard",
    type: "Site vitrine et catalogue de produits",
    client: "Menuiserie Gaudissard, Aigrefeuille-d'Aunis",
    accroche: "Toute la gamme d'un fabricant de menuiseries, de la fenêtre au portail, avec devis gratuit.",
    besoin:
      "Fabricant de menuiseries PVC et aluminium depuis 1964, près de La Rochelle, la Menuiserie Gaudissard propose une gamme très large, en dimensions standard ou sur mesure. Il fallait présenter chaque famille de produits clairement, faire connaître l'entreprise et son atelier, et transformer les visites en demandes de devis.",
    realise: [
      "Un catalogue organisé par famille de produits et par matériau : fenêtres, portes, portails, volets, pergolas, carports, clôtures, garde-corps et barrières anti-inondation.",
      "Une demande de devis gratuit accessible depuis tout le site.",
      "La présentation de l'entreprise : son histoire, son atelier, les visites du showroom sur rendez-vous et ses reportages.",
      "Les informations pratiques : services, plan d'accès et documents à télécharger.",
      "Un espace client et un accès à la boutique des produits déclassés.",
      "La création du site, puis sa gestion dans la durée.",
    ],
    chiffres: [
      { valeur: "1964", libelle: "année de création de l'entreprise" },
      { valeur: "10", libelle: "familles de produits présentées" },
      { valeur: "40", libelle: "salariés dans l'entreprise" },
    ],
    site: { href: "https://www.gaudissard.fr/", libelle: "gaudissard.fr" },
    teinte: "#1F5EFF",
    visuels: [
      { src: "/realisations/menuiserie-gaudissard/accueil.webp", alt: "Page d'accueil du site de Menuiserie Gaudissard", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/menuiserie-gaudissard/fenetres.webp", alt: "Page « Fenêtres » du site de Menuiserie Gaudissard", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/menuiserie-gaudissard/societe.webp", alt: "Page « La société » du site de Menuiserie Gaudissard", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/menuiserie-gaudissard/mobile.webp", alt: "Version mobile du site de Menuiserie Gaudissard", l: 659, h: 1187, format: "telephone" },
    ],
    resume: {
      activite: "Fabricant de menuiseries PVC et aluminium depuis 1964",
      lieu: "Aigrefeuille-d'Aunis, près de La Rochelle",
      points: ["Catalogue par produit et par matériau", "Demande de devis gratuit", "Espace client"],
    },
  },
  {
    slug: "carpentier-communication",
    categorie: "client",
    nom: "Carpentier Communication",
    type: "Site vitrine d'imprimeur avec devis en ligne",
    client: "Carpentier Communication, Toulouse",
    accroche: "Affiches, PLV, panneaux et adhésifs : l'offre complète d'un imprimeur toulousain, avec devis gratuit.",
    besoin:
      "Imprimeur à Toulouse depuis 1962, Carpentier Communication réalise affiches, PLV, panneaux et adhésifs en sérigraphie, en numérique et en offset grand format, avec livraison dans toute la France. Le site devait présenter chaque support, mettre en avant le savoir-faire de l'atelier et faciliter les demandes de devis.",
    realise: [
      "Une page par famille de produits : affiches, PLV, panneaux et adhésifs.",
      "Un formulaire de devis gratuit.",
      "Une page d'assistance PAO pour accompagner les clients dans la préparation de leurs fichiers.",
      "Une brochure de produits à télécharger.",
      "La présentation de l'entreprise, de ses références clients et des conditions de livraison.",
      "La création du site, puis sa gestion dans la durée.",
    ],
    chiffres: [
      { valeur: "1962", libelle: "année de création de l'entreprise" },
      { valeur: "4", libelle: "familles de produits" },
      { valeur: "12", libelle: "références clients présentées" },
    ],
    site: { href: "https://www.carpentier-impressions.fr/", libelle: "carpentier-impressions.fr" },
    teinte: "#00B4D8",
    visuels: [
      { src: "/realisations/carpentier-communication/accueil.webp", alt: "Page d'accueil du site de Carpentier Communication", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/carpentier-communication/affiches.webp", alt: "Page « Affiches » du site de Carpentier Communication", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/carpentier-communication/plv.webp", alt: "Page « PLV » du site de Carpentier Communication", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/carpentier-communication/mobile.webp", alt: "Version mobile du site de Carpentier Communication", l: 659, h: 1187, format: "telephone" },
    ],
    resume: {
      activite: "Imprimeur d'affiches, PLV, panneaux et adhésifs depuis 1962",
      lieu: "Toulouse",
      points: ["Gamme complète par support", "Demande de devis gratuit", "Assistance PAO et brochure à télécharger"],
    },
  },
  {
    slug: "re-borne-retrogaming",
    categorie: "client",
    nom: "Re-borne Retrogaming",
    type: "Site vitrine d'animations événementielles",
    client: "Re-borne Retrogaming, Toulouse",
    accroche: "Consoles rétro et bornes d'arcade pour les événements, du séminaire au mariage.",
    besoin:
      "Re-borne Retrogaming anime les salons, séminaires, soirées d'entreprise et fêtes privées avec des consoles rétro, des bornes d'arcade et un camion d'arcade mobile, le Pixel Truck. Le site devait donner envie, détailler les formules et le matériel, et recueillir les demandes de devis.",
    realise: [
      "La présentation du concept et des prestations, pour les entreprises comme pour les particuliers.",
      "Un catalogue du matériel : consoles, bornes d'arcade et options.",
      "Une page de tarifs présentant les formules.",
      "Une rubrique d'actualités.",
      "Des formulaires de devis gratuit et de contact.",
      "La création du site, puis sa gestion dans la durée.",
    ],
    chiffres: [
      { valeur: "19", libelle: "consoles au catalogue" },
      { valeur: "5 à 30", libelle: "postes de jeu par événement" },
      { valeur: "4", libelle: "bornes d'arcade dans le Pixel Truck" },
    ],
    site: { href: "https://www.reborne-retrogaming.com/", libelle: "reborne-retrogaming.com" },
    teinte: "#2BD47D",
    visuels: [
      { src: "/realisations/re-borne-retrogaming/accueil.webp", alt: "Page d'accueil du site de Re-borne Retrogaming", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/re-borne-retrogaming/actualites.webp", alt: "Page « Actualités » du site de Re-borne Retrogaming", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/re-borne-retrogaming/materiel.webp", alt: "Page « Matériel et tarifs » du site de Re-borne Retrogaming", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/re-borne-retrogaming/mobile.webp", alt: "Version mobile du site de Re-borne Retrogaming", l: 659, h: 1187, format: "telephone" },
    ],
    resume: {
      activite: "Animations retrogaming et location de bornes d'arcade pour les événements",
      lieu: "Toulouse",
      points: ["Prestations et tarifs", "Catalogue du matériel", "Actualités et demande de devis"],
    },
  },
  {
    slug: "galerie-carpentier",
    categorie: "client",
    nom: "Galerie Michel Carpentier",
    type: "Galerie d'art en ligne",
    client: "Michel Carpentier, peintre",
    accroche: "La galerie en ligne d'un peintre, de ses toiles à ses expositions.",
    besoin:
      "L'œuvre de Michel Carpentier couvre neuf univers, du rugby aux caricatures, des océans aux créations numériques. Il fallait un écrin à la hauteur de ce travail, et un outil simple pour que l'artiste fasse vivre sa galerie lui-même.",
    realise: [
      "Une galerie organisée en neuf catégories, pensée pour mettre chaque toile en valeur.",
      "Les pages Expositions, Histoire et Amis, qui racontent le parcours de l'artiste.",
      "Un espace d'administration complet : l'artiste ajoute ses œuvres et ses expositions en toute autonomie.",
      "Un site rapide, agréable sur mobile et optimisé pour le référencement.",
    ],
    technos: ["Next.js", "TypeScript", "Supabase", "Vercel"],
    chiffres: [
      { valeur: "291", libelle: "œuvres en ligne" },
      { valeur: "22", libelle: "expositions présentées" },
      { valeur: "9", libelle: "univers artistiques" },
    ],
    site: { href: "https://www.carpentier-galerie.com/fr", libelle: "carpentier-galerie.com" },
    teinte: "#0B8E9E",
    resume: {
      activite: "Galerie d'art en ligne du peintre Michel Carpentier",
      lieu: "Bordeaux",
      points: ["291 œuvres en neuf univers", "Expositions et parcours de l'artiste", "Gérée par l'artiste lui-même"],
    },
  },
  {
    slug: "dietetiphyt",
    categorie: "client",
    nom: "Diététi'Phyt",
    type: "Site de praticienne avec prise de rendez-vous",
    client: "Diététi'Phyt, Toulouse",
    accroche: "Le site d'une diététicienne-nutritionniste, avec rendez-vous en ligne et téléconsultation.",
    besoin:
      "Diététi'Phyt accompagne ses patients en nutrition et en phytothérapie : alimentation équilibrée, perte de poids, maladies chroniques. Le site devait présenter clairement chaque accompagnement, mettre les patients en confiance et rendre la prise de rendez-vous immédiate, au cabinet comme à distance.",
    realise: [
      "Une page par accompagnement : alimentation équilibrée, perte de poids et maladies chroniques.",
      "La prise de rendez-vous en ligne, avec téléconsultation et visites à domicile.",
      "Une page lieux et tarifs.",
      "Un blog, une foire aux questions et des ressources pour les patients.",
      "Les liens vers Instagram, Facebook et LinkedIn.",
      "La création du site, puis sa gestion dans la durée.",
    ],
    chiffres: [
      { valeur: "3", libelle: "accompagnements détaillés" },
      { valeur: "24 h/24", libelle: "prise de rendez-vous en ligne" },
    ],
    site: { href: "https://www.dietetiphyt.com/", libelle: "dietetiphyt.com" },
    teinte: "#1638A8",
    resume: {
      activite: "Diététicienne-nutritionniste et conseillère en phytothérapie",
      lieu: "Toulouse",
      points: ["Prise de rendez-vous en ligne", "Téléconsultation", "Blog et ressources pour les patients"],
    },
  },
  {
    slug: "point-serigraphie",
    categorie: "client",
    nom: "Point Sérigraphie",
    type: "Site vitrine d'imprimeur avec catalogues",
    client: "Point Sérigraphie, Albi",
    accroche: "Autocollants, vitrophanies, panneaux, marquages : l'impression sur tous supports, à Albi depuis 1976.",
    besoin:
      "Point Sérigraphie imprime en sérigraphie et en numérique sur une très grande variété de supports, avec livraison dans toute la France en 24 à 48 heures. Le site devait rendre lisible une offre très large et faciliter les demandes de devis.",
    realise: [
      "Une page par famille de produits : autocollants, vitrophanies, panneaux, marquages, transferts, banderoles, PLV, magnétiques, cartes et badges, ardoises et doming.",
      "Un formulaire de devis gratuit, avec une réponse sous 24 heures.",
      "Des catalogues à télécharger.",
      "Un fil d'actualités.",
      "Les pages entreprise, prépresse et livraison dans toute la France.",
      "La création du site, puis sa gestion dans la durée.",
    ],
    chiffres: [
      { valeur: "1976", libelle: "année de création de l'entreprise" },
      { valeur: "11", libelle: "familles de produits" },
      { valeur: "24 à 48 h", libelle: "de livraison dans toute la France" },
    ],
    site: { href: "https://www.point-serigraphie.com/", libelle: "point-serigraphie.com" },
    teinte: "#00B4D8",
    resume: {
      activite: "Impression sérigraphique et numérique sur tous supports depuis 1976",
      lieu: "Albi",
      points: ["Onze familles de produits", "Catalogues à télécharger", "Devis sous 24 heures"],
    },
  },
  {
    slug: "mozaic-environnement",
    categorie: "client",
    nom: "Mozaic Environnement",
    type: "Site vitrine pour les collectivités",
    client: "Mozaic Environnement, Albi",
    accroche: "Signalétique et supports imprimés pour la collecte et le tri des déchets.",
    besoin:
      "Mozaic Environnement imprime les supports de communication de la collecte et du tri des déchets : signalétique, adhésifs de conteneurs, consignes de tri, banderoles. Sa clientèle de collectivités, d'associations et d'entreprises du déchet attendait un catalogue clair et un accès direct aux devis et aux échantillons.",
    realise: [
      "Un catalogue de dix-huit catégories de produits.",
      "Des catalogues à consulter.",
      "Une demande d'échantillons gratuits.",
      "Des formulaires de devis gratuit et de contact.",
      "La présentation de l'entreprise et de ses adhésions professionnelles (AdCF, FESPA France).",
      "La création du site, puis sa gestion dans la durée.",
    ],
    chiffres: [
      { valeur: "18", libelle: "catégories de produits" },
      { valeur: "1976", libelle: "année de création de l'entreprise" },
    ],
    site: { href: "https://www.mozaic-environnement.com/", libelle: "mozaic-environnement.com" },
    teinte: "#2BD47D",
    resume: {
      activite: "Signalétique et supports imprimés pour la collecte et le tri des déchets",
      lieu: "Albi",
      points: ["Dix-huit catégories de produits", "Échantillons gratuits", "Demande de devis"],
    },
  },
];

export type Capacite = { titre: string; texte: string; exemples: string[]; icone: NomIcone };

export const CAPACITES: Capacite[] = [
  {
    titre: "Sites sur mesure",
    icone: "site",
    texte:
      "Vitrines, galeries, sites multilingues : un design unique, rapide sur tous les écrans et pensé pour le référencement dès la première ligne.",
    exemples: ["galerie-carpentier", "inspiration-et-meditation"],
  },
  {
    titre: "Applications web et mobiles",
    icone: "app",
    texte:
      "Une seule base de code pour l'iPhone, Android et le navigateur, publiée sur l'App Store et Google Play.",
    exemples: ["memoday"],
  },
  {
    titre: "Plateformes à abonnement",
    icone: "abonnement",
    texte:
      "Comptes utilisateurs, formules, paiement par Stripe et achats intégrés aux stores : un service en ligne prêt à encaisser.",
    exemples: ["memoday"],
  },
  {
    titre: "IA intégrée",
    icone: "ia",
    texte:
      "Compréhension du langage, lecture de documents, recherche par le sens, assistants : l'IA au cœur du produit, là où elle fait gagner du temps.",
    exemples: ["memoday"],
  },
  {
    titre: "Référencement et visibilité IA",
    icone: "visibilite",
    texte:
      "Référencement naturel et local, fiche Google Business, données structurées et contenus pensés pour être cités par ChatGPT, Perplexity ou Google : votre site trouvé là où vos clients cherchent.",
    exemples: ["inspiration-et-meditation", "klart-concept"],
  },
  {
    titre: "Données et back-offices",
    icone: "donnees",
    texte:
      "Bases de données sécurisées, outils de gestion, réservations, e-mails automatiques et tableaux de bord : vous pilotez votre activité en autonomie.",
    exemples: ["galerie-carpentier", "inspiration-et-meditation"],
  },
  {
    titre: "Refonte, migration et suivi",
    icone: "evolution",
    texte:
      "Refonte d'un site existant, changement d'hébergeur ou de technologie sans perdre votre référencement, puis mises à jour et évolutions dans la durée.",
    exemples: ["galerie-carpentier", "menuiserie-gaudissard"],
  },
  {
    titre: "Performance et sécurité",
    icone: "securite",
    texte:
      "Hébergement rapide, sauvegardes, sécurité et conformité RGPD : un site qui se charge vite et reste protégé.",
    exemples: [],
  },
];

export type Etape = { titre: string; texte: string };

export const METHODE: Etape[] = [
  {
    titre: "Cadrer vite",
    texte:
      "Vos objectifs d'abord. En quelques jours, un prototype cliquable rend le projet concret : on décide sur pièce, pas sur plan.",
  },
  {
    titre: "Produire plus",
    texte:
      "L'IA démultiplie chaque étape : code, tests, contenus, traductions. La capacité d'une équipe entière, avec un seul interlocuteur.",
  },
  {
    titre: "Tout vérifier",
    texte:
      "Tests automatisés, revue systématique et sécurité dès la conception : la vitesse ne se paie jamais en qualité.",
  },
  {
    titre: "Faire évoluer",
    texte:
      "Une veille permanente sur les technologies et l'IA : chaque nouveauté utile vient renforcer votre projet, longtemps après sa mise en ligne.",
  },
];

export const ENGAGEMENTS: Etape[] = [
  {
    titre: "Tout vous appartient",
    texte: "Votre site, ses contenus et vos données sont à vous : vous restez libre, à tout moment.",
  },
  {
    titre: "Un seul interlocuteur",
    texte: "La même personne du premier échange au suivi : pas de relais, pas d'information perdue.",
  },
  {
    titre: "Vous validez avant la mise en ligne",
    texte: "Vous testez votre site ou votre application en conditions réelles avant sa publication.",
  },
  {
    titre: "Une prise en main accompagnée",
    texte: "Vous apprenez à faire vivre votre site, pour être autonome dès le premier jour.",
  },
];

export type Question = { question: string; reponse: string; lien?: Lien };

export const FAQ: Question[] = [
  {
    question: "Comment travailler avec nous ?",
    reponse:
      "Nous travaillons sur recommandation et sur demande privée. Si l'on vous a parlé de nous, il suffit de nous écrire directement : chaque projet commence par un échange sur vos objectifs.",
  },
  {
    question: "Combien de temps faut-il pour créer un site ?",
    reponse:
      "Cela dépend de l'ambition du projet : quelques semaines pour un site vitrine, davantage pour une application ou une plateforme complète. Grâce à l'IA, les délais sont bien plus courts qu'auparavant, et un planning précis vous est donné dès le cadrage.",
  },
  {
    question: "Pourrai-je modifier mon site moi-même ?",
    reponse:
      "Oui. Votre projet peut inclure un espace d'administration pensé pour vous : textes, images, produits, actualités, œuvres ou rendez-vous. Vous êtes accompagné pour le prendre en main, et vous pouvez toujours confier les évolutions plus importantes.",
    lien: { href: "/realisations/galerie-carpentier", libelle: "Exemple : la Galerie Michel Carpentier" },
  },
  {
    question: "Le référencement est-il compris ?",
    reponse:
      "Les fondations du référencement sont intégrées dès la conception : structure des pages, vitesse de chargement, balisage, données structurées et affichage mobile. Pour aller plus loin, un accompagnement dédié est possible : référencement local, fiche Google Business, contenus.",
  },
  {
    question: "Qu'est-ce que la visibilité dans les IA ?",
    reponse:
      "De plus en plus de personnes posent leurs questions à ChatGPT, à Perplexity ou à la recherche Google enrichie par l'IA, au lieu de parcourir une liste de liens. La visibilité IA consiste à structurer votre site et vos contenus pour que ces outils comprennent votre activité, la citent et renvoient vers vous.",
  },
  {
    question: "Faut-il refaire mon site ou simplement le mettre à jour ?",
    reponse:
      "Tout dépend de son état. Un diagnostic de l'existant permet de recommander la solution la plus adaptée : parfois quelques améliorations suffisent, parfois une refonte est plus intéressante. Dans les deux cas, votre référencement est préservé.",
  },
  {
    question: "À qui appartient le site une fois livré ?",
    reponse: "À vous. Votre site, ses contenus et vos données vous appartiennent : vous restez libre, à tout moment.",
  },
  {
    question: "Que se passe-t-il après la mise en ligne ?",
    reponse:
      "Votre site est suivi dans la durée : mises à jour, sauvegardes, sécurité, évolutions et amélioration du référencement. Vous n'êtes jamais seul face à votre site.",
  },
  {
    question: "Pouvez-vous intégrer de l'IA dans mon projet ?",
    reponse:
      "Oui : compréhension des messages, lecture automatique de documents, recherche par le sens, assistants. L'IA est intégrée là où elle vous fait gagner du temps, comme dans l'application MemoDay.",
    lien: { href: "/realisations/memoday", libelle: "Découvrir MemoDay" },
  },
  {
    question: "Développez-vous des applications mobiles ?",
    reponse:
      "Oui, pour l'iPhone et Android à partir d'une seule base de code, avec publication sur l'App Store et Google Play. L'application fonctionne aussi dans le navigateur.",
    lien: { href: "/realisations/memoday", libelle: "Exemple : MemoDay" },
  },
  {
    question: "Travaillez-vous uniquement à Toulouse ?",
    reponse:
      "Nous sommes basés à Toulouse et travaillons partout en France à distance. Plusieurs de nos clients sont installés à Albi, dans les Hautes-Pyrénées ou près de La Rochelle.",
    lien: { href: "/realisations#clients", libelle: "Voir les sites clients" },
  },
];

// Formulaire de contact
export const BESOINS = [
  "Création de site",
  "Application web ou mobile",
  "Plateforme ou abonnement",
  "Refonte ou migration",
  "Référencement et visibilité IA",
  "Maintenance et suivi",
  "Autre",
];


export const LEGAL = {
  editeur: "Florent Regnault EI",
  nomCommercial: "Web Online Concept",
  siren: "510 583 800",
  siret: "510 583 800 00048",
  adresse: "5 rue Paul Estival, 31200 Toulouse, France",
  telephone: "06 03 36 93 42",
  email: "contact@web-online-concept.com",
  directeur: "Florent Regnault",
  hebergeur: {
    nom: "Vercel Inc.",
    adresse: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    contact: "privacy@vercel.com",
    site: "https://vercel.com",
  },
};

export const PROJETS_SUR_MESURE = REALISATIONS.filter((r) => r.categorie === "sur-mesure");
export const SITES_CLIENTS = REALISATIONS.filter((r) => r.categorie === "client");

export function realisation(slug: string) {
  return REALISATIONS.find((r) => r.slug === slug);
}
