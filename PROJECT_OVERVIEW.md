# Project Overview

## Purpose
Premium motion design portfolio for Nikita Kasperovich. Bilingual (EN/RU), light/dark themes, cinematic scroll animations, hover-based video previews, and View Transitions API for page transitions.

## Tech Stack
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.9 | Framework (App Router) |
| React | 19.2.4 | UI |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x (PostCSS) | Utility-first CSS |
| GSAP | 3.15+ | Scroll animations, page transitions |
| Lenis | 1.3.25 | Smooth scrolling |
| Inter font | 5.2.8 | Typography (300-700 weights) |

## Folder Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata, inline flicker-prevention script
│   ├── page.tsx            # Homepage (Hero, SelectedWorks, About, Software, Contact)
│   ├── providers.tsx       # I18nProvider + ThemeProvider composition
│   ├── globals.css         # CSS variables, Tailwind imports, View Transitions CSS
│   ├── not-found.tsx       # Custom 404
│   ├── robots.ts           # robots.txt generation
│   ├── sitemap.ts          # Dynamic sitemap with all projects
│   ├── manifest.ts         # PWA manifest
│   ├── experience/
│   │   └── page.tsx        # Experience page (Purrweb + Freelance)
│   ├── workflow/
│   │   └── page.tsx        # Workflow page (6-step pipeline)
│   └── projects/
│       └── [slug]/
│           └── page.tsx    # Dynamic project detail page
├── components/
│   ├── Navigation.tsx      # Fixed nav, backdrop blur on scroll, mobile menu
│   ├── Hero.tsx            # Full-viewport hero with GSAP entrance animation
│   ├── SelectedWorks.tsx   # Section wrapper for ProjectGrid
│   ├── ProjectGrid.tsx     # 3-column editorial CSS Grid with dense packing
│   ├── ProjectCard.tsx     # Hover-driven video preview, singleton tracker
│   ├── About.tsx           # About section with languages
│   ├── Software.tsx        # Software/tools grid
│   ├── Contact.tsx         # Contact links (email, Telegram, CV, LinkedIn)
│   ├── Footer.tsx          # Minimal footer
│   └── SmoothScroll.tsx    # Lenis smooth scroll (SSR disabled)
├── data/
│   └── projects.ts         # All project data, helpers, aspect ratio config
└── lib/
    ├── i18n-context.tsx    # I18n provider (EN/RU), browser detection, localStorage
    ├── theme-context.tsx   # Theme provider (dark/light), OS preference, localStorage
    ├── translations.ts     # Complete EN/RU translation maps
    └── use-scroll-animation.ts  # GSAP ScrollTrigger hook

