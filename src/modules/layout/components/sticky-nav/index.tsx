"use client"

import { useEffect, useState } from "react"

interface StickyNavContentProps {
  children: React.ReactNode
}

/**
 * Translucent dark bar with a constant height (no shrink-on-scroll layout
 * jump). A hairline + soft shadow fades in once content scrolls beneath it.
 */
export default function StickyNavContent({ children }: StickyNavContentProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header
        className={`relative mx-auto h-16 bg-[#191718]/90 backdrop-blur-xl backdrop-saturate-150 transition-shadow duration-200 ${
          isScrolled ? "shadow-[0_1px_0_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.18)]" : ""
        }`}
      >
        <nav className="content-container flex h-full w-full items-center justify-between text-brand-peach">
          {children}
        </nav>
      </header>
    </div>
  )
}
