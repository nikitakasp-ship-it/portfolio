# Review Notes

## Known Issues

### 1. Global CSS transition on `*` selector
`globals.css` applies `transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease` to ALL elements (`*, *::before, *::after`). This conflicts with GSAP animations — GSAP needs to control `opacity` and `transform` directly. The global transition was originally causing GSAP content to disappear on scroll. Current workaround: `opacity` and `transform` are NOT in the global transition list, but the blanket `color` and `background-color` transition may still cause unwanted interpolation on elements that GSAP animates.

### 2. `useScrollAnimation` hook — empty dependency array
The hook uses `useEffect(() => { ... }, [])` with an eslint-disable comment for `react-hooks/exhaustive-deps`. This means the hook never re-runs if the ref changes. It works because ScrollTrigger handles its own lifecycle, but it's technically a stale closure risk if the component re-renders with different props.

### 3. ScrollTrigger + Lenis — no integration
Lenis runs its own `requestAnimationFrame` loop. ScrollTrigger runs independently. There is NO `ScrollTrigger.scrollerProxy()` or Lenis integration. This can cause subtle scroll position mismatches in some edge cases, though it has been working fine in practice.

### 4. No Next.js `<Image>` component
All images use raw `<img>` tags, not `next/image`. This means:
- No automatic WebP/AVIF optimization
- No responsive `srcset` generation
- No lazy loading by default (manual `loading="lazy"` applied)
- No blur placeholder
- The `images.formats` config in `next.config.ts` is unused

### 5. Detail page `VideoPlayer` — IntersectionObserver plays video immediately
The `VideoPlayer` component in `projects/[slug]/page.tsx` uses IntersectionObserver with `threshold: 0.2` to auto-play. There is no user interaction check — it plays as soon as 20% visible. This may surprise users or waste bandwidth on mobile.

### 6. Translations `getValue()` returns `, `-joined string for arrays
The `getValue()` function in `translations.ts` handles arrays by joining with `, `. The `responsibilitiesList` and `recentWorkList` are arrays, but the `experience/page.tsx` renders them by splitting on `, `. This creates a fragile circular dependency — if a translation item contains a comma, it will break the split.

### 7. Inline styles vs. Tailwind
Most components use inline `style={{}}` objects rather than Tailwind classes. This is intentional for dynamic values (CSS variables, clamp(), computed states), but many static styles could be Tailwind classes for better maintainability.

### 8. No `loading="lazy"` on video elements
Preview videos in project cards use `preload="metadata"`, which is correct. But the hero video on detail pages also uses `preload="metadata"` — it should arguably use `preload="auto"` since it's the primary content.

## Current Limitations

### Content
- 3 placeholder projects (nadi, healthcare, ai-human) have no media, no descriptions, no technologies
- No actual CV PDF file at `/cv.pdf` (linked in Contact section)
- No `showreel-poster.png` in use (exists in `public/images/` but not referenced)

### Performance
- All 4 project preview videos load via `preload="metadata"` — on a slow connection, this still downloads the full first frame for each video
- No intersection-based lazy loading for video elements (cards load all videos eagerly)
- Lenis smooth scroll runs a continuous `requestAnimationFrame` loop even when the page is idle

### Accessibility
- Mobile hamburger menu uses `aria-expanded` and `aria-label` — good
- Skip-to-content link exists — good
- No `role="main"` on `<main>` elements (Next.js App Router uses semantic `<main>` tag, which is fine)
- Video elements have no `aria-label` or captions
- Color contrast: `--text-muted` (#7D7D7D on dark, #6A6A6A on light) may fail WCAG AA on their respective backgrounds

### Type Safety
- `getValue()` returns `string` but can receive `string[]` — the join behavior is implicit
- Some `any`-ish patterns in GSAP usage (`gsap.TweenTarget`)

## Recent Changes (Last 5 Commits)
1. **Nav backdrop**: `var(--nav-background)` with 0.72 alpha, 12px blur, WebkitBackdropFilter
2. **Contact redesign**: New headline, 4-column grid (email, Telegram, CV, LinkedIn)
3. **JDM data update**: New category, full EN/RU description and overview
4. **ProjectCard rewrite**: Removed cover images entirely, video first frame as thumbnail
5. **Cover field removed**: `cover` removed from Project interface and all entries

## Areas That Need Improvement

### Architecture
- Extract inline styles to Tailwind where possible (or CSS modules)
- Consider consolidating the Navigation component (185 lines with lots of duplication between desktop/mobile)
- The experience page has local helper components (`SectionBlock`, `SectionHeader`, etc.) that could be extracted to a shared library
- `providers.tsx` is thin — could be inlined into `layout.tsx`

### Performance
- Implement intersection-based video loading (only load when card is near viewport)
- Consider `next/image` for gallery images and fallback thumbnails
- Add `loading="eager"` to hero video, `loading="lazy"` to everything below fold
- Debounce or throttle the nav scroll listener (currently runs on every frame)

### UX
- No skeleton/loading states for video thumbnails
- No error handling if video fails to load (card shows solid color — acceptable)
- No keyboard navigation for project cards (they are `<Link>` elements, so they're focusable, but no hover simulation)
- Mobile menu has no escape-key or swipe-to-close

### Code Quality
- ESLint `react-hooks/set-state-in-effect` is suppressed in both context providers — consider using `useEffect` with proper deps or `useLayoutEffect`
- `useScrollAnimation` eslint-disable for empty deps
- `package-lock.json` is tracked in git (intentional for reproducibility, but can cause merge conflicts)

## Areas Requesting External Review

1. **Performance audit**: Are there unnecessary re-renders? Are memo patterns needed? Is GSAP used efficiently?
2. **Accessibility audit**: WCAG 2.1 AA compliance — contrast ratios, keyboard navigation, screen reader support, video captions
3. **SEO audit**: Are metadata tags complete? Is the sitemap optimal? Are there any crawlability issues?
4. **Architecture review**: Is the component structure maintainable? Are there anti-patterns?
5. **Animation review**: Are GSAP animations performant? Any jank on low-end devices? Are reduced-motion preferences properly respected?
6. **Security review**: Any XSS vectors? Are external links properly sanitized with `rel="noopener noreferrer"`?
7. **Next.js best practices**: Is App Router used correctly? Any server/client component boundary issues?