public/
├── favicon.svg             # NK monogram
├── images/                 # Static images
└── projects/               # Per-project folders (preview.mp4 per project)
```

## Routing
| Route | Type | Description |
|---|---|---|
| `/` | Static | Homepage |
| `/experience` | Static | Work experience |
| `/workflow` | Static | Creative process |
| `/projects/[slug]` | Dynamic | Project detail page |
| `/robots.txt` | Generated | robots.txt |
| `/sitemap.xml` | Generated | Dynamic sitemap |
| `/manifest.webmanifest` | Generated | PWA manifest |

## State Management
- **Theme**: React Context (`ThemeContext`) with `useState` + `useEffect` syncing to `data-theme` attribute and `localStorage`
- **I18n**: React Context (`I18nContext`) with `useState` + `useEffect` syncing to `document.documentElement.lang` and `localStorage`
- **No global state library** — all state is local or context-based

## Theme System
- CSS custom properties on `:root` (dark default) and `[data-theme="light"]`
- Variables: `--background`, `--surface`, `--nav-background`, `--border`, `--text-primary`, `--text-secondary`, `--text-muted`, `--text-hover`
- 300ms transition on `background-color`, `color`, `border-color`, `box-shadow` via global `*` selector
- Inline `<script>` in `<head>` reads localStorage/preference before React hydrates (flicker prevention)

## Language System
- `translations.ts`: flat `TranslationMap` objects for EN and RU
- `getValue(obj, path)`: dot-notation key lookup (e.g., `"experience.purrweb.p1"`)
- `I18nProvider` wraps the app; `useI18n()` hook provides `t()`, `locale`, `setLocale`
- Browser language detection via `navigator.language`; persisted to `localStorage`

## Animation Libraries
- **GSAP**: Hero entrance timeline, page entrance/exit animations, scroll-triggered reveals via `useScrollAnimation` hook
- **GSAP ScrollTrigger**: Used in `useScrollAnimation` for fade-in-up animations on section enter
- **Lenis**: Smooth scrolling with custom easing, respects `prefers-reduced-motion`
- **View Transitions API**: `experimental.viewTransition: true` in next.config.ts; shared `viewTransitionName` between card and detail hero; custom CSS animations for morph/fade

## Video Playback Logic

### Project Cards (`ProjectCard.tsx`)
- **Default state**: Video element with `preload="metadata"`, paused at `currentTime=0`, shows first frame
- **Hover**: `video.play()` from frame 0; singleton `activePreviewVideo` ensures only one plays at a time
- **Leave**: `video.pause()` + `currentTime=0` — first frame reappears instantly
- **No cover images** — video first frame IS the thumbnail
- **Fallback**: For projects without video (placeholders), solid `project.color` background + title/category text

### Detail Page (`projects/[slug]/page.tsx`)
- **VideoPlayer component**: `IntersectionObserver` with 0.2 threshold — auto-plays when visible, pauses when not
- **Hero section**: Hero video/image animates in with GSAP (scale 0.88→1, opacity 0→1)
- **Back link**: GSAP exit animation (scale 0.96, opacity 0, translateY -20) before `router.push`

## Project Card Architecture
- **Grid**: 3-column CSS Grid with `gridAutoFlow: "dense"` and `alignItems: "start"`
- **Column span**: Determined by `aspectRatioColSpan` mapping:
  - "21:9" → 3 columns (full width)
  - "16:9", "4:3", "3:2", "9:16" → 2 columns
  - "1:1", "4:5", "3:4" → 1 column
- **Card sizing**: `aspectRatio` field directly controls `aspect-ratio` CSS property
- **Hover effects**: Scale 1→1.025, gradient overlay, title/category/year with 150ms stagger

## Data Model (`projects.ts`)
```typescript
interface Project {
  id: string
  slug: string
  title: string
  category: string
  year: string
  description: { en: string; ru: string }
  previewVideo?: string    // Card preview video path
  heroVideo?: string       // Detail page hero video
  galleryImages: string[]  // Detail page gallery
  additionalVideos?: string[]
  behindTheScenes?: string[]
  aspectRatio: string      // e.g., "21:9", "16:9", "1:1"
  overview: { en: string; ru: string }
  credits?: string
  color: string            // Fallback background color
  technologies: string[]
  featured: boolean        // Show on homepage grid
}
```

## Adding New Projects
1. Create folder: `public/projects/{slug}/`
2. Add `preview.mp4` (card thumbnail + hover video)
3. Add `hero.mp4` (optional, detail page hero)
4. Edit `src/data/projects.ts`: add entry to `projects` array
5. All fields: id, slug, title, category, year, description, previewVideo, heroVideo, galleryImages, aspectRatio, overview, credits, color, technologies, featured
6. Deploy — Vercel auto-deploys from GitHub push

## Build Instructions
```bash
npm install
npm run dev      # Development server (port 3000)
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## SEO
- Metadata: OG tags, Twitter Cards, metadataBase, robots
- Dynamic sitemap includes all project pages
- Custom 404 page
- `robots.txt` generated via `robots.ts`
- PWA manifest via `manifest.ts`
