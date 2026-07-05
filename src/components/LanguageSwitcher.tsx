"use client"

import { useI18n } from "@/lib/i18n-context"

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useI18n()

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ru" : "en")}
      className={`text-xs font-medium tracking-widest transition-colors duration-300 ${className}`}
      style={{ color: "var(--text-muted)" }}
      aria-label={`Switch to ${locale === "en" ? "Russian" : "English"}`}
    >
      <span style={{ color: locale === "en" ? "var(--text-primary)" : "var(--text-muted)" }}>
        EN
      </span>
      <span style={{ color: "var(--border)", margin: "0 4px" }}> | </span>
      <span style={{ color: locale === "ru" ? "var(--text-primary)" : "var(--text-muted)" }}>
        RU
      </span>
    </button>
  )
}
