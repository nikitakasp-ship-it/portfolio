"use client"

import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import SmoothScroll from "@/components/SmoothScroll"

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <Navigation />
      {children}
      <Footer />
    </>
  )
}
