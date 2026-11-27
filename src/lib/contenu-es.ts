import { chemin } from "@/lib/i18n/chemins";
import { CONTENU_FR, type Chiffre, type Contenu, type Lien, type Realisation } from "@/lib/contenu";

// Contenu éditorial en espagnol (même structure que contenu.ts) — registre « usted »

const L = "es" as const;

const SITE = {
  ...CONTENU_FR.SITE,
  titre: "Usted lo imagina. Lo creamos, al servicio de sus objetivos.",
  sousTitre:
    "Más de quince años de desarrollo web, multiplicados por la IA: sitios web, aplicaciones y plataformas completas, desde la primera idea hasta la puesta en línea.",
  phraseFinale: "Trabajamos por recomendación.",
};

const NAVIGATION = [
  { href: chemin(L, "realisations"), libelle: "Proyectos" },
  { href: chemin(L, "capacites"), libelle: "Capacidades" },
  { href: chemin(L, "methode"), libelle: "Método" },
  { href: chemin(L, "a-propos"), libelle: "Nosotros" },
  { href: chemin(L, "blog"), libelle: "Blog" },
  { href: chemin(L, "faq"), libelle: "FAQ" },
  { href: chemin(L, "contact"), libelle: "Contacto" },
];

const MANIFESTE = [
  "Ayer, la pregunta era: ¿es factible? ¿En cuánto tiempo? ¿Con cuántos desarrolladores?",
  "Hoy, la experiencia técnica unida a la IA ha eliminado esos límites.",
  "Solo quedan las preguntas que importan: ¿qué quiere lograr, para quién y con qué objetivos?",
];

const QUESTIONS_D_HIER = ["¿Es factible?", "¿En cuánto tiempo?", "¿Con cuántos desarrolladores?"];

const PHOTOS: Contenu["PHOTOS"] = {
  rendezVous: { src: CONTENU_FR.PHOTOS.rendezVous.src, alt: "Presentación de un nuevo sitio web a una clienta en una pantalla panorámica" },
  poste: { src: CONTENU_FR.PHOTOS.poste.src, alt: "Puesto de trabajo del estudio: seis pantallas con maquetas de sitios, aplicaciones y código" },
  ultralarge: { src: CONTENU_FR.PHOTOS.ultralarge.src, alt: "Desarrollo de un sitio web en pantalla panorámica, con la aplicación probada en un teléfono" },
  validation: { src: CONTENU_FR.PHOTOS.validation.src, alt: "Un cliente aprueba su nuevo sitio web presentado en una pantalla grande" },
  commercante: { src: CONTENU_FR.PHOTOS.commercante.src, alt: "Una comerciante consulta su sitio web en una tableta en su tienda" },
  artisan: { src: CONTENU_FR.PHOTOS.artisan.src, alt: "Un artesano recibe una solicitud de presupuesto en su teléfono en su taller" },
};

const STUDIO = {
  titre: "Un estudio equipado para llegar lejos",
  texte:
    "Varias pantallas, las herramientas y los modelos de IA más recientes: diseñamos, desarrollamos y probamos en paralelo, en todos los formatos de pantalla. Y usted sigue su proyecto en pantalla grande, paso a paso.",
};

const POUR_QUI = {
  intro: "Nuestras propias aplicaciones, pensadas para todo el mundo, y sitios y herramientas a medida para profesionales.",
  tous: {
    titre: "Para todo el mundo",
    texte:
      "Diseñamos y publicamos nuestras propias aplicaciones para el gran público. MemoDay, la primera, está disponible en el App Store, Google Play y la web; otras están en preparación.",
    lien: { href: chemin(L, "realisations", "memoday"), libelle: "Descubrir MemoDay" },
  },
  pros: {
    titre: "Para profesionales",
    texte:
      "Comercios, artesanos, profesionales de la salud, autónomos, empresas: un sitio o una herramienta a medida que trabaja para usted, incluso cuando está ocupado en otra cosa.",
    lien: { href: chemin(L, "realisations"), libelle: "Ver los sitios realizados" },
  },
};

