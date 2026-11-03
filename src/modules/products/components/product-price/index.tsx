"use client"

import { cx } from "@lib/util/cx"

import { getProductPrice } from "@lib/util/get-product-price"
import { convertUsdToUzs, formatUzsAmount } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"
import { useParams } from "next/navigation"
import { getLang, t } from "@lib/util/translations"

export default function ProductPrice({
  product,
  variant,
  region,
  exchangeRate,
  compact = false,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  region?: HttpTypes.StoreRegion
  exchangeRate?: number
  compact?: boolean
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const countryCode = useParams()?.countryCode as string | undefined

  const selectedPrice = useMemo(() => {
    const price = variant ? variantPrice : cheapestPrice
    
    if (!price || !exchangeRate) {
      return price
    }
    
    // Convert prices to UZS
    const calculatedPriceUzs = convertUsdToUzs(price.calculated_price_number, exchangeRate)
    const originalPriceUzs = price.original_price_number
      ? convertUsdToUzs(price.original_price_number, exchangeRate)
      : null
    
    return {
      ...price,
      calculated_price: formatUzsAmount(calculatedPriceUzs, countryCode),
      original_price: originalPriceUzs ? formatUzsAmount(originalPriceUzs, countryCode) : price.original_price,
    }
  }, [variant, variantPrice, cheapestPrice, exchangeRate, countryCode])

  if (!selectedPrice) {
    return compact ? null : <div className="h-8 w-40 rounded-control bg-brand-linen animate-pulse" />
  }

  const isSale = selectedPrice.price_type === "sale"
  const showFrom = !variant && (product.variants?.length ?? 0) > 1
  const isUz = getLang(countryCode) === "uz"

  if (compact) {
    return <span className="num">{selectedPrice.calculated_price}</span>
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-baseline gap-2">
        {showFrom && !isUz && (
          <span className="text-callout text-ink-muted">{t({ uz: "", ru: "от", en: "from" }, countryCode)}</span>
        )}
        <span
          className={cx("text-title-2 num", isSale ? "text-brand-accent-strong" : "text-ink")}
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
        {showFrom && isUz && <span className="text-callout text-ink-muted">dan</span>}
      </span>
      {isSale && (
        <span className="flex items-center gap-2 text-footnote">
          <span
            className="text-ink-muted line-through num"
            data-testid="original-product-price"
            data-value={selectedPrice.original_price_number}
          >
            {selectedPrice.original_price}
          </span>
          <span className="rounded-full bg-brand-accent-strong px-2 py-0.5 font-medium text-white num">
            −{selectedPrice.percentage_diff}%
          </span>
        </span>
      )}
    </div>
  )
}
