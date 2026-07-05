# Admin Guide — Portfolio Projects

Everything you need to add or update projects. No React knowledge required — edit one file and drop in media.

---

## Folder Structure

Each project lives in `public/projects/{slug}/`:

```
public/projects/
  {slug}/
    cover.webp       ← Hero image on the project detail page
    preview.mp4      ← Optional background video (replaces cover.webp)
    gallery/
      01.webp        ← Gallery images (optional)
      02.webp
      ...
```

### Current project folders

| slug          | media folder                            |
|---------------|-----------------------------------------|
| `demiand`     | `public/projects/demiand/`              |
| `obsidian-oni`| `public/projects/obsidian-oni/`         |
| `jdm`         | `public/projects/jdm/`                  |
| `dexter`      | `public/projects/dexter/`              |

---

## How to Add a New Project

### 1. Choose a slug

The `slug` is used as the URL (`/projects/{slug}`) and the media folder name.

**Rules:**
- Lowercase English letters, numbers, and hyphens only
- No spaces, no uppercase, no special characters
- Examples: `nadi`, `healthcare`, `ai-human`, `my-new-project`

### 2. Create the media folder

```
public/projects/{slug}/
  cover.webp
  gallery/
    01.webp
```

### 3. Add the entry to the data file

Open **`src/data/projects.ts`** and add a new object to the `projects` array:

```ts
{
  id: "nadi",
  slug: "nadi",
  title: "Nadi",
  category: "Product Commercial",
  year: "2026",
  description: {
    en: "AI-assisted product commercial",
    ru: "AI-продакшн продукта",
  },
  thumbnail: "/projects/nadi/gallery/01.webp",
  cover: "/projects/nadi/cover.webp",
  gallery: [
    "/projects/nadi/gallery/01.webp",
  ],
  video: "/projects/nadi/preview.mp4",       // optional — omit if no video
  videoAspect: "16/9",                       // optional — card adapts to this ratio
  overview: {
    en: "A longer paragraph describing the project in detail. Shown on the project page.",
    ru: "Длинное описание проекта на русском.",
  },
  credits: "Client name or personal project",   // optional
  color: "#1a1a2e",
  technologies: ["Cinema 4D", "Redshift"],
  layout: "landscape",
  featured: true,
}
```

> **That's it.** The project card and detail page render automatically. No React files to touch.

---

## Project Fields Reference

| Field          | Required | Type                     | Description                                        |
|----------------|----------|--------------------------|----------------------------------------------------|
| `id`           | yes      | string                   | Unique identifier. Same as `slug` for simplicity.  |
| `slug`         | yes      | string                   | URL path + folder name. Lowercase, hyphens only.   |
| `title`        | yes      | string                   | Display name. Any case, any characters.            |
| `category`     | yes      | string                   | Shown under title on card and detail page.         |
| `year`         | yes      | string                   | Display year.                                      |
| `description`  | yes      | `{ en: string, ru: string }` | Short blurb — English and Russian variants.   |
| `thumbnail`    | yes      | string                   | Path to card thumbnail. Empty `""` shows title as fallback. |
| `cover`        | yes      | string                   | Path to hero image on project detail page.         |
| `gallery`      | yes      | string[]                 | Paths to gallery images. Can be `[]`.              |
| `video`        | no       | string                   | Path to preview video. Replaces `cover` if set.    |
| `videoAspect`  | no       | string                   | Aspect ratio of the video (e.g. `"16/9"`, `"9/16"`, `"4/3"`, `"1/1"`, `"21/9"`). Card and detail page adapt automatically. Falls back to layout default if not set. |
| `overview`     | yes      | `{ en: string, ru: string }` | Main description — English and Russian variants.   |
| `credits`      | no       | string                   | Shown below overview (e.g. "Client: Nike").        |
| `color`        | yes      | string                   | Hex background color for card and detail hero area.|
| `technologies` | yes      | string[]                 | List of tools used. Displayed as tags. Can be `[]`.|
| `layout`       | yes      | LayoutType               | Controls card size and grid position (see below).  |
| `featured`     | yes      | boolean                  | `true` = shown on homepage grid. `false` = hidden from grid but page still works at `/projects/{slug}`. |

---

## Supported Layouts

Layout determines the card's **aspect ratio**, **grid column span**, and **minimum height**.

| Layout      | Aspect Ratio | Grid Columns  | Min Height | Best for                         |
|-------------|-------------|---------------|------------|----------------------------------|
| `hero`      | 16:9        | full width    | 70vh       | Showreel-style hero cards        |
| `wide`      | 21:9        | full width    | 50vh       | Cinematic / landscape projects   |
| `landscape` | 4:3         | 2 columns     | auto       | Standard video / photo projects  |
| `square`    | 1:1         | 1 column      | auto       | Instagram-style content          |
| `portrait`  | 3:4         | 1 column      | auto       | Vertical / mobile content        |
| `tall`      | 9:16        | 1 column      | auto       | TikTok / Reels / vertical video  |

