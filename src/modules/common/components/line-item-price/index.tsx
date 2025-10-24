import { getPercentageDiff } from "@lib/util/get-precentage-diff"
import { convertToLocale, formatUzsAmount } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"

type LineItemPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  currencyCode: string
  exchangeRate?: number // Optional UZS exchange rate
}

const LineItemPrice = ({
  item,
  style = "default",
  currencyCode,
  exchangeRate,
}: LineItemPriceProps) => {
  const { total, original_total } = item
  const originalPrice = original_total
  const currentPrice = total
  const hasReducedPrice = currentPrice < originalPrice

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
    <div className="flex flex-col gap-x-2 text-ui-fg-subtle items-end">
      <div className="text-left">
        {hasReducedPrice && (
          <>
            <p>
              {style === "default" && (
                <span className="text-ui-fg-subtle">Original: </span>
              )}
              <span
                className="line-through text-ui-fg-muted"
                data-testid="product-original-price"
              >
                {formatPrice(originalPrice)}
              </span>
            </p>
            {style === "default" && (
              <span className="text-ui-fg-interactive">
                -{getPercentageDiff(originalPrice, currentPrice || 0)}%
              </span>
            )}
          </>
        )}
        <span
          className={clx("text-base-regular", {
            "text-ui-fg-interactive": hasReducedPrice,
          })}
          data-testid="product-price"
        >
          {formatPrice(currentPrice)}
        </span>
      </div>
    </div>
  )
}

export default LineItemPrice
