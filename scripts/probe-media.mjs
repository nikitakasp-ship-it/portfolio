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

// ── WebM / Matroska (EBML) dimension parser ──────────────────────────────────

const EBML_CLUSTER = 0x1F43B675
const EBML_VIDEO = 0xE0
const EBML_PIXEL_WIDTH = 0xB0
const EBML_PIXEL_HEIGHT = 0xBA
const EBML_TRACK_ENTRY = 0xAE
const EBML_TRACKS = 0x1654AE6B
const EBML_SEGMENT = 0x18538067

function readEbmlVarInt(buf, off) {
  const first = buf.readUInt8(off)
  let len = 0
  let mask = 0x80
  while (mask > 0 && !(first & mask)) {
    mask >>= 1
    len++
  }
  if (mask === 0 || len > 7) return null
  let val = first & ~mask
  for (let i = 1; i <= len; i++) {
    val = (val << 8) | buf.readUInt8(off + i)
  }
  return { length: len + 1, value: val }
}

function readEbmlElementId(buf, off) {
  const first = buf.readUInt8(off)
  if (first === 0) return null // invalid: no leading 1 bit
  let len = 0
  let mask = 0x80
  while (mask > 0 && !(first & mask)) {
    mask >>= 1
    len++
  }
  if (mask === 0) return null
  return len + 1
}

// Skip past one EBML element (header + data). Returns the offset after the element, or null on failure.
function skipEbmlElement(buf, off, end) {
  if (off >= end) return null
  const idLen = readEbmlElementId(buf, off)
  if (!idLen || off + idLen >= end) return null
  off += idLen
  const size = readEbmlVarInt(buf, off)
  if (!size || off + size.length >= end) return null
  off += size.length
  const dataEnd = off + size.value
  if (dataEnd > end) return null
  return dataEnd
}

function probeVideoWebm(filePath) {
  try {
    const buf = readFileSync(filePath)
    if (buf.readUInt8(0) !== 0x1A) return null

    const len = buf.length

    let off = 0
    while (off < len) {
      const idLen = readEbmlElementId(buf, off)
      if (!idLen) { off++; continue }
      const id = buf.readUIntBE(off, idLen)
      off += idLen
      if (off >= len) break
      const size = readEbmlVarInt(buf, off)
      if (!size) break
      off += size.length
      const dataEnd = off + size.value
      if (dataEnd > len) break

      if (id === EBML_SEGMENT) {
        let soff = off
        while (soff < dataEnd) {
          const sidLen = readEbmlElementId(buf, soff)
          if (!sidLen) { soff++; continue }
          const sid = buf.readUIntBE(soff, sidLen)
          if (sid === EBML_CLUSTER) break
          soff += sidLen
          if (soff >= dataEnd) break
          const ssize = readEbmlVarInt(buf, soff)
          if (!ssize) break
          soff += ssize.length
          const sdataEnd = soff + ssize.value
          if (sdataEnd > dataEnd) break

          if (sid === EBML_TRACKS) {
            let toff = soff
            while (toff < sdataEnd) {
              const tidLen = readEbmlElementId(buf, toff)
              if (!tidLen) { toff++; continue }
              const tid = buf.readUIntBE(toff, tidLen)
              toff += tidLen
              if (toff >= sdataEnd) break
              const tsize = readEbmlVarInt(buf, toff)
              if (!tsize) break
              toff += tsize.length
              const tdataEnd = toff + tsize.value
              if (tdataEnd > sdataEnd) break

              if (tid === EBML_TRACK_ENTRY) {
                let eoff = toff
                let trackType = -1
                let pixelWidth = -1
                let pixelHeight = -1

                while (eoff < tdataEnd) {
                  const eidLen = readEbmlElementId(buf, eoff)
                  if (!eidLen) { eoff++; continue }
                  const eid = buf.readUIntBE(eoff, eidLen)
                  eoff += eidLen
                  if (eoff >= tdataEnd) break
                  const esize = readEbmlVarInt(buf, eoff)
                  if (!esize) break
                  eoff += esize.length
                  const edataEnd = eoff + esize.value
                  if (edataEnd > tdataEnd) break

                  if (eid === 0x83 && esize.value === 1) {
                    trackType = buf.readUInt8(eoff)
                  } else if (eid === EBML_VIDEO) {
                    let voff = eoff
                    while (voff < edataEnd) {
                      const vidLen = readEbmlElementId(buf, voff)
                      if (!vidLen) { voff++; continue }
                      const vid = buf.readUIntBE(voff, vidLen)
                      voff += vidLen
                      if (voff >= edataEnd) break
                      const vsize = readEbmlVarInt(buf, voff)
                      if (!vsize) break
                      voff += vsize.length
                      const vdataEnd = voff + vsize.value
                      if (vdataEnd > edataEnd) break

                      if (vid === EBML_PIXEL_WIDTH && vsize.value <= 4) {
                        pixelWidth = buf.readUIntBE(voff, vsize.value)
                      } else if (vid === EBML_PIXEL_HEIGHT && vsize.value <= 4) {
                        pixelHeight = buf.readUIntBE(voff, vsize.value)
                      }
                      voff = vdataEnd
                    }
                  }

                  eoff = edataEnd
                }

                if (trackType === 1 && pixelWidth > 0 && pixelHeight > 0) {
                  return { width: pixelWidth, height: pixelHeight }
                }
              }

              toff = tdataEnd
            }
          }

          soff = sdataEnd
        }
      }

      off = dataEnd
    }
  } catch { /* skip */ }
  return null
}

