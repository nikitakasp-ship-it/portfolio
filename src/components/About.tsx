"use client"

import { useRef } from "react"
import { useScrollAnimation } from "@/lib/use-scroll-animation"
import { useI18n } from "@/lib/i18n-context"

export default function About() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)

  useScrollAnimation(sectionRef, 0.2)

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-padding"
      style={{ background: "var(--background)", borderTop: "1px solid var(--border)" }}
    >
      <div className="content-container">
        <h2
          data-animate
          className="font-bold mb-24"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}
        >
          {t("about.title")}
        </h2>

        <div
          data-animate
          className="grid gap-16 md:gap-24"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
          }}
        >
          <div className="flex flex-col gap-8">
            <p
              className="leading-relaxed"
              style={{
                fontSize: "clamp(1.125rem, 1.5vw, 1.35rem)",
                color: "var(--text-secondary)",
                lineHeight: "1.8",
              }}
            >
              {t("about.p1")}
            </p>
            <p
              className="leading-relaxed"
              style={{
                fontSize: "1rem",
                color: "var(--text-secondary)",
                lineHeight: "1.8",
              }}
            >
              {t("about.p2")}
            </p>
            <p
              className="leading-relaxed"
              style={{
                fontSize: "1rem",
                color: "var(--text-secondary)",
                lineHeight: "1.8",
              }}
            >
              {t("about.p3")}
            </p>
            <p
              className="leading-relaxed"
              style={{
                fontSize: "1rem",
                color: "var(--text-secondary)",
                lineHeight: "1.8",
              }}
            >
              {t("about.p4")}
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <span className="text-xs font-medium tracking-widest block mb-4" style={{ color: "var(--text-muted)" }}>
                {t("about.languages")}
              </span>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 text-sm">
                  <span style={{ color: "var(--text-muted)", minWidth: "80px" }}>{t("about.russian")}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{t("about.native")}</span>
                </div>
                <div className="flex gap-3 text-sm">
                  <span style={{ color: "var(--text-muted)", minWidth: "80px" }}>{t("about.english")}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{t("about.workingProficiency")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
