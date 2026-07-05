import { readFileSync } from "fs"
import { join } from "path"

const PROJECTS_DIR = join(import.meta.dirname, "..", "public", "projects")
const slugs = ["playrix", "trading-platform", "dexter", "mobile-device", "demiand", "jdm", "obsidian-oni"]

function scanBoxes(buf, offset, limit, target) {
  let off = offset
  const results = []
  while (off < limit - 8) {
    const size = buf.readUInt32BE(off)
    const type = buf.toString("ascii", off + 4, off + 8)
    if (size < 8 || off + size > limit) break
    if (type === target) {
      results.push({ offset: off, size })
    }
    // Recurse into containers
    if (["moov", "trak", "mdia", "minf", "stbl", "stsd", "udta", "meta", "ilst",
      "moof", "traf", "edts", "wave", "sinf", "schi", "avcC", "hvcC", "av1C"].includes(type)) {
      results.push(...scanBoxes(buf, off + 8, off + size, target))
    }
    off += size
  }
  return results
}

for (const slug of slugs) {
  const filePath = join(PROJECTS_DIR, slug, "preview.mp4")
  console.log(`\n========== ${slug} ==========`)
  
  try {
    const buf = readFileSync(filePath)
    
    // Check for pasp box
    const pasps = scanBoxes(buf, 0, buf.length, "pasp")
    if (pasps.length > 0) {
      for (const p of pasps) {
        const hSpacing = buf.readUInt32BE(p.offset + 8)
        const vSpacing = buf.readUInt32BE(p.offset + 12)
        const sar = hSpacing / vSpacing
        console.log(`  ⚠ PASP (Pixel Aspect Ratio): ${hSpacing}:${vSpacing} = ${sar.toFixed(4)} (${sar === 1 ? 'square' : 'NON-SQUARE!'})`)
        if (sar !== 1) console.log(`    → Display dimensions would be different from coded dimensions!`)
      }
    } else {
      console.log(`  ✓ No PASP box = square pixels (SAR 1:1)`)
    }

    // Check avcC or hvcC for explicit SAR
    const avcCs = scanBoxes(buf, 0, buf.length, "avcC")
    for (const avc of avcCs) {
      if (avc.size <= 10) continue
      // AVC configuration record
      const offset = avc.offset + 8
      const avcProfile = buf.readUInt8(offset + 1)
      const avcLevel = buf.readUInt8(offset + 3)
      const lengthSize = (buf.readUInt8(offset + 4) & 3) + 1
      // After SPS/PPS, the information is complex
      // For now just note the profile
      console.log(`  AVC Profile: ${avcProfile.toString(16)}`)
    }

    // Check tkhd for any SAR info
    const tkhds = scanBoxes(buf, 0, buf.length, "tkhd")
    for (const tkhd of tkhds) {
      const ver = buf.readUInt8(tkhd.offset + 8)
      const wOff = tkhd.offset + (ver === 0 ? 84 : 96)
      const hOff = tkhd.offset + (ver === 0 ? 88 : 100)
      const w = buf.readUInt32BE(wOff) >> 16
      const h = buf.readUInt32BE(hOff) >> 16

      // Read matrix
      const mOff = tkhd.offset + (ver === 0 ? 48 : 60)
      const a = buf.readInt32BE(mOff) / 65536
      const b = buf.readInt32BE(mOff + 4) / 65536
      const c = buf.readInt32BE(mOff + 12) / 65536
      const d = buf.readInt32BE(mOff + 16) / 65536
      const isRotated = Math.abs(a) < 0.5 && Math.abs(d) < 0.5 && Math.abs(b) > 0.5 && Math.abs(c) > 0.5

      if (w > 0 && h > 0) {
        console.log(`  tkhd track: ${w}×${h} (display dims)` + (isRotated ? " ⚠ ROTATED" : " ✓"))
      }
    }
  } catch (e) {
    console.log(`  ERROR: ${e.message}`)
  }
}
console.log("\nDone.")
