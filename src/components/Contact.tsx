"use client"

import { useRef } from "react"
import { useScrollAnimation } from "@/lib/use-scroll-animation"
import { useI18n } from "@/lib/i18n-context"

export default function Contact() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)

  useScrollAnimation(sectionRef, 0.2)

  return (
    <section
      ref={sectionRef}
      id="contact"
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
          {t("contact.title")}
        </h2>

        <div
          data-animate
          className="grid gap-12 md:gap-20"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          }}
        >
          <div>
            <p
              className="mb-12 leading-relaxed"
              style={{
                fontSize: "1.125rem",
                color: "var(--text-secondary)",
                lineHeight: "1.8",
              }}
            >
              {t("contact.description")}
            </p>
            <div className="flex flex-col gap-8">
              <div>
                <span className="text-xs font-medium tracking-widest block mb-3" style={{ color: "var(--text-muted)" }}>
                  {t("contact.email")}
                </span>
                <a
                  href="mailto:nikitakasp@gmail.com"
                  className="block text-sm transition-colors duration-300 contact-link"
                  style={{ color: "var(--text-secondary)" }}
                >
                  nikitakasp@gmail.com
                </a>
              </div>
              <div>
                <span className="text-xs font-medium tracking-widest block mb-3" style={{ color: "var(--text-muted)" }}>
                  {t("contact.telegram")}
                </span>
                <a
                  href="https://t.me/Kuspik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm transition-colors duration-300 contact-link"
                  style={{ color: "var(--text-secondary)" }}
                >
                  @Kuspik
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
