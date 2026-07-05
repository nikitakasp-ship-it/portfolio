"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import Link from "next/link"
import type { Project } from "@/data/projects"
import { getAspectRatioCSS } from "@/data/projects"
import { easings } from "@/lib/motion"

const hoverEase = easings.hover

let activePreviewVideo: HTMLVideoElement | null = null

export default function ProjectCard({
  project,
}: {
  project: Project
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)

  const aspectCSS = getAspectRatioCSS(project.aspectRatio)
  const hasVideo = !!project.previewVideo

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
      { rootMargin: "200px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasVideo, shouldLoad])

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
      style={{ cursor: "pointer", display: "block" }}
    >
      <div
        className="relative overflow-hidden project-card"
        style={{
          borderRadius: "12px",
          background: project.color,
          border: "1px solid var(--border)",
          transform: `scale(${isHovered ? 1.025 : 1})`,
          transition: `transform 300ms ${hoverEase}`,
        }}
        onMouseEnter={activatePreview}
        onMouseLeave={deactivatePreview}
        onFocus={activatePreview}
        onBlur={deactivatePreview}
        tabIndex={0}
      >
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: aspectCSS,
            viewTransitionName: `project-${project.slug}`,
          } as React.CSSProperties}
        >
          {hasVideo && (
            <video
              ref={videoRef}
              src={shouldLoad ? project.previewVideo : undefined}
              muted
              loop
              playsInline
              preload={shouldLoad ? "metadata" : "none"}
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          )}

          {!hasVideo && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <span
                  style={{
                    display: "block",
                    fontWeight: 700,
                    marginBottom: "8px",
                    fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {project.title}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--text-secondary)",
                  }}
                >
                  {project.category}
                </span>
              </div>
            </div>
          )}

          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: isHovered ? 1 : 0,
              transition: isHovered
                ? `opacity 300ms ${hoverEase} 150ms`
                : `opacity 200ms ${hoverEase}`,
              background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)",
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "40px",
              pointerEvents: "none",
              opacity: isHovered ? 1 : 0,
              transform: `translateY(${isHovered ? 0 : "12px"})`,
              transition: isHovered
                ? `opacity 300ms ${hoverEase} 150ms, transform 300ms ${hoverEase} 150ms`
                : `opacity 200ms ${hoverEase}, transform 200ms ${hoverEase}`,
            }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
                marginBottom: "6px",
              }}
            >
              {project.category}
            </p>
            <h3
              style={{
                fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                fontWeight: 600,
                color: "#ffffff",
                letterSpacing: "-0.01em",
                marginBottom: "4px",
              }}
            >
              {project.title}
            </h3>
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 400,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {project.year}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
