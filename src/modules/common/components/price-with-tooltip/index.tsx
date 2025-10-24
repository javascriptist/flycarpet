"use client"

import { InformationCircleSolid } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState } from "react"

type PriceWithTooltipProps = {
  uzsAmount: number
  usdAmount: number // in cents
  className?: string
  showOriginalPrice?: boolean
}

export default function PriceWithTooltip({
  uzsAmount,
  usdAmount,
  className,
  showOriginalPrice = false,
}: PriceWithTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  // Format UZS amount with consistent locale (en-US for commas)
  const formattedUzs = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(uzsAmount) + " so'm"

  // Format USD amount (already in dollars, not cents)
  const formattedUsd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdAmount)

  return (
    <span className={clx("inline-flex items-center gap-1", className)}>
      <span>{formattedUzs}</span>
      <span
        className="relative inline-flex items-center cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <InformationCircleSolid className="w-4 h-4 text-ui-fg-subtle hover:text-ui-fg-base transition-colors" />
        {showTooltip && (
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50 shadow-lg">
            {formattedUsd}
            <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></span>
          </span>
        )}
      </span>
    </span>
  )
}
