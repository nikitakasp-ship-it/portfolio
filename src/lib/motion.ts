export const easings = {
  /** Standard hover/card ease */
  hover: "cubic-bezier(0.215, 0.61, 0.355, 1)",
  /** GSAP power3.out equivalent for CSS transitions */
  out: "cubic-bezier(0.215, 0.61, 0.355, 1)",
  /** GSAP power3.in equivalent for CSS transitions */
  in: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
} as const

export const durations = {
  /** Quick fade for overlays */
  fast: 200,
  /** Standard hover transition */
  normal: 300,
  /** Page entrance/exit */
  slow: 600,
  /** Hero entrance */
  hero: 700,
} as const

export const gsapDefaults = {
  ease: "power3.out",
  duration: 0.6,
  stagger: 0.1,
} as const
