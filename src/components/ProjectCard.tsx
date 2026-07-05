"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import Link from "next/link"
import type { Project } from "@/data/projects"
import { getMediaAspectCSS } from "@/data/projects"
import { easings } from "@/lib/motion"

const hoverEase = easings.hover

let activePreviewVideo: HTMLVideoElement | null = null

export default function ProjectCard({
  project,
}: {
  project: Project
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)

  const hasVideo = !!project.previewVideo
  const aspectCSS = hasVideo
    ? getMediaAspectCSS(project.slug, "preview")
    : "16 / 9"

  useEffect(() => {
    if (!hasVideo || shouldLoad) return

    const el = videoRef.current?.parentElement
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: "300px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasVideo, shouldLoad])

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container) return

    const realW = video.videoWidth
    const realH = video.videoHeight
    if (realW > 0 && realH > 0) {
      container.style.aspectRatio = `${realW} / ${realH}`
    }
  }, [])

  const activatePreview = useCallback(() => {
    const video = videoRef.current
    setIsHovered(true)

    if (!video) return

    if (activePreviewVideo && activePreviewVideo !== video) {
      activePreviewVideo.pause()
      activePreviewVideo.currentTime = 0
    }

    activePreviewVideo = video
    video.currentTime = 0
    video.play().catch(() => {})
  }, [])

  const deactivatePreview = useCallback(() => {
    const video = videoRef.current
    setIsHovered(false)

    if (!video) return

    video.pause()
    video.currentTime = 0

    if (activePreviewVideo === video) {
      activePreviewVideo = null
    }
  }, [])

  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`${project.title} — ${project.category} — ${project.year}`}
      className="project-card"
      onMouseEnter={activatePreview}
      onMouseLeave={deactivatePreview}
      onFocus={activatePreview}
      onBlur={deactivatePreview}
      tabIndex={0}
    >
      <div
        ref={containerRef}
        className="project-card-media"
        style={{
          aspectRatio: hasVideo ? aspectCSS : "16 / 9",
          viewTransitionName: `project-${project.slug}`,
        } as React.CSSProperties}
      >
        {hasVideo ? (
          <video
            ref={videoRef}
            src={shouldLoad ? project.previewVideo : undefined}
            muted
            loop
            playsInline
            preload={shouldLoad ? "metadata" : "none"}
            aria-hidden="true"
            onLoadedMetadata={handleLoadedMetadata}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: "cover",
            }}
          />
        ) : (
          <div className="project-card-placeholder">
            <span className="project-card-placeholder-title">
              {project.title}
            </span>
            <span className="project-card-placeholder-category">
              {project.category}
            </span>
          </div>
        )}

        <div
          className="project-card-overlay"
          style={{
            opacity: isHovered ? 1 : 0,
            transition: isHovered
              ? `opacity 300ms ${hoverEase} 120ms`
              : `opacity 250ms ${hoverEase}`,
          }}
        />

        <div
          className="project-card-info"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: `translateY(${isHovered ? 0 : 10}px)`,
            transition: isHovered
              ? `opacity 300ms ${hoverEase} 120ms, transform 300ms ${hoverEase} 120ms`
              : `opacity 250ms ${hoverEase}, transform 250ms ${hoverEase}`,
          }}
        >
          <p className="project-card-category">{project.category}</p>
          <h3 className="project-card-title">{project.title}</h3>
          <span className="project-card-year">{project.year}</span>
        </div>
      </div>

      <div className="project-card-meta">
        <div className="project-card-meta-top">
          <span className="project-card-meta-year">{project.year}</span>
          <span className="project-card-meta-sep">&mdash;</span>
          <span className="project-card-meta-category">{project.category}</span>
        </div>
        <h3 className="project-card-meta-title">{project.title}</h3>
      </div>
    </Link>
  )
}
