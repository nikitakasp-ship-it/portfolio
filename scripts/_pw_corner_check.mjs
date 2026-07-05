import { chromium } from "@playwright/test"

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
  })
  const page = await context.newPage()

  await page.goto("http://localhost:3459", { waitUntil: "networkidle" })
  
  // Scroll to grid
  const gridTop = await page.evaluate(() => {
    const grid = document.querySelector(".project-grid")
    if (!grid) return 0
    return grid.getBoundingClientRect().top + window.scrollY
  })
  
  await page.evaluate((top) => window.scrollTo(0, top - 100), gridTop)
  await page.waitForTimeout(3000)
  
  // Now pixel-sample at the 4 corners of each card
  // Also sample the grid background between cards
  const pixelSample = await page.evaluate(() => {
    const cards = document.querySelectorAll(".project-card-media")
    const results = []
    
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect()
      
      // Sample pixel at each corner (inset by 2px to avoid anti-aliasing edge)
      function getPixel(x, y) {
        // Get pixel color at document coordinates
        // We use a canvas approach - draw the area and read pixel
        return { x, y }
      }
      
      // Use an off-screen canvas to get pixel data
      const canvas = document.createElement("canvas")
      canvas.width = rect.width
      canvas.height = rect.height
      const ctx = canvas.getContext("2d")
      // Draw the card region into the canvas
      ctx.drawWindow(window, rect.left, rect.top, rect.width, rect.height, canvas.width, canvas.height)
      // ^^ drawWindow is non-standard, let's try a different approach
      
      // Alternative: just record the rect info
      results.push({
        index: i,
        rect: { l: rect.left, t: rect.top, w: rect.width.toFixed(1), h: rect.height.toFixed(1) },
      })
    })
    
    return results
  })
  
  console.log("Pixel sample:", JSON.stringify(pixelSample, null, 2))
  
  // Alternative approach: take screenshots of individual cards and analyze
  // Let me just check if there's any visible difference between card and video edges
  const edgeInfo = await page.evaluate(() => {
    const cards = document.querySelectorAll(".project-card-media")
    const info = []
    
    for (let i = 0; i < 2; i++) {
      const card = cards[i]
      if (!card) continue
      const video = card.querySelector("video")
      if (!video) continue
      
      const cardCS = window.getComputedStyle(card)
      const videoCS = window.getComputedStyle(video)
      const cardRect = card.getBoundingClientRect()
      const videoRect = video.getBoundingClientRect()
      
      // Check if overlay contributes to any visible border
      const overlay = card.querySelector(".project-card-overlay")
      const overlayCS = overlay ? window.getComputedStyle(overlay) : null
      
      // Read the computed style of the card element for any box-shadow, outline, etc.
      info.push({
        index: i,
        cardShadow: cardCS.boxShadow,
        cardOutline: cardCS.outline,
        outlineColor: cardCS.outlineColor,
        outlineWidth: cardCS.outlineWidth,
        overflow: cardCS.overflow,
        cardBorderRadius: cardCS.borderRadius,
        overlayPosition: overlayCS?.position,
        overlayInset: overlayCS?.inset || overlayCS?.top,
        overlayBg: overlayCS?.backgroundImage || overlayCS?.backgroundColor,
      })
    }
    
    return info
  })
  
  console.log("\nEdge info:", JSON.stringify(edgeInfo, null, 2))
  
  // Check the grid background in the gap areas
  const gapCheck = await page.evaluate(() => {
    const grid = document.querySelector(".project-grid")
    if (!grid) return null
    
    const gridRect = grid.getBoundingClientRect()
    const canvas = document.createElement("canvas")
    canvas.width = gridRect.width
    canvas.height = 100 // just check a strip
    const ctx = canvas.getContext("2d")
    
    return { gridRect: { x: gridRect.x, w: gridRect.w, h: gridRect.h } }
  })
  
  console.log("\nGap check:", JSON.stringify(gapCheck, null, 2))
  
  await browser.close()
}

main().catch(e => {
  console.error("Error:", e)
  process.exit(1)
})
