import { chemin } from "@/lib/i18n/chemins";
import { CONTENU_FR, type Chiffre, type Contenu, type Lien, type Realisation } from "@/lib/contenu";

// Contenu éditorial en anglais (même structure que contenu.ts)

const L = "en" as const;

const SITE = {
  ...CONTENU_FR.SITE,
  titre: "You imagine it. We build it, around your goals.",
  sousTitre:
    "Over fifteen years of web development, multiplied by AI: websites, apps and complete platforms, from the first idea to launch.",
  phraseFinale: "We work by referral.",
};

const NAVIGATION = [
  { href: chemin(L, "realisations"), libelle: "Work" },
  { href: chemin(L, "capacites"), libelle: "Capabilities" },
  { href: chemin(L, "methode"), libelle: "Method" },
  { href: chemin(L, "a-propos"), libelle: "About" },
  { href: chemin(L, "blog"), libelle: "Blog" },
  { href: chemin(L, "faq"), libelle: "FAQ" },
  { href: chemin(L, "contact"), libelle: "Contact" },
];

const MANIFESTE = [
  "Yesterday, people asked: is it feasible? How long will it take? How many developers will it need?",
  "Today, technical expertise combined with AI has lifted those limits.",
  "Only the questions that matter remain: what do you want to achieve, for whom, and with what goals?",
];

const QUESTIONS_D_HIER = ["Is it feasible?", "How long will it take?", "How many developers?"];

const PHOTOS: Contenu["PHOTOS"] = {
  rendezVous: { src: CONTENU_FR.PHOTOS.rendezVous.src, alt: "Presenting a new website to a client on an ultrawide screen" },
  poste: { src: CONTENU_FR.PHOTOS.poste.src, alt: "The studio's workstation: six screens showing website and app mockups and code" },
  ultralarge: { src: CONTENU_FR.PHOTOS.ultralarge.src, alt: "Building a website on an ultrawide screen, with the app tested on a phone" },
  validation: { src: CONTENU_FR.PHOTOS.validation.src, alt: "A client approves their new website, shown on a large screen" },
  commercante: { src: CONTENU_FR.PHOTOS.commercante.src, alt: "A shop owner browses her website on a tablet in her store" },
  artisan: { src: CONTENU_FR.PHOTOS.artisan.src, alt: "A craftsman receives a quote request on his phone in his workshop" },
};

const STUDIO = {
  titre: "A studio equipped to go further",
  texte:
    "Multiple screens, the latest AI tools and models: we design, build and test in parallel, on every screen size. And you follow your project on the big screen, step by step.",
};

const POUR_QUI = {
  intro: "Our own apps, designed for everyone, and custom websites and tools for businesses.",
  tous: {
    titre: "For everyone",
    texte:
      "We design and publish our own consumer apps. MemoDay, the first one, is available on the App Store, Google Play and the web; more are on the way.",
    lien: { href: chemin(L, "realisations", "memoday"), libelle: "Discover MemoDay" },
  },
  pros: {
    titre: "For businesses",
    texte:
      "Shops, tradespeople, practitioners, freelancers, companies: a custom website or tool that works for you, even when you're busy elsewhere.",
    lien: { href: chemin(L, "realisations"), libelle: "See the websites we've built" },
  },
};

// Textes traduits de chaque réalisation ; les captures, liens et couleurs restent ceux du français
type TexteRealisation = Pick<Realisation, "type" | "accroche" | "besoin" | "realise" | "chiffres"> & {
  client?: string;
  technos?: string[];
  alts: string[];
  resume?: Realisation["resume"];
  autresLiens?: Lien[];
};

const page = (nom: string, titre?: string) => (titre ? `“${titre}” page of the ${nom} website` : `Home page of the ${nom} website`);
const mobile = (nom: string) => `Mobile version of the ${nom} website`;
const c = (valeur: string, libelle: string): Chiffre => ({ valeur, libelle });

