"use client"

import { formatUzsAmount } from "@lib/util/money"

type Props = {
  uzsAmount: number
  usdAmount: number
}

export default function PriceWithTooltip({ uzsAmount, usdAmount }: Props) {
  const uzsFormatted = formatUzsAmount(uzsAmount)
  const usdFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdAmount)

  return (
    <span className="relative group">
      {uzsFormatted}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {usdFormatted}
      </span>
    </span>
  )
}
