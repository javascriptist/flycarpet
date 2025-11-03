'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface StickyNavContentProps {
  children: React.ReactNode
}

export default function StickyNavContent({ children }: StickyNavContentProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header 
        className={`relative mx-auto border-b bg-white border-ui-border-base transition-all duration-300 ${
          isScrolled 
            ? 'h-14 shadow-md' 
            : 'h-16'
        }`}
      >
        <nav className={`content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular transition-all duration-300`}>
          {children}
        </nav>
      </header>
    </div>
  )
}
