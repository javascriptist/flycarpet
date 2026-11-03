import { formatMoney } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"

type LineItemUnitPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  currencyCode: string
  exchangeRate?: number // USD→UZS rate
  countryCode?: string
}

const LineItemUnitPrice = ({
  item,
  style = "default",
  currencyCode,
  exchangeRate,
  countryCode,
}: LineItemUnitPriceProps) => {
  const { total, original_total } = item
  const hasReducedPrice = total < original_total

  const percentage_diff = Math.round(
    ((original_total - total) / original_total) * 100
  )

  const formatPrice = (amount: number) =>
    formatMoney(amount, currencyCode, exchangeRate, countryCode)


  return (
    <div className="flex flex-col text-ui-fg-muted justify-center h-full">
      {hasReducedPrice && (
        <>
          <p>
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