const TEXTES: Record<string, TexteRealisation> = {
  memoday: {
    type: "Web and mobile app, our own product",
    accroche: "A personal memory for everything you don't want to forget.",
    besoin:
      "Expenses, appointments, paperwork, photos: everyday life gets scattered across dozens of apps. The goal was to offer a single place where you hand over a piece of information in one sentence, a photo or by voice, and find it again forever, without filing anything yourself.",
    realise: [
      "An AI that understands each message and files it on its own: expense, appointment, task, document or memory.",
      "Automatic reading of photographed invoices and contracts, with an alert before every deadline.",
      "Automatic reminders, the day before and one hour before each appointment.",
      "Search by meaning: you find information without remembering the exact words.",
      "Family sharing of selected lists and appointments, while everything else stays private.",
      "Sync with Google Calendar, Outlook and iPhone, an offline mode and bulk import of hundreds of documents at once.",
      "Passwordless sign-in and subscriptions managed through Stripe, the App Store and Google Play.",
    ],
    technos: ["Next.js", "TypeScript", "Supabase", "Generative AI", "Stripe", "iOS and Android", "Installable app"],
    chiffres: [c("3", "platforms: iPhone, Android and web"), c("3", "languages: French, English and Spanish"), c("70", "data tables, each isolated per user")],
    alts: ["MemoDay website home page", "MemoDay website on mobile", "“My memory” screen of the MemoDay app", "“Documents” screen of the MemoDay app"],
    autresLiens: [
      { href: "https://apps.apple.com/us/app/memoday-your-memory-for-life/id6831483081", libelle: "App Store" },
      { href: "https://play.google.com/store/apps/details?id=net.memoday.app&hl=en", libelle: "Google Play" },
    ],
  },
  "klart-concept": {
    type: "Website for a renovation company",
    client: "Klart Concept, Argelès-Gazost",
    accroche: "Custom bathrooms, kitchens and fittings in the Hautes-Pyrénées, France.",
    besoin:
      "Klart Concept designs and renovates bathrooms, kitchens and fittings, and handles every trade involved in a turnkey interior renovation. The website had to showcase the quality of their work, cover their whole service area and generate quote requests.",
    realise: [
      "One page per specialty: bathrooms, kitchens, fittings and advice.",
      "Trade pages: insulation, electrics, plumbing, tiling and painting.",
      "Photo galleries of completed projects.",
      "A service area page covering some twenty towns, including Tarbes and Lourdes.",
      "Google customer reviews, a DIY blog and a partners page.",
      "A free quote request, plus building the website and managing it over time.",
    ],
    chiffres: [c("15 years", "of company experience"), c("20", "towns in the service area"), c("5", "trades presented")],
    alts: [page("Klart Concept"), page("Klart Concept", "Our concept"), page("Klart Concept", "Our specialties"), mobile("Klart Concept")],
    resume: {
      activite: "Design and renovation of bathrooms, kitchens and fittings",
      lieu: "Argelès-Gazost, Hautes-Pyrénées",
      points: ["Project galleries", "Customer reviews and blog", "Local search visibility across its service area"],
    },
  },
  "inspiration-et-meditation": {
    type: "Practitioner website with online booking",
    accroche: "Meditations, workshops and treatments, with online booking and payment.",
    besoin:
      "Anne Brulard Labasse offers meditations, workshops and home treatments in the Hautes-Pyrénées, as well as a book and a digital space. Her whole activity needed to come together on a single website, with online booking and payment.",
    realise: [
      "A complete presentation of her work: treatments, workshops, book and press.",
      "Booking for treatments and workshops, with online payment through PayPal.",
      "A client area and “Le Sanctuaire”, a digital meditation space.",
      "Automatic emails sent every morning.",
      "Integrated Google reviews and local search visibility across some forty towns.",
      "An admin area to keep the website alive day to day.",
    ],
    technos: ["PHP", "MySQL", "PayPal", "OVH"],
    chiffres: [c("40", "towns covered by local search"), c("24/7", "online booking and payment")],
    alts: [page("Inspiration & Méditation"), page("Inspiration & Méditation", "The book"), page("Inspiration & Méditation", "Le Sanctuaire"), mobile("Inspiration & Méditation")],
  },
  "menuiserie-gaudissard": {
    type: "Business website and product catalog",
    client: "Menuiserie Gaudissard, Aigrefeuille-d'Aunis",
    accroche: "A window and door manufacturer's full range, from windows to gates, with free quotes.",
    besoin:
      "A maker of PVC and aluminum joinery since 1964, near La Rochelle, Menuiserie Gaudissard offers a very wide range, in standard or custom sizes. Each product family had to be presented clearly, the company and its workshop made known, and visits turned into quote requests.",
    realise: [
      "A catalog organized by product family and material: windows, doors, gates, shutters, pergolas, carports, fences, railings and flood barriers.",
      "A free quote request available from anywhere on the site.",
      "A presentation of the company: its history, its workshop, showroom visits by appointment and its media coverage.",
      "Practical information: services, directions and downloadable documents.",
      "A client area and access to the store for discounted products.",
      "Building the website, then managing it over time.",
    ],
    chiffres: [c("1964", "year the company was founded"), c("10", "product families presented"), c("40", "employees")],
    alts: [page("Menuiserie Gaudissard"), page("Menuiserie Gaudissard", "Windows"), page("Menuiserie Gaudissard", "The company"), mobile("Menuiserie Gaudissard")],
    resume: {
      activite: "Manufacturer of PVC and aluminum windows and doors since 1964",
      lieu: "Aigrefeuille-d'Aunis, near La Rochelle",
      points: ["Catalog by product and material", "Free quote request", "Client area"],
    },
  },
  "carpentier-communication": {
    type: "Printing company website with online quotes",
    accroche: "Posters, displays, signs and stickers: a printer's full range, with free quotes.",
    besoin:
      "A printer since 1962, Carpentier Communication produces posters, point-of-sale displays, signs and stickers using screen printing, digital and large-format offset, with delivery across France. The website had to present each medium, highlight the workshop's expertise and make quote requests easy.",
    realise: [
      "One page per product family: posters, displays, signs and stickers.",
      "A free quote form.",
      "A prepress help page to guide clients in preparing their files.",
      "A downloadable product brochure.",
      "A presentation of the company, its client references and delivery terms.",
      "Building the website, then managing it over time.",
    ],
    chiffres: [c("1962", "year the company was founded"), c("4", "product families"), c("12", "client references presented")],
    alts: [page("Carpentier Communication"), page("Carpentier Communication", "Posters"), page("Carpentier Communication", "Displays"), mobile("Carpentier Communication")],
    resume: {
      activite: "Printer of posters, displays, signs and stickers since 1962",
      points: ["Full range by medium", "Free quote request", "Prepress help and downloadable brochure"],
    },
  },
  "re-borne-retrogaming": {
    type: "Website for an event entertainment company",
    accroche: "Retro consoles and arcade machines for events, from corporate seminars to weddings.",
    besoin:
      "Re-borne Retrogaming livens up trade shows, seminars, corporate parties and private celebrations with retro consoles, arcade machines and a mobile arcade truck, the Pixel Truck. The website had to spark excitement, detail the packages and equipment, and collect quote requests.",
    realise: [
      "A presentation of the concept and services, for companies and individuals alike.",
      "An equipment catalog: consoles, arcade machines and options.",
      "A pricing page presenting the packages.",
      "A news section.",
      "Free quote and contact forms.",
      "Building the website, then managing it over time.",
    ],
    chiffres: [c("19", "consoles in the catalog"), c("5 to 30", "gaming stations per event"), c("4", "arcade machines in the Pixel Truck")],
    alts: [page("Re-borne Retrogaming"), page("Re-borne Retrogaming", "News"), page("Re-borne Retrogaming", "Equipment and pricing"), mobile("Re-borne Retrogaming")],
    resume: {
      activite: "Retro gaming entertainment and arcade machine rental for events",
      points: ["Services and pricing", "Equipment catalog", "News and quote requests"],
    },
  },
  "galerie-carpentier": {
    type: "Online art gallery",
    client: "Michel Carpentier, painter",
    accroche: "A painter's online gallery, from his canvases to his exhibitions.",
    besoin:
      "Michel Carpentier's work spans nine worlds, from rugby to caricature, from the oceans to digital creations. It needed a showcase worthy of this work, and a simple tool so the artist could keep his gallery alive himself.",
    realise: [
      "A gallery organized into nine categories, designed to show each canvas at its best.",
      "Exhibitions, History and Friends pages that tell the story of the artist's career.",
      "A complete admin area: the artist adds his works and exhibitions on his own.",
      "A fast website, pleasant on mobile and optimized for search engines.",
    ],
    technos: ["Next.js", "TypeScript", "Supabase", "Vercel"],
    chiffres: [c("291", "works online"), c("22", "exhibitions presented"), c("9", "artistic worlds")],
    alts: [page("Galerie Michel Carpentier"), page("Galerie Michel Carpentier", "Exhibitions"), page("Galerie Michel Carpentier", "Seas & Oceans"), mobile("Galerie Michel Carpentier")],
    resume: {
      activite: "Online art gallery of the painter Michel Carpentier",
      lieu: "Bordeaux",
      points: ["291 works across nine worlds", "Exhibitions and the artist's career", "Managed by the artist himself"],
    },
  },
  dietetiphyt: {
    type: "Practitioner website with appointment booking",
    accroche: "A dietitian-nutritionist's website, with online booking and video consultations.",
    besoin:
      "Diététi'Phyt supports patients in nutrition and herbal medicine: balanced eating, weight loss, chronic conditions. The website had to present each program clearly, reassure patients and make booking instant, in the office or remotely.",
    realise: [
      "One page per program: balanced eating, weight loss and chronic conditions.",
      "Online appointment booking, with video consultations and home visits.",
      "A locations and fees page.",
      "A blog, an FAQ and resources for patients.",
      "Links to Instagram, Facebook and LinkedIn.",
      "Building the website, then managing it over time.",
    ],
    chiffres: [c("3", "programs in detail"), c("24/7", "online appointment booking")],
    alts: [page("Diététi'Phyt"), page("Diététi'Phyt", "Blog"), page("Diététi'Phyt", "Services"), mobile("Diététi'Phyt")],
    resume: {
      activite: "Dietitian-nutritionist and herbal medicine advisor",
      points: ["Online appointment booking", "Video consultations", "Blog and patient resources"],
    },
  },
  "point-serigraphie": {
    type: "Printing company website with catalogs",
    client: "Point Sérigraphie, Albi",
    accroche: "Stickers, window graphics, signs, markings: printing on every surface, in Albi since 1976.",
    besoin:
      "Point Sérigraphie prints using screen printing and digital methods on a very wide variety of surfaces, with delivery across France within 24 to 48 hours. The website had to make a very broad offering easy to read and make quote requests simple.",
    realise: [
      "One page per product family: stickers, window graphics, signs, markings, transfers, banners, displays, magnets, cards and badges, boards and doming.",
      "A free quote form, with a reply within 24 hours.",
      "Downloadable catalogs.",
      "A news feed.",
      "Company, prepress and France-wide delivery pages.",
      "Building the website, then managing it over time.",
    ],
    chiffres: [c("1976", "year the company was founded"), c("11", "product families"), c("24 to 48 h", "delivery across France")],
    alts: [page("Point Sérigraphie"), page("Point Sérigraphie", "Stickers"), page("Point Sérigraphie", "Signs"), mobile("Point Sérigraphie")],
    resume: {
      activite: "Screen and digital printing on every surface since 1976",
      lieu: "Albi",
      points: ["Eleven product families", "Downloadable catalogs", "Quotes within 24 hours"],
    },
  },
  "mozaic-environnement": {
    type: "Website for local authorities",
    client: "Mozaic Environnement, Albi",
    accroche: "Signage and printed materials for waste collection and sorting.",
    besoin:
      "Mozaic Environnement prints the communication materials used for waste collection and sorting: signage, container stickers, sorting instructions, banners. Its clients, local authorities, associations and waste management companies, expected a clear catalog and direct access to quotes and samples.",
    realise: [
      "A catalog of eighteen product categories.",
      "Catalogs to browse online.",
      "Free sample requests.",
      "Free quote and contact forms.",
      "A presentation of the company and its professional memberships (AdCF, FESPA France).",
      "Building the website, then managing it over time.",
    ],
    chiffres: [c("18", "product categories"), c("1976", "year the company was founded")],
    alts: [page("Mozaic Environnement"), page("Mozaic Environnement", "Our catalogs"), page("Mozaic Environnement", "Ordering steps"), mobile("Mozaic Environnement")],
    resume: {
      activite: "Signage and printed materials for waste collection and sorting",
      lieu: "Albi",
      points: ["Eighteen product categories", "Free samples", "Quote requests"],
    },
  },
};

