import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"
import { getExchangeRate } from "@lib/data/exchange-rate"
import { convertUsdToUzs } from "@lib/util/money"
import PriceWithTooltip from "@modules/common/components/price-with-tooltip"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  // Get exchange rate and convert to UZS
  const exchangeRate = await getExchangeRate()
  const rate = exchangeRate?.rate || 12750 // Fallback rate

  const calculatedPriceUzs = convertUsdToUzs(price.calculated_price_number, rate)
  const originalPriceUzs = price.original_price_number 
    ? convertUsdToUzs(price.original_price_number, rate)
    : null

  return (
    <>
      {price.price_type === "sale" && originalPriceUzs && price.original_price_number && (
        <Text
          className="line-through text-ui-fg-muted"
          data-testid="original-price"
        >
          <PriceWithTooltip 
            uzsAmount={originalPriceUzs}
            usdAmount={price.original_price_number}
          />
        </Text>
      )}
      <Text
        className={clx("text-ui-fg-muted", {
          "text-ui-fg-interactive": price.price_type === "sale",
        })}
        data-testid="price"
      >
        <PriceWithTooltip 
          uzsAmount={calculatedPriceUzs}
          usdAmount={price.calculated_price_number}
        />
      </Text>
    </>
  )
}
