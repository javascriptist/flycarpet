"use client"

import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { t } from "@lib/util/translations"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
  countryCode: string
  exchangeRate?: number
}

export function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart, countryCode, exchangeRate }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-5 rounded-card bg-surface-raised p-5 shadow-card small:p-6">
      <h2 className="text-headline text-ink">
        {t({ uz: "Buyurtma", ru: "Ваш заказ", en: "Order summary" }, countryCode)}
      </h2>
      <CartTotals totals={cart} countryCode={countryCode} exchangeRate={exchangeRate} />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        className="btn-primary w-full"
        data-testid="checkout-button"
      >
        {t({ uz: "Rasmiylashtirish", ru: "Оформить заказ", en: "Checkout" }, countryCode)}
      </LocalizedClientLink>
      <DiscountCode cart={cart} countryCode={countryCode} />
    </div>
  )
}

export default Summary
