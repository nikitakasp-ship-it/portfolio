"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n-context"
import { useTheme } from "@/lib/theme-context"

export default function Navigation() {
  const { t, locale, setLocale } = useI18n()
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: t("nav.work"), href: "/#work" },
    { label: t("nav.experience"), href: "/experience" },
    { label: t("nav.workflow"), href: "/workflow" },
    { label: t("nav.contact"), href: "/#contact" },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? "var(--background)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div
        className="content-container flex items-center justify-between"
        style={{ padding: "20px 40px" }}
      >
        <Link
          href="/"
          className="flex items-center justify-center w-10 h-10 rounded-full"
          style={{
            border: "1.5px solid var(--border)",
            letterSpacing: "0.15em",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          NK
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors duration-300 nav-link"
              style={{ color: "var(--text-secondary)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => setLocale(locale === "en" ? "ru" : "en")}
            className="text-xs font-medium tracking-widest transition-colors duration-300"
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

          <button
            onClick={toggle}
            className="text-sm transition-colors duration-300"
            style={{ color: "var(--text-muted)" }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </div>

        <button
          className="md:hidden relative flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          style={{ width: "44px", height: "44px" }}
        >
          <span
            className="absolute block h-[1.5px] w-6"
            style={{
              background: "var(--text-primary)",
              transform: menuOpen ? "rotate(45deg)" : "translateY(-4px)",
              transition: "transform 0.3s, background 0.3s",
            }}
          />
          <span
            className="absolute block h-[1.5px] w-6"
            style={{
              background: "var(--text-primary)",
              opacity: menuOpen ? 0 : 1,
              transition: "opacity 0.3s, background 0.3s",
            }}
          />
          <span
            className="absolute block h-[1.5px] w-6"
            style={{
              background: "var(--text-primary)",
              transform: menuOpen ? "rotate(-45deg)" : "translateY(4px)",
              transition: "transform 0.3s, background 0.3s",
            }}
          />
        </button>
      </div>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed inset-0 z-[-1] flex flex-col items-center justify-center gap-12 md:hidden"
        style={{
          background: "var(--background)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.5s, background 0.5s",
        }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-3xl font-light transition-colors duration-300 nav-link"
            style={{ color: "var(--text-secondary)" }}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        <div className="flex items-center gap-6 mt-8">
          <button
            onClick={() => setLocale(locale === "en" ? "ru" : "en")}
            className="text-sm font-medium tracking-widest transition-colors duration-300"
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

          <button
            onClick={toggle}
            className="text-lg transition-colors duration-300"
            style={{ color: "var(--text-muted)" }}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </div>
      </div>
    </header>
  )
}
