import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/*
 * Site translations.
 * To add a language: add its code to LANGUAGES, then add a dictionary with
 * the same keys as `en` to `dictionaries` below. TypeScript will flag any
 * missing text.
 */

export const LANGUAGES = [
  { code: "en", label: "English", locale: "en-US" },
  { code: "fr", label: "Français", locale: "fr-FR" },
  { code: "es", label: "Español", locale: "es-ES" },
  { code: "pt", label: "Português", locale: "pt-BR" },
  { code: "de", label: "Deutsch", locale: "de-DE" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

const STORAGE_KEY = "wintas-language";

const en = {
  meta: {
    title: "Wintas | AI-powered Full-Stack Developer",
  },
  language: {
    label: "Language",
  },
  nav: {
    home: "Home",
    about: "About",
    projects: "Projects",
    contact: "Contact",
    letsTalk: "Let's Talk",
    toggleMenu: "Toggle menu",
  },
  hero: {
    line1: "Designing",
    line2: "Digital Solutions",
    intro:
      "I build full-stack web apps and AI-powered products, from university platforms to ticketing and payments, and I use AI tools to ship them fast.",
    available: "Available",
    availableText: "Currently taking on new projects.",
  },
  about: {
    title: "About Me",
    body: "I'm a Computer Science graduate (2026) and full-stack developer who builds with AI. I've delivered a university e-library and website, a ticketing platform, a VTU payments app, and an AI content bot, using AI as a core part of how I design, write, and ship software. My goal is technology that is useful, polished, and built to last.",
    expertise: "Expertise",
    expertiseItems: [
      "Full-Stack Web Development",
      "AI Integration (LLM APIs)",
      "AI-Assisted Development & Prompting",
      "UI/UX Design",
    ],
    focus: "Focus Areas",
    focusItems: [
      "Practical Digital Products",
      "User-Focused Experiences",
      "Continuous Learning",
      "Impactful Technology",
    ],
    downloadCv: "DOWNLOAD CV",
  },
  projects: {
    title: "Projects",
    subtitle: "Things I've built and places you can find my work.",
    visitPage: "Visit Page",
    liveDemo: "Live Demo",
    comingSoon: "Coming Soon",
    viewCode: "View Code",
    templateBadge: "Portfolio template",
    previewAlt: (title: string) => `Preview of ${title}`,
    descriptions: {
      tixora:
        "Event ticketing platform: find concerts and parties, pay your way, and enter with a QR code.",
      komuLibrary:
        "University e-library for e-books, journals, theses and research databases. I built the frontend and backend.",
      vtu: "Download my VTU application — fast, simple, and reliable.",
      churchBot:
        "Demo platform for an automated church assistant experience and workflow.",
      komuWebsite:
        "Team redesign of the official Kingsley Ozumba Mbadiwe University website.",
      neon: "Free, open-source portfolio template with a particle field, kinetic text and a pinned scroll gallery. One HTML file, with a setup guide.",
      echo: "Free cinematic scroll portfolio template — a recreated concept with a starry-sky reveal and a 3D project ribbon, rebuilt in plain HTML, CSS and JS.",
    },
  },
  contact: {
    titleLine1: "Let's create",
    titleLine2: "together.",
    body: "Available for freelance and collaboration. Reach out and let's build something great.",
    email: "Email",
    whatsapp: "WhatsApp",
    contactMe: "Contact Me",
  },
  footer: {
    rights: "All rights reserved.",
  },
  github: {
    eyebrow: "Live on GitHub",
    heading: "Open-source work and contributions",
    intro:
      "Follow my latest repositories and see what I've been contributing to on GitHub.",
    avatarAlt: (login: string) => `${login} GitHub avatar`,
    publicRepos: (n: number) => `${n} public repos`,
    followers: (n: number) => `${n} followers`,
    visitProfile: "Visit my GitHub profile",
    unavailable: "GitHub data is temporarily unavailable here.",
    openGithub: "Open GitHub",
    viewFullProfile: "View full profile",
    contributions: (n: number, year: number | null) =>
      `${n} contribution${n === 1 ? "" : "s"} ${year === null ? "in the last year" : `in ${year}`}`,
    dayTitle: (n: number, date: string) =>
      `${n} contribution${n === 1 ? "" : "s"} on ${date}`,
    graphLabel: (user: string) => `GitHub contributions for ${user}`,
    refresh: "Refresh contribution activity",
    yearLabel: "Contribution year",
    viewProfile: "View GitHub profile",
    weekdays: ["Mon", "Wed", "Fri"],
    loading: "Loading contribution activity…",
    activityUnavailable: "Contribution activity is unavailable right now.",
    learnCount: "Learn how we count contributions",
    couldntRefresh: "Couldn’t refresh activity.",
    lastChecked: (time: string) => `Last checked ${time}`,
    loadingLive: "Loading live activity",
    levels: "Contribution levels from less to more",
    less: "Less",
    more: "More",
  },
};

export type Dictionary = typeof en;

const fr: Dictionary = {
  meta: {
    title: "Wintas | Développeur full-stack propulsé par l'IA",
  },
  language: {
    label: "Langue",
  },
  nav: {
    home: "Accueil",
    about: "À propos",
    projects: "Projets",
    contact: "Contact",
    letsTalk: "Discutons",
    toggleMenu: "Ouvrir ou fermer le menu",
  },
  hero: {
    line1: "Concevoir",
    line2: "des solutions numériques",
    intro:
      "Je crée des applications web full-stack et des produits propulsés par l'IA, des plateformes universitaires à la billetterie et aux paiements, et j'utilise des outils d'IA pour les livrer rapidement.",
    available: "Disponible",
    availableText: "J'accepte actuellement de nouveaux projets.",
  },
  about: {
    title: "À propos de moi",
    body: "Je suis diplômé en informatique (2026) et développeur full-stack qui construit avec l'IA. J'ai livré une bibliothèque numérique et un site web universitaires, une plateforme de billetterie, une application de paiements VTU et un bot de contenu IA, en faisant de l'IA un élément central de ma façon de concevoir, d'écrire et de livrer des logiciels. Mon objectif : une technologie utile, soignée et faite pour durer.",
    expertise: "Compétences",
    expertiseItems: [
      "Développement web full-stack",
      "Intégration de l'IA (API de LLM)",
      "Développement assisté par l'IA et prompting",
      "Design UI/UX",
    ],
    focus: "Priorités",
    focusItems: [
      "Produits numériques pratiques",
      "Expériences centrées sur l'utilisateur",
      "Apprentissage continu",
      "Technologie à fort impact",
    ],
    downloadCv: "TÉLÉCHARGER LE CV",
  },
  projects: {
    title: "Projets",
    subtitle: "Ce que j'ai construit et où trouver mon travail.",
    visitPage: "Voir le site",
    liveDemo: "Démo en ligne",
    comingSoon: "Bientôt disponible",
    viewCode: "Voir le code",
    templateBadge: "Modèle de portfolio",
    previewAlt: (title: string) => `Aperçu de ${title}`,
    descriptions: {
      tixora:
        "Plateforme de billetterie événementielle : trouvez des concerts et des soirées, payez comme vous voulez et entrez avec un QR code.",
      komuLibrary:
        "Bibliothèque numérique universitaire pour livres électroniques, revues, thèses et bases de données de recherche. J'ai développé le frontend et le backend.",
      vtu: "Téléchargez mon application VTU — rapide, simple et fiable.",
      churchBot:
        "Plateforme de démonstration d'un assistant automatisé pour église et de son flux de travail.",
      komuWebsite:
        "Refonte en équipe du site officiel de l'Université Kingsley Ozumba Mbadiwe.",
      neon: "Modèle de portfolio gratuit et open source avec champ de particules, texte animé et galerie fixée au défilement. Un seul fichier HTML, avec guide d'installation.",
      echo: "Modèle de portfolio gratuit au défilement cinématographique — un concept recréé avec un ciel étoilé qui se dévoile et un ruban de projets en 3D, reconstruit en HTML, CSS et JS purs.",
    },
  },
  contact: {
    titleLine1: "Créons",
    titleLine2: "ensemble.",
    body: "Disponible pour des missions freelance et des collaborations. Écrivez-moi et construisons quelque chose de formidable.",
    email: "E-mail",
    whatsapp: "WhatsApp",
    contactMe: "Me contacter",
  },
  footer: {
    rights: "Tous droits réservés.",
  },
  github: {
    eyebrow: "En direct sur GitHub",
    heading: "Travaux open source et contributions",
    intro:
      "Suivez mes derniers dépôts et découvrez mes contributions sur GitHub.",
    avatarAlt: (login: string) => `Avatar GitHub de ${login}`,
    publicRepos: (n: number) => `${n} dépôts publics`,
    followers: (n: number) => `${n} abonnés`,
    visitProfile: "Visitez mon profil GitHub",
    unavailable: "Les données GitHub sont temporairement indisponibles.",
    openGithub: "Ouvrir GitHub",
    viewFullProfile: "Voir le profil complet",
    contributions: (n: number, year: number | null) =>
      `${n} contribution${n > 1 ? "s" : ""} ${year === null ? "au cours de la dernière année" : `en ${year}`}`,
    dayTitle: (n: number, date: string) =>
      `${n} contribution${n > 1 ? "s" : ""} le ${date}`,
    graphLabel: (user: string) => `Contributions GitHub de ${user}`,
    refresh: "Actualiser l'activité",
    yearLabel: "Année des contributions",
    viewProfile: "Voir le profil GitHub",
    weekdays: ["Lun", "Mer", "Ven"],
    loading: "Chargement de l'activité…",
    activityUnavailable: "L'activité est indisponible pour le moment.",
    learnCount: "Comment les contributions sont comptées",
    couldntRefresh: "Impossible d'actualiser l'activité.",
    lastChecked: (time: string) => `Dernière vérification à ${time}`,
    loadingLive: "Chargement de l'activité en direct",
    levels: "Niveaux de contribution, du plus faible au plus élevé",
    less: "Moins",
    more: "Plus",
  },
};

const es: Dictionary = {
  meta: {
    title: "Wintas | Desarrollador full-stack impulsado por IA",
  },
  language: {
    label: "Idioma",
  },
  nav: {
    home: "Inicio",
    about: "Sobre mí",
    projects: "Proyectos",
    contact: "Contacto",
    letsTalk: "Hablemos",
    toggleMenu: "Abrir o cerrar el menú",
  },
  hero: {
    line1: "Diseñando",
    line2: "soluciones digitales",
    intro:
      "Desarrollo aplicaciones web full-stack y productos impulsados por IA, desde plataformas universitarias hasta venta de entradas y pagos, y uso herramientas de IA para lanzarlos rápido.",
    available: "Disponible",
    availableText: "Actualmente acepto nuevos proyectos.",
  },
  about: {
    title: "Sobre mí",
    body: "Soy graduado en Informática (2026) y desarrollador full-stack que construye con IA. He entregado una biblioteca digital y un sitio web universitarios, una plataforma de venta de entradas, una app de pagos VTU y un bot de contenido con IA, usando la IA como parte central de cómo diseño, escribo y lanzo software. Mi objetivo es una tecnología útil, pulida y hecha para durar.",
    expertise: "Especialidades",
    expertiseItems: [
      "Desarrollo web full-stack",
      "Integración de IA (API de LLM)",
      "Desarrollo asistido por IA y prompting",
      "Diseño UI/UX",
    ],
    focus: "Áreas de enfoque",
    focusItems: [
      "Productos digitales prácticos",
      "Experiencias centradas en el usuario",
      "Aprendizaje continuo",
      "Tecnología con impacto",
    ],
    downloadCv: "DESCARGAR CV",
  },
  projects: {
    title: "Proyectos",
    subtitle: "Lo que he construido y dónde encontrar mi trabajo.",
    visitPage: "Visitar sitio",
    liveDemo: "Demo en vivo",
    comingSoon: "Próximamente",
    viewCode: "Ver código",
    templateBadge: "Plantilla de portafolio",
    previewAlt: (title: string) => `Vista previa de ${title}`,
    descriptions: {
      tixora:
        "Plataforma de venta de entradas para eventos: encuentra conciertos y fiestas, paga como prefieras y entra con un código QR.",
      komuLibrary:
        "Biblioteca digital universitaria con libros electrónicos, revistas, tesis y bases de datos de investigación. Desarrollé el frontend y el backend.",
      vtu: "Descarga mi aplicación VTU: rápida, sencilla y fiable.",
      churchBot:
        "Plataforma de demostración de un asistente automatizado para iglesias y su flujo de trabajo.",
      komuWebsite:
        "Rediseño en equipo del sitio web oficial de la Universidad Kingsley Ozumba Mbadiwe.",
      neon: "Plantilla de portafolio gratuita y de código abierto con campo de partículas, texto animado y galería fija al desplazarse. Un solo archivo HTML, con guía de configuración.",
      echo: "Plantilla de portafolio gratuita con desplazamiento cinematográfico: un concepto recreado con un cielo estrellado que se revela y una cinta de proyectos en 3D, reconstruido en HTML, CSS y JS puros.",
    },
  },
  contact: {
    titleLine1: "Creemos algo",
    titleLine2: "juntos.",
    body: "Disponible para proyectos freelance y colaboraciones. Escríbeme y construyamos algo genial.",
    email: "Correo",
    whatsapp: "WhatsApp",
    contactMe: "Contáctame",
  },
  footer: {
    rights: "Todos los derechos reservados.",
  },
  github: {
    eyebrow: "En vivo en GitHub",
    heading: "Trabajo open source y contribuciones",
    intro:
      "Sigue mis repositorios más recientes y mira en qué he contribuido en GitHub.",
    avatarAlt: (login: string) => `Avatar de GitHub de ${login}`,
    publicRepos: (n: number) => `${n} repos públicos`,
    followers: (n: number) => `${n} seguidores`,
    visitProfile: "Visita mi perfil de GitHub",
    unavailable: "Los datos de GitHub no están disponibles temporalmente.",
    openGithub: "Abrir GitHub",
    viewFullProfile: "Ver perfil completo",
    contributions: (n: number, year: number | null) =>
      `${n} ${n === 1 ? "contribución" : "contribuciones"} ${year === null ? "en el último año" : `en ${year}`}`,
    dayTitle: (n: number, date: string) =>
      `${n} ${n === 1 ? "contribución" : "contribuciones"} el ${date}`,
    graphLabel: (user: string) => `Contribuciones de ${user} en GitHub`,
    refresh: "Actualizar actividad",
    yearLabel: "Año de contribuciones",
    viewProfile: "Ver perfil de GitHub",
    weekdays: ["Lun", "Mié", "Vie"],
    loading: "Cargando actividad…",
    activityUnavailable: "La actividad no está disponible en este momento.",
    learnCount: "Cómo se cuentan las contribuciones",
    couldntRefresh: "No se pudo actualizar la actividad.",
    lastChecked: (time: string) => `Última comprobación: ${time}`,
    loadingLive: "Cargando actividad en vivo",
    levels: "Niveles de contribución de menos a más",
    less: "Menos",
    more: "Más",
  },
};

const pt: Dictionary = {
  meta: {
    title: "Wintas | Desenvolvedor full-stack com IA",
  },
  language: {
    label: "Idioma",
  },
  nav: {
    home: "Início",
    about: "Sobre",
    projects: "Projetos",
    contact: "Contato",
    letsTalk: "Vamos conversar",
    toggleMenu: "Abrir ou fechar o menu",
  },
  hero: {
    line1: "Criando",
    line2: "soluções digitais",
    intro:
      "Desenvolvo aplicações web full-stack e produtos com IA, de plataformas universitárias a venda de ingressos e pagamentos, e uso ferramentas de IA para entregá-los rapidamente.",
    available: "Disponível",
    availableText: "Aceitando novos projetos no momento.",
  },
  about: {
    title: "Sobre mim",
    body: "Sou formado em Ciência da Computação (2026) e desenvolvedor full-stack que constrói com IA. Já entreguei uma biblioteca digital e um site universitários, uma plataforma de venda de ingressos, um app de pagamentos VTU e um bot de conteúdo com IA, usando a IA como parte central de como projeto, escrevo e entrego software. Meu objetivo é criar tecnologia útil, bem-acabada e feita para durar.",
    expertise: "Especialidades",
    expertiseItems: [
      "Desenvolvimento web full-stack",
      "Integração de IA (APIs de LLM)",
      "Desenvolvimento assistido por IA e prompting",
      "Design UI/UX",
    ],
    focus: "Áreas de foco",
    focusItems: [
      "Produtos digitais práticos",
      "Experiências focadas no usuário",
      "Aprendizado contínuo",
      "Tecnologia de impacto",
    ],
    downloadCv: "BAIXAR CV",
  },
  projects: {
    title: "Projetos",
    subtitle: "O que construí e onde encontrar meu trabalho.",
    visitPage: "Visitar site",
    liveDemo: "Demo ao vivo",
    comingSoon: "Em breve",
    viewCode: "Ver código",
    templateBadge: "Template de portfólio",
    previewAlt: (title: string) => `Prévia de ${title}`,
    descriptions: {
      tixora:
        "Plataforma de ingressos para eventos: encontre shows e festas, pague do seu jeito e entre com um QR code.",
      komuLibrary:
        "Biblioteca digital universitária com e-books, periódicos, teses e bases de dados de pesquisa. Desenvolvi o frontend e o backend.",
      vtu: "Baixe meu aplicativo VTU — rápido, simples e confiável.",
      churchBot:
        "Plataforma de demonstração de um assistente automatizado para igrejas e seu fluxo de trabalho.",
      komuWebsite:
        "Redesign em equipe do site oficial da Universidade Kingsley Ozumba Mbadiwe.",
      neon: "Template de portfólio gratuito e open source com campo de partículas, texto animado e galeria fixa na rolagem. Um único arquivo HTML, com guia de configuração.",
      echo: "Template de portfólio gratuito com rolagem cinematográfica — um conceito recriado com um céu estrelado que se revela e uma faixa de projetos em 3D, refeito em HTML, CSS e JS puros.",
    },
  },
  contact: {
    titleLine1: "Vamos criar",
    titleLine2: "juntos.",
    body: "Disponível para freelas e colaborações. Fale comigo e vamos construir algo incrível.",
    email: "E-mail",
    whatsapp: "WhatsApp",
    contactMe: "Fale comigo",
  },
  footer: {
    rights: "Todos os direitos reservados.",
  },
  github: {
    eyebrow: "Ao vivo no GitHub",
    heading: "Trabalho open source e contribuições",
    intro:
      "Acompanhe meus repositórios mais recentes e veja no que tenho contribuído no GitHub.",
    avatarAlt: (login: string) => `Avatar do GitHub de ${login}`,
    publicRepos: (n: number) => `${n} repositórios públicos`,
    followers: (n: number) => `${n} seguidores`,
    visitProfile: "Visite meu perfil no GitHub",
    unavailable: "Os dados do GitHub estão temporariamente indisponíveis.",
    openGithub: "Abrir GitHub",
    viewFullProfile: "Ver perfil completo",
    contributions: (n: number, year: number | null) =>
      `${n} ${n === 1 ? "contribuição" : "contribuições"} ${year === null ? "no último ano" : `em ${year}`}`,
    dayTitle: (n: number, date: string) =>
      `${n} ${n === 1 ? "contribuição" : "contribuições"} em ${date}`,
    graphLabel: (user: string) => `Contribuições de ${user} no GitHub`,
    refresh: "Atualizar atividade",
    yearLabel: "Ano das contribuições",
    viewProfile: "Ver perfil no GitHub",
    weekdays: ["Seg", "Qua", "Sex"],
    loading: "Carregando atividade…",
    activityUnavailable: "A atividade está indisponível no momento.",
    learnCount: "Como as contribuições são contadas",
    couldntRefresh: "Não foi possível atualizar a atividade.",
    lastChecked: (time: string) => `Última verificação: ${time}`,
    loadingLive: "Carregando atividade ao vivo",
    levels: "Níveis de contribuição de menos para mais",
    less: "Menos",
    more: "Mais",
  },
};

const de: Dictionary = {
  meta: {
    title: "Wintas | KI-gestützter Full-Stack-Entwickler",
  },
  language: {
    label: "Sprache",
  },
  nav: {
    home: "Start",
    about: "Über mich",
    projects: "Projekte",
    contact: "Kontakt",
    letsTalk: "Kontakt aufnehmen",
    toggleMenu: "Menü öffnen oder schließen",
  },
  hero: {
    line1: "Ich gestalte",
    line2: "digitale Lösungen",
    intro:
      "Ich entwickle Full-Stack-Webanwendungen und KI-gestützte Produkte – von Hochschulplattformen bis zu Ticketing und Zahlungen – und nutze KI-Tools, um sie schnell auszuliefern.",
    available: "Verfügbar",
    availableText: "Ich nehme derzeit neue Projekte an.",
  },
  about: {
    title: "Über mich",
    body: "Ich habe 2026 meinen Abschluss in Informatik gemacht und bin Full-Stack-Entwickler, der mit KI baut. Ich habe eine digitale Hochschulbibliothek und eine Hochschulwebsite, eine Ticketing-Plattform, eine VTU-Zahlungs-App und einen KI-Content-Bot umgesetzt – KI ist ein zentraler Teil davon, wie ich Software entwerfe, schreibe und ausliefere. Mein Ziel ist Technologie, die nützlich, ausgereift und langlebig ist.",
    expertise: "Kompetenzen",
    expertiseItems: [
      "Full-Stack-Webentwicklung",
      "KI-Integration (LLM-APIs)",
      "KI-gestützte Entwicklung & Prompting",
      "UI/UX-Design",
    ],
    focus: "Schwerpunkte",
    focusItems: [
      "Praktische digitale Produkte",
      "Nutzerzentrierte Erlebnisse",
      "Kontinuierliches Lernen",
      "Wirkungsvolle Technologie",
    ],
    downloadCv: "LEBENSLAUF HERUNTERLADEN",
  },
  projects: {
    title: "Projekte",
    subtitle: "Was ich gebaut habe und wo Sie meine Arbeit finden.",
    visitPage: "Seite besuchen",
    liveDemo: "Live-Demo",
    comingSoon: "Demnächst",
    viewCode: "Code ansehen",
    templateBadge: "Portfolio-Vorlage",
    previewAlt: (title: string) => `Vorschau von ${title}`,
    descriptions: {
      tixora:
        "Ticketing-Plattform für Events: Konzerte und Partys finden, flexibel bezahlen und per QR-Code einchecken.",
      komuLibrary:
        "Digitale Hochschulbibliothek für E-Books, Fachzeitschriften, Abschlussarbeiten und Forschungsdatenbanken. Ich habe Frontend und Backend entwickelt.",
      vtu: "Laden Sie meine VTU-App herunter – schnell, einfach und zuverlässig.",
      churchBot:
        "Demo-Plattform für einen automatisierten Kirchenassistenten und dessen Abläufe.",
      komuWebsite:
        "Team-Redesign der offiziellen Website der Kingsley Ozumba Mbadiwe University.",
      neon: "Kostenlose Open-Source-Portfolio-Vorlage mit Partikelfeld, animierter Typografie und fixierter Scroll-Galerie. Eine einzige HTML-Datei, inklusive Einrichtungsanleitung.",
      echo: "Kostenlose Portfolio-Vorlage mit cineastischem Scrollen – ein nachgebautes Konzept mit Sternenhimmel-Effekt und 3D-Projektband, neu umgesetzt in reinem HTML, CSS und JS.",
    },
  },
  contact: {
    titleLine1: "Gemeinsam",
    titleLine2: "etwas schaffen.",
    body: "Verfügbar für Freelance-Projekte und Kooperationen. Melden Sie sich – lassen Sie uns etwas Großartiges bauen.",
    email: "E-Mail",
    whatsapp: "WhatsApp",
    contactMe: "Kontakt aufnehmen",
  },
  footer: {
    rights: "Alle Rechte vorbehalten.",
  },
  github: {
    eyebrow: "Live auf GitHub",
    heading: "Open-Source-Arbeit und Beiträge",
    intro:
      "Verfolgen Sie meine neuesten Repositories und sehen Sie, woran ich auf GitHub mitgewirkt habe.",
    avatarAlt: (login: string) => `GitHub-Avatar von ${login}`,
    publicRepos: (n: number) => `${n} öffentliche Repos`,
    followers: (n: number) => `${n} Follower`,
    visitProfile: "Mein GitHub-Profil besuchen",
    unavailable: "GitHub-Daten sind hier vorübergehend nicht verfügbar.",
    openGithub: "GitHub öffnen",
    viewFullProfile: "Vollständiges Profil ansehen",
    contributions: (n: number, year: number | null) =>
      `${n} ${n === 1 ? "Beitrag" : "Beiträge"} ${year === null ? "im letzten Jahr" : `im Jahr ${year}`}`,
    dayTitle: (n: number, date: string) =>
      `${n} ${n === 1 ? "Beitrag" : "Beiträge"} am ${date}`,
    graphLabel: (user: string) => `GitHub-Beiträge von ${user}`,
    refresh: "Aktivität aktualisieren",
    yearLabel: "Beitragsjahr",
    viewProfile: "GitHub-Profil ansehen",
    weekdays: ["Mo", "Mi", "Fr"],
    loading: "Aktivität wird geladen…",
    activityUnavailable: "Die Aktivität ist derzeit nicht verfügbar.",
    learnCount: "So werden Beiträge gezählt",
    couldntRefresh: "Aktivität konnte nicht aktualisiert werden.",
    lastChecked: (time: string) => `Zuletzt geprüft um ${time}`,
    loadingLive: "Live-Aktivität wird geladen",
    levels: "Beitragsstufen von wenig bis viel",
    less: "Weniger",
    more: "Mehr",
  },
};

const dictionaries: Record<LanguageCode, Dictionary> = { en, fr, es, pt, de };

function isLanguageCode(value: unknown): value is LanguageCode {
  return LANGUAGES.some((language) => language.code === value);
}

// Order of preference: ?lang= in the URL, the visitor's saved choice,
// their browser language, then English.
function detectInitialLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";

  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (isLanguageCode(fromUrl)) return fromUrl;
  } catch {
    // ignore
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguageCode(saved)) return saved;
  } catch {
    // storage can be blocked (private mode, embedded views)
  }

  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const tag of browserLanguages) {
    const base = tag?.toLowerCase().split("-")[0];
    if (isLanguageCode(base)) return base;
  }

  return "en";
}

type I18nContextValue = {
  language: LanguageCode;
  locale: string;
  t: Dictionary;
  setLanguage: (language: LanguageCode) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(
    detectInitialLanguage,
  );

  const setLanguage = (next: LanguageCode) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  const value = useMemo<I18nContextValue>(() => {
    const locale =
      LANGUAGES.find((entry) => entry.code === language)?.locale ?? "en-US";
    return { language, locale, t: dictionaries[language], setLanguage };
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = dictionaries[language].meta.title;
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside <LanguageProvider>");
  }
  return context;
}
