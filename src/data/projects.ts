import mediaRatios from "./media-ratios.json"

export interface MediaInfo {
  width: number
  height: number
  ratio: string
}

export interface Project {
  id: string
  slug: string
  title: string
  category: string
  year: string
  description: { en: string; ru: string }
  previewVideo?: string
  heroVideo?: string
  galleryImages: string[]
  additionalVideos?: string[]
  behindTheScenes?: string[]
  overview: { en: string; ru: string }
  credits?: string
  color: string
  technologies: string[]
  featured: boolean
  gridPosition?: "full" | "left" | "right"
}

const ratios = mediaRatios as Record<string, Record<string, MediaInfo>>

export function getMediaInfo(
  slug: string,
  type: string = "preview"
): MediaInfo | null {
  const entry = ratios[slug]
  if (entry?.[type]) return entry[type]
  if (entry?.preview) return entry.preview
  return null
}

export function getMediaAspectCSS(slug: string, type: string = "preview"): string {
  const info = getMediaInfo(slug, type)
  if (info) return `${info.width} / ${info.height}`
  return "16 / 9"
}

export function getMediaAspectRatio(slug: string, type: string = "preview"): number {
  const info = getMediaInfo(slug, type)
  if (info) return info.width / info.height
  return 16 / 9
}

export const projects: Project[] = [
  {
    id: "demiand",
    slug: "demiand",
    title: "DÉMIAND",
    category: "Product Commercial",
    year: "2025",
    description: {
      en: "AI-assisted product commercial for kitchen appliances",
      ru: "AI-ассистированный продакшн для кухонной техники",
    },
    previewVideo: "/projects/demiand/preview.mp4",
    heroVideo: "/projects/demiand/preview.mp4",
    galleryImages: [],
    overview: {
      en: "A recruitment design task exploring AI-assisted production for a kitchen appliance brand. Combining 3D product visualization with AI-generated assets to create a premium commercial spot.",
      ru: "Дизайн-задание на рекрутинге, исследующее AI-ассистированный продакшн для бренда кухонной техники. Сочетание 3D-продакшена и AI-генерации для создания премиального коммерческого ролика.",
    },
    credits: "Design task — Purrweb recruitment",
    color: "#1a1a2e",
    technologies: ["Cinema 4D", "Redshift", "After Effects", "Midjourney", "ChatGPT"],
    featured: true,
    gridPosition: "full",
  },
  {
    id: "playrix",
    slug: "playrix",
    title: "Playrix — Mobile Ad Concepts",
    category: "Mobile Advertising • Motion Design",
    year: "2025",
    description: {
      en: "Creation of animated mobile game advertisements as part of a Playrix Motion Designer test assignment.",
      ru: "Создание анимированных рекламных мобильных игр в рамках тестового задания Playrix на позицию Motion Designer.",
    },
    previewVideo: "/projects/playrix/preview.mp4",
    heroVideo: "/projects/playrix/preview.mp4",
    galleryImages: [],
    additionalVideos: [],
    behindTheScenes: [],
    overview: {
      en: "Creation of animated mobile game advertisements as part of a Playrix Motion Designer test assignment. The project focused on building engaging UA creatives, combining fast-paced storytelling, UI animation, visual effects and gameplay presentation while following a production pipeline similar to commercial mobile advertising.",
      ru: "Создание анимированных рекламных мобильных игр в рамках тестового задания Playrix на позицию Motion Designer. Проект был сосредоточен на создании привлекательных UA-креативов, сочетая динамичный сторителлинг, UI-анимацию, визуальные эффекты и презентацию геймплея в рамках продакшн-пайплайна, аналогичного коммерческой мобильной рекламе.",
    },
    credits: "Test assignment — Playrix",
    color: "#1a2e1a",
    technologies: ["After Effects", "Cinema 4D", "Photoshop", "AI Tools"],
    featured: true,
  },
  {
    id: "mobile-device",
    slug: "mobile-device",
    title: "Mobile Device Commercial",
    category: "Product Commercial • 3D Animation",
    year: "2025",
    description: {
      en: "Personal commercial product animation created entirely in Cinema 4D.",
      ru: "Личный коммерческий продуктовый ролик, созданный полностью в Cinema 4D.",
    },
    previewVideo: "/projects/mobile-device/preview.mp4",
    heroVideo: "/projects/mobile-device/preview.mp4",
    galleryImages: [],
    additionalVideos: [],
    behindTheScenes: [],
    overview: {
      en: "Personal commercial product animation created entirely in Cinema 4D. The project focuses on premium product presentation, realistic lighting, procedural animation and cinematic composition featuring a stylized character interacting with a mobile device.",
      ru: "Личный коммерческий продуктовый ролик, созданный полностью в Cinema 4D. Проект сосредоточен на премиальной подаче продукта, реалистичном освещении, процедурной анимации и кинематографичной композиции со стилизованным персонажем, взаимодействующим с мобильным устройством.",
    },
    credits: "Personal project",
    color: "#1a1a2e",
    technologies: ["Cinema 4D", "Redshift", "After Effects"],
    featured: true,
    gridPosition: "left",
  },
  {
    id: "obsidian-oni",
    slug: "obsidian-oni",
    title: "Obsidian Oni",
    category: "3D Character Animation • AI Rendering",
    year: "2026",
    description: {
      en: "A cinematic character exploration combining traditional 3D production with AI-assisted rendering. The project was created in Cinema 4D, where the character, composition, lighting, and animation were developed before being enhanced through an AI rendering pipeline to achieve a stylized cinematic aesthetic while preserving the original 3D direction.",
      ru: "Кинематографичный персонаж, созданный в Cinema 4D с последующим AI-рендерингом для стилизованной кинематографичной эстетики.",
    },
    previewVideo: "/projects/obsidian-oni/preview.mp4",
    heroVideo: "/projects/obsidian-oni/preview.mp4",
    galleryImages: [],
    overview: {
      en: "A cinematic character exploration combining traditional 3D production with AI-assisted rendering. The project was created in Cinema 4D, where the character, composition, lighting, and animation were developed before being enhanced through an AI rendering pipeline to achieve a stylized cinematic aesthetic while preserving the original 3D direction.\n\n• Character Design\n• 3D Animation\n• Lighting & Composition\n• AI-Assisted Rendering\n• Cinematic Look Development",
      ru: "Кинематографичный персонаж, созданный в Cinema 4D с последующим AI-рендерингом для стилизованной кинематографичной эстетики.",
    },
    credits: "Personal project",
    color: "#16213e",
    technologies: ["Cinema 4D", "AI Rendering Tools"],
    featured: true,
    gridPosition: "right",
  },
  {
    id: "trading-platform",
    slug: "trading-platform",
    title: "Trading Platform Concept",
    category: "Product Visualization • Motion Design",
    year: "2025",
    description: {
      en: "Personal concept project exploring the visual language of modern trading platforms.",
      ru: "Личный концепт-проект, исследующий визуальный язык современных торговых платформ.",
    },
    previewVideo: "/projects/trading-platform/preview.mp4",
    heroVideo: "/projects/trading-platform/preview.mp4",
    galleryImages: [],
    additionalVideos: [],
    overview: {
      en: "Personal concept project exploring the visual language of modern trading platforms. The project combines cinematic motion design, UI presentation and product visualization to create a premium financial product experience.",
      ru: "Личный концепт-проект, исследующий визуальный язык современных торговых платформ. Проект сочетает кинематографичную моушн-графику, презентацию UI и продакшн продуктов для создания премиального финансового продукта.",
    },
    credits: "Personal project",
    color: "#0a1628",
    technologies: ["Cinema 4D", "Redshift", "After Effects"],
    featured: true,
  },
  {
    id: "jdm",
    slug: "jdm",
    title: "JDM",
    category: "3D Environment Design • Asset Production",
    year: "2025",
    description: {
      en: "Creation of cinematic 3D environments and a modular asset library in Cinema 4D for a website dedicated to Japanese drift culture.",
      ru: "Создание кинематографичных 3D-сред и модульной библиотеки ассетов в Cinema 4D для сайта, посвящённого японской дрифт-культуре.",
    },
    previewVideo: "/projects/jdm/preview.mp4",
    heroVideo: "/projects/jdm/preview.mp4",
    galleryImages: [],
    overview: {
      en: "Creation of cinematic 3D environments and a modular asset library in Cinema 4D for a website dedicated to Japanese drift culture. The project focused on building reusable scenes, lighting setups, materials, and atmospheric compositions that reflected the aesthetics of modern JDM motorsport.",
      ru: "Создание кинематографичных 3D-сред и модульной библиотеки ассетов в Cinema 4D для сайта, посвящённого японской дрифт-культуре. Проект был сосредоточен на создании многоразовых сцен, настроек освещения, материалов и атмосферных композиций, отражающих эстетику современного JDM-автоспорта.",
    },
    credits: "Personal project",
    color: "#1a1a2e",
    technologies: ["Cinema 4D", "Redshift", "After Effects"],
    featured: true,
    gridPosition: "full",
    additionalVideos: [
      "/projects/jdm/additional/01.webm",
      "/projects/jdm/additional/02.webm",
      "/projects/jdm/additional/03.webm",
    ],
  },
  {
    id: "dexter",
    slug: "dexter",
    title: "Dexter",
    category: "AI Digital Human",
    year: "2025",
    description: {
      en: "AI digital human / AI avatar project",
      ru: "AI цифровой человек / AI аватар",
    },
    previewVideo: "/projects/dexter/preview.mp4",
    heroVideo: "/projects/dexter/preview.mp4",
    galleryImages: [],
    overview: {
      en: "Exploration of AI-driven digital human technology. Combining 3D character workflows with AI tools to create a believable digital avatar.",
      ru: "Исследование AI-управляемой технологии цифровых людей. Сочетание 3D-воркфлоу с AI-инструментами для создания реалистичного цифрового аватара.",
    },
    credits: "Personal project",
    color: "#0f3460",
    technologies: ["Cinema 4D", "Redshift", "Midjourney", "ChatGPT"],
    featured: true,
  },
  {
    id: "nadi",
    slug: "nadi",
    title: "Nadi",
    category: "TBD",
    year: "2026",
    description: { en: "", ru: "" },
    galleryImages: [],
    technologies: [],
    color: "#1a1a2e",
    featured: false,
    overview: { en: "", ru: "" },
  },
  {
    id: "healthcare",
    slug: "healthcare",
    title: "Healthcare",
    category: "TBD",
    year: "2026",
    description: { en: "", ru: "" },
    galleryImages: [],
    technologies: [],
    color: "#1a1a2e",
    featured: false,
    overview: { en: "", ru: "" },
  },
  {
    id: "ai-human",
    slug: "ai-human",
    title: "AI Human",
    category: "TBD",
    year: "2026",
    description: { en: "", ru: "" },
    galleryImages: [],
    technologies: [],
    color: "#1a1a2e",
    featured: false,
    overview: { en: "", ru: "" },
  },
]
