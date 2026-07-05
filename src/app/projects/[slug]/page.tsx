"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import gsap from "gsap"
import { projects } from "@/data/projects"
import { useI18n } from "@/lib/i18n-context"

export default function ProjectPage() {
  const { t, locale } = useI18n()
  const params = useParams()
  const project = projects.find((p) => p.slug === params.slug)
  const contentRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      )
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

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
  }, [])

  if (!project) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ minHeight: "100vh", background: "var(--background)" }}
      >
        <p style={{ color: "var(--text-muted)" }}>{t("work.projectNotFound")}</p>
      </div>
    )
  }

  return (
    <main
      id="main-content"
      className="page-padding"
      style={{
        minHeight: "100vh",
        background: "var(--background)",
      }}
    >
      <div className="content-container">
        <Link
          href="/#work"
          className="inline-block text-sm mb-16 transition-colors duration-300"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          &larr; {t("back")}
        </Link>

        <div ref={contentRef}>
          <div
            className="overflow-hidden mb-20"
            style={{
              aspectRatio: project.videoAspect || "16/9",
              borderRadius: "12px",
              background: project.color,
              border: "1px solid var(--border)",
            }}
          >
            {project.video ? (
              <video
                ref={videoRef}
                src={project.video}
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            ) : project.cover ? (
              <img
                src={project.cover}
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center" style={{ color: "var(--overlay)" }}>
                  <span
                    className="block font-bold mb-2"
                    style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
                  >
                    {project.title}
                  </span>
                  <span className="text-sm font-medium tracking-wider uppercase">
                    {project.category}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div
            className="grid gap-12 md:gap-20 mb-20"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            }}
          >
            <div>
              <h1
                className="font-bold mb-4"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                }}
              >
                {project.title}
              </h1>
              <p className="text-sm font-medium tracking-wider" style={{ color: "var(--text-muted)" }}>
                {project.category} &mdash; {project.year}
              </p>
              {project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs"
                      style={{
                        background: "var(--border-subtle)",
                        border: "1px solid var(--border)",
                        borderRadius: "100px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p
                className="leading-relaxed"
                style={{ fontSize: "1.125rem", color: "var(--text-secondary)", lineHeight: "1.8" }}
              >
                {project.overview[locale]}
              </p>
              {project.credits && (
                <p className="mt-6 text-sm" style={{ color: "var(--text-muted)" }}>
                  {project.credits}
                </p>
              )}
            </div>
          </div>

          {project.gallery.length > 0 && (
            <div className="grid gap-6 md:gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 500px), 1fr))" }}>
              {project.gallery.map((img, i) => (
                <div
                  key={i}
                  className="overflow-hidden"
                  style={{
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                  }}
                >
                  <img
                    src={img}
                    alt={`${project.title} ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
