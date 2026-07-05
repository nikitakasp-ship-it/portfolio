"use client"

import { useRef } from "react"
import { useScrollAnimation } from "@/lib/use-scroll-animation"
import { useI18n } from "@/lib/i18n-context"

const tools = [
  "Cinema 4D",
  "Redshift",
  "After Effects",
  "Mocha Pro",
  "Houdini",
  "ChatGPT",
  "Midjourney",
  "Kling",
  "Veo",
  "Seedance",
]

export default function Software() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)

  useScrollAnimation(sectionRef, 0.2)

  return (
    <section
      ref={sectionRef}
      id="software"
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
          {t("software.title")}
        </h2>

        <div
          data-animate
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          }}
        >
          {tools.map((tool) => (
            <div
              key={tool}
              className="px-5 py-4"
              style={{
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--surface-alt)",
              }}
            >
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {tool}
                {tool === "Houdini" && (
                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block", marginTop: "2px" }}>
                    ({t("software.learning")})
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