type TexteRealisation = Pick<Realisation, "type" | "accroche" | "besoin" | "realise" | "chiffres"> & {
  client?: string;
  technos?: string[];
  alts: string[];
  resume?: Realisation["resume"];
  autresLiens?: Lien[];
};

const page = (nom: string, titre?: string) => (titre ? `Página «${titre}» del sitio de ${nom}` : `Página de inicio del sitio de ${nom}`);
const mobile = (nom: string) => `Versión móvil del sitio de ${nom}`;
const c = (valeur: string, libelle: string): Chiffre => ({ valeur, libelle });
const GESTION = "La creación del sitio y su gestión a lo largo del tiempo.";

const TEXTES: Record<string, TexteRealisation> = {
  memoday: {
    type: "Aplicación web y móvil, producto propio",
    accroche: "Una memoria personal para todo lo que no quiere olvidar.",
    besoin:
      "Gastos, citas, papeles, fotos: el día a día se dispersa entre decenas de aplicaciones. El objetivo era ofrecer un único lugar donde confiar una información en una frase, una foto o de viva voz, y encontrarla para siempre, sin tener que clasificar nada.",
    realise: [
      "Una IA que entiende cada mensaje y lo clasifica sola: gasto, cita, tarea, documento o recuerdo.",
      "La lectura automática de facturas y contratos fotografiados, con un aviso antes de cada vencimiento.",
      "Recordatorios automáticos, la víspera y una hora antes de cada cita.",
      "Una búsqueda por significado: se encuentra una información sin recordar las palabras exactas.",
      "El uso compartido en familia de listas y citas elegidas, mientras todo lo demás sigue siendo privado.",
      "La sincronización con Google Calendar, Outlook y el iPhone, un modo sin conexión y la importación de cientos de documentos de una vez.",
      "Un inicio de sesión sin contraseña y suscripciones gestionadas por Stripe, el App Store y Google Play.",
    ],
    technos: ["Next.js", "TypeScript", "Supabase", "IA generativa", "Stripe", "iOS y Android", "Aplicación instalable"],
    chiffres: [c("3", "plataformas: iPhone, Android y web"), c("3", "idiomas: francés, inglés y español"), c("70", "tablas de datos, cada una aislada por usuario")],
    alts: ["Página de inicio del sitio de MemoDay", "Versión móvil del sitio de MemoDay", "Pantalla «Mi memoria» de la aplicación MemoDay", "Pantalla «Documentos» de la aplicación MemoDay"],
    autresLiens: [
      { href: "https://apps.apple.com/us/app/memoday-your-memory-for-life/id6831483081", libelle: "App Store" },
      { href: "https://play.google.com/store/apps/details?id=net.memoday.app&hl=es", libelle: "Google Play" },
    ],
  },
  "klart-concept": {
    type: "Sitio web de una empresa de reformas",
    client: "Klart Concept, Argelès-Gazost",
    accroche: "Baños, cocinas y mobiliario a medida en los Altos Pirineos (Francia).",
    besoin:
      "Klart Concept diseña y reforma baños, cocinas y mobiliario, y se encarga de todos los oficios de una reforma interior llave en mano. El sitio debía mostrar la calidad de sus trabajos, cubrir toda su zona de actuación y generar solicitudes de presupuesto.",
    realise: [
      "Una página por especialidad: baños, cocinas, mobiliario y consejos.",
      "Páginas por oficio: aislamiento, electricidad, fontanería, alicatado y pintura.",
      "Galerías de fotos de los trabajos realizados.",
      "Una página de zona de actuación que cubre una veintena de municipios, entre ellos Tarbes y Lourdes.",
      "Las opiniones de clientes de Google, un blog de bricolaje y una página de colaboradores.",
      "Una solicitud de presupuesto gratuito, además de la creación del sitio y su gestión a lo largo del tiempo.",
    ],
    chiffres: [c("15 años", "de experiencia de la empresa"), c("20", "municipios en la zona de actuación"), c("5", "oficios presentados")],
    alts: [page("Klart Concept"), page("Klart Concept", "Nuestro concepto"), page("Klart Concept", "Nuestras especialidades"), mobile("Klart Concept")],
    resume: {
      activite: "Diseño y reforma de baños, cocinas y mobiliario",
      lieu: "Argelès-Gazost, Altos Pirineos",
      points: ["Galerías de trabajos", "Opiniones de clientes y blog", "Posicionamiento en su zona de actuación"],
    },
  },
  "inspiration-et-meditation": {
    type: "Sitio de terapeuta con reserva en línea",
    accroche: "Meditaciones, talleres y sesiones, con reserva y pago en línea.",
    besoin:
      "Anne Brulard Labasse ofrece meditaciones, talleres y sesiones a domicilio en los Altos Pirineos, así como un libro y un espacio digital. Había que reunir toda su actividad en un solo sitio y permitir reservar y pagar en línea.",
    realise: [
      "La presentación completa de su actividad: sesiones, talleres, libro y prensa.",
      "La reserva de sesiones y talleres, con pago en línea por PayPal.",
      "Un área de clientes y «Le Sanctuaire», un espacio digital de meditación.",
      "Correos electrónicos automáticos enviados cada mañana.",
      "Las opiniones de Google integradas y un posicionamiento local en unas cuarenta ciudades.",
      "Un panel de administración para mantener el sitio vivo en el día a día.",
    ],
    technos: ["PHP", "MySQL", "PayPal", "OVH"],
    chiffres: [c("40", "ciudades cubiertas por el posicionamiento local"), c("24 h", "reserva y pago en línea, todos los días")],
    alts: [page("Inspiration & Méditation"), page("Inspiration & Méditation", "El libro"), page("Inspiration & Méditation", "Le Sanctuaire"), mobile("Inspiration & Méditation")],
  },
  "menuiserie-gaudissard": {
    type: "Sitio web y catálogo de productos",
    client: "Menuiserie Gaudissard, Aigrefeuille-d'Aunis",
    accroche: "Toda la gama de un fabricante de carpintería, de la ventana al portón, con presupuesto gratuito.",
    besoin:
      "Fabricante de carpintería de PVC y aluminio desde 1964, cerca de La Rochelle, Menuiserie Gaudissard ofrece una gama muy amplia, en medidas estándar o a medida. Había que presentar claramente cada familia de productos, dar a conocer la empresa y su taller, y convertir las visitas en solicitudes de presupuesto.",
    realise: [
      "Un catálogo organizado por familia de productos y por material: ventanas, puertas, portones, persianas, pérgolas, cocheras, cercados, barandillas y barreras antiinundación.",
      "Una solicitud de presupuesto gratuito accesible desde todo el sitio.",
      "La presentación de la empresa: su historia, su taller, las visitas a la exposición con cita previa y sus reportajes.",
      "La información práctica: servicios, cómo llegar y documentos descargables.",
      "Un área de clientes y acceso a la tienda de productos con tara.",
      GESTION,
    ],
    chiffres: [c("1964", "año de creación de la empresa"), c("10", "familias de productos presentadas"), c("40", "empleados en la empresa")],
    alts: [page("Menuiserie Gaudissard"), page("Menuiserie Gaudissard", "Ventanas"), page("Menuiserie Gaudissard", "La empresa"), mobile("Menuiserie Gaudissard")],
    resume: {
      activite: "Fabricante de carpintería de PVC y aluminio desde 1964",
      lieu: "Aigrefeuille-d'Aunis, cerca de La Rochelle",
      points: ["Catálogo por producto y material", "Solicitud de presupuesto gratuito", "Área de clientes"],
    },
  },
  "carpentier-communication": {
    type: "Sitio web de imprenta con presupuesto en línea",
    accroche: "Carteles, PLV, paneles y adhesivos: la oferta completa de una imprenta, con presupuesto gratuito.",
    besoin:
      "Imprenta desde 1962, Carpentier Communication produce carteles, PLV, paneles y adhesivos en serigrafía, impresión digital y offset de gran formato, con envío a toda Francia. El sitio debía presentar cada soporte, destacar el saber hacer del taller y facilitar las solicitudes de presupuesto.",
    realise: [
      "Una página por familia de productos: carteles, PLV, paneles y adhesivos.",
      "Un formulario de presupuesto gratuito.",
      "Una página de asistencia de preimpresión para acompañar a los clientes en la preparación de sus archivos.",
      "Un folleto de productos descargable.",
      "La presentación de la empresa, de sus referencias de clientes y de las condiciones de envío.",
      GESTION,
    ],
    chiffres: [c("1962", "año de creación de la empresa"), c("4", "familias de productos"), c("12", "referencias de clientes presentadas")],
    alts: [page("Carpentier Communication"), page("Carpentier Communication", "Carteles"), page("Carpentier Communication", "PLV"), mobile("Carpentier Communication")],
    resume: {
      activite: "Imprenta de carteles, PLV, paneles y adhesivos desde 1962",
      points: ["Gama completa por soporte", "Solicitud de presupuesto gratuito", "Asistencia de preimpresión y folleto descargable"],
    },
  },
  "re-borne-retrogaming": {
    type: "Sitio web de animación para eventos",
    accroche: "Consolas retro y máquinas recreativas para eventos, del seminario a la boda.",
    besoin:
      "Re-borne Retrogaming anima ferias, seminarios, fiestas de empresa y celebraciones privadas con consolas retro, máquinas recreativas y un camión arcade móvil, el Pixel Truck. El sitio debía despertar las ganas, detallar las fórmulas y el material, y recoger las solicitudes de presupuesto.",
    realise: [
      "La presentación del concepto y de los servicios, tanto para empresas como para particulares.",
      "Un catálogo del material: consolas, máquinas recreativas y opciones.",
      "Una página de tarifas que presenta las fórmulas.",
      "Una sección de noticias.",
      "Formularios de presupuesto gratuito y de contacto.",
      GESTION,
    ],
    chiffres: [c("19", "consolas en el catálogo"), c("5 a 30", "puestos de juego por evento"), c("4", "máquinas recreativas en el Pixel Truck")],
    alts: [page("Re-borne Retrogaming"), page("Re-borne Retrogaming", "Noticias"), page("Re-borne Retrogaming", "Material y tarifas"), mobile("Re-borne Retrogaming")],
    resume: {
      activite: "Animación retrogaming y alquiler de máquinas recreativas para eventos",
      points: ["Servicios y tarifas", "Catálogo del material", "Noticias y solicitud de presupuesto"],
    },
  },
  "galerie-carpentier": {
    type: "Galería de arte en línea",
    client: "Michel Carpentier, pintor",
    accroche: "La galería en línea de un pintor, de sus lienzos a sus exposiciones.",
    besoin:
      "La obra de Michel Carpentier abarca nueve universos, del rugby a la caricatura, de los océanos a las creaciones digitales. Hacía falta un escaparate a la altura de este trabajo, y una herramienta sencilla para que el artista mantuviera su galería él mismo.",
    realise: [
      "Una galería organizada en nueve categorías, pensada para realzar cada lienzo.",
      "Las páginas Exposiciones, Historia y Amigos, que cuentan la trayectoria del artista.",
      "Un panel de administración completo: el artista añade sus obras y exposiciones con total autonomía.",
      "Un sitio rápido, agradable en el móvil y optimizado para los buscadores.",
    ],
    technos: ["Next.js", "TypeScript", "Supabase", "Vercel"],
    chiffres: [c("291", "obras en línea"), c("22", "exposiciones presentadas"), c("9", "universos artísticos")],
    alts: [page("Galerie Michel Carpentier"), page("Galerie Michel Carpentier", "Exposiciones"), page("Galerie Michel Carpentier", "Mares y océanos"), mobile("Galerie Michel Carpentier")],
    resume: {
      activite: "Galería de arte en línea del pintor Michel Carpentier",
      lieu: "Burdeos",
      points: ["291 obras en nueve universos", "Exposiciones y trayectoria del artista", "Gestionada por el propio artista"],
    },
  },
  dietetiphyt: {
    type: "Sitio de consulta con cita en línea",
    accroche: "El sitio de una dietista-nutricionista, con cita en línea y teleconsulta.",
    besoin:
      "Diététi'Phyt acompaña a sus pacientes en nutrición y fitoterapia: alimentación equilibrada, pérdida de peso, enfermedades crónicas. El sitio debía presentar claramente cada acompañamiento, dar confianza a los pacientes y hacer inmediata la reserva de citas, en consulta o a distancia.",
    realise: [
      "Una página por acompañamiento: alimentación equilibrada, pérdida de peso y enfermedades crónicas.",
      "La reserva de citas en línea, con teleconsulta y visitas a domicilio.",
      "Una página de lugares y tarifas.",
      "Un blog, preguntas frecuentes y recursos para los pacientes.",
      "Los enlaces a Instagram, Facebook y LinkedIn.",
      GESTION,
    ],
    chiffres: [c("3", "acompañamientos detallados"), c("24 h", "reserva de citas en línea, todos los días")],
    alts: [page("Diététi'Phyt"), page("Diététi'Phyt", "Blog"), page("Diététi'Phyt", "Servicios"), mobile("Diététi'Phyt")],
    resume: {
      activite: "Dietista-nutricionista y asesora en fitoterapia",
      points: ["Reserva de citas en línea", "Teleconsulta", "Blog y recursos para los pacientes"],
    },
  },
  "point-serigraphie": {
    type: "Sitio web de imprenta con catálogos",
    client: "Point Sérigraphie, Albi",
    accroche: "Adhesivos, vinilos para escaparates, paneles, rotulación: impresión en todos los soportes, en Albi desde 1976.",
    besoin:
      "Point Sérigraphie imprime en serigrafía y en digital sobre una gran variedad de soportes, con envío a toda Francia en 24 a 48 horas. El sitio debía hacer legible una oferta muy amplia y facilitar las solicitudes de presupuesto.",
    realise: [
      "Una página por familia de productos: adhesivos, vinilos para escaparates, paneles, rotulación, transfers, pancartas, PLV, imanes, tarjetas e identificadores, pizarras y doming.",
      "Un formulario de presupuesto gratuito, con respuesta en 24 horas.",
      "Catálogos descargables.",
      "Una sección de noticias.",
      "Las páginas de empresa, preimpresión y envío a toda Francia.",
      GESTION,
    ],
    chiffres: [c("1976", "año de creación de la empresa"), c("11", "familias de productos"), c("24 a 48 h", "de envío a toda Francia")],
    alts: [page("Point Sérigraphie"), page("Point Sérigraphie", "Adhesivos"), page("Point Sérigraphie", "Paneles"), mobile("Point Sérigraphie")],
    resume: {
      activite: "Impresión serigráfica y digital en todos los soportes desde 1976",
      lieu: "Albi",
      points: ["Once familias de productos", "Catálogos descargables", "Presupuesto en 24 horas"],
    },
  },
  "mozaic-environnement": {
    type: "Sitio web para administraciones locales",
    client: "Mozaic Environnement, Albi",
    accroche: "Señalización y soportes impresos para la recogida y la separación de residuos.",
    besoin:
      "Mozaic Environnement imprime los soportes de comunicación de la recogida y la separación de residuos: señalización, adhesivos para contenedores, instrucciones de reciclaje, pancartas. Sus clientes, administraciones locales, asociaciones y empresas del sector, esperaban un catálogo claro y un acceso directo a presupuestos y muestras.",
    realise: [
      "Un catálogo de dieciocho categorías de productos.",
      "Catálogos para consultar.",
      "Una solicitud de muestras gratuitas.",
      "Formularios de presupuesto gratuito y de contacto.",
      "La presentación de la empresa y de sus afiliaciones profesionales (AdCF, FESPA France).",
      GESTION,
    ],
    chiffres: [c("18", "categorías de productos"), c("1976", "año de creación de la empresa")],
    alts: [page("Mozaic Environnement"), page("Mozaic Environnement", "Nuestros catálogos"), page("Mozaic Environnement", "Pasos del pedido"), mobile("Mozaic Environnement")],
    resume: {
      activite: "Señalización y soportes impresos para la recogida y la separación de residuos",
      lieu: "Albi",
      points: ["Dieciocho categorías de productos", "Muestras gratuitas", "Solicitud de presupuesto"],
    },
  },
};

