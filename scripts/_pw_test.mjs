import { chromium } from "@playwright/test"
import { writeFileSync } from "fs"

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  // Set viewport to desktop size
  await page.setViewportSize({ width: 1440, height: 900 })
  
  // Navigate to homepage
  await page.goto("http://localhost:3459", { waitUntil: "networkidle" })
  
   // Wait for videos to potentially load
  await page.waitForTimeout(5000)
  
  // Check WHAT the IntersectionObserver sees
  const ioDiagnostics = await page.evaluate(() => {
    const videos = document.querySelectorAll("video")
    const info = []
    videos.forEach((v, i) => {
      const rect = v.getBoundingClientRect()
      info.push({
        index: i,
        hasSrc: !!v.src,
        src: v.src ? v.src.split("/").slice(-3).join("/") : "none",
        readyState: v.readyState,
        videoWidth: v.videoWidth,
        videoHeight: v.videoHeight,
        preload: v.preload,
        inViewport: rect.top < window.innerHeight && rect.bottom > 0,
        rect: { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right },
      })
    })
    return info
  })
  console.log("=== Video IO state ===")
  console.log(JSON.stringify(ioDiagnostics, null, 2))
  
  // Run diagnostics
  const results = await page.evaluate(() => {
    const cards = document.querySelectorAll(".project-card-media")
    const diagnostics = []
    
    cards.forEach((card, i) => {
      const video = card.querySelector("video")
      const rect = card.getBoundingClientRect()
      const vRect = video ? video.getBoundingClientRect() : null
      
      // Get computed styles
      const cardStyle = window.getComputedStyle(card)
      const videoStyle = video ? window.getComputedStyle(video) : null
      
      diagnostics.push({
        index: i,
        cardAspect: cardStyle.aspectRatio,
        cardDimensions: `${rect.width.toFixed(1)}×${rect.height.toFixed(1)}`,
        videoDimensions: vRect ? `${vRect.width.toFixed(1)}×${vRect.height.toFixed(1)}` : "no video",
        cardBg: cardStyle.backgroundColor,
        videoObjectFit: videoStyle?.objectFit,
        videoWidth: video?.videoWidth || 0,
        videoHeight: video?.videoHeight || 0,
        videoAspect: video ? (video.videoWidth / video.videoHeight).toFixed(4) : "no video",
        containerAspect: (rect.width / rect.height).toFixed(4),
        widthMatch: vRect ? Math.abs(vRect.width - rect.width) < 1 : "N/A",
        heightMatch: vRect ? Math.abs(vRect.height - rect.height) < 1 : "N/A",
        videoSrc: video?.src?.split("/").slice(-3).join("/") || "none",
        videoReadyState: video?.readyState ?? -1,
        inViewport: rect.top < window.innerHeight && rect.bottom > 0,
      })
    })
    
    return diagnostics
  })
  
  console.log(JSON.stringify(results, null, 2))
  
  // Take a screenshot for visual inspection
  await page.screenshot({ path: "scripts/_screenshot.png", fullPage: true })
  console.log("\nScreenshot saved!")
  
  // Now test the project detail page
  for (const slug of ["playrix", "demiand", "dexter"]) {
    console.log(`\n========== ${slug} detail page ==========`)
    await page.goto(`http://localhost:3459/projects/${slug}`, { waitUntil: "networkidle" })
    await page.waitForTimeout(3000)
    
    const detailResults = await page.evaluate(() => {
      const containers = document.querySelectorAll("[style*='aspect-ratio']")
      const res = []
      containers.forEach((el, i) => {
        const style = window.getComputedStyle(el)
        const rect = el.getBoundingClientRect()
        const video = el.querySelector("video")
        
        res.push({
          index: i,
          aspectRatio: style.aspectRatio,
          dimensions: `${rect.width.toFixed(1)}×${rect.height.toFixed(1)}`,
          actRatio: (rect.width / rect.height).toFixed(4),
          hasVideo: !!video,
          vidObjFit: video ? window.getComputedStyle(video).objectFit : "N/A",
          vw: video?.videoWidth || 0,
          vh: video?.videoHeight || 0,
          bg: style.backgroundColor,
        })
      })
      return res
    })
    console.log(JSON.stringify(detailResults, null, 2))
  }
  
  await browser.close()
}

main().catch(e => {
  console.error("Error:", e)
  process.exit(1)
})
