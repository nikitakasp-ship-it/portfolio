"use client"

import dynamic from "next/dynamic"
import Navigation from "@/components/Navigation"
import Hero from "@/components/Hero"
import SelectedWorks from "@/components/SelectedWorks"
import About from "@/components/About"
import Software from "@/components/Software"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false })

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Navigation />
      <main id="main-content">
        <Hero />
        <SelectedWorks />
        <About />
        <Software />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