const REALISATIONS: Realisation[] = CONTENU_FR.REALISATIONS.map((r) => {
  const { alts, ...texte } = TEXTES[r.slug];
  return { ...r, ...texte, visuels: r.visuels?.map((v, i) => ({ ...v, alt: alts[i] ?? v.alt })) };
});

const IA = {
  titre: "Las IA que integramos",
  phrase:
    "No estamos vinculados a ninguna IA: para cada proyecto, elegimos el modelo más adecuado según la calidad, el coste, la confidencialidad y el alojamiento, en Europa si es necesario.",
  criteres: ["Calidad", "Coste", "Confidencialidad", "Alojamiento en Europa"],
  modeles: CONTENU_FR.IA.modeles.map((m) => (m.nom === "Mistral" ? { ...m, editeur: "Mistral AI, Francia" } : m)),
};

const CAPACITES: Contenu["CAPACITES"] = [
  {
    ...CONTENU_FR.CAPACITES[0],
    titre: "Sitios a medida",
    texte:
      "Sitios corporativos, galerías, sitios multilingües: un diseño único, rápido en todas las pantallas y pensado para el posicionamiento desde la primera línea.",
    points: ["Un diseño único, sin plantillas prefabricadas", "Rápido y legible en todas las pantallas", "Pensado para el posicionamiento desde el diseño"],
  },
  {
    ...CONTENU_FR.CAPACITES[1],
    titre: "Aplicaciones web y móviles",
    texte: "Una sola base de código para iPhone, Android y el navegador, publicada en el App Store y Google Play.",
    points: ["Una sola base de código para iPhone, Android y la web", "Publicación en el App Store y Google Play", "Evoluciones que llegan a todos los dispositivos"],
  },
  {
    ...CONTENU_FR.CAPACITES[2],
    titre: "Plataformas de suscripción",
    texte: "Cuentas de usuario, planes, pago con Stripe y compras integradas en las tiendas: un servicio en línea listo para cobrar.",
    points: ["Cuentas de usuario y planes", "Pago con Stripe y compras integradas", "Suscripciones gestionadas automáticamente"],
  },
  {
    ...CONTENU_FR.CAPACITES[3],
    titre: "IA integrada",
    texte:
      "Comprensión del lenguaje, lectura de documentos, búsqueda por significado, asistentes: la IA en el corazón del producto, allí donde ahorra tiempo.",
    points: ["Comprensión del lenguaje natural", "Lectura automática de documentos", "Búsqueda por significado"],
  },
  {
    ...CONTENU_FR.CAPACITES[4],
    titre: "Posicionamiento y visibilidad en las IA",
    texte:
      "Posicionamiento orgánico y local, perfil de Google Business, datos estructurados y contenidos pensados para ser citados por ChatGPT, Perplexity o Google: su sitio, encontrado allí donde buscan sus clientes.",
    points: ["Posicionamiento orgánico y local", "Datos estructurados y perfil de Google Business", "Contenidos pensados para ser citados por las IA"],
  },
  {
    ...CONTENU_FR.CAPACITES[5],
    titre: "Datos y paneles de gestión",
    texte:
      "Bases de datos seguras, herramientas de gestión, reservas, correos automáticos y cuadros de mando: usted dirige su actividad con autonomía.",
    points: ["Bases de datos seguras", "Herramientas de gestión y cuadros de mando", "Reservas y correos automáticos"],
  },
  {
    ...CONTENU_FR.CAPACITES[6],
    titre: "Rediseño, migración y seguimiento",
    texte:
      "Rediseño de un sitio existente, cambio de alojamiento o de tecnología sin perder su posicionamiento, y después actualizaciones y evoluciones a lo largo del tiempo.",
    points: ["Un rediseño sin perder su posicionamiento", "Cambio de alojamiento o de tecnología", "Actualizaciones y evoluciones a lo largo del tiempo"],
  },
  {
    ...CONTENU_FR.CAPACITES[7],
    titre: "Rendimiento y seguridad",
    texte: "Alojamiento rápido, copias de seguridad, seguridad y cumplimiento del RGPD: un sitio que carga rápido y sigue protegido.",
    points: ["Un alojamiento rápido", "Copias de seguridad y protección de datos", "Cumplimiento del RGPD"],
  },
];

