"use client"

import { useRef } from "react"
import Link from "next/link"
import { useScrollAnimation } from "@/lib/use-scroll-animation"
import { useI18n } from "@/lib/i18n-context"

function ExperienceContent() {
  const { t } = useI18n()

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
          href="/"
          className="inline-block text-sm mb-24 transition-colors duration-300"
          style={{ color: "var(--text-muted)" }}
        >
          &larr; {t("back")}
        </Link>

        <h1
          className="font-bold mb-24"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}
        >
          {t("experience.title")}
        </h1>

        <SectionBlock>
          <SectionHeader
            role={t("experience.role")}
            company={t("experience.company")}
            badge={t("experience.currentPosition")}
          />
          <SectionBody>
            <Description text={t("experience.purrweb.p1")} />
            <Description text={t("experience.purrweb.p2")} />

            <SubSection title={t("experience.responsibilities")}>
              <BulletList />
            </SubSection>

            <SubSection title={t("experience.software")}>
              <Tags items={["Cinema 4D", "Redshift", "After Effects", "Mocha Pro"]} />
            </SubSection>
          </SectionBody>
        </SectionBlock>

        <Divider />

        <SectionBlock>
          <SectionHeader role={t("experience.freelanceRole")} />
          <SectionBody>
            <Description text={t("experience.freelance.p1")} />

            <SubSection title={t("experience.recentWork")}>
              <FreelanceList />
            </SubSection>

            <SubSection title={t("experience.aiTools")}>
              <Tags items={["ChatGPT", "Midjourney", "Kling", "Veo", "Seedance"]} />
            </SubSection>
          </SectionBody>
        </SectionBlock>
      </div>
    </main>
  )
}

function BulletList() {
  const { t } = useI18n()
  const items = t("experience.responsibilitiesList").split(",")
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li
          key={item.trim()}
          className="text-sm pl-4"
          style={{
            color: "var(--text-secondary)",
            borderLeft: "1px solid var(--border)",
            lineHeight: "1.6",
          }}
        >
          {item.trim()}
        </li>
      ))}
    </ul>
  )
}

function FreelanceList() {
  const { t } = useI18n()
  const items = t("experience.recentWorkList").split(",")
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li
          key={item.trim()}
          className="text-sm pl-4"
          style={{
            color: "var(--text-secondary)",
            borderLeft: "1px solid var(--border)",
            lineHeight: "1.6",
          }}
        >
          {item.trim()}
        </li>
      ))}
    </ul>
  )
}

function SectionBlock({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useScrollAnimation(ref, 0)
  return (
    <div
      ref={ref}
      className="grid gap-12 md:gap-16"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
      }}
    >
      {children}
    </div>
  )
}

function SectionHeader({ role, company, badge }: { role: string; company?: string; badge?: string }) {
  return (
    <div>
      <h2
        className="font-semibold mb-2"
        style={{
          fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
        }}
      >
        {role}
      </h2>
      {company && <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{company}</p>}
      {badge && (
        <span
          className="inline-block text-xs font-medium tracking-widest px-3 py-1"
          style={{ color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "100px" }}
        >
          {badge}
        </span>
      )}
    </div>
  )
}

function SectionBody({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-8">{children}</div>
}

function Description({ text }: { text: string }) {
  return (
    <p className="leading-relaxed" style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: "1.8" }}>
      {text}
    </p>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="text-xs font-medium tracking-widest mb-4 block" style={{ color: "var(--text-muted)" }}>
        {title}
      </span>
      {children}
    </div>
  )
}

function Tags({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="px-3 py-1 text-xs"
          style={{
            background: "var(--border-subtle)",
            border: "1px solid var(--border)",
            borderRadius: "100px",
            color: "var(--text-secondary)",
          }}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function Divider() {
  return <div className="my-20 md:my-24" style={{ height: "1px", background: "var(--border)" }} />
}

export default function ExperiencePage() {
  return <ExperienceContent />
}
