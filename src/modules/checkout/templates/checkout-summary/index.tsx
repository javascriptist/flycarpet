import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import { getExchangeRate } from "@lib/data/exchange-rate"

const CheckoutSummary = async ({ cart, countryCode }: { cart: any; countryCode: string }) => {
  const exchangeRate = await getExchangeRate()
  const rate = exchangeRate?.rate

  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 ">
      <div className="w-full flex flex-col">
        <Divider className="my-6 small:hidden" />
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular items-baseline"
        >
          {countryCode === "uz" ? "Hisob" : "Счет"}   
        </Heading>
        <Divider className="my-6" />
        <CartTotals totals={cart} exchangeRate={rate} countryCode={countryCode} />
        <ItemsPreviewTemplate cart={cart} exchangeRate={rate} countryCode={countryCode} />
        <div className="my-6">
          <DiscountCode cart={cart} countryCode={countryCode} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
