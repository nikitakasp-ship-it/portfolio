import sharp from "sharp"
import { readFileSync } from "fs"

async function analyze() {
  const buf = readFileSync("scripts/_screenshot.png")
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
  const w = info.width, h = info.height

  console.log("Screenshot dimensions:", w, "x", h)

  // Sample pixels along the left and right edges of cards
  // The first card (demiand) should be at roughly y=1236-1855
  // Let's scan horizontally at several y positions

  const scanRows = [1300, 1400, 1500, 2000, 3000, 5000]
  
  for (const y of scanRows) {
    if (y >= h) continue
    console.log(`\n--- Horizontal scan at y=${y} ---`)
    let output = ""
    for (let x = 0; x < w; x += 4) {
      const idx = (y * w + x) * 4
      const r = data[idx], g = data[idx+1], b = data[idx+2]
      // Classify pixel
      if (r < 30 && g < 30 && b < 30) output += "█"
      else if (r < 100 && g < 100 && b < 100) output += "▓"
      else if (r < 180 && g < 180 && b < 180) output += "▒"
      else if (r < 230 && g < 230 && b < 230) output += "░"
      else output += " "
    }
    console.log(output)
    // Show first 200 chars of the output
  }

  // Also check for any distinctly colored pixels (non gray-scale)
  let coloredPixels = 0
  let totalPixels = 0
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2]
    // A pixel is "colored" if the difference between any two channels is > 50
    // and it's not too dark (< 30) or too light (> 200)
    const maxDiff = Math.max(Math.abs(r-g), Math.abs(r-b), Math.abs(g-b))
    if (maxDiff > 50 && r > 30 && g > 30 && b > 30) {
      coloredPixels++
    }
    totalPixels++
  }
  console.log(`\nTotal pixels: ${totalPixels}, colored: ${coloredPixels} (${(coloredPixels/totalPixels*100).toFixed(2)}%)`)
}

analyze().catch(e => console.error(e))
