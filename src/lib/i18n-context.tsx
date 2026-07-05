"use client"
/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useContext, useEffect, useState } from "react"
import { translations, type Locale, getValue } from "@/lib/translations"

type I18nContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (path: string) => string
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: () => "",
})

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en"
  const fromDOM = document.documentElement.lang
  if (fromDOM === "ru") return "ru"
  return "en"
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale)

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null
    if (saved === "en" || saved === "ru") {
      setLocale(saved)
    } else {
      const detected = navigator.language?.startsWith("ru") ? "ru" : "en"
      setLocale(detected)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    localStorage.setItem("locale", locale)
  }, [locale])

  const t = (path: string): string => {
    return getValue(translations[locale], path)
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => useContext(I18nContext)
/* eslint-enable react-hooks/set-state-in-effect */
