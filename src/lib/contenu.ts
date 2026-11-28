import type { NomIcone } from "@/components/site/Icones";

// Contenu éditorial du site (validé avec Florent, novembre 2026).

export const SITE = {
  nom: "Web Online Concept",
  url: "https://www.web-online-concept.com",
  email: "contact@web-online-concept.com",
  // Réseaux du studio (pied de page et données structurées)
  x: "https://x.com/WebOnlineFr",
  titre: "Vous l'imaginez. Nous le réalisons, au service de vos objectifs.",
  sousTitre:
    "Plus de quinze ans de développement web, démultipliés par l'IA : sites, applications et plateformes complètes, de la première idée à la mise en ligne.",
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
  "Hier, on se demandait\u00a0: est-ce faisable\u00a0? En combien de temps\u00a0? Avec combien de développeurs\u00a0?",
  "Aujourd'hui, l'expertise technique alliée à l'IA a levé ces limites.",
  "Il reste les seules questions qui comptent\u00a0: que voulez-vous accomplir, pour qui, et avec quels objectifs\u00a0?",
];

// Les questions d'hier, barrées une à une dans le bloc « conviction » de la page Méthode
export const QUESTIONS_D_HIER = ["Est-ce faisable\u00a0?", "En combien de temps\u00a0?", "Avec combien de développeurs\u00a0?"];

// Photos d'illustration de l'accueil (générées, sans personne réelle identifiable)
export const PHOTOS = {
  rendezVous: { src: "/photos/studio-rendez-vous.webp", alt: "Présentation d'un nouveau site à une cliente sur un écran panoramique" },
  poste: { src: "/photos/studio-poste.webp", alt: "Poste de travail du studio : six écrans avec des maquettes de sites, d'applications et du code" },
  ultralarge: { src: "/photos/studio-ultralarge.webp", alt: "Développement d'un site sur écran panoramique, avec l'application testée sur téléphone" },
  validation: { src: "/photos/studio-validation.webp", alt: "Un client valide son nouveau site présenté sur grand écran" },
  commercante: { src: "/photos/client-commercante.webp", alt: "Une commerçante consulte son site sur une tablette dans sa boutique" },
  artisan: { src: "/photos/client-artisan.webp", alt: "Un artisan reçoit une demande de devis sur son téléphone dans son atelier" },
};

export const STUDIO = {
  titre: "Un studio équipé pour aller loin",
  texte:
    "Plusieurs écrans, les outils et les modèles d'IA les plus récents : nous concevons, développons et testons en parallèle, sur tous les formats d'écran. Et vous suivez votre projet sur grand écran, étape par étape.",
};

