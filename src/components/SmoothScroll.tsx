"use client"

import { useEffect } from "react"
import Lenis from "lenis"

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const lenis = new Lenis({
      duration: 1.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,
    })

    let animId: number
    let active = true

    function raf(time: number) {
      if (!active) return
      lenis.raf(time)
      animId = requestAnimationFrame(raf)
    }

    animId = requestAnimationFrame(raf)

    function onVisibility() {
      if (document.hidden) {
        active = false
        cancelAnimationFrame(animId)
      } else {
        active = true
        animId = requestAnimationFrame(raf)
      }
    }

    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      active = false
      cancelAnimationFrame(animId)
      document.removeEventListener("visibilitychange", onVisibility)
      lenis.destroy()
    }
  }, [])

  return null
}
