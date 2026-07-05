"use client"

import Hero from "@/components/Hero"
import SelectedWorks from "@/components/SelectedWorks"
import About from "@/components/About"
import Software from "@/components/Software"
import Contact from "@/components/Contact"

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <SelectedWorks />
      <About />
      <Software />
      <Contact />
    </main>
  )
}