const METHODE_DETAILS: Contenu["METHODE_DETAILS"] = [
  {
    ...CONTENU_FR.METHODE_DETAILS[0],
    points: [
      "Una conversación para entender sus objetivos, su público y sus limitaciones",
      "Un prototipo navegable en pocos días",
      "Un alcance y un calendario claros antes del desarrollo",
    ],
    carte: { titre: "Prototipo aprobado", detail: "Pasamos al desarrollo" },
  },
  {
    ...CONTENU_FR.METHODE_DETAILS[1],
    points: [
      "Código, pruebas, contenidos y traducciones acelerados por las mejores IA del momento",
      "Versiones para probar en línea a medida que avanza el desarrollo",
      "Un único interlocutor, desde la primera conversación hasta la puesta en línea",
    ],
    carte: { titre: "Nueva versión en línea", detail: "Lista para probar" },
  },
  {
    ...CONTENU_FR.METHODE_DETAILS[2],
    points: [
      "Pruebas automatizadas en cada modificación",
      "Una revisión sistemática del código y de la seguridad",
      "Rendimiento y accesibilidad medidos antes de la puesta en línea",
    ],
    carte: { titre: "Todas las pruebas superadas", detail: "Seguridad verificada" },
  },
  {
    ...CONTENU_FR.METHODE_DETAILS[3],
    points: [
      "Actualizaciones y copias de seguridad supervisadas",
      "Nuevas funcionalidades cuando su actividad crece",
      "Una vigilancia permanente de las tecnologías y la IA",
    ],
    carte: { titre: "Evolución entregada", detail: "Su proyecto crece con usted" },
  },
];

