import { chromium } from "@playwright/test"

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
  })
  const page = await context.newPage()

  await page.goto("http://localhost:3459", { waitUntil: "networkidle" })
  
  // Ensure dark theme
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark")
  })
  
  // Scroll to project grid and wait for videos to load
  const gridTop = await page.evaluate(() => {
    const grid = document.querySelector(".project-grid")
    if (!grid) return 0
    return grid.getBoundingClientRect().top + window.scrollY
  })
  
  await page.evaluate((top) => window.scrollTo(0, top - 100), gridTop)
  await page.waitForTimeout(3000) // Wait for IntersectionObserver + video load
  
  // Now pixel-scan each card
  const cardAnalysis = await page.evaluate(() => {
    const cards = document.querySelectorAll(".project-card-media")
    const results = []
    
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect()
      const video = card.querySelector("video")
      const vReady = video?.readyState || 0
      const vw = video?.videoWidth || 0
      const vh = video?.videoHeight || 0
      
      // The card background color
      const cardBg = window.getComputedStyle(card).backgroundColor
      
      // Check the background color of the video element
      const vidBg = video ? window.getComputedStyle(video).backgroundColor : "no-video"
      
      // Get video object-fit
      const objFit = video ? window.getComputedStyle(video).objectFit : "no-video"
      
      // Check if card dimensions match video display area
      // (Aspect ratio from computed style)
      const aspectCSS = window.getComputedStyle(card).aspectRatio
      
      results.push({
        index: i,
        rect: { w: rect.width.toFixed(1), h: rect.height.toFixed(1) },
        aspectCSS,
        actualAspect: (rect.width / rect.height).toFixed(4),
        cardBg,
        vidBg,
        objFit,
        vReady,
        vw,
        vh,
        expectedAspect: vw > 0 && vh > 0 ? (vw / vh).toFixed(4) : "no-video-data",
      })
    })
    
    return results
  })
  
  console.log("=== CARD ANALYSIS (scrolled to grid, waited 3s) ===")
  console.log(JSON.stringify(cardAnalysis, null, 2))
  
  // Now do a pixel-level edge check on the first visible card
  // Check if there's any non-video pixel showing at the 4 edges
  const edgeCheck = await page.evaluate(() => {
    const card = document.querySelector(".project-card-media")
    if (!card) return { error: "no card" }
    
    const rect = card.getBoundingClientRect()
    const video = card.querySelector("video")
    if (!video) return { error: "no video" }
    
    const vRect = video.getBoundingClientRect()
    
    // Check if video element exactly covers card
    return {
      card: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
      video: { x: vRect.x, y: vRect.y, w: vRect.width, h: vRect.height },
      overlap: {
        x: Math.abs(rect.x - vRect.x),
        y: Math.abs(rect.y - vRect.y),
        w: Math.abs(rect.width - vRect.width),
        h: Math.abs(rect.height - vRect.height),
      },
      cardComputed: {
        padding: window.getComputedStyle(card).padding,
        border: window.getComputedStyle(card).border,
        display: window.getComputedStyle(card).display,
      },
      videoComputed: {
        display: window.getComputedStyle(video).display,
        width: window.getComputedStyle(video).width,
        height: window.getComputedStyle(video).height,
        "object-fit": window.getComputedStyle(video).objectFit,
      }
    }
  })
  
  console.log("\n=== EDGE CHECK (first card) ===")
  console.log(JSON.stringify(edgeCheck, null, 2))
  
  // Check what happens when hover - does the overlay create a visible border?
  const hoverCheck = await page.evaluate(() => {
    const link = document.querySelector(".project-card")
    if (!link) return { error: "no link" }
    
    // Before hover - check overlay styles
    const overlay = link.querySelector(".project-card-overlay")
    const overlayBefore = overlay ? window.getComputedStyle(overlay) : null
    
    // Trigger hover
    link.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }))
    
    // After brief wait
    return new Promise(resolve => {
      setTimeout(() => {
        const overlayAfter = overlay ? window.getComputedStyle(overlay) : null
        resolve({
          overlayBefore: overlayBefore ? { opacity: overlayBefore.opacity, bg: overlayBefore.backgroundColor } : "no-overlay",
          overlayAfter: overlayAfter ? { opacity: overlayAfter.opacity, bg: overlayAfter.backgroundColor } : "no-overlay",
        })
      }, 500)
    })
  })
  
  console.log("\n=== HOVER CHECK ===")
  console.log(JSON.stringify(hoverCheck, null, 2))
  
  await browser.close()
}

main().catch(e => {
  console.error("Error:", e)
  process.exit(1)
})
