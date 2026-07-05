"use client"

import { useTheme } from "@/lib/theme-context"

export default function ThemeSwitcher({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className={`transition-colors duration-300 ${className}`}
      style={{ color: "var(--text-muted)" }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  )
}
