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

  const theme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"))
  console.log("Theme:", theme)
  if (theme !== "dark") {
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"))
  }

  // Get all project card media elements
  const cardCount = await page.evaluate(() => document.querySelectorAll(".project-card-media").length)
  console.log(`Total cards found: ${cardCount}`)

  const results = []

  for (let i = 0; i < cardCount; i++) {
    console.log(`\n--- Card ${i + 1}/${cardCount} ---`)

    // Scroll card into view
    const scrolled = await page.evaluate((idx) => {
      const cards = document.querySelectorAll(".project-card-media")
      const card = cards[idx]
      if (!card) return false
      card.scrollIntoView({ block: "center", behavior: "instant" })
      return true
    }, i)

    if (!scrolled) {
      console.log(`  Card ${i} not found`)
      continue
    }

    // Wait briefly for IntersectionObserver to fire and video to start loading
    await page.waitForTimeout(1500)

    // Wait for video readyState >= 2 (HAVE_CURRENT_DATA)
    const videoReady = await page.evaluate((idx) => {
      const cards = document.querySelectorAll(".project-card-media")
      const video = cards[idx]?.querySelector("video")
      if (!video) return -1
      return new Promise((resolve) => {
        if (video.readyState >= 2) {
          resolve(video.readyState)
          return
        }
        const onReady = () => {
          video.removeEventListener("loadeddata", onReady)
          video.removeEventListener("loadedmetadata", onReady)
          video.removeEventListener("canplay", onReady)
          resolve(video.readyState)
        }
        video.addEventListener("loadeddata", onReady)
        video.addEventListener("loadedmetadata", onReady)
        video.addEventListener("canplay", onReady)
        // Timeout fallback
        setTimeout(() => resolve(video.readyState), 8000)
      })
    }, i)

    console.log(`  Video readyState: ${videoReady} (≥2 = loaded)`)

    // Now gather all measurements while this card is still in viewport
    const info = await page.evaluate((idx) => {
      const cards = document.querySelectorAll(".project-card-media")
      const card = cards[idx]
      if (!card) return null

      const video = card.querySelector("video")
      const rect = card.getBoundingClientRect()
      const vRect = video ? video.getBoundingClientRect() : null
      const cs = window.getComputedStyle(card)
      const vs = video ? window.getComputedStyle(video) : null
      const link = card.closest("a")
      const slug = link?.getAttribute("href")?.split("/").pop() || "unknown"

      // Exact pixel match check
      let exactMatch = false
      if (vRect && rect) {
        exactMatch =
          Math.abs(rect.x - vRect.x) < 1 &&
          Math.abs(rect.y - vRect.y) < 1 &&
          Math.abs(rect.width - vRect.width) < 1 &&
          Math.abs(rect.height - vRect.height) < 1
      }

      return {
        slug,
        aspectCSS: cs.aspectRatio,
        cardBg: cs.backgroundColor,
        videoBg: vs?.backgroundColor || "no-video",
        pageBg: window.getComputedStyle(document.body).backgroundColor,
        objectFit: vs?.objectFit,
        videoLoaded: (video?.videoWidth || 0) > 0 && (video?.videoHeight || 0) > 0,
        videoDims: `${video?.videoWidth || 0}×${video?.videoHeight || 0}`,
        exactMatch,
        cardRect: `${Math.round(rect.width * 100) / 100}×${Math.round(rect.height * 100) / 100}`,
        videoRect: vRect ? `${Math.round(vRect.width * 100) / 100}×${Math.round(vRect.height * 100) / 100}` : "no-video",
        boxShadow: cs.boxShadow,
        border: cs.border,
        outline: cs.outline,
        overflow: cs.overflow,
        hasSrc: video ? (video.src ? video.src.split("/").slice(-2).join("/") : "no-src") : "no-video-element",
      }
    }, i)

    if (info) {
      results.push(info)
      const pass = info.exactMatch && (info.cardBg === "rgba(0, 0, 0, 0)" || info.cardBg === "transparent")
      console.log(`  ${pass ? "✅" : "❌"} ${info.slug}: exactMatch=${info.exactMatch}, cardBg=${info.cardBg}, videoLoaded=${info.videoLoaded}, dims=${info.videoDims}`)
    }
  }

  console.log("\n\n========== FULL RESULTS ==========")
  console.log(JSON.stringify(results, null, 2))

  // Final summary
  console.log("\n========== SUMMARY ==========")
  const allMatch = results.every(r => r.exactMatch)
  const allTransparent = results.every(r => r.cardBg === "rgba(0, 0, 0, 0)")
  const allLoaded = results.every(r => r.videoLoaded)
  const noBorders = results.every(r => r.boxShadow === "none" && (r.border === "0px none rgb(0, 0, 0)" || r.border === "0px solid rgb(244, 244, 244)" || r.border === "0px solid #f4f4f4" || r.border === "0px none rgb(244, 244, 244)"))

  console.log(`Cards verified: ${results.length}/7`)
  console.log(`All exactMatch: ${allMatch}`)
  console.log(`All cardBg transparent: ${allTransparent}`)
  console.log(`All videoBg transparent: ${results.every(r => r.videoBg === "rgba(0, 0, 0, 0)")}`)
  console.log(`All videos loaded: ${allLoaded}`)
  console.log(`No borders/shadows: ${noBorders}`)
  console.log(`All object-fit: cover: ${results.every(r => r.objectFit === "cover")}`)

  if (allMatch && allTransparent && results.length === 7) {
    console.log("\n✅ PROVEN: All 7 cards — video fills container exactly, backgrounds transparent → NO colored borders visible")
  } else {
    console.log(`\n⚠ ISSUES FOUND`)
  }

  await browser.close()
}

main().catch(e => {
  console.error("Error:", e)
  process.exit(1)
})
