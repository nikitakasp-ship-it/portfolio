"use client"

import { useEffect, useState } from "react"
import { gsap } from "gsap"

export default function Preloader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false)
      return
    }

    const tl = gsap.timeline({ onComplete: () => setVisible(false) })
    tl.set(".preloader-mark", { opacity: 0, scale: 0.92 })
      .to(".preloader-mark", { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" })
      .to(".preloader-mark", { opacity: 0, scale: 1.08, duration: 0.5, ease: "power3.in" }, "+=0.8")
      .to(".preloader", { autoAlpha: 0, duration: 0.4, ease: "power3.out" }, "-=0.2")
  }, [])

  if (!visible) return null

  return (
    <div className="preloader" aria-hidden="true">
      <span className="preloader-mark">NK</span>
    </div>
  )
}
