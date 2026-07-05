export interface Project {
  id: string
  slug: string
  title: string
  category: string
  year: string
  description: { en: string; ru: string }
  cover: string
  previewVideo?: string
  heroVideo?: string
  galleryImages: string[]
  additionalVideos?: string[]
  behindTheScenes?: string[]
  aspectRatio: string
  overview: { en: string; ru: string }
  credits?: string
  color: string
  technologies: string[]
  featured: boolean
}

export const aspectRatioColSpan: Record<string, number> = {
  "21:9": 3,
  "16:9": 2,
  "4:3": 2,
  "3:2": 2,
  "9:16": 2,
  "4:5": 1,
  "3:4": 1,
  "1:1": 1,
}

export function getAspectRatioCSS(ratio: string): string {
  return ratio.replace(":", "/")
}

export function getColSpan(ratio: string): number {
  return aspectRatioColSpan[ratio] || 2
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
    cover: "",
    previewVideo: "/projects/demiand/preview.mp4",
    heroVideo: "/projects/demiand/preview.mp4",
    galleryImages: [],
    aspectRatio: "21:9",
    overview: {
      en: "A recruitment design task exploring AI-assisted production for a kitchen appliance brand. Combining 3D product visualization with AI-generated assets to create a premium commercial spot.",
      ru: "Дизайн-задание на рекрутинге, исследующее AI-ассистированный продакшн для бренда кухонной техники. Сочетание 3D-продакшена и AI-генерации для создания премиального коммерческого ролика.",
    },
    credits: "Design task — Purrweb recruitment",
    color: "#1a1a2e",
    technologies: ["Cinema 4D", "Redshift", "After Effects", "Midjourney", "ChatGPT"],
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
    cover: "",
    previewVideo: "/projects/obsidian-oni/preview.mp4",
    heroVideo: "/projects/obsidian-oni/preview.mp4",
    galleryImages: [],
    aspectRatio: "16:9",
    overview: {
      en: "A cinematic character animation study focused on mood, lighting, and storytelling through motion. Built entirely in Cinema 4D with Redshift.",
      ru: "Кинематографичное изучение анимации персонажа с фокусом на настроение, освещение и повествование через движение. Полностью создано в Cinema 4D с Redshift.",
    },
    credits: "Personal project",
    color: "#16213e",
    technologies: ["Cinema 4D", "Redshift"],
    featured: true,
  },
  {
    id: "jdm",
    slug: "jdm",
    title: "JDM",
    category: "Automotive Motion",
    year: "2025",
    description: {
      en: "Automotive motion design project showcasing car culture through dynamic 3D animation, lighting, and cinematic camera work.",
      ru: "Автомобильный проект, демонстрирующий культуру машин через динамичную 3D-анимацию, освещение и кинематографичную работу камеры.",
    },
    cover: "",
    previewVideo: "/projects/jdm/preview.mp4",
    heroVideo: "/projects/jdm/preview.mp4",
    galleryImages: [],
    aspectRatio: "21:9",
    overview: {
      en: "Automotive motion design project showcasing car culture through dynamic 3D animation, lighting, and cinematic camera work.",
      ru: "Автомобильный проект, демонстрирующий культуру машин через динамичную 3D-анимацию, освещение и кинематографичную работу камеры.",
    },
    credits: "Personal project",
    color: "#1a1a2e",
    technologies: ["Cinema 4D", "Redshift", "After Effects"],
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
    cover: "",
    previewVideo: "/projects/dexter/preview.mp4",
    heroVideo: "/projects/dexter/preview.mp4",
    galleryImages: [],
    aspectRatio: "1:1",
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
    cover: "",
    galleryImages: [],
    aspectRatio: "16:9",
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
    cover: "",
    galleryImages: [],
    aspectRatio: "16:9",
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
    cover: "",
    galleryImages: [],
    aspectRatio: "16:9",
    technologies: [],
    color: "#1a1a2e",
    featured: false,
    overview: { en: "", ru: "" },
  },
]
