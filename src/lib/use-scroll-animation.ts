import { useEffect, type RefObject } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function useScrollAnimation(
  ref: RefObject<HTMLElement | null>,
  stagger = 0,
  start = "top 80%"
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const targets: gsap.TweenTarget = stagger > 0
      ? el.querySelectorAll("[data-animate]")
      : el

    gsap.set(targets, { opacity: 0, y: 30 })

    const st = { current: null as ScrollTrigger | null }

    st.current = ScrollTrigger.create({
      trigger: el,
      start,
      onEnter: () => {
        if (el.dataset.animated === "true") {
          st.current?.kill()
          return
        }
        el.dataset.animated = "true"

        gsap.fromTo(
          targets,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: stagger || undefined,
            onComplete: () => { st.current?.kill() },
          }
        )
      },
    })

    return () => {
      st.current?.kill()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
