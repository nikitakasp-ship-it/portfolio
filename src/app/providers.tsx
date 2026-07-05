"use client"

import { ThemeProvider } from "@/lib/theme-context"
import { I18nProvider } from "@/lib/i18n-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </I18nProvider>
  )
}
