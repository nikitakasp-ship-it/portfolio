import { execSync } from "child_process"
import { existsSync, statSync, renameSync, rmSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

const ffmpeg = join(root, "node_modules", "ffmpeg-static", "ffmpeg.exe")

const projects = [
  "demiand", "playrix", "mobile-device", "obsidian-oni",
  "trading-platform", "jdm", "dexter",
]

for (const slug of projects) {
  const input = join(root, "public", "projects", slug, "preview.mp4")
  const tmp = join(root, "public", "projects", slug, "preview-tmp.mp4")

  if (!existsSync(input)) {
    console.log(`SKIP ${slug}: not found`)
    continue
  }

  const inputSize = statSync(input).size / 1024 / 1024
  console.log(`\n${slug}: ${inputSize.toFixed(1)}MB → compressing...`)

  try {
    const cmd = `"${ffmpeg}" -i "${input}" -c:v libx264 -crf 26 -preset slow -vf "scale='min(1920,iw)':-2" -movflags +faststart -an -y "${tmp}"`
    execSync(cmd, { stdio: "pipe", timeout: 180000 })

    const tmpSize = statSync(tmp).size / 1024 / 1024
    const saving = ((inputSize - tmpSize) / inputSize * 100).toFixed(0)
    console.log(`  done: ${tmpSize.toFixed(1)}MB (${saving}% saved)`)

    rmSync(input)
    renameSync(tmp, input)
  } catch (e) {
    console.error(`  FAILED: ${e.message}`)
    try { rmSync(tmp) } catch {}
  }
}

console.log("\n=== FINAL SIZES ===")
let totalBefore = 0, totalAfter = 0
for (const slug of projects) {
  const p = join(root, "public", "projects", slug, "preview.mp4")
  if (existsSync(p)) {
    const size = statSync(p).size / 1024 / 1024
    console.log(`  ${slug}: ${size.toFixed(1)}MB`)
    totalAfter += size
  }
}
console.log(`Total: ${totalAfter.toFixed(1)}MB`)
