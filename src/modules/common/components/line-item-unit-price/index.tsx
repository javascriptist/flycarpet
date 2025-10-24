import { convertToLocale, formatUzsAmount } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"

type LineItemUnitPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  currencyCode: string
  exchangeRate?: number // Optional UZS exchange rate
}

const LineItemUnitPrice = ({
  item,
  style = "default",
  currencyCode,
  exchangeRate,
}: LineItemUnitPriceProps) => {
  const { total, original_total } = item
  const hasReducedPrice = total < original_total

  const percentage_diff = Math.round(
    ((original_total - total) / original_total) * 100
  )

  // Convert to UZS if rate provided and currency is USD
  const isUsd = currencyCode?.toLowerCase() === "usd"
  const shouldConvert = isUsd && exchangeRate

  const formatPrice = (amount: number) => {
    if (shouldConvert) {
      // Convert USD cents to UZS and show both
      const usdDollars = amount 
      const uzsAmount = Math.round(usdDollars * exchangeRate!)
      const uzsFormatted = formatUzsAmount(uzsAmount)
      const usdFormatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(usdDollars)
      return `${uzsFormatted} (${usdFormatted})`
    }
    return convertToLocale({
      amount,
      currency_code: currencyCode,
    })
  }

  return (
    <div className="flex flex-col text-ui-fg-muted justify-center h-full">
      {hasReducedPrice && (
        <>
          <p>
            {style === "default" && (
              <span className="text-ui-fg-muted">Original: </span>
            )}
            <span
              className="line-through"
              data-testid="product-unit-original-price"
            >
              {formatPrice(original_total / item.quantity)}
            </span>
          </p>
          {style === "default" && (
            <span className="text-ui-fg-interactive">-{percentage_diff}%</span>
          )}
        </>
      )}
      <span
        className={clx("text-base-regular", {
          "text-ui-fg-interactive": hasReducedPrice,
        })}
        data-testid="product-unit-price"
      >
        {formatPrice(total / item.quantity)}
      </span>
    </div>
  )
}

export default LineItemUnitPrice
