"use client"

import { useRef } from "react"
import { useScrollAnimation } from "@/lib/use-scroll-animation"
import { useI18n } from "@/lib/i18n-context"

export default function Contact() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)

  useScrollAnimation(sectionRef, 0.2)

  const links = [
    {
      label: t("contact.email"),
      href: "mailto:nikitakasp@gmail.com",
      text: "nikitakasp@gmail.com",
      download: false,
    },
    {
      label: t("contact.telegram"),
      href: "https://t.me/Kuspik",
      text: "@Kuspik",
      download: false,
    },
    {
      label: t("contact.linkedin"),
      href: "https://www.linkedin.com/in/%D0%BD%D0%B8%D0%BA%D0%B8%D1%82%D0%B0-%D0%BA%D0%B0%D1%81%D0%BF%D0%B5%D1%80%D0%BE%D0%B2%D0%B8%D1%87-6759b2389",
      text: `LinkedIn →`,
      download: false,
    },
    // Uncomment when cv.pdf is added to public/
    // {
    //   label: t("contact.downloadCV"),
    //   href: "/cv.pdf",
    //   text: `${t("contact.downloadCV")} →`,
    //   download: true,
    // },
  ]

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
          style={{
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            lineHeight: 1.15,
            marginBottom: "80px",
            maxWidth: "700px",
          }}
        >
          {t("contact.headline")}
        </h2>

        <div
          data-animate
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "48px",
          }}
        >
          {links.map((link) => (
            <div key={link.label}>
              <p
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "10px",
                }}
              >
                {link.label}
              </p>
              <a
                href={link.href}
                target={link.download ? undefined : "_blank"}
                rel={link.download ? undefined : "noopener noreferrer"}
                download={link.download || undefined}
                className="contact-link"
                style={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {link.text}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
