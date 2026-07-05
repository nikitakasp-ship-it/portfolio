"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { useScrollAnimation } from "@/lib/use-scroll-animation"
import type { Project } from "@/data/projects"
import { getAspectRatioCSS } from "@/data/projects"

export default function ProjectCard({
  project,
}: {
  project: Project
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [imgError, setImgError] = useState(false)

  useScrollAnimation(cardRef, 0, "top 90%")

  const aspectCSS = getAspectRatioCSS(project.aspectRatio)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !project.video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [project.video])

  const imgSrc = project.thumbnail || project.cover
  const showImage = imgSrc && !imgError

  return (
    <Link href={`/projects/${project.slug}`}>
      <div
        ref={cardRef}
        className="group relative overflow-hidden w-full h-full"
        style={{
          borderRadius: "12px",
          background: project.color,
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="relative overflow-hidden w-full h-full"
          style={{ aspectRatio: aspectCSS }}
        >
          {project.video ? (
            <video
              ref={videoRef}
              src={project.video}
              muted
              loop
              playsInline
              preload="none"
              poster={imgSrc || undefined}
              className="w-full h-full object-cover"
            />
          ) : showImage ? (
            <img
              src={imgSrc}
              alt={project.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-6">
              <div className="text-center" style={{ color: "var(--overlay)" }}>
                <span
                  className="block font-bold mb-2"
                  style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
                >
                  {project.title}
                </span>
                <span className="text-xs font-medium tracking-wider uppercase">
                  {project.category}
                </span>
              </div>
            </div>
          )}

          <div
            className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
            }}
          />
        </div>

        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ background: "var(--surface)" }}
        >
          <div>
            <h3
              className="font-semibold"
              style={{ fontSize: "1.05rem", color: "var(--text-primary)" }}
            >
              {project.title}
            </h3>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {project.category}
            </p>
          </div>
          <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            {project.year}
          </span>
        </div>
      </div>
    </Link>
  )
}
