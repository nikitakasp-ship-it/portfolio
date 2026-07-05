"use client"

import { useRef } from "react"
import Link from "next/link"
import { useScrollAnimation } from "@/lib/use-scroll-animation"
import { useI18n } from "@/lib/i18n-context"

const stepData = [
  { number: "01", title: "Concept", tools: undefined as string[] | undefined },
  { number: "02", title: "Storyboarding", tools: undefined },
  { number: "03", title: "3D Production", tools: ["Cinema 4D", "Redshift"] },
  { number: "04", title: "Compositing", tools: ["After Effects", "Mocha Pro"] },
  { number: "05", title: "AI Production", tools: ["ChatGPT", "Midjourney", "Kling", "Veo", "Seedance"] },
  { number: "06", title: "Final Delivery", tools: undefined },
]

function StepCard({ number, title, tools }: { number: string; title: string; tools?: string[] }) {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)

  useScrollAnimation(ref, 0)

  return (
    <div ref={ref}>
      <div className="grid gap-6 md:gap-12" style={{ gridTemplateColumns: "80px 1fr" }}>
        <div>
          <span
            className="block font-bold"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              color: "var(--border)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {number}
          </span>
        </div>
        <div>
          <h3
            className="font-semibold mb-3"
            style={{
              fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}>
            {t(`workflow.steps.${number}`)}
          </p>
          {tools && (
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1 text-xs"
                  style={{
                    background: "var(--border-subtle)",
                    border: "1px solid var(--border)",
                    borderRadius: "100px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          )}
          {Number(number) < 6 && (
            <div className="mt-8 mb-8" style={{ color: "var(--border)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function WorkflowPage() {
  const { t } = useI18n()
  const titleRef = useRef<HTMLHeadingElement>(null)

  useScrollAnimation(titleRef, 0)

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
          ref={titleRef}
          className="font-bold mb-24"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}
        >
          {t("workflow.title")}
        </h1>

        <div className="max-w-3xl flex flex-col gap-0" style={{ borderLeft: "1px solid var(--border)" }}>
          {stepData.map((step) => (
            <div key={step.number} className="pl-8 md:pl-12">
              <StepCard number={step.number} title={step.title} tools={step.tools} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
