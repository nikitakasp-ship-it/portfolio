import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import LayoutShell from "./LayoutShell"
import Preloader from "@/components/Preloader"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
})

const siteUrl = "https://kuspik.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nikita Kasperovich — Motion Designer",
    template: "%s — Nikita Kasperovich",
  },
  description:
    "Motion Design, 3D Animation, Product Visualization, and AI-assisted production.",
  openGraph: {
    title: "Nikita Kasperovich — Motion Designer",
    description:
      "Motion Design, 3D Animation, Product Visualization, and AI-assisted production.",
    url: siteUrl,
    siteName: "Nikita Kasperovich",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nikita Kasperovich — Motion Designer",
    description:
      "Motion Design, 3D Animation, Product Visualization, and AI-assisted production.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t){document.documentElement.setAttribute("data-theme",t)}else{if(window.matchMedia("(prefers-color-scheme:light)").matches){document.documentElement.setAttribute("data-theme","light")}}var l=localStorage.getItem("locale");if(l){document.documentElement.lang=l}else{if(navigator.language&&navigator.language.startsWith("ru")){document.documentElement.lang="ru"}}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <Preloader />
        <a
          href="#main-content"
          className="fixed -top-full left-4 z-[100] px-4 py-2 text-sm transition-all focus:top-4"
          style={{ background: "var(--background)", color: "var(--text-primary)", border: "1px solid var(--border)", borderRadius: "8px" }}
        >
          Skip to content
        </a>
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  )
}
