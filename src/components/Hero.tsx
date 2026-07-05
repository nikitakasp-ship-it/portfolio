"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { useI18n } from "@/lib/i18n-context"

export default function Hero() {
  const { t } = useI18n()
  const containerRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
    tl.fromTo(labelRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 })
      .fromTo(nameRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1 }, "-=0.4")
      .fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
      .fromTo(indicatorRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.2")
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative flex items-end overflow-hidden"
      style={{
        minHeight: "100vh",
        padding: "0 40px 80px",
        background: "var(--background)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(var(--hero-overlay-rgb),0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full content-container">
        <p
          ref={labelRef}
          className="text-sm font-medium tracking-[0.3em] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          {t("hero.label")}
        </p>
        <h1
          ref={nameRef}
          className="font-bold leading-[0.92] mb-6"
          style={{
            fontSize: "clamp(4rem, 14vw, 11rem)",
            letterSpacing: "-0.04em",
            color: "var(--text-primary)",
          }}
        >
          Nikita
          <br />
          Kasperovich
        </h1>
        <p
          ref={subtitleRef}
          className="text-base font-light max-w-lg"
          style={{ color: "var(--text-secondary)", fontSize: "clamp(0.875rem, 1.2vw, 1.05rem)" }}
        >
          {t("hero.subtitle")}
        </p>
      </div>

      <div
        ref={indicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        style={{ opacity: 0 }}
      >
        <span className="text-xs tracking-widest" style={{ color: "var(--text-muted)" }}>
          {t("hero.scroll")}
        </span>
        <div
          className="w-[1px] h-8"
          style={{ background: "linear-gradient(to bottom, var(--text-muted), transparent)" }}
        />
      </div>
    </section>
  )
}
