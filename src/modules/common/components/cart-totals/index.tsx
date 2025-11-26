import { convertToLocale, formatUzsAmount } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type CartTotalsProps = {
  totals: HttpTypes.StoreCart | HttpTypes.StoreOrder
  countryCode?: string
  exchangeRate?: number
}

const CartTotals = ({ totals, countryCode, exchangeRate }: CartTotalsProps) => {
  const isLang = countryCode === "uz"
  const currencyCode = totals.currency_code?.toUpperCase() || "USD"
  
  const {
    subtotal = 0,
    discount_total = 0,
    gift_card_total = 0,
    tax_total = 0,
    shipping_total = 0,
    total = 0,
  } = totals

  const isUsd = currencyCode === "USD"
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
      currency_code: currencyCode,
    })
  }

  return (
    <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle">
      <div className="flex items-center justify-between">
        <Text className="flex gap-x-1 items-center">
          {isLang ? "Oraliq jami" : "Промежуточный итог"}
        </Text>
        <Text data-testid="cart-subtotal">{formatPrice(subtotal)}</Text>
      </div>
      {!!discount_total && (
        <div className="flex items-center justify-between">
          <Text>{isLang ? "Chegirma" : "Скидка"}</Text>
          <Text className="text-ui-fg-interactive" data-testid="cart-discount">
            - {formatPrice(discount_total)}
          </Text>
        </div>
      )}
      {!!gift_card_total && (
        <div className="flex items-center justify-between">
          <Text>{isLang ? "Sovg'a kartasi" : "Подарочная карта"}</Text>
          <Text className="text-ui-fg-interactive" data-testid="cart-gift-card-amount">
            - {formatPrice(gift_card_total)}
          </Text>
        </div>
      )}
      <div className="flex items-center justify-between">
        <Text>{isLang ? "Yetkazib berish" : "Доставка"}</Text>
        <Text data-testid="cart-shipping">{formatPrice(shipping_total)}</Text>
      </div>
      <div className="flex items-center justify-between">
        <Text>{isLang ? "Soliqlar" : "Налоги"}</Text>
        <Text data-testid="cart-taxes">{formatPrice(tax_total)}</Text>
      </div>
      <div className="h-px w-full border-b border-gray-200 my-2" />
      <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium-plus">
        <Text>{isLang ? "Jami" : "Итого"}</Text>
        <Text className="txt-xlarge-plus" data-testid="cart-total">
          {formatPrice(total)}
        </Text>
      </div>
    </div>
  )
}

export default CartTotals
