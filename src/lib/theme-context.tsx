"use client"
/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useContext, useEffect, useState } from "react"

export type Theme = "dark" | "light"

type ThemeContextType = {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null
    if (saved === "dark" || saved === "light") {
      setTheme(saved)
    } else {
      setTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      )
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggle = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
/* eslint-enable react-hooks/set-state-in-effect */