const METHODE = [
  {
    titre: "Definir rápido",
    texte: "Primero, sus objetivos. En pocos días, un prototipo navegable hace el proyecto concreto: se decide sobre pantallas reales, no sobre planos.",
  },
  {
    titre: "Producir más",
    texte: "La IA multiplica cada etapa: código, pruebas, contenidos, traducciones. La capacidad de un equipo entero, con un único interlocutor.",
  },
  {
    titre: "Verificarlo todo",
    texte: "Pruebas automatizadas, revisión sistemática y seguridad desde el diseño: la velocidad nunca se paga en calidad.",
  },
  {
    titre: "Hacer evolucionar",
    texte: "Una vigilancia permanente de las tecnologías y la IA: cada novedad útil refuerza su proyecto, mucho después de su puesta en línea.",
  },
];

const ENGAGEMENTS = [
  { titre: "Todo le pertenece", texte: "Su sitio, sus contenidos y sus datos son suyos: usted es libre, en todo momento." },
  { titre: "Un único interlocutor", texte: "La misma persona desde la primera conversación hasta el seguimiento: sin intermediarios ni información perdida." },
  { titre: "Usted aprueba antes de publicar", texte: "Prueba su sitio o su aplicación en condiciones reales antes de su publicación." },
  { titre: "Un acompañamiento en el uso", texte: "Aprende a mantener su sitio vivo, para ser autónomo desde el primer día." },
];