function probeVideo(filePath) {
  return probeVideoFfprobe(filePath) || probeVideoMp4(filePath) || probeVideoWebm(filePath)
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

const SCAN_SUBDIRS = ["additional", "behind-scenes"]

const ratios = {}
let detected = 0

for (const dir of readdirSync(PROJECTS_DIR)) {
  const projectDir = join(PROJECTS_DIR, dir)
  if (!existsSync(projectDir)) continue

  if (!ratios[dir]) ratios[dir] = {}

  // Scan root-level files (preview, hero, etc.)
  scanFiles(projectDir, "", dir)

  // Scan subdirectories (additional/, behind-scenes/)
  for (const subdir of SCAN_SUBDIRS) {
    const subPath = join(projectDir, subdir)
    if (existsSync(subPath)) {
      scanFiles(subPath, `${subdir}-`, dir)
    }
  }
}

function scanFiles(directory, keyPrefix, projectSlug) {
  // Collect all seen keys to skip duplicates (same name, different ext)
  const seenKeys = new Set(Object.keys(ratios[projectSlug] || {}).filter(k => k.startsWith(keyPrefix) && k !== keyPrefix.replace(/-$/, "")))
  for (const file of readdirSync(directory)) {
    const ext = extname(file).toLowerCase()
    const filePath = join(directory, file)
    if (!existsSync(filePath)) continue

    // Skip directories
    if (ext === "") continue

    let dims = null
    if (VIDEO_EXTS.has(ext)) {
      dims = probeVideo(filePath)
    } else if (IMAGE_EXTS.has(ext)) {
      dims = probeImage(filePath)
    }

    if (dims) {
      const ratio = normalizeRatio(dims.width, dims.height)
      const key = keyPrefix + file.replace(/\.[^.]+$/, "")
      if (seenKeys.has(key)) continue
      seenKeys.add(key)
      ratios[projectSlug][key] = {
        width: dims.width,
        height: dims.height,
        ratio,
      }
      detected++
      console.log(`  ${projectSlug}/${key}: ${dims.width}×${dims.height} → ${ratio}`)
    }
  }
}

writeFileSync(OUTPUT_FILE, JSON.stringify(ratios, null, 2) + "\n")
console.log(`\n[probe-media] Detected ${detected} files → ${OUTPUT_FILE}`)
