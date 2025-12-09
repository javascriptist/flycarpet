import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { convertUsdToUzs, formatUzsAmount } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"

export default function ProductPrice({
  product,
  variant,
  region,
  exchangeRate,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  region?: HttpTypes.StoreRegion
  exchangeRate?: number
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

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
      calculated_price: formatUzsAmount(calculatedPriceUzs),
      original_price: originalPriceUzs ? formatUzsAmount(originalPriceUzs) : price.original_price,
    }
  }, [variant, variantPrice, cheapestPrice, exchangeRate])

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  return (
    <div className="flex flex-col text-ui-fg-base">
      <span
        className={clx("text-xl-semi", {
          "text-ui-fg-interactive": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && " "}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <>
          <p>
            <span className="text-ui-fg-subtle">Original: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-ui-fg-interactive">
            -{selectedPrice.percentage_diff}%
          </span>
        </>
      )}
    </div>
  )
}
