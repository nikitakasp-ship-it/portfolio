export type LayoutType = "hero" | "wide" | "landscape" | "square" | "portrait" | "tall"

export interface Project {
  id: string
  slug: string
  title: string
  category: string
  year: string
  description: { en: string; ru: string }
  thumbnail: string
  cover: string
  gallery: string[]
  video?: string
  videoAspect?: string
  overview: { en: string; ru: string }
  credits?: string
  color: string
  technologies: string[]
  layout: LayoutType
  featured: boolean
}

export const layoutAspect: Record<LayoutType, string> = {
  hero: "16/9",
  wide: "21/9",
  landscape: "4/3",
  square: "1/1",
  portrait: "3/4",
  tall: "9/16",
}

export const layoutMinHeight: Record<LayoutType, string> = {
  hero: "70vh",
  wide: "50vh",
  landscape: "auto",
  square: "auto",
  portrait: "auto",
  tall: "auto",
}

export const colSpan: Record<LayoutType, string> = {
  hero: "1 / -1",
  wide: "1 / -1",
  landscape: "span 2",
  square: "span 1",
  portrait: "span 1",
  tall: "span 1",
}

export const videoAspectColSpan: Record<string, string> = {
  "21/9": "1 / -1",
  "16/9": "span 2",
  "4/3": "span 2",
  "1/1": "span 1",
  "3/4": "span 1",
  "9/16": "span 1",
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
    thumbnail: "/projects/demiand/gallery/01.webp",
    cover: "/projects/demiand/cover.webp",
    gallery: [
      "/projects/demiand/gallery/01.webp",
      "/projects/demiand/gallery/02.webp",
      "/projects/demiand/gallery/03.webp",
    ],
    video: "/projects/demiand/preview.mp4",
    videoAspect: "16/9",
    overview: {
      en: "A recruitment design task exploring AI-assisted production for a kitchen appliance brand. Combining 3D product visualization with AI-generated assets to create a premium commercial spot.",
      ru: "Дизайн-задание на рекрутинге, исследующее AI-ассистированный продакшн для бренда кухонной техники. Сочетание 3D-продакшена и AI-генерации для создания премиального коммерческого ролика.",
    },
    credits: "Design task — Purrweb recruitment",
    color: "#1a1a2e",
    technologies: ["Cinema 4D", "Redshift", "After Effects", "Midjourney", "ChatGPT"],
    layout: "landscape",
    featured: true,
  },
  {
    id: "obsidian-oni",
    slug: "obsidian-oni",
    title: "Obsidian Oni",
    category: "Character Animation",
    year: "2025",
    description: {
      en: "Cinematic character animation project",
      ru: "Кинематографичная анимация персонажа",
    },
    thumbnail: "",
    cover: "",
    gallery: [],
    overview: {
      en: "A cinematic character animation study focused on mood, lighting, and storytelling through motion. Built entirely in Cinema 4D with Redshift.",
      ru: "Кинематографичное изучение анимации персонажа с фокусом на настроение, освещение и повествование через движение. Полностью создано в Cinema 4D с Redshift.",
    },
    credits: "Personal project",
    color: "#16213e",
    technologies: ["Cinema 4D", "Redshift"],
    layout: "portrait",
    featured: true,
  },
  {
    id: "jdm",
    slug: "jdm",
    title: "JDM",
    category: "Automotive Motion",
    year: "2025",
    description: {
      en: "Automotive motion design project",
      ru: "Автомобильный моушн-дизайн проект",
    },
    thumbnail: "",
    cover: "",
    gallery: [],
    overview: {
      en: "Automotive motion design project showcasing car culture through dynamic 3D animation, lighting, and cinematic camera work.",
      ru: "Автомобильный проект, демонстрирующий культуру машин через динамичную 3D-анимацию, освещение и кинематографичную работу камеры.",
    },
    credits: "Personal project",
    color: "#1a1a2e",
    technologies: ["Cinema 4D", "Redshift", "After Effects"],
    layout: "wide",
    featured: true,
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
    thumbnail: "",
    cover: "",
    gallery: [],
    overview: {
      en: "Exploration of AI-driven digital human technology. Combining 3D character workflows with AI tools to create a believable digital avatar.",
      ru: "Исследование AI-управляемой технологии цифровых людей. Сочетание 3D-воркфлоу с AI-инструментами для создания реалистичного цифрового аватара.",
    },
    credits: "Personal project",
    color: "#0f3460",
    technologies: ["Cinema 4D", "Redshift", "Midjourney", "ChatGPT"],
    layout: "square",
    featured: true,
  },
  {
    id: "nadi",
    slug: "nadi",
    title: "Nadi",
    category: "TBD",
    year: "2026",
    description: { en: "", ru: "" },
    thumbnail: "",
    cover: "",
    gallery: [],
    color: "#1a1a2e",
    technologies: [],
    layout: "square",
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
    thumbnail: "",
    cover: "",
    gallery: [],
    color: "#1a1a2e",
    technologies: [],
    layout: "square",
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
    thumbnail: "",
    cover: "",
    gallery: [],
    color: "#1a1a2e",
    technologies: [],
    layout: "square",
    featured: false,
    overview: { en: "", ru: "" },
  },
]
