"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { t } from '@lib/util/translations'

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  },
  countryCode: string
  exchangeRate?: number
}
function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart, countryCode, exchangeRate }: SummaryProps) => {
  const isLang = countryCode === "uz"
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem] text-brand-brown">
        {t({ uz: 'Xaridlar savati', ru: 'Корзина', en: 'Shopping cart' }, countryCode)}
      </Heading>
      <DiscountCode cart={cart} countryCode={countryCode}/>
      <Divider />
      <CartTotals totals={cart} countryCode={countryCode} exchangeRate={exchangeRate} />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button className="w-full h-10 liquid-glass rounded-3xl bg-brand-peach text-black hover:bg-brand-peach-hover transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-peach border-0 ">
          {t({ uz: 'To\u02bclov', ru: 'Оплата', en: 'Checkout' }, countryCode)}
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
