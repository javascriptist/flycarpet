import { convertToLocale, formatUzsAmount } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx, Text } from "@medusajs/ui"

type LineItemPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  className?: string
  currencyCode?: string
  exchangeRate?: number
}

export default function LineItemPrice({
  item,
  style = "default",
  className,
  currencyCode,
  exchangeRate,
}: LineItemPriceProps) {
  const currency = currencyCode || "usd"
  const { total, original_total } = item
  const hasDiscount = total < original_total

  // For UZS conversion: multiply by exchange rate if provided
  const isUsd = currency?.toLowerCase() === "usd"
  const shouldConvert = isUsd && exchangeRate

  const formatPrice = (amount: number) => {
    if (shouldConvert) {
      const uzsAmount = Math.round(amount * exchangeRate!)
      const uzsFormatted = formatUzsAmount(uzsAmount)
      const usdFormatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
      return `${uzsFormatted} (${usdFormatted})`
    }
    return convertToLocale({
      amount,
      currency_code: currency,
    })
  }

  return (
    <div
      className={clx("flex flex-col text-ui-fg-base txt-medium-plus", className, {
        "items-end": style === "tight",
      })}
    >
      {hasDiscount && (
        <Text className="text-ui-fg-subtle line-through txt-small">
          {formatPrice(original_total)}
        </Text>
      )}
      <Text className="txt-medium-plus" data-testid="product-price">
        {formatPrice(total)}
      </Text>
    </div>
  )
}
