// Contenu éditorial du site (validé avec Florent, novembre 2026).

export const SITE = {
  nom: "Web Online Concept",
  url: "https://www.web-online-concept.com",
  email: "contact@web-online-concept.com",
  titre: "Imaginez-le et Web Online Concept le réalise afin d'atteindre vos objectifs.",
  sousTitre:
    "Plus de quinze ans de développement web, démultipliés par l'IA : sites, applications et plateformes complètes, de la première idée à la mise en ligne.",
  phraseFinale:
    "Votre projet commence par vos objectifs. Parlons de ce que vous voulez accomplir.",
};

export const NAVIGATION = [
  { href: "/realisations", libelle: "Réalisations" },
  { href: "/capacites", libelle: "Capacités" },
  { href: "/methode", libelle: "Méthode" },
  { href: "/a-propos", libelle: "À propos" },
  { href: "/blog", libelle: "Blog" },
];

export const MANIFESTE = [
  "Hier, on se demandait : est-ce faisable ? En combien de temps ? Avec combien de développeurs ?",
  "Aujourd'hui, l'expertise technique alliée à l'IA a levé ces limites.",
  "Il reste les seules questions qui comptent : que voulez-vous accomplir, pour qui, et avec quels objectifs ?",
];

export type Chiffre = { valeur: string; libelle: string };
export type Lien = { href: string; libelle: string };

export type Realisation = {
  slug: string;
  nom: string;
  type: string;
  client?: string;
  accroche: string;
  besoin: string;
  realise: string[];
  technos: string[];
  chiffres: Chiffre[];
  site: Lien;
  autresLiens?: Lien[];
  teinte: string; // couleur dominante de la carte
};

export const REALISATIONS: Realisation[] = [
  {
    slug: "memoday",
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
  },
  {
    slug: "galerie-carpentier",
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
  },
  {
    slug: "inspiration-et-meditation",
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
  },
];

export type Capacite = { titre: string; texte: string; exemples: string[] };

export const CAPACITES: Capacite[] = [
  {
    titre: "Sites sur mesure",
    texte:
      "Vitrines, galeries, sites multilingues : un design unique, rapide sur tous les écrans et pensé pour le référencement dès la première ligne.",
    exemples: ["galerie-carpentier", "inspiration-et-meditation"],
  },
  {
    titre: "Applications web et mobiles",
    texte:
      "Une seule base de code pour l'iPhone, Android et le navigateur, publiée sur l'App Store et Google Play.",
    exemples: ["memoday"],
  },
  {
    titre: "Plateformes à abonnement",
    texte:
      "Comptes utilisateurs, formules, paiement par Stripe et achats intégrés aux stores : un service en ligne prêt à encaisser.",
    exemples: ["memoday"],
  },
  {
    titre: "IA intégrée",
    texte:
      "Compréhension du langage, lecture de documents, recherche par le sens, assistants : l'IA au cœur du produit, là où elle fait gagner du temps.",
    exemples: ["memoday"],
  },
  {
    titre: "Données et back-offices",
    texte:
      "Bases de données sécurisées, outils de gestion, réservations, e-mails automatiques et tableaux de bord : vous pilotez votre activité en autonomie.",
    exemples: ["galerie-carpentier", "inspiration-et-meditation"],
  },
  {
    titre: "Performance et sécurité",
    texte:
      "Hébergement, sauvegardes, maintenance et conformité RGPD : un site rapide, protégé et suivi dans la durée.",
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

export function realisation(slug: string) {
  return REALISATIONS.find((r) => r.slug === slug);
}
