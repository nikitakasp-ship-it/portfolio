"use client"

import { useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import gsap from "gsap"
import { projects, getMediaAspectCSS } from "@/data/projects"
import { useI18n } from "@/lib/i18n-context"
import { SectionLabel, MediaGrid, MediaCard } from "@/components/MediaComponents"

function VideoPlayer({
  src,
  slug,
  type = "hero",
  viewTransitionName,
}: {
  src: string
  slug?: string
  type?: string
  viewTransitionName?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const aspectCSS = slug ? getMediaAspectCSS(slug, type) : undefined

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play()
        } else {
          video.pause()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  const handleLoadedMetadata = () => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container) return
    const realW = video.videoWidth
    const realH = video.videoHeight
    if (realW > 0 && realH > 0) {
      container.style.aspectRatio = `${realW} / ${realH}`
    }
    video.currentTime = 0.3
  }

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid var(--border)",
        lineHeight: 0,
        aspectRatio: aspectCSS,
        ...(viewTransitionName ? { viewTransitionName } as React.CSSProperties : {}),
      }}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover",
        }}
      />
    </div>
  )
}

export default function ProjectContent({ slug }: { slug: string }) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const project = projects.find((p) => p.slug === slug)
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = document.querySelector("[data-hero]") as HTMLElement | null
    const content = document.querySelectorAll("[data-animate-in]:not([data-hero])") as NodeListOf<HTMLElement>

    const tl = gsap.timeline()

    if (hero) {
      gsap.set(hero, { opacity: 0, scale: 0.88, y: 30 })
      tl.to(hero, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      })
    }

    if (content.length) {
      const els = Array.from(content)
      gsap.set(els, { opacity: 0, y: 30 })
      tl.to(
        els,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.15"
      )
    }

    return () => {
      tl.kill()
    }
  }, [project])

  const handleBack = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (!pageRef.current) {
        router.push("/#work")
        return
      }
      gsap.to(pageRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.96,
        duration: 0.35,
        ease: "power3.in",
        onComplete: () => router.push("/#work"),
      })
    },
    [router]
  )

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
          prefetch={false}
          onClick={handleBack}
          style={{
            display: "inline-block",
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            marginBottom: "64px",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          &larr; {t("back")}
        </Link>

        <div ref={pageRef}>
          {project.heroVideo && (
            <div data-animate-in data-hero>
              <VideoPlayer
                src={project.heroVideo}
                slug={project.slug}
                type="hero"
                viewTransitionName={`project-${project.slug}`}
              />
            </div>
          )}

          <div
            data-animate-in
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 350px), 1fr))",
              gap: "48px 80px",
              marginTop: "80px",
              marginBottom: "120px",
            }}
          >
            <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                {project.category} &mdash; {project.year}
              </p>
              <h1
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                  lineHeight: 1.1,
                }}
              >
                {project.title}
              </h1>
              {project.technologies.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        padding: "6px 14px",
                        fontSize: "0.8rem",
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
              {project.overview[locale] && (
                <p
                  style={{
                    fontSize: "1.125rem",
                    color: "var(--text-secondary)",
                    lineHeight: "1.8",
                  }}
                >
                  {project.overview[locale]}
                </p>
              )}
              {project.credits && (
                <p
                  style={{
                    marginTop: "24px",
                    fontSize: "0.875rem",
                    color: "var(--text-muted)",
                    lineHeight: "1.6",
                  }}
                >
                  {project.credits}
                </p>
              )}
            </div>
          </div>

          {project.additionalVideos && project.additionalVideos.length > 0 && (
            <div data-animate-in style={{ marginBottom: "120px" }}>
              <SectionLabel label={locale === "ru" ? "Дополнительные видео" : "Additional Videos"} />
              <MediaGrid columns="1fr">
                {project.additionalVideos.map((video, i) => (
                  <VideoPlayer key={i} src={video} slug={project.slug} type="preview" />
                ))}
              </MediaGrid>
            </div>
          )}

          {project.galleryImages && project.galleryImages.length > 0 && (
            <div data-animate-in style={{ marginBottom: "120px" }}>
              <SectionLabel label={locale === "ru" ? "Галерея" : "Gallery"} />
              <MediaGrid>
                {project.galleryImages.map((img, i) => (
                  <MediaCard key={i}>
                    <img
                      src={img}
                      alt={`${project.title} ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  </MediaCard>
                ))}
              </MediaGrid>
            </div>
          )}

          {project.behindTheScenes && project.behindTheScenes.length > 0 && (
            <div data-animate-in style={{ marginBottom: "120px" }}>
              <SectionLabel label={locale === "ru" ? "За кулисами" : "Behind the Scenes"} />
              <MediaGrid>
                {project.behindTheScenes.map((src, i) => {
                  const isVideo = src.endsWith(".mp4") || src.endsWith(".mov")
                  return (
                    <MediaCard key={i}>
                      {isVideo ? (
                        <video
                          src={src}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={src}
                          alt={`${project.title} BTS ${i + 1}`}
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </MediaCard>
                  )
                })}
              </MediaGrid>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
