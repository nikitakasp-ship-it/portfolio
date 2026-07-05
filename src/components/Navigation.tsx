"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n-context"
import LanguageSwitcher from "./LanguageSwitcher"
import ThemeSwitcher from "./ThemeSwitcher"

export default function Navigation() {
  const { t } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const navLinks = [
    { label: t("nav.work"), href: "/#work" },
    { label: t("nav.experience"), href: "/experience" },
    { label: t("nav.workflow"), href: "/workflow" },
    { label: t("nav.contact"), href: "/#contact" },
  ]

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 60)
        ticking = false
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu()
        return
      }

      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [menuOpen, closeMenu])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? "var(--nav-background)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
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
          aria-label="NK — Go to homepage"
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

        <nav className="hidden md:flex items-center gap-10" aria-label="Main navigation">
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
          <LanguageSwitcher />
          <ThemeSwitcher className="text-sm" />
        </div>

        <button
          ref={menuButtonRef}
          className="md:hidden relative flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
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
        ref={menuRef}
        id="mobile-menu"
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
            tabIndex={menuOpen ? 0 : -1}
            onClick={closeMenu}
          >
            {link.label}
          </Link>
        ))}

        <div className="flex items-center gap-6 mt-8">
          <LanguageSwitcher className={menuOpen ? "" : "[&>button]:tabindex-[-1]"} />
          <ThemeSwitcher className={`text-lg ${menuOpen ? "" : "[&>button]:tabindex-[-1]"}`} />
        </div>
      </div>
    </header>
  )
}