export const POUR_QUI = {
  intro: "Nos propres applications, pensées pour tout le monde, et des sites et outils sur mesure pour les professionnels.",
  tous: {
    titre: "Pour tout le monde",
    texte:
      "Nous concevons et éditons nos propres applications grand public. MemoDay, la première, est disponible sur l'App Store, Google Play et le web ; d'autres sont en préparation.",
    lien: { href: "/realisations/memoday", libelle: "Découvrir MemoDay" },
  },
  pros: {
    titre: "Pour les professionnels",
    texte:
      "Commerçants, artisans, praticiens, indépendants, entreprises : un site ou un outil sur mesure qui travaille pour vous, même quand vous êtes occupé ailleurs.",
    lien: { href: "/realisations", libelle: "Voir les sites réalisés" },
  },
};

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
      "Dépenses, rendez-vous, papiers, photos : le quotidien s'éparpille entre des dizaines d'applications. L'objectif était d'offrir un seul endroit où l'on confie une information en une phrase, une photo ou à la voix, et où on la retrouve pour toujours, sans rien classer soi-même.",
    realise: [
      "Une IA qui comprend chaque message et le classe toute seule : dépense, rendez-vous, tâche, document ou souvenir.",
      "La lecture automatique des factures et contrats photographiés, avec une alerte avant chaque échéance.",
      "Des rappels automatiques, la veille puis une heure avant chaque rendez-vous.",
      "Une recherche par le sens : on retrouve une information sans se souvenir des mots exacts.",
      "Le partage familial de listes et de rendez-vous choisis, tout le reste restant privé.",
      "La synchronisation avec Google Agenda, Outlook et l'iPhone, un mode hors ligne et l'import de centaines de documents d'un coup.",
      "Une connexion sans mot de passe et des abonnements gérés par Stripe, l'App Store et Google Play.",
    ],
    technos: ["Next.js", "TypeScript", "Supabase", "IA générative", "Stripe", "iOS et Android", "Application installable"],
    chiffres: [
      { valeur: "3", libelle: "plateformes : iPhone, Android et web" },
      { valeur: "3", libelle: "langues : français, anglais et espagnol" },
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
      { src: "/realisations/memoday/app-2.webp", alt: "Écran « Ma mémoire » de l'application MemoDay", l: 659, h: 1280, format: "telephone" },
      { src: "/realisations/memoday/app-3.webp", alt: "Écran « Documents » de l'application MemoDay", l: 659, h: 1280, format: "telephone" },
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
      "Une page par spécialité : salles de bain, cuisines, agencements et conseils.",
      "Des pages métiers : isolation, électricité, plomberie, carrelage et peinture.",
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
      { src: "/realisations/klart-concept/concept.webp", alt: "Page « Notre concept » du site de Klart Concept", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/klart-concept/specialites.webp", alt: "Page « Nos spécialités » du site de Klart Concept", l: 1600, h: 900, format: "ordinateur" },
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
      "La présentation complète de l'activité : soins, ateliers, livre et presse.",
      "La réservation des soins et des ateliers, avec paiement en ligne par PayPal.",
      "Un espace client et « Le Sanctuaire », un espace numérique de méditation.",
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
      { src: "/realisations/inspiration-et-meditation/livre.webp", alt: "Page « Le livre » du site de Inspiration & Méditation", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/inspiration-et-meditation/sanctuaire.webp", alt: "Page « Le Sanctuaire » du site de Inspiration & Méditation", l: 1600, h: 900, format: "ordinateur" },
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
      "Un catalogue organisé par famille de produits et par matériau : fenêtres, portes, portails, volets, pergolas, carports, clôtures, garde-corps et barrières anti-inondation.",
      "Une demande de devis gratuit accessible depuis tout le site.",
      "La présentation de l'entreprise : son histoire, son atelier, les visites du showroom sur rendez-vous et ses reportages.",
      "Les informations pratiques : services, plan d'accès et documents à télécharger.",
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
      { src: "/realisations/menuiserie-gaudissard/fenetres.webp", alt: "Page « Fenêtres » du site de Menuiserie Gaudissard", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/menuiserie-gaudissard/societe.webp", alt: "Page « La société » du site de Menuiserie Gaudissard", l: 1600, h: 900, format: "ordinateur" },
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
    client: "Carpentier Communication",
    accroche: "Affiches, PLV, panneaux et adhésifs : l'offre complète d'un imprimeur, avec devis gratuit.",
    besoin:
      "Imprimeur depuis 1962, Carpentier Communication réalise affiches, PLV, panneaux et adhésifs en sérigraphie, en numérique et en offset grand format, avec livraison dans toute la France. Le site devait présenter chaque support, mettre en avant le savoir-faire de l'atelier et faciliter les demandes de devis.",
    realise: [
      "Une page par famille de produits : affiches, PLV, panneaux et adhésifs.",
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
      { src: "/realisations/carpentier-communication/affiches.webp", alt: "Page « Affiches » du site de Carpentier Communication", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/carpentier-communication/plv.webp", alt: "Page « PLV » du site de Carpentier Communication", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/carpentier-communication/mobile.webp", alt: "Version mobile du site de Carpentier Communication", l: 659, h: 1187, format: "telephone" },
    ],
    resume: {
      activite: "Imprimeur d'affiches, PLV, panneaux et adhésifs depuis 1962",
      points: ["Gamme complète par support", "Demande de devis gratuit", "Assistance PAO et brochure à télécharger"],
    },
  },
  {
    slug: "re-borne-retrogaming",
    categorie: "client",
    nom: "Re-borne Retrogaming",
    type: "Site vitrine d'animations événementielles",
    client: "Re-borne Retrogaming",
    accroche: "Consoles rétro et bornes d'arcade pour les événements, du séminaire au mariage.",
    besoin:
      "Re-borne Retrogaming anime les salons, séminaires, soirées d'entreprise et fêtes privées avec des consoles rétro, des bornes d'arcade et un camion d'arcade mobile, le Pixel Truck. Le site devait donner envie, détailler les formules et le matériel, et recueillir les demandes de devis.",
    realise: [
      "La présentation du concept et des prestations, pour les entreprises comme pour les particuliers.",
      "Un catalogue du matériel : consoles, bornes d'arcade et options.",
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
      { src: "/realisations/re-borne-retrogaming/actualites.webp", alt: "Page « Actualités » du site de Re-borne Retrogaming", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/re-borne-retrogaming/materiel.webp", alt: "Page « Matériel et tarifs » du site de Re-borne Retrogaming", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/re-borne-retrogaming/mobile.webp", alt: "Version mobile du site de Re-borne Retrogaming", l: 659, h: 1187, format: "telephone" },
    ],
    resume: {
      activite: "Animations retrogaming et location de bornes d'arcade pour les événements",
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
      "Un espace d'administration complet : l'artiste ajoute ses œuvres et ses expositions en toute autonomie.",
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
    visuels: [
      { src: "/realisations/galerie-carpentier/accueil.webp", alt: "Page d'accueil du site de Galerie Michel Carpentier", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/galerie-carpentier/expositions.webp", alt: "Page « Expositions » du site de Galerie Michel Carpentier", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/galerie-carpentier/mers-oceans.webp", alt: "Page « Mers & Océans » du site de Galerie Michel Carpentier", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/galerie-carpentier/mobile.webp", alt: "Version mobile du site de Galerie Michel Carpentier", l: 659, h: 1188, format: "telephone" },
    ],
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
    client: "Diététi'Phyt",
    accroche: "Le site d'une diététicienne-nutritionniste, avec rendez-vous en ligne et téléconsultation.",
    besoin:
      "Diététi'Phyt accompagne ses patients en nutrition et en phytothérapie : alimentation équilibrée, perte de poids, maladies chroniques. Le site devait présenter clairement chaque accompagnement, mettre les patients en confiance et rendre la prise de rendez-vous immédiate, au cabinet comme à distance.",
    realise: [
      "Une page par accompagnement : alimentation équilibrée, perte de poids et maladies chroniques.",
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
    visuels: [
      { src: "/realisations/dietetiphyt/accueil.webp", alt: "Page d'accueil du site de Diététi'Phyt", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/dietetiphyt/blog.webp", alt: "Page « Blog » du site de Diététi'Phyt", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/dietetiphyt/services.webp", alt: "Page « Services » du site de Diététi'Phyt", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/dietetiphyt/mobile.webp", alt: "Version mobile du site de Diététi'Phyt", l: 659, h: 1187, format: "telephone" },
    ],
    resume: {
      activite: "Diététicienne-nutritionniste et conseillère en phytothérapie",
      points: ["Prise de rendez-vous en ligne", "Téléconsultation", "Blog et ressources pour les patients"],
    },
  },
  {
    slug: "point-serigraphie",
    categorie: "client",
    nom: "Point Sérigraphie",
    type: "Site vitrine d'imprimeur avec catalogues",
    client: "Point Sérigraphie, Albi",
    accroche: "Autocollants, vitrophanies, panneaux, marquages : l'impression sur tous supports, à Albi depuis 1976.",
    besoin:
      "Point Sérigraphie imprime en sérigraphie et en numérique sur une très grande variété de supports, avec livraison dans toute la France en 24 à 48 heures. Le site devait rendre lisible une offre très large et faciliter les demandes de devis.",
    realise: [
      "Une page par famille de produits : autocollants, vitrophanies, panneaux, marquages, transferts, banderoles, PLV, magnétiques, cartes et badges, ardoises et doming.",
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
    visuels: [
      { src: "/realisations/point-serigraphie/accueil.webp", alt: "Page d'accueil du site de Point Sérigraphie", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/point-serigraphie/autocollants.webp", alt: "Page « Autocollants » du site de Point Sérigraphie", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/point-serigraphie/panneaux.webp", alt: "Page « Panneaux » du site de Point Sérigraphie", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/point-serigraphie/mobile.webp", alt: "Version mobile du site de Point Sérigraphie", l: 659, h: 1187, format: "telephone" },
    ],
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
      "Mozaic Environnement imprime les supports de communication de la collecte et du tri des déchets : signalétique, adhésifs de conteneurs, consignes de tri, banderoles. Sa clientèle de collectivités, d'associations et d'entreprises du déchet attendait un catalogue clair et un accès direct aux devis et aux échantillons.",
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
    visuels: [
      { src: "/realisations/mozaic-environnement/accueil.webp", alt: "Page d'accueil du site de Mozaic Environnement", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/mozaic-environnement/catalogues.webp", alt: "Page « Nos catalogues » du site de Mozaic Environnement", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/mozaic-environnement/etapes.webp", alt: "Page « Étapes de commande » du site de Mozaic Environnement", l: 1600, h: 900, format: "ordinateur" },
      { src: "/realisations/mozaic-environnement/mobile.webp", alt: "Version mobile du site de Mozaic Environnement", l: 659, h: 1187, format: "telephone" },
    ],
    resume: {
      activite: "Signalétique et supports imprimés pour la collecte et le tri des déchets",
      lieu: "Albi",
      points: ["Dix-huit catégories de produits", "Échantillons gratuits", "Demande de devis"],
    },
  },
];

// IA intégrées aux projets (texte, sans logo) : à tenir à jour, ce marché évolue vite
export const IA = {
  titre: "Les IA que nous intégrons",
  phrase:
    "Nous ne sommes liés à aucune IA : pour chaque projet, nous choisissons le modèle le plus adapté selon la qualité, le coût, la confidentialité et l'hébergement, en Europe si besoin.",
  criteres: ["Qualité", "Coût", "Confidentialité", "Hébergement en Europe"],
  modeles: [
    { nom: "Claude", editeur: "Anthropic" },
    { nom: "ChatGPT", editeur: "OpenAI" },
    { nom: "Gemini", editeur: "Google" },
    { nom: "Mistral", editeur: "Mistral AI, France" },
    { nom: "Grok", editeur: "xAI" },
  ],
};

// texte : description (accueil, données structurées) ; intro : pour qui et ce que ça change (page Capacités, en tête des points)
export type Capacite = { titre: string; texte: string; intro: string; points: string[]; exemples: string[]; icone: NomIcone };

export const CAPACITES: Capacite[] = [
  {
    titre: "Sites sur mesure",
    icone: "site",
    texte:
      "Vitrines, galeries, sites multilingues : un design unique, rapide sur tous les écrans et pensé pour le référencement dès la première ligne.",
    intro:
      "Pour une entreprise, un artisan ou un artiste dont le site doit donner envie de pousser la porte, de réserver ou de demander un devis.",
    points: ["Un design unique, sans modèle tout fait", "Rapide et lisible sur tous les écrans", "Pensé pour le référencement dès la conception"],
    exemples: ["galerie-carpentier", "inspiration-et-meditation"],
  },
  {
    titre: "Applications web et mobiles",
    icone: "app",
    texte:
      "Une seule base de code pour l'iPhone, Android et le navigateur, publiée sur l'App Store et Google Play.",
    intro:
      "Pour une idée qui doit vivre dans la poche de vos utilisateurs, avec tout ce qu'offre un téléphone : notifications, appareil photo, micro.",
    points: ["Une seule base de code pour l'iPhone, Android et le web", "Publication sur l'App Store et Google Play", "Des évolutions qui suivent sur tous les appareils"],
    exemples: ["memoday"],
  },
  {
    titre: "Plateformes à abonnement",
    icone: "abonnement",
    texte:
      "Comptes utilisateurs, formules, paiement par Stripe et achats intégrés aux stores : un service en ligne prêt à encaisser.",
    intro:
      "Pour transformer un service en revenus réguliers : vos clients s'inscrivent, choisissent leur formule et paient seuls, à toute heure.",
    points: ["Comptes utilisateurs et formules", "Paiement par Stripe et achats intégrés aux stores", "Abonnements gérés automatiquement"],
    exemples: ["memoday"],
  },
  {
    titre: "IA intégrée",
    icone: "ia",
    texte:
      "Compréhension du langage, lecture de documents, recherche par le sens, assistants : l'IA au cœur du produit, là où elle fait gagner du temps.",
    intro:
      "Pour les tâches qui prennent du temps à vos utilisateurs ou à votre équipe : trier, saisir, retrouver. L'IA s'en charge, discrètement, au bon endroit.",
    points: ["Compréhension du langage naturel", "Lecture automatique de documents", "Recherche par le sens"],
    exemples: ["memoday"],
  },
  {
    titre: "Référencement et visibilité IA",
    icone: "visibilite",
    texte:
      "Référencement naturel et local, fiche Google Business, données structurées et contenus pensés pour être cités par ChatGPT, Perplexity ou Google : votre site trouvé là où vos clients cherchent.",
    intro:
      "Vos clients ne cherchent plus seulement sur Google : ils posent aussi leurs questions à ChatGPT ou Perplexity. Votre activité doit apparaître dans les deux cas.",
    points: ["Référencement naturel et local", "Données structurées et fiche Google Business", "Des contenus pensés pour être cités par les IA"],
    exemples: ["inspiration-et-meditation", "klart-concept"],
  },
  {
    titre: "Données et back-offices",
    icone: "donnees",
    texte:
      "Bases de données sécurisées, outils de gestion, réservations, e-mails automatiques et tableaux de bord : vous pilotez votre activité en autonomie.",
    intro:
      "Pour ne plus dépendre de tableurs, de messages éparpillés ou d'un prestataire à chaque modification : vos informations au même endroit, et la main sur votre activité.",
    points: ["Bases de données sécurisées", "Outils de gestion et tableaux de bord", "Réservations et e-mails automatiques"],
    exemples: ["galerie-carpentier", "inspiration-et-meditation"],
  },
  {
    titre: "Refonte, migration et suivi",
    icone: "evolution",
    texte:
      "Refonte d'un site existant, changement d'hébergeur ou de technologie sans perdre votre référencement, puis mises à jour et évolutions dans la durée.",
    intro:
      "Pour un site qui a vieilli, qui ralentit ou que plus personne ne sait modifier : nous le remettons sur des bases saines, sans repartir de zéro.",
    points: ["Une refonte sans perdre votre référencement", "Changement d'hébergeur ou de technologie", "Mises à jour et évolutions dans la durée"],
    exemples: ["galerie-carpentier", "menuiserie-gaudissard"],
  },
  {
    titre: "Performance et sécurité",
    icone: "securite",
    texte:
      "Hébergement rapide, sauvegardes, sécurité et conformité RGPD : un site qui se charge vite et reste protégé.",
    intro:
      "Un visiteur part si la page met trop de temps à s'afficher, et une faille peut coûter cher. Ces sujets sont réglés en amont, pour que vous n'ayez pas à y penser.",
    points: ["Un hébergement rapide", "Sauvegardes et protection des données", "Conformité RGPD"],
    exemples: [],
  },
];

export type Etape = { titre: string; texte: string };

// Détail de chaque étape pour la page Méthode (même ordre que METHODE)
// intro : ce que l'étape change pour le client (page Méthode, en tête des points ; le texte court de METHODE sert à l'accueil)
export const METHODE_DETAILS: { intro: string; points: string[]; photo: keyof typeof PHOTOS; carte: { titre: string; detail: string } }[] = [
  {
    intro:
      "Vous savez exactement ce que vous allez obtenir avant qu'une seule ligne de code soit écrite, sans surprise en cours de route.",
    points: [
      "Un échange pour comprendre vos objectifs, votre public et vos contraintes",
      "Un prototype cliquable en quelques jours",
      "Un périmètre et un planning clairs avant le développement",
    ],
    photo: "rendezVous",
    carte: { titre: "Prototype validé", detail: "On passe au développement" },
  },
  {
    intro:
      "Des projets qui demandaient hier une équipe entière et de longs mois deviennent possibles, à votre échelle et à votre rythme.",
    points: [
      "Code, tests, contenus et traductions accélérés par les meilleures IA du moment",
      "Des versions à essayer en ligne au fil du développement",
      "Un seul interlocuteur, du premier échange à la mise en ligne",
    ],
    photo: "ultralarge",
    carte: { titre: "Nouvelle version en ligne", detail: "Prête à être testée" },
  },
  {
    intro:
      "Aller vite ne sert à rien si le site casse au premier clic. Ce que vous recevez fonctionne, sur tous les écrans, le jour de la mise en ligne comme les mois suivants.",
    points: [
      "Des tests automatisés à chaque modification",
      "Une relecture systématique du code et de la sécurité",
      "Performance et accessibilité mesurées avant la mise en ligne",
    ],
    photo: "poste",
    carte: { titre: "Tous les tests sont passés", detail: "Sécurité vérifiée" },
  },
  {
    intro:
      "La mise en ligne n'est qu'un début : vous gardez le même interlocuteur, qui connaît votre projet par cœur, aussi longtemps que vous en avez besoin.",
    points: [
      "Mises à jour et sauvegardes suivies",
      "De nouvelles fonctionnalités quand votre activité grandit",
      "Une veille permanente sur les technologies et l'IA",
    ],
    photo: "validation",
    carte: { titre: "Évolution livrée", detail: "Votre projet grandit avec vous" },
  },
];

export const METHODE: Etape[] = [
  {
    titre: "Cadrer vite",
    texte:
      "Vos objectifs d'abord. En quelques jours, un prototype cliquable rend le projet concret : on décide sur pièce, pas sur plan.",
  },
  {
    titre: "Produire plus",
    texte:
      "L'IA démultiplie chaque étape : code, tests, contenus, traductions. La capacité d'une équipe entière, avec un seul interlocuteur.",
  },
  {
    titre: "Tout vérifier",
    texte:
      "Tests automatisés, revue systématique et sécurité dès la conception : la vitesse ne se paie jamais en qualité.",
  },
  {
    titre: "Faire évoluer",
    texte:
      "Une veille permanente sur les technologies et l'IA : chaque nouveauté utile vient renforcer votre projet, longtemps après sa mise en ligne.",
  },
];

export const ENGAGEMENTS: Etape[] = [
  {
    titre: "Tout vous appartient",
    texte: "Votre site, ses contenus et vos données sont à vous : vous restez libre, à tout moment.",
  },
  {
    titre: "Un seul interlocuteur",
    texte: "La même personne du premier échange au suivi : pas de relais, pas d'information perdue.",
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

export type ThemeFaq = "ensemble" | "projet" | "visibilite" | "suivi";

export const THEMES_FAQ: { id: ThemeFaq; titre: string }[] = [
  { id: "ensemble", titre: "Travailler ensemble" },
  { id: "projet", titre: "Votre projet" },
  { id: "visibilite", titre: "Visibilité" },
  { id: "suivi", titre: "Après la mise en ligne" },
];

export type Question = { question: string; reponse: string; theme: ThemeFaq; lien?: Lien };

export const FAQ: Question[] = [
  {
    theme: "ensemble",
    question: "Comment travailler avec nous ?",
    reponse:
      "Nous travaillons sur recommandation et sur demande privée. Si l'on vous a parlé de nous, il suffit de nous écrire directement : chaque projet commence par un échange sur vos objectifs.",
  },
  {
    theme: "ensemble",
    question: "Travaillez-vous à distance ?",
    reponse:
      "Oui, nous travaillons à distance, en France comme à l'étranger : visio, téléphone et e-mail, en français, en anglais ou en espagnol. Le suivi se fait aussi simplement que si nous étions voisins.",
    lien: { href: "/realisations#clients", libelle: "Voir les sites clients" },
  },
  {
    theme: "ensemble",
    question: "À qui appartient le site une fois livré ?",
    reponse: "À vous. Votre site, ses contenus et vos données vous appartiennent : vous restez libre, à tout moment.",
  },
  {
    theme: "projet",
    question: "Combien de temps faut-il pour créer un site ?",
    reponse:
      "Cela dépend de l'ambition du projet : quelques semaines pour un site vitrine, davantage pour une application ou une plateforme complète. Grâce à l'IA, les délais sont bien plus courts qu'auparavant, et un planning précis vous est donné dès le cadrage.",
  },
  {
    theme: "projet",
    question: "Faut-il refaire mon site ou simplement le mettre à jour ?",
    reponse:
      "Tout dépend de son état. Un diagnostic de l'existant permet de recommander la solution la plus adaptée : parfois quelques améliorations suffisent, parfois une refonte est plus intéressante. Dans les deux cas, votre référencement est préservé.",
  },
  {
    theme: "projet",
    question: "Développez-vous des applications mobiles ?",
    reponse:
      "Oui, pour l'iPhone et Android à partir d'une seule base de code, avec publication sur l'App Store et Google Play. L'application fonctionne aussi dans le navigateur.",
    lien: { href: "/realisations/memoday", libelle: "Exemple : MemoDay" },
  },
  {
    theme: "projet",
    question: "Pouvez-vous intégrer de l'IA dans mon projet ?",
    reponse:
      "Oui : compréhension des messages, lecture automatique de documents, recherche par le sens, assistants. Nous travaillons avec Claude, ChatGPT, Gemini, Mistral ou Grok, et choisissons le modèle adapté à chaque projet, comme pour l'application MemoDay.",
    lien: { href: "/capacites", libelle: "Les IA que nous intégrons" },
  },
  {
    theme: "projet",
    question: "Faites-vous des sites en plusieurs langues ?",
    reponse:
      "Oui, comme ce site, disponible en français, en anglais et en espagnol. Chaque langue a ses propres adresses, pour être bien référencée dans chaque pays, et les traductions sont préparées avec l'IA puis vérifiées. L'application MemoDay existe elle aussi dans ces trois langues.",
    lien: { href: "/realisations/memoday", libelle: "Découvrir MemoDay" },
  },
  {
    theme: "visibilite",
    question: "Le référencement est-il compris ?",
    reponse:
      "Les fondations du référencement sont intégrées dès la conception : structure des pages, vitesse de chargement, balisage, données structurées et affichage mobile. Pour aller plus loin, un accompagnement dédié est possible : référencement local, fiche Google Business, contenus.",
  },
  {
    theme: "visibilite",
    question: "Qu'est-ce que la visibilité dans les IA ?",
    reponse:
      "De plus en plus de personnes posent leurs questions à ChatGPT, à Claude, à Perplexity ou à la recherche Google enrichie par l'IA, au lieu de parcourir une liste de liens. La visibilité IA consiste à structurer votre site et vos contenus pour que ces outils comprennent votre activité, la citent et renvoient vers vous.",
    lien: { href: "/blog/visibilite-ia-chatgpt-claude-perplexity", libelle: "Lire notre article sur le sujet" },
  },
  {
    theme: "suivi",
    question: "Pourrai-je modifier mon site moi-même ?",
    reponse:
      "Oui. Votre projet peut inclure un espace d'administration pensé pour vous : textes, images, produits, actualités, œuvres ou rendez-vous. Vous êtes accompagné pour le prendre en main, et vous pouvez toujours confier les évolutions plus importantes.",
    lien: { href: "/realisations/galerie-carpentier", libelle: "Exemple : la Galerie Michel Carpentier" },
  },
  {
    theme: "suivi",
    question: "Que se passe-t-il après la mise en ligne ?",
    reponse:
      "Votre site est suivi dans la durée : mises à jour, sauvegardes, sécurité, évolutions et amélioration du référencement. Vous n'êtes jamais seul face à votre site.",
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

// Contenu complet en français : modèle des versions anglaise (contenu-en.ts) et espagnole (contenu-es.ts)
export const CONTENU_FR = {
  SITE,
  NAVIGATION,
  MANIFESTE,
  QUESTIONS_D_HIER,
  PHOTOS,
  STUDIO,
  POUR_QUI,
  REALISATIONS,
  IA,
  CAPACITES,
  METHODE_DETAILS,
  METHODE,
  ENGAGEMENTS,
  THEMES_FAQ,
  FAQ,
  BESOINS,
};
export type Contenu = typeof CONTENU_FR;

export const PROJETS_SUR_MESURE = REALISATIONS.filter((r) => r.categorie === "sur-mesure");
export const SITES_CLIENTS = REALISATIONS.filter((r) => r.categorie === "client");

// Écrans mobiles d'une réalisation (au plus trois), pour les éventails d'application
export function ecransApplication(slug: string) {
  return (REALISATIONS.find((r) => r.slug === slug)?.visuels ?? []).filter((v) => v.format === "telephone").slice(0, 3);
}

export function realisation(slug: string) {
  return REALISATIONS.find((r) => r.slug === slug);
}
