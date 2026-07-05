export type Locale = "en" | "ru"

type TranslationMap = {
  [key: string]: string | string[] | TranslationMap
}

const en: TranslationMap = {
  nav: {
    work: "Work",
    experience: "Experience",
    workflow: "Workflow",
    contact: "Contact",
  },
  hero: {
    label: "MOTION DESIGNER",
    subtitle: "3D Animation • Product Visualization • AI-assisted Production",
    scroll: "SCROLL",
  },
  work: {
    title: "Selected Works",
    projectNotFound: "Project not found",
  },
  about: {
    title: "About",
    p1: "Motion Designer specializing in cinematic 3D animation, product visualization and AI-assisted content production.",
    p2: "I combine Cinema 4D, Redshift, After Effects and modern generative AI tools to create commercial visuals for digital products, advertising and marketing.",
    p3: "My workflow focuses on creating realistic lighting, premium materials, cinematic camera movement and visually clear storytelling.",
    p4: "I actively integrate AI into production — not as a replacement for creativity, but as a tool for concept development, image generation, video generation and production acceleration.",
    languages: "LANGUAGES",
    russian: "Russian",
    english: "English",
    native: "Native",
    workingProficiency: "Working Proficiency",
  },
  software: {
    title: "Software",
    learning: "Currently Learning",
  },
  contact: {
    headline: "Let's build something together.",
    email: "EMAIL",
    telegram: "TELEGRAM",
    downloadCV: "Download CV",
    linkedin: "LinkedIn",
  },
  footer: {
    copyright: "Nikita Kasperovich",
  },
  back: "Back",
  experience: {
    title: "Experience",
    role: "Motion Designer",
    company: "Purrweb",
    currentPosition: "Current Position",
    purrweb: {
      p1: "I work as a Motion Designer at Purrweb, creating visual content for digital products, marketing campaigns and commercial presentations.",
      p2: "My work combines 3D production, animation, compositing and AI-assisted workflows. Projects include product visualization, healthcare interfaces, promotional videos, UI animation and marketing assets for international clients.",
    },
    responsibilities: "Responsibilities",
    responsibilitiesList: [
      "Product visualization",
      "Cinematic 3D animation",
      "Marketing videos",
      "UI animation",
      "Healthcare visualizations",
      "Motion graphics",
      "AI-assisted content production",
      "Creative concept development",
      "Rendering and compositing",
      "Working closely with designers and marketing teams",
    ],
    software: "Software",
    freelanceRole: "Freelance Motion Designer",
    freelance: {
      p1: "Alongside my full-time work I create commercial motion graphics and CGI content for clients. My freelance work focuses on product advertising, AI-assisted production and cinematic product presentations.",
    },
    recentWork: "Recent work includes",
    recentWorkList: [
      "Product commercials",
      "CGI advertising",
      "AI-generated video production",
      "Product visualization",
      "Motion graphics",
      "Commercial presentations",
    ],
    aiTools: "AI Tools",
  },
  workflow: {
    title: "Workflow",
    steps: {
      "01": "Creative direction, mood boards, and visual research to define the look and feel of the project.",
      "02": "Shot-by-shot planning with timing, camera angles, and key frame compositions.",
      "03": "Modeling, lighting, shading, and rendering with a focus on cinematic quality and detail.",
      "04": "Post-production, motion graphics, color grading, and visual effects integration.",
      "05": "AI-assisted concept development, image generation, and video production.",
      "06": "Export, format optimization, and delivery across platforms and formats.",
    },
  },
}