The grid is **3 columns** with `grid-auto-flow: dense`. Tall and portrait items fill gaps automatically.

---

## Supported Formats

### Images

| Format | Recommended | Notes                        |
|--------|-------------|------------------------------|
| WebP   | **yes**     | Best quality/size ratio      |
| JPEG   | fallback    | Use only if WebP unavailable |
| PNG    | fallback    | Use only if WebP unavailable |

### Videos

| Format | Codec       | Recommended | Notes                     |
|--------|-------------|-------------|---------------------------|
| MP4    | H.264       | **yes**     | Best browser support      |
| WebM   | VP9         | alternative | Smaller file, less support|

---

## Recommended Sizes

| Usage           | Recommended Resolution | Aspect Ratio |
|-----------------|------------------------|--------------|
| `cover.webp`    | 1920×1080              | 16:9         |
| `preview.mp4`   | 1920×1080              | 16:9         |
| Gallery images  | 1920×1080 or up        | any          |
| Card thumbnail  | Same as cover.webp     | depends on layout |

> Videos are displayed as 16:9 on the detail page regardless of layout. Videos autoplay only when visible in the viewport and pause when scrolled away.

---

## Thumbnail Recommendations

- **Use the first gallery image** as the thumbnail path whenever possible
- Keep thumbnails under 500 KB for fast loading
- If no thumbnail is set (`""`), the card shows the project title and category as centered text (usable placeholder)
- Cards use `object-fit: cover` — images are cropped to fit the aspect ratio, not distorted
- Images use `loading="lazy"` — modern browsers handle optimization automatically

---

## Naming Conventions

| Item              | Convention                    | Example                      |
|-------------------|-------------------------------|------------------------------|
| Slug              | kebab-case                    | `ai-human`, `my-project`     |
| Cover image       | `cover.webp`                  | `cover.webp`                 |
| Preview video     | `preview.mp4`                 | `preview.mp4`                |
| Gallery images    | `01.webp`, `02.webp`, …       | `03.webp`                    |
| Gallery folder    | `gallery/`                    | `gallery/`                   |
| Parent folder     | matches slug                  | `public/projects/ai-human/` |

---

## English & Russian Content

Every project stores `description` and `overview` in both English and Russian:

```ts
description: {
  en: "AI-assisted product commercial",
  ru: "AI-продакшн продукта",
},
overview: {
  en: "Full description in English…",
  ru: "Полное описание на русском…",
},
```

The page automatically shows the correct language based on the user's selected locale. Keep both translations in sync when updating content.

---

## Adding a Video to an Existing Project

1. Place `preview.mp4` in `public/projects/{slug}/`
2. In `src/data/projects.ts`, add (or uncomment) the `video` field:

```ts
video: "/projects/{slug}/preview.mp4",
```

3. The video replaces the cover image automatically on the detail page.
4. Videos autoplay muted when visible in the viewport and pause when scrolled away.

---

## Adding Gallery Images

1. Place images in `public/projects/{slug}/gallery/`
2. Update the `gallery` array in `src/data/projects.ts`:

```ts
gallery: [
  "/projects/{slug}/gallery/01.webp",
  "/projects/{slug}/gallery/02.webp",
],
```

3. Gallery images use `loading="lazy"` and display in a responsive grid.

---

## Making a Project Invisible from the Grid

Set `featured: false`. The project page still works at `/projects/{slug}` — useful for hidden portfolio pieces or WIP pages.

---

## Best Practices

- **Compress images** to WebP format before uploading. Aim for < 300 KB per gallery image.
- **Compress videos** with H.264: `ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k output.mp4`
- **Keep videos short** — 15–30 seconds is ideal for a project preview.
- **Thumbnails first** — always set `thumbnail` to the first gallery image or a dedicated card image.
- **Both languages** — always fill in both `en` and `ru` for `description` and `overview`.
- **Technologies** — only list tools actually used in the project. Displayed as tags on the detail page.
- **Slug uniqueness** — never reuse a slug. If a project is removed, don't reuse its slug for a new one.
- **Run `npm run build`** — always verify the build passes before deploying.

---

## Quick Checklist

- [ ] `id` and `slug` match (kebab-case, lowercase)
- [ ] Folder created at `public/projects/{slug}/`
- [ ] `cover.webp` exists (or `preview.mp4`)
- [ ] Gallery images numbered `01.webp`, `02.webp`, …
- [ ] Entry added to `projects` array in `src/data/projects.ts`
- [ ] Both `en` and `ru` filled for `description` and `overview`
- [ ] `technologies` array filled
- [ ] `featured: true` if it should show on homepage
- [ ] `color` is a valid hex color
- [ ] Run `npm run build` to verify no errors
