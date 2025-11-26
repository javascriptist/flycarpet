"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowUpRightMini } from "@medusajs/icons"

type Props = {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function InteractiveLink({
  href,
  children,
  className = "",
  onClick,
}: Props) {
  return (
    <LocalizedClientLink
      href={href}
      className={`flex items-center gap-x-1 text-ui-fg-interactive hover:text-ui-fg-interactive-hover transition-colors ${className}`}
      onClick={onClick}
    >
      <span>{children}</span>
      <ArrowUpRightMini />
    </LocalizedClientLink>
  )
}

// Export as named export for alternative imports (e.g., UnderlineLink)
export { InteractiveLink as UnderlineLink }
