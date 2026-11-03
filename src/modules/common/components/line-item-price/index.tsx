import { formatMoney } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type LineItemPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  className?: string
  currencyCode?: string
  exchangeRate?: number
  countryCode?: string
}

export default function LineItemPrice({
  item,
  style = "default",
  className,
  currencyCode,
  exchangeRate,
  countryCode,
}: LineItemPriceProps) {
  const currency = currencyCode || "usd"
  const { total, original_total } = item
  const hasDiscount = total < original_total

  const formatPrice = (amount: number) =>
    formatMoney(amount, currency, exchangeRate, countryCode)


  return (
    <div
      className={[
        "flex shrink-0 flex-col text-callout num",
        style === "tight" ? "items-end text-right" : "",
        className ?? "",
      ].join(" ")}
    >
      {hasDiscount && (
        <span className="text-footnote text-ink-subtle line-through">
          {formatPrice(original_total)}
        </span>
      )}
      <span className={hasDiscount ? "font-medium text-brand-accent-strong" : "font-medium text-ink"} data-testid="product-price">
        {formatPrice(total)}
      </span>
    </div>
  )
}
