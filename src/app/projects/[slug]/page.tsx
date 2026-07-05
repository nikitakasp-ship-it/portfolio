"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { projects, getAspectRatioCSS } from "@/data/projects"

gsap.registerPlugin(ScrollTrigger)
import { useI18n } from "@/lib/i18n-context"

function VideoPlayer({ src, aspectRatio }: { src: string; aspectRatio: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

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

  return (
    <div
      style={{
        aspectRatio: getAspectRatioCSS(aspectRatio),
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid var(--border)",
      }}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />
    </div>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p
      style={{
        fontSize: "0.75rem",
        fontWeight: 500,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "var(--text-muted)",
        marginBottom: "32px",
      }}
    >
      {label}
    </p>
  )
}

export default function ProjectPage() {
  const { t, locale } = useI18n()
  const params = useParams()
  const project = projects.find((p) => p.slug === params.slug)

  useEffect(() => {
    const els = document.querySelectorAll("[data-animate-in]")
    if (!els.length) return
    gsap.fromTo(
      els,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: els[0].parentElement,
          start: "top 92%",
        },
      }
    )
  }, [project])

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

        <div>
          {project.heroVideo ? (
            <div data-animate-in>
              <VideoPlayer src={project.heroVideo} aspectRatio={project.aspectRatio} />
            </div>
          ) : project.cover ? (
            <div
              data-animate-in
              style={{
                aspectRatio: getAspectRatioCSS(project.aspectRatio),
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid var(--border)",
                background: project.color,
              }}
            >
              <img
                src={project.cover}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}

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
            <div>
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "16px",
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
                  marginBottom: "32px",
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
              <div
                style={{
                  display: "grid",
                  gap: "24px",
                }}
              >
                {project.additionalVideos.map((video, i) => (
                  <VideoPlayer key={i} src={video} aspectRatio="16:9" />
                ))}
              </div>
            </div>
          )}

          {project.galleryImages && project.galleryImages.length > 0 && (
            <div data-animate-in style={{ marginBottom: "120px" }}>
              <SectionLabel label={locale === "ru" ? "Галерея" : "Gallery"} />
              <div
                style={{
                  display: "grid",
                  gap: "24px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
                }}
              >
                {project.galleryImages.map((img, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
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
            </div>
          )}

          {project.behindTheScenes && project.behindTheScenes.length > 0 && (
            <div data-animate-in style={{ marginBottom: "120px" }}>
              <SectionLabel label={locale === "ru" ? "За кулисами" : "Behind the Scenes"} />
              <div
                style={{
                  display: "grid",
                  gap: "24px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
                }}
              >
                {project.behindTheScenes.map((src, i) => {
                  const isVideo = src.endsWith(".mp4") || src.endsWith(".mov")
                  return (
                    <div
                      key={i}
                      style={{
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {isVideo ? (
                        <video
                          src={src}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={src}
                          alt={`${project.title} BTS ${i + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
