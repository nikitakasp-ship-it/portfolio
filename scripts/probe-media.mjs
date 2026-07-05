#!/usr/bin/env node

/**
 * probe-media.mjs
 *
 * Scans public/projects/ subdirectories for .mp4, .jpg, .jpeg, .png files.
 * Detects real pixel dimensions and computes normalized aspect ratios.
 *
 * Videos: ffprobe (if available) → pure Node.js MP4 parser (fallback)
 * Images: image-size npm package
 *
 * Outputs: src/data/media-ratios.json
 *
 * Usage: node scripts/probe-media.mjs
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs"
import { join, extname } from "path"
import { execFileSync } from "child_process"
import { imageSize } from "image-size"

const PROJECTS_DIR = join(import.meta.dirname, "..", "public", "projects")
const OUTPUT_FILE = join(import.meta.dirname, "..", "src", "data", "media-ratios.json")

const VIDEO_EXTS = new Set([".mp4", ".mov", ".webm"])
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"])

// ── GCD for normalizing ratios ──────────────────────────────────────────────

function gcd(a, b) {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}

function normalizeRatio(w, h) {
  const d = gcd(w, h)
  return `${w / d}:${h / d}`
}

// ── Video: try ffprobe first, fallback to MP4 atom parsing ──────────────────

function probeVideoFfprobe(filePath) {
  try {
    const out = execFileSync("ffprobe", [
      "-v", "error",
      "-select_streams", "v:0",
      "-show_entries", "stream=width,height",
      "-of", "json",
      filePath,
    ], { timeout: 10000, stdio: ["pipe", "pipe", "pipe"] })
    const json = JSON.parse(out.toString())
    const stream = json.streams?.[0]
    if (stream?.width && stream?.height) {
      return { width: stream.width, height: stream.height }
    }
  } catch {
    // ffprobe not available or failed
  }
  return null
}

// Pure Node.js MP4 parser (no external deps)
function findBoxes(buf, start, end, target) {
  const results = []
  let off = start
  while (off < end - 8) {
    const size = buf.readUInt32BE(off)
    const type = buf.toString("ascii", off + 4, off + 8)
    if (size < 8) break
    if (type === target) results.push({ offset: off, size })
    if (["moov", "trak", "mdia", "minf", "stbl"].includes(type)) {
      results.push(...findBoxes(buf, off + 8, off + size, target))
    }
    off += size
  }
  return results
}

const VIDEO_CODECS = new Set(["avc1", "avc2", "avc3", "avc4", "hvc1", "hev1", "hvc2", "mp4v"])

function probeVideoMp4(filePath) {
  try {
    const buf = readFileSync(filePath)
    const len = buf.length

    // Find moov → trak → stbl → stsd → codec entry
    const moovs = findBoxes(buf, 0, len, "moov")
    if (moovs.length === 0) return null

    const traks = findBoxes(buf, moovs[0].offset + 8, moovs[0].offset + moovs[0].size, "trak")

    for (const trak of traks) {
      const stsds = findBoxes(buf, trak.offset + 8, trak.offset + trak.size, "stsd")
      for (const stsd of stsds) {
        const dataStart = stsd.offset + 8
        const entryCount = buf.readUInt32BE(dataStart + 4)
        if (entryCount === 0) continue
        const entryStart = dataStart + 8
        if (entryStart + 36 > len) continue
        const entryType = buf.toString("ascii", entryStart + 4, entryStart + 8)
        if (VIDEO_CODECS.has(entryType)) {
          const width = buf.readUInt16BE(entryStart + 32)
          const height = buf.readUInt16BE(entryStart + 34)
          if (width > 0 && height > 0) return { width, height }
        }
      }
    }

    // Fallback: tkhd
    for (const trak of traks.reverse()) {
      const tkhds = findBoxes(buf, trak.offset + 8, trak.offset + trak.size, "tkhd")
      if (tkhds.length === 0) continue
      const tkhd = tkhds[0]
      const ver = buf.readUInt8(tkhd.offset + 8)
      const w = buf.readUInt32BE(tkhd.offset + (ver === 0 ? 84 : 96)) >> 16
      const h = buf.readUInt32BE(tkhd.offset + (ver === 0 ? 88 : 100)) >> 16
      if (w > 0 && h > 0) return { width: w, height: h }
    }
  } catch { /* skip */ }
  return null
}

function probeVideo(filePath) {
  return probeVideoFfprobe(filePath) || probeVideoMp4(filePath)
}

// ── Image dimensions via image-size ─────────────────────────────────────────

function probeImage(filePath) {
  try {
    const dims = imageSize(filePath)
    if (dims.width && dims.height) {
      return { width: dims.width, height: dims.height }
    }
  } catch { /* skip */ }
  return null
}

// ── Main ────────────────────────────────────────────────────────────────────

const ratios = {}
let detected = 0

for (const dir of readdirSync(PROJECTS_DIR)) {
  const projectDir = join(PROJECTS_DIR, dir)
  if (!existsSync(projectDir)) continue

  const files = readdirSync(projectDir)
  for (const file of files) {
    const ext = extname(file).toLowerCase()
    const filePath = join(projectDir, file)
    if (!existsSync(filePath)) continue

    let dims = null
    if (VIDEO_EXTS.has(ext)) {
      dims = probeVideo(filePath)
    } else if (IMAGE_EXTS.has(ext)) {
      dims = probeImage(filePath)
    }

    if (dims) {
      const ratio = normalizeRatio(dims.width, dims.height)
      if (!ratios[dir]) ratios[dir] = {}
      // key = filename without extension
      const key = file.replace(/\.[^.]+$/, "")
      ratios[dir][key] = {
        width: dims.width,
        height: dims.height,
        ratio,
      }
      detected++
      console.log(`  ${dir}/${file}: ${dims.width}×${dims.height} → ${ratio}`)
    }
  }
}

writeFileSync(OUTPUT_FILE, JSON.stringify(ratios, null, 2) + "\n")
console.log(`\n[probe-media] Detected ${detected} files → ${OUTPUT_FILE}`)
