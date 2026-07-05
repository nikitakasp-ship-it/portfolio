#!/usr/bin/env node

/**
 * detect-video-metadata.mjs
 *
 * Reads MP4 video dimensions by parsing trak>mdia>minf>stbl>stsd.
 * Iterates all traks to find the video track (not the first stsd).
 * Falls back to tkhd if stsd parsing fails.
 * Zero external dependencies — pure Node.js buffer parsing.
 *
 * Runs as a prebuild step. Outputs src/data/video-metadata.json.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs"
import { join } from "path"

const PROJECTS_DIR = join(import.meta.dirname, "..", "public", "projects")
const OUTPUT_FILE = join(import.meta.dirname, "..", "src", "data", "video-metadata.json")

const VIDEO_FILES = ["preview.mp4", "hero.mp4"]
const VIDEO_CODECS = new Set(["avc1", "avc2", "avc3", "avc4", "hvc1", "hev1", "hvc2", "mp4v"])
const CONTAINER_BOXES = new Set(["moov", "trak", "mdia", "minf", "stbl"])

function findAllBoxes(buf, start, end, target) {
  const results = []
  let off = start
  while (off < end - 8) {
    const size = buf.readUInt32BE(off)
    const type = buf.toString("ascii", off + 4, off + 8)
    if (size < 8) break
    if (type === target) results.push({ offset: off, size })
    if (CONTAINER_BOXES.has(type)) {
      results.push(...findAllBoxes(buf, off + 8, off + size, target))
    }
    off += size
  }
  return results
}

function getVideoDimensions(filePath) {
  try {
    const buf = readFileSync(filePath)
    const totalLen = buf.length

    // Verify ftyp
    const ftyps = findAllBoxes(buf, 0, Math.min(totalLen, 32), "ftyp")
    if (ftyps.length === 0) return null

    // Find all trak boxes inside moov
    const moovs = findAllBoxes(buf, 0, totalLen, "moov")
    if (moovs.length === 0) return null

    const moov = moovs[0]
    const traks = findAllBoxes(buf, moov.offset + 8, moov.offset + moov.size, "trak")

    // Search each trak for a video codec entry in stsd
    for (const trak of traks) {
      const stbls = findAllBoxes(buf, trak.offset + 8, trak.offset + trak.size, "stbl")
      for (const stbl of stbls) {
        const stsds = findAllBoxes(buf, stbl.offset + 8, stbl.offset + stbl.size, "stsd")
        for (const stsd of stsds) {
          const stsdDataStart = stsd.offset + 8
          const entryCount = buf.readUInt32BE(stsdDataStart + 4)
          if (entryCount === 0) continue

          const entryStart = stsdDataStart + 8
          if (entryStart + 36 > totalLen) continue

          const entryType = buf.toString("ascii", entryStart + 4, entryStart + 8)
          if (VIDEO_CODECS.has(entryType)) {
            const width = buf.readUInt16BE(entryStart + 32)
            const height = buf.readUInt16BE(entryStart + 34)
            if (width > 0 && height > 0) {
              return { width, height }
            }
          }
        }
      }
    }

    // Fallback: parse tkhd (use the last trak which is usually video)
    for (const trak of traks.reverse()) {
      const tkhds = findAllBoxes(buf, trak.offset + 8, trak.offset + trak.size, "tkhd")
      if (tkhds.length === 0) continue
      const tkhd = tkhds[0]
      const boxStart = tkhd.offset
      const version = buf.readUInt8(boxStart + 8)
      let w, h
      if (version === 0) {
        w = buf.readUInt32BE(boxStart + 84) >> 16
        h = buf.readUInt32BE(boxStart + 88) >> 16
      } else {
        w = buf.readUInt32BE(boxStart + 96) >> 16
        h = buf.readUInt32BE(boxStart + 100) >> 16
      }
      if (w > 0 && h > 0) return { width: w, height: h }
    }
  } catch (e) {
    // silently skip unreadable files
  }
  return null
}

const metadata = {}
let detected = 0

for (const dir of readdirSync(PROJECTS_DIR)) {
  const projectDir = join(PROJECTS_DIR, dir)
  if (!existsSync(projectDir)) continue

  for (const file of VIDEO_FILES) {
    const videoPath = join(projectDir, file)
    if (existsSync(videoPath)) {
      const dims = getVideoDimensions(videoPath)
      if (dims) {
        if (!metadata[dir]) metadata[dir] = {}
        metadata[dir][file.replace(".mp4", "")] = dims
        detected++
        console.log(`  ${dir}/${file}: ${dims.width}x${dims.height}`)
      }
    }
  }
}

writeFileSync(OUTPUT_FILE, JSON.stringify(metadata, null, 2) + "\n")
console.log(`\n[detect-video-metadata] Detected dimensions for ${detected} videos → ${OUTPUT_FILE}`)
