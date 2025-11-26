import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { convertUsdToUzs } from "@lib/util/money"
import PriceWithTooltip from "@modules/common/components/price-with-tooltip"

export default function ProductPrice({
  product,
  variant,
  exchangeRate,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  exchangeRate?: number
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  // Use provided exchange rate or fallback
  const rate = exchangeRate || 12750

  const calculatedPriceUzs = convertUsdToUzs(selectedPrice.calculated_price_number, rate)
  const originalPriceUzs = selectedPrice.original_price_number 
    ? convertUsdToUzs(selectedPrice.original_price_number, rate)
    : null

  return (
    <div className="flex flex-col text-ui-fg-base">
      <span
        className={clx("text-xl-semi", {
          "text-ui-fg-interactive": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && " "}
        <span data-testid="product-price">
          <PriceWithTooltip 
            uzsAmount={calculatedPriceUzs}
            usdAmount={selectedPrice.calculated_price_number}
          />
        </span>
      </span>
      {selectedPrice.price_type === "sale" && originalPriceUzs && (
        <>
          <p>
            <span className="text-ui-fg-subtle">Original: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
            >
              <PriceWithTooltip 
                uzsAmount={originalPriceUzs}
                usdAmount={selectedPrice.original_price_number!}
              />
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
