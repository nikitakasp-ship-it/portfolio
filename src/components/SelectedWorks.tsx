"use client"

import { useRef } from "react"
import { useScrollAnimation } from "@/lib/use-scroll-animation"
import ProjectGrid from "./ProjectGrid"
import { useI18n } from "@/lib/i18n-context"

export default function SelectedWorks() {
  const { t } = useI18n()
  const titleRef = useRef<HTMLHeadingElement>(null)

  useScrollAnimation(titleRef, 0)

  return (
    <section
      id="work"
      className="section-padding"
      style={{ background: "var(--background)" }}
    >
      <div className="content-container">
        <h2
          ref={titleRef}
          className="font-bold mb-20"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}
        >
          {t("work.title")}
        </h2>

        <ProjectGrid />
      </div>
    </section>
  )
}
