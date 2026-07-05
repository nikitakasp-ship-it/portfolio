import { chromium } from "@playwright/test"

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
  })
  const page = await context.newPage()

  console.log("=== Opening LIVE site: https://kuspik.vercel.app ===")
  await page.goto("https://kuspik.vercel.app", { waitUntil: "networkidle", timeout: 30000 })

  // Verify dark theme
  const theme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"))
  console.log("Theme:", theme)

  // Scroll down to project grid
  const gridTop = await page.evaluate(() => {
    const grid = document.querySelector(".project-grid")
    if (!grid) return 0
    const rect = grid.getBoundingClientRect()
    return window.scrollY + rect.top
  })
  console.log("Grid top (absolute):", gridTop)

  // Scroll to grid with some offset, wait for IntersectionObserver to trigger
  await page.evaluate((top) => window.scrollTo(0, top - 100), gridTop)
  await page.waitForTimeout(5000)

  // Now do a comprehensive pulse check of every card
  const results = await page.evaluate(() => {
    const cards = document.querySelectorAll(".project-card-media")
    const data = []

    cards.forEach((card, i) => {
      const video = card.querySelector("video")
      const rect = card.getBoundingClientRect()
      const cs = window.getComputedStyle(card)
      const vs = video ? window.getComputedStyle(video) : null
      const vRect = video ? video.getBoundingClientRect() : null

      // Card background (this is what shows behind the video)
      const cardBg = cs.backgroundColor

      // Page background
      const pageBg = window.getComputedStyle(document.body).backgroundColor

      // Video background
      const videoBg = vs ? vs.backgroundColor : "no-video"

      // Video dimensions
      const vw = video?.videoWidth || 0
      const vh = video?.videoHeight || 0

      // Check if video fills card exactly
      let wDiff = -1, hDiff = -1
      if (vRect && rect) {
        wDiff = Math.round(Math.abs(vRect.width - rect.width) * 100) / 100
        hDiff = Math.round(Math.abs(vRect.height - rect.height) * 100) / 100
      }

      data.push({
        index: i,
        slug: card.querySelector("[class*='project-']")?.innerText?.toLowerCase() ||
              (video?.src?.split("/").slice(-3, -1)[0] || "unknown"),
        aspectCSS: cs.aspectRatio,
        cardBg,
        videoBg,
        pageBg,
        objectFit: vs?.objectFit,
        videoLoaded: vw > 0 && vh > 0,
        videoDims: `${vw}×${vh}`,
        widthDiff: wDiff,
        heightDiff: hDiff,
        cardRect: `${rect.width.toFixed(1)}×${rect.height.toFixed(1)}`,
      })
    })

    return data
  })

  console.log("\n=== CARD INSPECTION ===")
  console.log(JSON.stringify(results, null, 2))

  // Now PIXEL-SCAN the edges of SPECIFIC problem projects
  // playrix (green border), dexter/obsidian-oni (blue/face)
  console.log("\n=== PIXEL EDGE SCAN ===")
  
  const edgeScans = await page.evaluate(() => {
    const cards = document.querySelectorAll(".project-card-media")
    const scans = []

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i]
      const video = card.querySelector("video")
      if (!video) continue

      const rect = card.getBoundingClientRect()
      const vRect = video.getBoundingClientRect()

      // Draw each card into a canvas and sample the 4 edges
      // Look for any pixel mismatch between card edge color and adjacent pixel
      
      // We sample:
      // - The 4 corners of the card (if any non-video pixel is different from page bg)
      // - Check continuous edge runs

      // Use the card element itself and check its computed style
      const cs = window.getComputedStyle(card)

      // Check if the video element EXACTLY covers the card
      const exactMatch = Math.abs(rect.x - vRect.x) < 1 &&
                         Math.abs(rect.y - vRect.y) < 1 &&
                         Math.abs(rect.width - vRect.width) < 1 &&
                         Math.abs(rect.height - vRect.height) < 1

      // Check if there are any box-shadows, borders, outlines
      const extra = {
        boxShadow: cs.boxShadow,
        outline: cs.outline,
        border: cs.border,
        overflow: cs.overflow,
        position: cs.position,
        bg: cs.backgroundColor,
      }

      scans.push({
        index: i,
        exactMatch,
        rect: { x: Math.round(rect.x*100)/100, y: Math.round(rect.y*100)/100, w: Math.round(rect.width*100)/100, h: Math.round(rect.height*100)/100 },
        vRect: { x: Math.round(vRect.x*100)/100, y: Math.round(vRect.y*100)/100, w: Math.round(vRect.width*100)/100, h: Math.round(vRect.height*100)/100 },
        extra,
      })
    }

    return scans
  })

  console.log(JSON.stringify(edgeScans, null, 2))

  // FINAL VERDICT
  const allMatch = edgeScans.every(s => s.exactMatch)
  const allVideosLoaded = results.every(r => r.videoLoaded)
  const bgColors = [...new Set(results.map(r => r.cardBg))]
  const videoBgColors = [...new Set(results.map(r => r.videoBg))]
  const pageBg = results[0]?.pageBg

  console.log("\n=== VERDICT ===")
  console.log(`Page background: ${pageBg}`)
  console.log(`Card background colors: ${bgColors.join(", ")}`)
  console.log(`Video background: ${videoBgColors.join(", ")}`)
  console.log(`All videos loaded: ${allVideosLoaded}`)
  console.log(`All cards exact match: ${allMatch}`)
  
  if (allMatch && pageBg === bgColors[0]) {
    console.log("\n✅ PASS: Video fills container exactly, card bg matches page bg → no visible borders")
  } else if (allMatch) {
    console.log(`\n⚠ Video fills container, but card bg (${bgColors[0]}) ≠ page bg (${pageBg})`)
  } else {
    console.log("\n❌ FAIL: Card and video dimensions don't match")
  }

  await browser.close()
}

main().catch(e => {
  console.error("Error:", e)
  process.exit(1)
})
