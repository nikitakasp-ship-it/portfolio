# Admin Guide — Portfolio Projects

Everything you need to add or update projects. No React knowledge required — edit one file and drop in media.

---

## Folder Structure

Each project lives in `public/projects/{slug}/`:

```
public/projects/
  {slug}/
    cover.webp       ← Cover image (shown on card & detail page)
    preview.mp4      ← Optional preview video (replaces cover on card)
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
  preview.mp4       (optional)
  gallery/
    01.webp         (optional)
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
  video: "/projects/nadi/preview.mp4",     // optional
  aspectRatio: "16:9",                     // required — controls card size & detail page
  overview: {
    en: "A longer paragraph describing the project in detail.",
    ru: "Длинное описание проекта на русском.",
  },
  credits: "Client name or personal project", // optional
  color: "#1a1a2e",
  technologies: ["Cinema 4D", "Redshift"],
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
| `description`  | yes      | `{ en, ru }`             | Short blurb — English and Russian variants.        |
| `thumbnail`    | yes      | string                   | Path to card image. Falls back to `cover` if empty.|
| `cover`        | yes      | string                   | Path to hero image on project detail page.         |
| `gallery`      | yes      | string[]                 | Paths to gallery images. Can be `[]`.              |
| `video`        | no       | string                   | Path to preview video. Autoplays on card when visible, pauses on scroll away. Replaces cover on card. |
| `aspectRatio`  | **yes**  | string                   | Native aspect ratio of the media. Controls card shape and grid position. See below. |
| `overview`     | yes      | `{ en, ru }`             | Main description — English and Russian variants.   |
| `credits`      | no       | string                   | Shown below overview (e.g. "Client: Nike").        |
| `color`        | yes      | string                   | Hex background color for card and detail hero area.|
| `technologies` | yes      | string[]                 | List of tools used. Displayed as tags. Can be `[]`.|
| `featured`     | yes      | boolean                  | `true` = shown on homepage grid. `false` = hidden from grid but page still works. |

---

## Supported Aspect Ratios

The `aspectRatio` field directly controls the card's shape and its column span in the grid.

| Aspect Ratio | Grid Columns | Visual        | Best for                         |
|--------------|-------------|---------------|----------------------------------|
| `21:9`       | 3 (full)    | Ultrawide      | Cinematic / wide landscape       |
| `16:9`       | 2           | Standard       | Most videos, horizontal content  |
| `4:3`        | 2           | Classic        | Standard photos, older footage   |
| `3:2`        | 2           | Photo          | Photography                      |
| `1:1`        | 1           | Square         | Instagram-style content          |
| `4:5`        | 1           | Portrait       | Vertical content                 |
| `3:4`        | 1           | Portrait       | Vertical content                 |
| `9:16`       | 1           | Tall           | TikTok / Reels / Shorts          |

The grid is **3 columns** with `grid-auto-flow: dense`. Wide items fill full width, standard items fill 2 columns, square/portrait items fill 1 column. Items automatically rearrange to fill gaps.

**Always use the project's native media aspect ratio.** Never stretch or squash artwork to fit a predefined card size.

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
| Card thumbnail  | Same as cover.webp     | depends on aspectRatio |

> Videos on the detail page display at the project's `aspectRatio`. Videos on the homepage grid autoplay muted when visible and pause when scrolled away.

---

## Thumbnail Recommendations

- Set `thumbnail` to the first gallery image or a dedicated card image
- If `thumbnail` is empty and `cover` exists, cover is used as fallback
- If a `video` exists, it autoplays on the card (muted, loop) — no thumbnail needed
- Keep images under 500 KB for fast loading
- Cards use `object-fit: cover` — images are cropped to fit the aspect ratio, not distorted
- If no image or video is available, the card shows title + category as placeholder

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
2. In `src/data/projects.ts`, add the `video` field:

```ts
video: "/projects/{slug}/preview.mp4",
```

3. The video replaces the cover image on the homepage card (autoplays muted when visible, pauses on scroll away) and on the detail page.
4. Update `aspectRatio` to match the video's native ratio if needed.

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

- **Use native aspect ratios** — the `aspectRatio` field should match your video or image's actual ratio
- **Wide content** (21:9) spans full width — use for your strongest cinematic work
- **Standard content** (16:9, 4:3) spans 2 columns — most projects should use this
- **Square/portrait** (1:1, 4:5, 9:16) spans 1 column — use for vertical or square content
- **Compress images** to WebP before uploading. Aim for < 300 KB per gallery image
- **Compress videos** with H.264: `ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k output.mp4`
- **Keep previews short** — 15–30 seconds is ideal for a card preview
- **Both languages** — always fill in both `en` and `ru` for `description` and `overview`
- **Run `npm run build`** — always verify the build passes before deploying

---

## Quick Checklist

- [ ] `id` and `slug` match (kebab-case, lowercase)
- [ ] Folder created at `public/projects/{slug}/`
- [ ] `cover.webp` exists (or `preview.mp4`)
- [ ] Gallery images numbered `01.webp`, `02.webp`, …
- [ ] `aspectRatio` matches the actual media ratio
- [ ] Both `en` and `ru` filled for `description` and `overview`
- [ ] `technologies` array filled
- [ ] `featured: true` if it should show on homepage
- [ ] `color` is a valid hex color
- [ ] Run `npm run build` to verify no errors