const REALISATIONS: Realisation[] = CONTENU_FR.REALISATIONS.map((r) => {
  const { alts, ...texte } = TEXTES[r.slug];
  return { ...r, ...texte, visuels: r.visuels?.map((v, i) => ({ ...v, alt: alts[i] ?? v.alt })) };
});

const IA = {
  titre: "The AIs we integrate",
  phrase:
    "We're not tied to any AI: for each project, we choose the best-suited model based on quality, cost, privacy and hosting, in Europe if needed.",
  criteres: ["Quality", "Cost", "Privacy", "Hosting in Europe"],
  modeles: CONTENU_FR.IA.modeles.map((m) => (m.nom === "Mistral" ? { ...m, editeur: "Mistral AI, France" } : m)),
};

const CAPACITES: Contenu["CAPACITES"] = [
  {
    ...CONTENU_FR.CAPACITES[0],
    titre: "Custom websites",
    texte:
      "Business sites, galleries, multilingual sites: a unique design, fast on every screen and built for search engines from the very first line.",
    points: ["A unique design, no ready-made templates", "Fast and readable on every screen", "Built for search engines from the start"],
  },
  {
    ...CONTENU_FR.CAPACITES[1],
    titre: "Web and mobile apps",
    texte: "A single codebase for iPhone, Android and the browser, published on the App Store and Google Play.",
    points: ["A single codebase for iPhone, Android and the web", "Published on the App Store and Google Play", "Updates that reach every device"],
  },
  {
    ...CONTENU_FR.CAPACITES[2],
    titre: "Subscription platforms",
    texte: "User accounts, plans, Stripe payments and in-app purchases: an online service ready to take payments.",
    points: ["User accounts and plans", "Stripe payments and in-app purchases", "Subscriptions managed automatically"],
  },
  {
    ...CONTENU_FR.CAPACITES[3],
    titre: "Built-in AI",
    texte:
      "Language understanding, document reading, search by meaning, assistants: AI at the heart of the product, wherever it saves time.",
    points: ["Natural language understanding", "Automatic document reading", "Search by meaning"],
  },
  {
    ...CONTENU_FR.CAPACITES[4],
    titre: "SEO and AI visibility",
    texte:
      "Organic and local search, Google Business Profile, structured data and content designed to be cited by ChatGPT, Perplexity or Google: your website found wherever your customers search.",
    points: ["Organic and local search", "Structured data and Google Business Profile", "Content designed to be cited by AI"],
  },
  {
    ...CONTENU_FR.CAPACITES[5],
    titre: "Data and back offices",
    texte:
      "Secure databases, management tools, bookings, automatic emails and dashboards: you run your business on your own.",
    points: ["Secure databases", "Management tools and dashboards", "Bookings and automatic emails"],
  },
  {
    ...CONTENU_FR.CAPACITES[6],
    titre: "Redesign, migration and support",
    texte:
      "Redesigning an existing website, switching hosts or technologies without losing your search rankings, then updates and improvements over time.",
    points: ["A redesign that keeps your search rankings", "Switching hosts or technologies", "Updates and improvements over time"],
  },
  {
    ...CONTENU_FR.CAPACITES[7],
    titre: "Performance and security",
    texte: "Fast hosting, backups, security and GDPR compliance: a website that loads quickly and stays protected.",
    points: ["Fast hosting", "Backups and data protection", "GDPR compliance"],
  },
];

