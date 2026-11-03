import { t } from "@lib/util/translations"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import { getExchangeRate } from "@lib/data/exchange-rate"

const CheckoutSummary = async ({ cart, countryCode }: { cart: any; countryCode: string }) => {
  const exchangeRate = await getExchangeRate()
  const rate = exchangeRate?.rate

  return (
    <div className="small:sticky small:top-8">
      <div className="flex flex-col gap-5 rounded-card bg-surface-raised p-5 shadow-card small:p-6">
        <h2 className="text-headline text-ink">
          {t({ uz: "Buyurtma", ru: "Ваш заказ", en: "Order summary" }, countryCode)}
        </h2>
        <ItemsPreviewTemplate cart={cart} exchangeRate={rate} countryCode={countryCode} />
        <div className="border-t border-line pt-4">
          <CartTotals totals={cart} exchangeRate={rate} countryCode={countryCode} />
        </div>
        <DiscountCode cart={cart} countryCode={countryCode} />
      </div>
    </div>
  )
}

export default CheckoutSummary
