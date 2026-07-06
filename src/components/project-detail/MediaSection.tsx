"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { requestPlay, releasePlay, shouldAutoplay } from "@/lib/video-play-manager"
import { getMediaAspectCSS } from "@/data/projects"

function webmSrc(mp4Src: string): string | undefined {
  if (mp4Src.endsWith(".mp4")) {
    return mp4Src.slice(0, -4) + ".webm"
  }
  return undefined
}

function AdditionalVideoTile({
  slug,
  src,
  index,
}: {
  slug: string
  src: string
  index: number
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const aspectCSS = getMediaAspectCSS(
    slug,
    `additional-${String(index + 1).padStart(2, "0")}`
  )
  const webm = webmSrc(src)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
        if (entry.isIntersecting) setShouldLoad(true)
      },
      { threshold: 0.4, rootMargin: "150px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (shouldLoad && videoRef.current) {
      videoRef.current.load()
    }
  }, [shouldLoad])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldLoad) return
    if (isInView && shouldAutoplay()) requestPlay(video)
    else releasePlay(video)
    return () => releasePlay(video)
  }, [isInView, shouldLoad])

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container) return
    container.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`
    video.currentTime = 0.3
  }, [])

  return (
    <div
      ref={containerRef}
      className="additional-media-tile"
      style={{ aspectRatio: aspectCSS }}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        onLoadedMetadata={handleLoadedMetadata}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      >
        {shouldLoad && webm && (
          <source src={webm} type="video/webm" />
        )}
        {shouldLoad && (
          <source src={src} type="video/mp4" />
        )}
      </video>
    </div>
  )
}

export default function MediaSection({
  slug,
  label,
  videos,
}: {
  slug: string
  label: string
  videos: string[]
}) {
  if (!videos.length) return null
  return (
    <div data-animate-in style={{ marginBottom: "120px" }}>
      <p className="section-label">{label}</p>
      <div
        style={{
          display: "grid",
          gap: "24px",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
        }}
      >
        {videos.map((src, i) => (
          <AdditionalVideoTile key={src} slug={slug} src={src} index={i} />
        ))}
      </div>
    </div>
  )
}