const ru: TranslationMap = {
  nav: {
    work: "Работы",
    experience: "Опыт",
    workflow: "Процесс",
    contact: "Контакты",
  },
  hero: {
    label: "MOTION ДИЗАЙНЕР",
    subtitle: "3D анимация • Продакшн • AI-продакшн",
    scroll: "ЛИСТАЙТЕ",
  },
  work: {
    title: "Избранные работы",
    projectNotFound: "Проект не найден",
  },
  about: {
    title: "Обо мне",
    p1: "Motion-дизайнер, специализирующийся на кинематографичной 3D-анимации, продакшене продуктов и AI-ассистированном создании контента.",
    p2: "Я объединяю Cinema 4D, Redshift, After Effects и современные генеративные AI-инструменты для создания коммерческих визуалов для цифровых продуктов, рекламы и маркетинга.",
    p3: "Мой воркфлоу сфокусирован на реалистичном освещении, премиальных материалах, кинематографичных движениях камеры и визуально чистом сторителлинге.",
    p4: "Я активно интегрирую AI в производство — не как замену креативности, а как инструмент для разработки концепций, генерации изображений, видео и ускорения производства.",
    languages: "ЯЗЫКИ",
    russian: "Русский",
    english: "Английский",
    native: "Родной",
    workingProficiency: "Рабочий уровень",
  },
  software: {
    title: "Инструменты",
    learning: "В процессе изучения",
  },
  contact: {
    headline: "Давайте создадим что-то вместе.",
    email: "ПОЧТА",
    telegram: "ТЕЛЕГРАМ",
    downloadCV: "Скачать резюме",
    linkedin: "LinkedIn",
  },
  footer: {
    copyright: "Никита Касперович",
  },
  back: "Назад",
  experience: {
    title: "Опыт",
    role: "Motion Дизайнер",
    company: "Purrweb",
    currentPosition: "Текущая должность",
    purrweb: {
      p1: "Я работаю Motion-дизайнером в Purrweb, создавая визуальный контент для цифровых продуктов, маркетинговых кампаний и коммерческих презентаций.",
      p2: "Моя работа объединяет 3D-продакшн, анимацию, композитинг и AI-воркфлоу. Проекты включают продакшен продуктов, интерфейсы для здравоохранения, промо-ролики, UI-анимацию и маркетинговые материалы для международных клиентов.",
    },
    responsibilities: "Обязанности",
    responsibilitiesList: [
      "Продакшн продуктов",
      "Кинематографичная 3D анимация",
      "Маркетинговые видео",
      "UI анимация",
      "Визуализации для здравоохранения",
      "Моушн графика",
      "AI-ассистированный продакшн",
      "Разработка креативных концепций",
      "Рендеринг и композитинг",
      "Работа с дизайнерами и маркетинговыми командами",
    ],
    software: "Инструменты",
    freelanceRole: "Фриланс Motion Дизайнер",
    freelance: {
      p1: "Параллельно с основной работой я создаю коммерческую моушн-графику и CGI-контент для клиентов. Фриланс сфокусирован на продуктовой рекламе, AI-продакшне и кинематографичных презентациях продуктов.",
    },
    recentWork: "Последние работы",
    recentWorkList: [
      "Продуктовые коммерческие",
      "CGI реклама",
      "AI-видео продакшн",
      "Продакшн продуктов",
      "Моушн графика",
      "Коммерческие презентации",
    ],
    aiTools: "AI Инструменты",
  },
  workflow: {
    title: "Процесс",
    steps: {
      "01": "Креативное направление, мудборды и визуальное исследование для определения look & feel проекта.",
      "02": "Покадровое планирование с таймингом, ракурсами камеры и ключевыми композициями.",
      "03": "Моделинг, освещение, шейдинг и рендеринг с фокусом на кинематографическое качество и детали.",
      "04": "Пост-продакшн, моушн-графика, цветокоррекция и интеграция визуальных эффектов.",
      "05": "AI-ассистированная разработка концепций, генерация изображений и видео-продакшн.",
      "06": "Экспорт, оптимизация форматов и доставка под различные платформы.",
    },
  },
}

export const translations = { en, ru }

export function getValue(obj: TranslationMap, path: string): string {
  const keys = path.split(".")
  let value: unknown = obj
  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as TranslationMap)[key]
    } else {
      return path
    }
  }
  if (typeof value === "string") return value
  if (Array.isArray(value)) return value.join(", ")
  return path
}
