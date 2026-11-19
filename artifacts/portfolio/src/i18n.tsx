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
  { code: "en", label: "English", locale: "en-US", dir: "ltr" },
  { code: "fr", label: "Français", locale: "fr-FR", dir: "ltr" },
  { code: "es", label: "Español", locale: "es-ES", dir: "ltr" },
  { code: "pt", label: "Português", locale: "pt-BR", dir: "ltr" },
  { code: "de", label: "Deutsch", locale: "de-DE", dir: "ltr" },
  { code: "ar", label: "العربية", locale: "ar", dir: "rtl" },
  { code: "zh", label: "中文（简体）", locale: "zh-CN", dir: "ltr" },
  { code: "ja", label: "日本語", locale: "ja-JP", dir: "ltr" },
  { code: "ko", label: "한국어", locale: "ko-KR", dir: "ltr" },
  { code: "hi", label: "हिन्दी", locale: "hi-IN", dir: "ltr" },
] as const;

// Inter has no Arabic, CJK or Devanagari letters, so these load a matching
// Noto font, only when a visitor picks that language.
const EXTRA_FONTS: Partial<Record<LanguageCode, string>> = {
  ar: "Noto+Sans+Arabic:wght@400;500;600;700",
  zh: "Noto+Sans+SC:wght@400;500;700",
  ja: "Noto+Sans+JP:wght@400;500;700",
  ko: "Noto+Sans+KR:wght@400;500;700",
  hi: "Noto+Sans+Devanagari:wght@400;500;600;700",
};

