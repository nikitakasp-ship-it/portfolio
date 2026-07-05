"use client"

import { useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useScrollAnimation } from "@/lib/use-scroll-animation"
import type { Project } from "@/data/projects"
import { getAspectRatioCSS } from "@/data/projects"

const hoverEase = "cubic-bezier(0.22, 0.61, 0.36, 1)"

export default function ProjectCard({
  project,
}: {
  project: Project
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [coverError, setCoverError] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  useScrollAnimation(cardRef, 0, "top 90%")

  const aspectCSS = getAspectRatioCSS(project.aspectRatio)

  const handleMouseEnter = useCallback(() => {
    const video = videoRef.current
    if (video && videoReady) {
      video.currentTime = 0
      video.play()
    }
    setIsHovered(true)
  }, [videoReady])

  const handleMouseLeave = useCallback(() => {
    const video = videoRef.current
    if (video) {
      video.pause()
      video.currentTime = 0
    }
    setIsHovered(false)
  }, [])

  const showFallback = !project.cover || coverError

  return (
    <Link
      href={`/projects/${project.slug}`}
      style={{ cursor: "pointer" }}
    >
      <div
        ref={cardRef}
        className="group relative overflow-hidden w-full h-full"
        style={{
          borderRadius: "12px",
          background: project.color,
          border: "1px solid var(--border)",
          transform: `scale(${isHovered ? 1.03 : 1})`,
          transition: `transform 300ms ${hoverEase}`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: aspectCSS }}
        >
          {!showFallback && (
            <img
              src={project.cover}
              alt={project.title}
              loading="lazy"
              draggable={false}
              onError={() => setCoverError(true)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: isHovered ? 0 : 1,
                transform: `scale(${isHovered ? 1.04 : 1})`,
                transition: `opacity 300ms ${hoverEase}, transform 300ms ${hoverEase}`,
              }}
            />
          )}

          {showFallback && !isHovered && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                opacity: isHovered ? 0 : 1,
                transition: `opacity 300ms ${hoverEase}`,
              }}
            >
              <div style={{ textAlign: "center", color: "var(--overlay)" }}>
                <span
                  style={{
                    display: "block",
                    fontWeight: 700,
                    marginBottom: "8px",
                    fontSize: "clamp(1rem, 2vw, 1.5rem)",
                  }}
                >
                  {project.title}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {project.category}
                </span>
              </div>
            </div>
          )}

          {project.previewVideo && (
            <video
              ref={videoRef}
              src={project.previewVideo}
              muted
              loop
              playsInline
              preload="auto"
              onCanPlay={() => setVideoReady(true)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: isHovered ? 1 : 0,
                transform: `scale(${isHovered ? 1.04 : 1})`,
                transition: `opacity 300ms ${hoverEase}, transform 300ms ${hoverEase}`,
              }}
            />
          )}

          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: isHovered ? 1 : 0,
              transition: `opacity 300ms ${hoverEase}`,
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, transparent 60%)",
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
              transition: `opacity 300ms ${hoverEase}, transform 300ms ${hoverEase}`,
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
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