const METHODE_DETAILS: Contenu["METHODE_DETAILS"] = [
  {
    ...CONTENU_FR.METHODE_DETAILS[0],
    points: [
      "A conversation to understand your goals, your audience and your constraints",
      "A clickable prototype within a few days",
      "A clear scope and schedule before development begins",
    ],
    carte: { titre: "Prototype approved", detail: "On to development" },
  },
  {
    ...CONTENU_FR.METHODE_DETAILS[1],
    points: [
      "Code, tests, content and translations accelerated by today's best AIs",
      "Versions you can try online as development progresses",
      "A single point of contact, from the first conversation to launch",
    ],
    carte: { titre: "New version online", detail: "Ready to test" },
  },
  {
    ...CONTENU_FR.METHODE_DETAILS[2],
    points: [
      "Automated tests with every change",
      "A systematic review of code and security",
      "Performance and accessibility measured before launch",
    ],
    carte: { titre: "All tests passed", detail: "Security checked" },
  },
  {
    ...CONTENU_FR.METHODE_DETAILS[3],
    points: ["Updates and backups monitored", "New features as your business grows", "Constant watch on technology and AI"],
    carte: { titre: "Update delivered", detail: "Your project grows with you" },
  },
];

const METHODE = [
  {
    titre: "Frame it fast",
    texte: "Your goals first. Within a few days, a clickable prototype makes the project tangible: decisions are made on real screens, not on paper.",
  },
  {
    titre: "Produce more",
    texte: "AI multiplies every step: code, tests, content, translations. The capacity of an entire team, with a single point of contact.",
  },
  {
    titre: "Check everything",
    texte: "Automated tests, systematic reviews and security by design: speed never comes at the expense of quality.",
  },
  {
    titre: "Keep evolving",
    texte: "A constant watch on technology and AI: every useful new development strengthens your project, long after launch.",
  },
];