const THEMES_FAQ: Contenu["THEMES_FAQ"] = [
  { id: "ensemble", titre: "Trabajar juntos" },
  { id: "projet", titre: "Su proyecto" },
  { id: "visibilite", titre: "Visibilidad" },
  { id: "suivi", titre: "Después de la puesta en línea" },
];

const FAQ: Contenu["FAQ"] = [
  {
    theme: "ensemble",
    question: "¿Cómo trabajar con nosotros?",
    reponse:
      "Trabajamos por recomendación y bajo petición privada. Si alguien le ha hablado de nosotros, basta con escribirnos directamente: cada proyecto empieza con una conversación sobre sus objetivos.",
  },
  {
    theme: "ensemble",
    question: "¿Trabajan a distancia?",
    reponse:
      "Sí, trabajamos a distancia, en Francia y en el extranjero: videollamada, teléfono y correo electrónico, en español, francés o inglés. El seguimiento es tan sencillo como si fuéramos vecinos.",
    lien: { href: `${chemin(L, "realisations")}#clients`, libelle: "Ver los sitios de nuestros clientes" },
  },
  {
    theme: "ensemble",
    question: "¿De quién es el sitio una vez entregado?",
    reponse: "Suyo. Su sitio, sus contenidos y sus datos le pertenecen: usted es libre, en todo momento.",
  },
  {
    theme: "projet",
    question: "¿Cuánto tiempo se tarda en crear un sitio web?",
    reponse:
      "Depende de la ambición del proyecto: unas semanas para un sitio corporativo, más para una aplicación o una plataforma completa. Gracias a la IA, los plazos son mucho más cortos que antes, y recibe un calendario preciso desde la definición del proyecto.",
  },
  {
    theme: "projet",
    question: "¿Hay que rehacer mi sitio o simplemente actualizarlo?",
    reponse:
      "Todo depende de su estado. Un diagnóstico del sitio actual permite recomendar la solución más adecuada: a veces bastan algunas mejoras, a veces conviene más un rediseño. En ambos casos, su posicionamiento se conserva.",
  },
  {
    theme: "projet",
    question: "¿Desarrollan aplicaciones móviles?",
    reponse:
      "Sí, para iPhone y Android a partir de una sola base de código, con publicación en el App Store y Google Play. La aplicación también funciona en el navegador.",
    lien: { href: chemin(L, "realisations", "memoday"), libelle: "Ejemplo: MemoDay" },
  },
  {
    theme: "projet",
    question: "¿Pueden integrar IA en mi proyecto?",
    reponse:
      "Sí: comprensión de mensajes, lectura automática de documentos, búsqueda por significado, asistentes. Trabajamos con Claude, ChatGPT, Gemini, Mistral o Grok, y elegimos el modelo adecuado para cada proyecto, como en la aplicación MemoDay.",
    lien: { href: chemin(L, "capacites"), libelle: "Las IA que integramos" },
  },
  {
    theme: "projet",
    question: "¿Hacen sitios en varios idiomas?",
    reponse:
      "Sí, como este sitio, disponible en español, francés e inglés. Cada idioma tiene sus propias direcciones, para posicionarse bien en cada país, y las traducciones se preparan con la IA y después se revisan. La aplicación MemoDay también existe en estos tres idiomas.",
    lien: { href: chemin(L, "realisations", "memoday"), libelle: "Descubrir MemoDay" },
  },
  {
    theme: "visibilite",
    question: "¿Está incluido el posicionamiento?",
    reponse:
      "Las bases del posicionamiento se integran desde el diseño: estructura de las páginas, velocidad de carga, etiquetado, datos estructurados y visualización en el móvil. Para ir más lejos, es posible un acompañamiento específico: posicionamiento local, perfil de Google Business, contenidos.",
  },
  {
    theme: "visibilite",
    question: "¿Qué es la visibilidad en las IA?",
    reponse:
      "Cada vez más personas hacen sus preguntas a ChatGPT, a Claude, a Perplexity o a la búsqueda de Google enriquecida con IA, en lugar de recorrer una lista de enlaces. La visibilidad en las IA consiste en estructurar su sitio y sus contenidos para que estas herramientas entiendan su actividad, la citen y remitan a usted.",
    lien: { href: chemin(L, "blog", "visibilidad-ia-chatgpt-claude-perplexity"), libelle: "Leer nuestro artículo sobre el tema" },
  },
  {
    theme: "suivi",
    question: "¿Podré modificar mi sitio yo mismo?",
    reponse:
      "Sí. Su proyecto puede incluir un panel de administración pensado para usted: textos, imágenes, productos, noticias, obras o citas. Le acompañamos en sus primeros pasos, y siempre puede confiarnos las evoluciones más importantes.",
    lien: { href: chemin(L, "realisations", "galerie-carpentier"), libelle: "Ejemplo: la Galerie Michel Carpentier" },
  },
  {
    theme: "suivi",
    question: "¿Qué pasa después de la puesta en línea?",
    reponse:
      "Su sitio tiene seguimiento a lo largo del tiempo: actualizaciones, copias de seguridad, seguridad, evoluciones y mejora del posicionamiento. Nunca está solo frente a su sitio.",
  },
];

const BESOINS = [
  "Creación de sitio web",
  "Aplicación web o móvil",
  "Plataforma o suscripción",
  "Rediseño o migración",
  "Posicionamiento y visibilidad en las IA",
  "Mantenimiento y seguimiento",
  "Otro",
];

export const CONTENU_ES: Contenu = {
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
