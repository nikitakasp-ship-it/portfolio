import { chromium } from "@playwright/test"

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
  })
  const page = await context.newPage()

  await page.goto("http://localhost:3459", { waitUntil: "networkidle" })
  
  // Change to dark mode to match user's likely viewing environment
  // Actually the inline script auto-detects, but let's check the theme first
  const theme = await page.evaluate(() => {
    return document.documentElement.getAttribute("data-theme")
  })
  console.log("Current theme:", theme)

  // Now let's scroll down to the project grid and check layout
  await page.evaluate(() => window.scrollTo(0, 1200))
  await page.waitForTimeout(1000)

  // Take a screenshot of the grid section
  const gridEl = await page.$(".project-grid")
  if (gridEl) {
    await gridEl.screenshot({ path: "scripts/_grid_section.png" })
    console.log("Grid screenshot saved!")
  }

  // Check the actual computed styles of the first visible card
  const firstCardInfo = await page.evaluate(() => {
    const cards = document.querySelectorAll(".project-card-media")
    const info = []
    for (let i = 0; i < Math.min(cards.length, 2); i++) {
      const card = cards[i]
      const video = card.querySelector("video")
      const cs = window.getComputedStyle(card)
      const vs = video ? window.getComputedStyle(video) : null
      
      info.push({
        i,
        cardCSaspect: cs.aspectRatio,
        cardRect: card.getBoundingClientRect(),
        videoSrc: video?.src || "(no src)",
        videoReady: video?.readyState ?? -1,
        videoCSwidth: vs?.width,
        videoCSheight: vs?.height,
        videoObjFit: vs?.objectFit,
        videoElementWidth: video?.offsetWidth,
        videoElementHeight: video?.offsetHeight,
        // Check if video element fills card exactly
        widthDiff: video ? video.offsetWidth - card.offsetWidth : -1,
        heightDiff: video ? video.offsetHeight - card.offsetHeight : -1,
        // Check if video has any background color that might show
        videoBg: vs?.backgroundColor,
        cardBg: cs.backgroundColor,
        cardPos: cs.position,
      })
    }
    // Also check any visible "bars" or extra background areas
    const bodyBg = window.getComputedStyle(document.body).backgroundColor
    const mainBg = window.getComputedStyle(document.querySelector("main") || document.body).backgroundColor
    return { info, bodyBg, mainBg, gridGap: window.getComputedStyle(document.querySelector(".project-grid") || document.body).gap }
  })

  console.log(JSON.stringify(firstCardInfo, null, 2))

  await browser.close()
}

main().catch(e => {
  console.error("Error:", e)
  process.exit(1)
})