const ENGAGEMENTS = [
  { titre: "Everything belongs to you", texte: "Your website, its content and your data are yours: you stay free, at any time." },
  { titre: "A single point of contact", texte: "The same person from the first conversation to ongoing support: no hand-offs, no lost information." },
  { titre: "You approve before launch", texte: "You test your website or app in real conditions before it goes live." },
  { titre: "Guided onboarding", texte: "You learn to keep your website alive, so you're independent from day one." },
];

const THEMES_FAQ: Contenu["THEMES_FAQ"] = [
  { id: "ensemble", titre: "Working together" },
  { id: "projet", titre: "Your project" },
  { id: "visibilite", titre: "Visibility" },
  { id: "suivi", titre: "After launch" },
];

const FAQ: Contenu["FAQ"] = [
  {
    theme: "ensemble",
    question: "How can we work together?",
    reponse:
      "We work by referral and private request. If someone told you about us, simply write to us directly: every project starts with a conversation about your goals.",
  },
  {
    theme: "ensemble",
    question: "Do you work remotely?",
    reponse:
      "Yes, we work remotely, in France and abroad: video calls, phone and email, in English, French or Spanish. Day-to-day follow-up is as easy as if we were neighbors.",
    lien: { href: `${chemin(L, "realisations")}#clients`, libelle: "See our client websites" },
  },
  {
    theme: "ensemble",
    question: "Who owns the website once it's delivered?",
    reponse: "You do. Your website, its content and your data belong to you: you stay free, at any time.",
  },
  {
    theme: "projet",
    question: "How long does it take to build a website?",
    reponse:
      "It depends on the project's ambition: a few weeks for a business website, longer for an app or a complete platform. Thanks to AI, timelines are much shorter than they used to be, and you get a precise schedule as soon as the project is framed.",
  },
  {
    theme: "projet",
    question: "Should I rebuild my website or simply update it?",
    reponse:
      "It depends on its condition. A review of the existing site lets us recommend the best-suited solution: sometimes a few improvements are enough, sometimes a redesign makes more sense. Either way, your search rankings are preserved.",
  },
  {
    theme: "projet",
    question: "Do you build mobile apps?",
    reponse:
      "Yes, for iPhone and Android from a single codebase, published on the App Store and Google Play. The app also works in the browser.",
    lien: { href: chemin(L, "realisations", "memoday"), libelle: "Example: MemoDay" },
  },
  {
    theme: "projet",
    question: "Can you integrate AI into my project?",
    reponse:
      "Yes: message understanding, automatic document reading, search by meaning, assistants. We work with Claude, ChatGPT, Gemini, Mistral or Grok, and choose the right model for each project, as we did for the MemoDay app.",
    lien: { href: chemin(L, "capacites"), libelle: "The AIs we integrate" },
  },
  {
    theme: "projet",
    question: "Do you build multilingual websites?",
    reponse:
      "Yes, like this one, available in English, French and Spanish. Each language has its own addresses, so it ranks well in each country, and translations are prepared with AI, then reviewed. The MemoDay app is also available in all three languages.",
    lien: { href: chemin(L, "realisations", "memoday"), libelle: "Discover MemoDay" },
  },
  {
    theme: "visibilite",
    question: "Is SEO included?",
    reponse:
      "The foundations of SEO are built in from the design stage: page structure, loading speed, markup, structured data and mobile display. To go further, dedicated support is available: local search, Google Business Profile, content.",
  },
  {
    theme: "visibilite",
    question: "What is AI visibility?",
    reponse:
      "More and more people ask their questions to ChatGPT, Claude, Perplexity or AI-enhanced Google Search instead of browsing a list of links. AI visibility means structuring your website and content so these tools understand your business, cite it and send people your way.",
    lien: { href: chemin(L, "blog", "ai-visibility-chatgpt-claude-perplexity"), libelle: "Read our article on the topic" },
  },
  {
    theme: "suivi",
    question: "Will I be able to edit my website myself?",
    reponse:
      "Yes. Your project can include an admin area designed for you: text, images, products, news, artworks or appointments. You're guided as you get started, and you can always hand over bigger changes.",
    lien: { href: chemin(L, "realisations", "galerie-carpentier"), libelle: "Example: the Galerie Michel Carpentier" },
  },
  {
    theme: "suivi",
    question: "What happens after launch?",
    reponse:
      "Your website is looked after over time: updates, backups, security, improvements and better search visibility. You're never alone with your website.",
  },
];

const BESOINS = [
  "Website creation",
  "Web or mobile app",
  "Platform or subscription service",
  "Redesign or migration",
  "SEO and AI visibility",
  "Maintenance and support",
  "Other",
];

export const CONTENU_EN: Contenu = {
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