function loadFontFor(language: LanguageCode) {
  const family = EXTRA_FONTS[language];
  if (!family || document.getElementById(`font-${language}`)) return;
  const link = document.createElement("link");
  link.id = `font-${language}`;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
  document.head.appendChild(link);
}

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
  },
  contact: {
    titleLine1: "Let's create",
    titleLine2: "together.",
    body: "Available for freelance and collaboration. Reach out and let's build something great.",
    email: "Email",
    whatsapp: "WhatsApp",
    contactMe: "Contact Me",
  },
  tools: {
    title: "Tools I build with",
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
  },
  contact: {
    titleLine1: "Créons",
    titleLine2: "ensemble.",
    body: "Disponible pour des missions freelance et des collaborations. Écrivez-moi et construisons quelque chose de formidable.",
    email: "E-mail",
    whatsapp: "WhatsApp",
    contactMe: "Me contacter",
  },
  tools: {
    title: "Mes outils de création",
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
  },
  contact: {
    titleLine1: "Creemos algo",
    titleLine2: "juntos.",
    body: "Disponible para proyectos freelance y colaboraciones. Escríbeme y construyamos algo genial.",
    email: "Correo",
    whatsapp: "WhatsApp",
    contactMe: "Contáctame",
  },
  tools: {
    title: "Herramientas con las que construyo",
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
    letsTalk: "Vamos falar",
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
  },
  contact: {
    titleLine1: "Vamos criar",
    titleLine2: "juntos.",
    body: "Disponível para freelas e colaborações. Fale comigo e vamos construir algo incrível.",
    email: "E-mail",
    whatsapp: "WhatsApp",
    contactMe: "Fale comigo",
  },
  tools: {
    title: "Ferramentas que uso para construir",
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
    letsTalk: "Kontakt",
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
  },
  contact: {
    titleLine1: "Gemeinsam",
    titleLine2: "etwas schaffen.",
    body: "Verfügbar für Freelance-Projekte und Kooperationen. Melden Sie sich – lassen Sie uns etwas Großartiges bauen.",
    email: "E-Mail",
    whatsapp: "WhatsApp",
    contactMe: "Kontakt aufnehmen",
  },
  tools: {
    title: "Werkzeuge, mit denen ich baue",
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

const ar: Dictionary = {
  meta: {
    title: "Wintas | مطوّر Full-Stack مدعوم بالذكاء الاصطناعي",
  },
  language: {
    label: "اللغة",
  },
  nav: {
    home: "الرئيسية",
    about: "نبذة عني",
    projects: "المشاريع",
    contact: "تواصل",
    letsTalk: "لنتحدث",
    toggleMenu: "فتح القائمة أو إغلاقها",
  },
  hero: {
    line1: "أصمّم",
    line2: "حلولًا رقمية",
    intro:
      "أبني تطبيقات ويب متكاملة (Full-Stack) ومنتجات مدعومة بالذكاء الاصطناعي، من المنصات الجامعية إلى حجز التذاكر والمدفوعات، وأستخدم أدوات الذكاء الاصطناعي لإطلاقها بسرعة.",
    available: "متاح",
    availableText: "أستقبل مشاريع جديدة حاليًا.",
  },
  about: {
    title: "نبذة عني",
    body: "أنا خريج علوم الحاسوب (2026) ومطوّر Full-Stack أبني بالذكاء الاصطناعي. سلّمتُ مكتبة إلكترونية وموقعًا لجامعة، ومنصة لحجز التذاكر، وتطبيقًا لمدفوعات VTU، وروبوت محتوى بالذكاء الاصطناعي، مع جعل الذكاء الاصطناعي جزءًا أساسيًا من طريقتي في تصميم البرمجيات وكتابتها وإطلاقها. هدفي تقنية مفيدة ومتقنة ومصممة لتدوم.",
    expertise: "الخبرات",
    expertiseItems: [
      "تطوير الويب المتكامل (Full-Stack)",
      "دمج الذكاء الاصطناعي (واجهات LLM)",
      "التطوير بمساعدة الذكاء الاصطناعي وكتابة الأوامر",
      "تصميم الواجهات وتجربة المستخدم (UI/UX)",
    ],
    focus: "مجالات التركيز",
    focusItems: [
      "منتجات رقمية عملية",
      "تجارب تتمحور حول المستخدم",
      "التعلّم المستمر",
      "تقنية ذات أثر",
    ],
    downloadCv: "تحميل السيرة الذاتية",
  },
  projects: {
    title: "المشاريع",
    subtitle: "ما بنيته وأين تجد أعمالي.",
    visitPage: "زيارة الموقع",
    liveDemo: "عرض مباشر",
    comingSoon: "قريبًا",
    viewCode: "عرض الكود",
    templateBadge: "قالب معرض أعمال",
    previewAlt: (title: string) => `معاينة ${title}`,
  },
  contact: {
    titleLine1: "لنصنع شيئًا",
    titleLine2: "معًا.",
    body: "متاح للعمل الحر والتعاون. تواصل معي ولنبنِ شيئًا رائعًا.",
    email: "البريد الإلكتروني",
    whatsapp: "واتساب",
    contactMe: "تواصل معي",
  },
  tools: {
    title: "الأدوات التي أبني بها",
  },
  footer: {
    rights: "جميع الحقوق محفوظة.",
  },
  github: {
    eyebrow: "مباشر على GitHub",
    heading: "أعمال مفتوحة المصدر ومساهمات",
    intro: "تابع أحدث مستودعاتي وشاهد ما أساهم فيه على GitHub.",
    avatarAlt: (login: string) => `الصورة الرمزية لـ ${login} على GitHub`,
    publicRepos: (n: number) => `${n} مستودع عام`,
    followers: (n: number) => `${n} متابع`,
    visitProfile: "زر ملفي على GitHub",
    unavailable: "بيانات GitHub غير متاحة هنا مؤقتًا.",
    openGithub: "فتح GitHub",
    viewFullProfile: "عرض الملف الكامل",
    contributions: (n: number, year: number | null) =>
      `${n} مساهمة ${year === null ? "خلال العام الماضي" : `في ${year}`}`,
    dayTitle: (n: number, date: string) => `${n} مساهمة في ${date}`,
    graphLabel: (user: string) => `مساهمات ${user} على GitHub`,
    refresh: "تحديث النشاط",
    yearLabel: "سنة المساهمات",
    viewProfile: "عرض ملف GitHub",
    weekdays: ["الإثنين", "الأربعاء", "الجمعة"],
    loading: "جارٍ تحميل النشاط…",
    activityUnavailable: "النشاط غير متاح حاليًا.",
    learnCount: "كيف تُحتسب المساهمات",
    couldntRefresh: "تعذّر تحديث النشاط.",
    lastChecked: (time: string) => `آخر تحقق: ${time}`,
    loadingLive: "جارٍ تحميل النشاط المباشر",
    levels: "مستويات المساهمة من الأقل إلى الأكثر",
    less: "أقل",
    more: "أكثر",
  },
};

const zh: Dictionary = {
  meta: {
    title: "Wintas | AI 驱动的全栈开发者",
  },
  language: {
    label: "语言",
  },
  nav: {
    home: "首页",
    about: "关于",
    projects: "项目",
    contact: "联系",
    letsTalk: "聊一聊",
    toggleMenu: "打开或关闭菜单",
  },
  hero: {
    line1: "设计",
    line2: "数字化解决方案",
    intro:
      "我开发全栈 Web 应用和 AI 驱动的产品，涵盖高校平台、票务和支付等领域，并借助 AI 工具快速交付。",
    available: "可接项目",
    availableText: "目前正在承接新项目。",
  },
  about: {
    title: "关于我",
    body: "我是计算机科学专业毕业生（2026 届），也是一名用 AI 进行开发的全栈开发者。我交付过高校电子图书馆和官网、票务平台、VTU 支付应用以及 AI 内容机器人，AI 是我设计、编写和交付软件的核心环节。我的目标是打造实用、精致且经久耐用的技术。",
    expertise: "专业技能",
    expertiseItems: [
      "全栈 Web 开发",
      "AI 集成（LLM API）",
      "AI 辅助开发与提示词工程",
      "UI/UX 设计",
    ],
    focus: "关注方向",
    focusItems: [
      "实用的数字产品",
      "以用户为中心的体验",
      "持续学习",
      "有影响力的技术",
    ],
    downloadCv: "下载简历",
  },
  projects: {
    title: "项目",
    subtitle: "我做过的作品，以及可以找到它们的地方。",
    visitPage: "访问网站",
    liveDemo: "在线演示",
    comingSoon: "即将推出",
    viewCode: "查看代码",
    templateBadge: "作品集模板",
    previewAlt: (title: string) => `${title} 预览`,
  },
  contact: {
    titleLine1: "让我们",
    titleLine2: "一起创造。",
    body: "可承接自由职业和合作项目。欢迎联系我，一起打造出色的作品。",
    email: "邮箱",
    whatsapp: "WhatsApp",
    contactMe: "联系我",
  },
  tools: {
    title: "我使用的开发工具",
  },
  footer: {
    rights: "保留所有权利。",
  },
  github: {
    eyebrow: "GitHub 实时动态",
    heading: "开源作品与贡献",
    intro: "关注我的最新仓库，看看我在 GitHub 上的贡献。",
    avatarAlt: (login: string) => `${login} 的 GitHub 头像`,
    publicRepos: (n: number) => `${n} 个公开仓库`,
    followers: (n: number) => `${n} 位关注者`,
    visitProfile: "访问我的 GitHub 主页",
    unavailable: "暂时无法获取 GitHub 数据。",
    openGithub: "打开 GitHub",
    viewFullProfile: "查看完整主页",
    contributions: (n: number, year: number | null) =>
      `${year === null ? "过去一年" : `${year} 年`}共 ${n} 次贡献`,
    dayTitle: (n: number, date: string) => `${date}：${n} 次贡献`,
    graphLabel: (user: string) => `${user} 的 GitHub 贡献`,
    refresh: "刷新贡献动态",
    yearLabel: "贡献年份",
    viewProfile: "查看 GitHub 主页",
    weekdays: ["周一", "周三", "周五"],
    loading: "正在加载贡献动态…",
    activityUnavailable: "暂时无法显示贡献动态。",
    learnCount: "了解贡献的统计方式",
    couldntRefresh: "无法刷新动态。",
    lastChecked: (time: string) => `最后检查于 ${time}`,
    loadingLive: "正在加载实时动态",
    levels: "贡献等级，从少到多",
    less: "少",
    more: "多",
  },
};

const ja: Dictionary = {
  meta: {
    title: "Wintas | AIを活用するフルスタック開発者",
  },
  language: {
    label: "言語",
  },
  nav: {
    home: "ホーム",
    about: "自己紹介",
    projects: "プロジェクト",
    contact: "お問い合わせ",
    letsTalk: "相談する",
    toggleMenu: "メニューを開閉",
  },
  hero: {
    line1: "デザインする、",
    line2: "デジタルソリューション",
    intro:
      "大学向けプラットフォームからチケット販売や決済まで、フルスタックのWebアプリとAIを活用したプロダクトを開発し、AIツールでスピーディーに届けています。",
    available: "受付中",
    availableText: "現在、新しいプロジェクトを受け付けています。",
  },
  about: {
    title: "自己紹介",
    body: "2026年にコンピュータサイエンスの学位を取得した、AIを活用して開発するフルスタック開発者です。大学の電子図書館とWebサイト、チケット販売プラットフォーム、VTU決済アプリ、AIコンテンツボットを手がけてきました。AIは、私がソフトウェアを設計し、書き、リリースするうえで欠かせない存在です。目指しているのは、役に立ち、完成度が高く、長く使えるテクノロジーです。",
    expertise: "専門分野",
    expertiseItems: [
      "フルスタックWeb開発",
      "AI統合（LLM API）",
      "AI支援開発とプロンプト設計",
      "UI/UXデザイン",
    ],
    focus: "注力分野",
    focusItems: [
      "実用的なデジタルプロダクト",
      "ユーザー中心の体験",
      "継続的な学習",
      "インパクトのあるテクノロジー",
    ],
    downloadCv: "履歴書をダウンロード",
  },
  projects: {
    title: "プロジェクト",
    subtitle: "これまでに作ったものと、作品を見られる場所です。",
    visitPage: "サイトを見る",
    liveDemo: "ライブデモ",
    comingSoon: "近日公開",
    viewCode: "コードを見る",
    templateBadge: "ポートフォリオテンプレート",
    previewAlt: (title: string) => `${title}のプレビュー`,
  },
  contact: {
    titleLine1: "一緒に",
    titleLine2: "つくりましょう。",
    body: "フリーランスのご依頼やコラボレーションを受け付けています。お気軽にご連絡ください。素晴らしいものを一緒に作りましょう。",
    email: "メール",
    whatsapp: "WhatsApp",
    contactMe: "連絡する",
  },
  tools: {
    title: "開発に使っているツール",
  },
  footer: {
    rights: "無断転載を禁じます。",
  },
  github: {
    eyebrow: "GitHubでライブ公開中",
    heading: "オープンソースの活動とコントリビューション",
    intro: "最新のリポジトリや、GitHubでのコントリビューションをご覧ください。",
    avatarAlt: (login: string) => `${login}のGitHubアバター`,
    publicRepos: (n: number) => `公開リポジトリ ${n}件`,
    followers: (n: number) => `フォロワー ${n}人`,
    visitProfile: "GitHubプロフィールを見る",
    unavailable: "GitHubのデータを一時的に表示できません。",
    openGithub: "GitHubを開く",
    viewFullProfile: "プロフィールをすべて見る",
    contributions: (n: number, year: number | null) =>
      `${year === null ? "過去1年間" : `${year}年`}のコントリビューション：${n}件`,
    dayTitle: (n: number, date: string) => `${date}：${n}件のコントリビューション`,
    graphLabel: (user: string) => `${user}のGitHubコントリビューション`,
    refresh: "アクティビティを更新",
    yearLabel: "コントリビューションの年",
    viewProfile: "GitHubプロフィールを見る",
    weekdays: ["月", "水", "金"],
    loading: "アクティビティを読み込み中…",
    activityUnavailable: "現在アクティビティを表示できません。",
    learnCount: "コントリビューションの数え方",
    couldntRefresh: "アクティビティを更新できませんでした。",
    lastChecked: (time: string) => `最終確認 ${time}`,
    loadingLive: "最新のアクティビティを読み込み中",
    levels: "コントリビューションのレベル（少ない〜多い）",
    less: "少",
    more: "多",
  },
};

const ko: Dictionary = {
  meta: {
    title: "Wintas | AI 기반 풀스택 개발자",
  },
  language: {
    label: "언어",
  },
  nav: {
    home: "홈",
    about: "소개",
    projects: "프로젝트",
    contact: "연락처",
    letsTalk: "문의하기",
    toggleMenu: "메뉴 열기/닫기",
  },
  hero: {
    line1: "디지털 솔루션을",
    line2: "디자인합니다",
    intro:
      "대학 플랫폼부터 티켓 예매와 결제까지, 풀스택 웹 앱과 AI 기반 제품을 만들고 AI 도구로 빠르게 출시합니다.",
    available: "작업 가능",
    availableText: "현재 새 프로젝트를 받고 있습니다.",
  },
  about: {
    title: "소개",
    body: "2026년 컴퓨터공학을 졸업한 풀스택 개발자로, AI를 활용해 개발합니다. 대학 전자도서관과 웹사이트, 티켓 예매 플랫폼, VTU 결제 앱, AI 콘텐츠 봇을 만들었으며, AI는 제가 소프트웨어를 설계하고 작성하고 출시하는 방식의 핵심입니다. 제 목표는 유용하고, 완성도 높으며, 오래가는 기술을 만드는 것입니다.",
    expertise: "전문 분야",
    expertiseItems: [
      "풀스택 웹 개발",
      "AI 통합(LLM API)",
      "AI 보조 개발 및 프롬프트 작성",
      "UI/UX 디자인",
    ],
    focus: "관심 분야",
    focusItems: [
      "실용적인 디지털 제품",
      "사용자 중심 경험",
      "꾸준한 학습",
      "임팩트 있는 기술",
    ],
    downloadCv: "이력서 다운로드",
  },
  projects: {
    title: "프로젝트",
    subtitle: "제가 만든 것들과 작업을 볼 수 있는 곳입니다.",
    visitPage: "사이트 방문",
    liveDemo: "라이브 데모",
    comingSoon: "출시 예정",
    viewCode: "코드 보기",
    templateBadge: "포트폴리오 템플릿",
    previewAlt: (title: string) => `${title} 미리보기`,
  },
  contact: {
    titleLine1: "함께",
    titleLine2: "만들어요.",
    body: "프리랜스와 협업이 가능합니다. 연락 주시면 함께 멋진 것을 만들어 보겠습니다.",
    email: "이메일",
    whatsapp: "WhatsApp",
    contactMe: "연락하기",
  },
  tools: {
    title: "제가 사용하는 도구",
  },
  footer: {
    rights: "모든 권리 보유.",
  },
  github: {
    eyebrow: "GitHub 실시간",
    heading: "오픈소스 작업과 기여",
    intro: "최신 저장소를 확인하고 제가 GitHub에서 기여한 내용을 살펴보세요.",
    avatarAlt: (login: string) => `${login}의 GitHub 아바타`,
    publicRepos: (n: number) => `공개 저장소 ${n}개`,
    followers: (n: number) => `팔로워 ${n}명`,
    visitProfile: "제 GitHub 프로필 방문하기",
    unavailable: "GitHub 데이터를 일시적으로 불러올 수 없습니다.",
    openGithub: "GitHub 열기",
    viewFullProfile: "전체 프로필 보기",
    contributions: (n: number, year: number | null) =>
      `${year === null ? "지난 1년간" : `${year}년`} 기여 ${n}회`,
    dayTitle: (n: number, date: string) => `${date}: 기여 ${n}회`,
    graphLabel: (user: string) => `${user}의 GitHub 기여`,
    refresh: "기여 활동 새로고침",
    yearLabel: "기여 연도",
    viewProfile: "GitHub 프로필 보기",
    weekdays: ["월", "수", "금"],
    loading: "기여 활동을 불러오는 중…",
    activityUnavailable: "지금은 기여 활동을 표시할 수 없습니다.",
    learnCount: "기여 횟수 계산 방법",
    couldntRefresh: "활동을 새로고침하지 못했습니다.",
    lastChecked: (time: string) => `마지막 확인 ${time}`,
    loadingLive: "실시간 활동을 불러오는 중",
    levels: "기여 수준(적음에서 많음)",
    less: "적음",
    more: "많음",
  },
};

const hi: Dictionary = {
  meta: {
    title: "Wintas | AI-संचालित फुल-स्टैक डेवलपर",
  },
  language: {
    label: "भाषा",
  },
  nav: {
    home: "होम",
    about: "परिचय",
    projects: "प्रोजेक्ट्स",
    contact: "संपर्क",
    letsTalk: "बात करें",
    toggleMenu: "मेन्यू खोलें या बंद करें",
  },
  hero: {
    line1: "डिज़ाइन करता हूँ",
    line2: "डिजिटल समाधान",
    intro:
      "मैं फुल-स्टैक वेब ऐप्स और AI-संचालित प्रोडक्ट बनाता हूँ — यूनिवर्सिटी प्लेटफ़ॉर्म से लेकर टिकटिंग और पेमेंट तक — और उन्हें जल्दी लॉन्च करने के लिए AI टूल्स का इस्तेमाल करता हूँ।",
    available: "उपलब्ध",
    availableText: "फ़िलहाल नए प्रोजेक्ट ले रहा हूँ।",
  },
  about: {
    title: "मेरे बारे में",
    body: "मैं कंप्यूटर साइंस ग्रेजुएट (2026) और फुल-स्टैक डेवलपर हूँ, जो AI के साथ निर्माण करता है। मैंने एक यूनिवर्सिटी ई-लाइब्रेरी और वेबसाइट, एक टिकटिंग प्लेटफ़ॉर्म, एक VTU पेमेंट ऐप और एक AI कंटेंट बॉट बनाए हैं, और AI मेरे सॉफ़्टवेयर डिज़ाइन करने, लिखने और लॉन्च करने के तरीके का अहम हिस्सा है। मेरा लक्ष्य ऐसी तकनीक बनाना है जो उपयोगी, बेहतरीन और लंबे समय तक चलने वाली हो।",
    expertise: "विशेषज्ञता",
    expertiseItems: [
      "फुल-स्टैक वेब डेवलपमेंट",
      "AI इंटीग्रेशन (LLM API)",
      "AI-सहायता प्राप्त डेवलपमेंट और प्रॉम्प्टिंग",
      "UI/UX डिज़ाइन",
    ],
    focus: "फ़ोकस क्षेत्र",
    focusItems: [
      "व्यावहारिक डिजिटल प्रोडक्ट",
      "यूज़र-केंद्रित अनुभव",
      "लगातार सीखना",
      "प्रभावशाली तकनीक",
    ],
    downloadCv: "CV डाउनलोड करें",
  },
  projects: {
    title: "प्रोजेक्ट्स",
    subtitle: "मैंने क्या बनाया है और मेरा काम कहाँ देखें।",
    visitPage: "साइट देखें",
    liveDemo: "लाइव डेमो",
    comingSoon: "जल्द आ रहा है",
    viewCode: "कोड देखें",
    templateBadge: "पोर्टफ़ोलियो टेम्पलेट",
    previewAlt: (title: string) => `${title} का प्रीव्यू`,
  },
  contact: {
    titleLine1: "आइए मिलकर",
    titleLine2: "कुछ बनाएँ।",
    body: "फ़्रीलांस और सहयोग के लिए उपलब्ध हूँ। संपर्क करें और कुछ शानदार बनाते हैं।",
    email: "ईमेल",
    whatsapp: "WhatsApp",
    contactMe: "संपर्क करें",
  },
  tools: {
    title: "जिन टूल्स से मैं बनाता हूँ",
  },
  footer: {
    rights: "सर्वाधिकार सुरक्षित।",
  },
  github: {
    eyebrow: "GitHub पर लाइव",
    heading: "ओपन-सोर्स काम और योगदान",
    intro: "मेरी नई रिपॉज़िटरी देखें और जानें कि मैं GitHub पर किसमें योगदान दे रहा हूँ।",
    avatarAlt: (login: string) => `${login} का GitHub अवतार`,
    publicRepos: (n: number) => `${n} पब्लिक रिपॉज़िटरी`,
    followers: (n: number) => `${n} फ़ॉलोअर्स`,
    visitProfile: "मेरी GitHub प्रोफ़ाइल देखें",
    unavailable: "GitHub डेटा अभी अस्थायी रूप से उपलब्ध नहीं है।",
    openGithub: "GitHub खोलें",
    viewFullProfile: "पूरी प्रोफ़ाइल देखें",
    contributions: (n: number, year: number | null) =>
      `${year === null ? "पिछले एक साल में" : `${year} में`} ${n} योगदान`,
    dayTitle: (n: number, date: string) => `${date} को ${n} योगदान`,
    graphLabel: (user: string) => `${user} के GitHub योगदान`,
    refresh: "योगदान गतिविधि रीफ़्रेश करें",
    yearLabel: "योगदान वर्ष",
    viewProfile: "GitHub प्रोफ़ाइल देखें",
    weekdays: ["सोम", "बुध", "शुक्र"],
    loading: "योगदान गतिविधि लोड हो रही है…",
    activityUnavailable: "योगदान गतिविधि अभी उपलब्ध नहीं है।",
    learnCount: "योगदान कैसे गिने जाते हैं",
    couldntRefresh: "गतिविधि रीफ़्रेश नहीं हो सकी।",
    lastChecked: (time: string) => `आख़िरी बार जाँचा गया: ${time}`,
    loadingLive: "लाइव गतिविधि लोड हो रही है",
    levels: "योगदान स्तर, कम से ज़्यादा",
    less: "कम",
    more: "ज़्यादा",
  },
};

const dictionaries: Record<LanguageCode, Dictionary> = {
  en,
  fr,
  es,
  pt,
  de,
  ar,
  zh,
  ja,
  ko,
  hi,
};

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
  dir: "ltr" | "rtl";
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
    const entry = LANGUAGES.find((item) => item.code === language);
    return {
      language,
      locale: entry?.locale ?? "en-US",
      dir: entry?.dir ?? "ltr",
      t: dictionaries[language],
      setLanguage,
    };
  }, [language]);

  useEffect(() => {
    const entry = LANGUAGES.find((item) => item.code === language);
    document.documentElement.lang = language;
    document.documentElement.dir = entry?.dir ?? "ltr";
    loadFontFor(language);
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
