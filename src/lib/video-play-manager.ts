const playingVideos = new Set<HTMLVideoElement>()
const MAX_CONCURRENT = 3

export function requestPlay(video: HTMLVideoElement) {
  if (playingVideos.has(video)) return
  if (playingVideos.size >= MAX_CONCURRENT) {
    const oldest = playingVideos.values().next().value
    if (oldest) {
      oldest.pause()
      playingVideos.delete(oldest)
    }
  }
  playingVideos.add(video)
  video.play().catch(() => {})
}

export function releasePlay(video: HTMLVideoElement) {
  playingVideos.delete(video)
  video.pause()
}

export function shouldAutoplay(): boolean {
  const conn = (navigator as any).connection
  if (conn?.saveData) return false
  if (conn?.effectiveType && ["slow-2g", "2g"].includes(conn.effectiveType)) return false
  return true
}
