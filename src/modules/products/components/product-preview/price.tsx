import { VariantPrice } from "types/global"
import { getExchangeRate } from "@lib/data/exchange-rate"
import { formatStorePrice } from "@lib/util/money"
import { t } from "@lib/util/translations"

export default async function PreviewPrice({
  price,
  countryCode,
  perMetre = false,
}: {
  price: VariantPrice
  countryCode?: string
  perMetre?: boolean
}) {
  if (!price) {
    return null
  }

  const exchangeRate = await getExchangeRate()
  const rate = exchangeRate?.rate
  const isSale = price.price_type === "sale"

  return (
    <p className="flex flex-wrap items-baseline gap-x-2 text-callout num">
      <span
        className={isSale ? "font-medium text-brand-accent-strong" : "font-medium text-ink"}
        data-testid="price"
      >
        {formatStorePrice(price.calculated_price_number, rate, countryCode)}
        {perMetre && (
          <span className="font-normal text-ink-muted">
            {" "}
            {t({ uz: "/ m", ru: "/ м", en: "/ m" }, countryCode)}
          </span>
        )}
      </span>
      {isSale && price.original_price_number && (
        <span className="text-footnote text-ink-subtle line-through" data-testid="original-price">
          {formatStorePrice(price.original_price_number, rate, countryCode)}
        </span>
      )}
    </p>
  )
}
