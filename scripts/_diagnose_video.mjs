#!/usr/bin/env node
/**
 * Deep diagnostic: checks each video for rotation metadata, SAR, and
 * other details that could cause videoWidth/videoHeight to differ
 * from the stsd-parsed dimensions.
 *
 * Usage: node scripts/_diagnose_video.mjs
 */

import { readFileSync } from "fs"
import { join } from "path"

const PROJECTS_DIR = join(import.meta.dirname, "..", "public", "projects")
const slugs = ["playrix", "trading-platform", "dexter", "mobile-device", "demiand", "jdm", "obsidian-oni"]

// Read mp4 boxes recursively, collecting ALL box info
function parseBoxes(buf, start, end, depth = 0) {
  const boxes = []
  let off = start
  while (off < end - 8) {
    const size = buf.readUInt32BE(off)
    const type = buf.toString("ascii", off + 4, off + 8)
    if (size < 8 || off + size > end) break
    const box = { type, offset: off, size, depth, children: [] }
    // Parse children for container boxes
    if (["moov", "trak", "mdia", "minf", "stbl", "udta", "meta", "ilst"].includes(type) ||
        type === "moof" || type === "traf" || type === "edts") {
      box.children = parseBoxes(buf, off + 8, off + size, depth + 1)
    }
    boxes.push(box)
    off += size
  }
  return boxes
}

function findBox(boxes, type) {
  for (const b of boxes) {
    if (b.type === type) return b
    const found = findBox(b.children, type)
    if (found) return found
  }
  return null
}

function findAll(boxes, type) {
  const results = []
  for (const b of boxes) {
    if (b.type === type) results.push(b)
    results.push(...findAll(b.children, type))
  }
  return results
}

for (const slug of slugs) {
  const filePath = join(PROJECTS_DIR, slug, "preview.mp4")
  console.log(`\n========== ${slug} ==========`)

  try {
    const buf = readFileSync(filePath)
    const boxes = parseBoxes(buf, 0, buf.length)
    
    // Get all trak boxes
    const traks = findAll(boxes, "trak")
    
    for (let t = 0; t < traks.length; t++) {
      const trak = traks[t]
      
      // Check tkhd for dimensions and rotation
      const tkhd = findBox(trak.children, "tkhd")
      if (!tkhd) continue
      
      const ver = buf.readUInt8(tkhd.offset + 8)
      const tkhdDataStart = tkhd.offset + (ver === 0 ? 12 : 20) // skip version+flags and creation/modification times
      
      // tkhd structure (version 0):
      // 0-3: creation_time (32-bit)
      // 4-7: modification_time
      // 8-11: track_id
      // 12-15: reserved
      // 16-19: duration
      // 20-23: reserved
      // 24-27: reserved
      // 28-35: layer + alternate_group + volume + reserved
      // 36-71: matrix (36 bytes = 9 × 32-bit fixed-point)
      // 72-75: width (32-bit fixed-point 16.16)
      // 76-79: height (32-bit fixed-point 16.16)
      
      // Actually let's read properly
      let tkhdOff
      if (ver === 0) {
        // version 0: 84 bytes fixed header
        tkhdOff = tkhd.offset + 20 // skip 12 bytes (header size/flags/version) + creation_time + modification_time
        // Actually let me recompute
        // tkhd version 0: 
        // 4 bytes version+flags (offset +8 to +11)
        // 4 bytes creation_time (offset +12)
        // 4 bytes modification_time (offset +16)
        // 4 bytes track_id (offset +20)
        // 4 bytes reserved (offset +24)
        // 4 bytes duration (offset +28)
        // 8 bytes reserved (offset +32)
        // 2 bytes layer (offset +40)
        // 2 bytes alternate_group (offset +42)
        // 2 bytes volume (offset +44)
        // 2 bytes reserved (offset +46)
        // 36 bytes matrix (offset +48 to +83)
        // 4 bytes width (offset +84)
        // 4 bytes height (offset +88)
        const wFixed = buf.readUInt32BE(tkhd.offset + 84)
        const hFixed = buf.readUInt32BE(tkhd.offset + 88)
        const wDisplay = wFixed >> 16
        const hDisplay = hFixed >> 16
        
        // Read matrix (9 × 32-bit fixed-point 16.16)
        const matrix = []
        for (let i = 0; i < 9; i++) {
          const raw = buf.readInt32BE(tkhd.offset + 48 + i * 4)
          matrix.push(raw / 65536) // values in 16.16 signed fixed-point
        }
        // Matrix is:
        // [a, b, u]
        // [c, d, v]
        // [x, y, w]
        // For 90° rotation: a=0, b=65536, c=-65536, d=0 (or a=0, b=-65536, c=65536, d=0)
        const a = matrix[0], b = matrix[1], c = matrix[3], d = matrix[4]
        
        // Check if there's rotation
        const isRotated = Math.abs(a) < 0.5 && Math.abs(d) < 0.5 && Math.abs(b) > 0.5 && Math.abs(c) > 0.5
        const is90 = isRotated && b > 0 && c < 0
        const is270 = isRotated && b < 0 && c > 0
        
        console.log(`  Track ${t}:`)
        console.log(`    tkhd display dims: ${wDisplay}×${hDisplay}`)
        console.log(`    Matrix: a=${a.toFixed(4)}, b=${b.toFixed(4)}, c=${c.toFixed(4)}, d=${d.toFixed(4)}`)
        
        if (isRotated) {
          console.log(`    ⚠ ROTATION DETECTED: ${is90 ? '90°' : '270°'} CCW`)
          console.log(`    → videoWidth/videoHeight would be ${is90 ? hDisplay : wDisplay}×${is90 ? wDisplay : hDisplay}`)
        } else {
          console.log(`    ✓ No rotation (identity matrix)`)
        }

        // Check stsd dims (the ones we use)
        const stbl = findBox(trak.children, "stbl")
        if (stbl) {
          const stsd = findBox(stbl.children, "stsd")
          if (stsd) {
            const dataStart = stsd.offset + 8
            const entryCount = buf.readUInt32BE(dataStart + 4)
            if (entryCount > 0) {
              const entryStart = dataStart + 8
              const sWidth = buf.readUInt16BE(entryStart + 32)
              const sHeight = buf.readUInt16BE(entryStart + 34)
              console.log(`    stsd coded dims: ${sWidth}×${sHeight}`)
              
              // Compare
              if (sWidth !== wDisplay || sHeight !== hDisplay) {
                console.log(`    ⚠ MISMATCH: stsd (${sWidth}×${sHeight}) ≠ tkhd (${wDisplay}×${hDisplay})`)
              }
            }
          }
        }
      }
    }
  } catch (e) {
    console.log(`  ERROR: ${e.message}`)
  }
}

console.log("\nDone.")
