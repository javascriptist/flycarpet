import { Heading } from "@medusajs/ui"
import { getExchangeRate } from "@lib/data/exchange-rate"
import { convertUsdToUzs } from "@lib/util/money"
import { cookies as nextCookies } from "next/headers"
import Image from "next/image"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
  countryCode?: string
}

export default async function OrderCompletedTemplate({
  order,
  countryCode,
}: OrderCompletedTemplateProps) {
  const exchangeRateObj = await getExchangeRate()
  const exchangeRate = exchangeRateObj?.rate || 12750
  const isLang = countryCode === "uz"
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="py-6 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div
          className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-10"
          data-testid="order-complete-container"
        >
          <Heading
            level="h1"
            className="flex flex-col gap-y-3 text-ui-fg-base text-3xl mb-4"
          >
            <span>{isLang ? "Buyurtma qabul qilindi!" : "Заказ принят!"}</span>
            <span>{isLang ? "Davom etish uchun to'lovni amalga oshiring" : "Оплатите заказ для продолжения"}</span>
          </Heading>
          
          {/* Direct Payme Form Button */}
          {order.total > 0 && (() => {
            // Use shared conversion logic
            const uzs = convertUsdToUzs(order.total, exchangeRate)
            const tiyin = Math.round(uzs * 100)
            return (
              <form
                method="POST"
                action="https://checkout.paycom.uz"
                className="w-full sm:w-auto"
              >
                <input type="hidden" name="merchant" value={process.env.NEXT_PUBLIC_PAYME_MERCHANT_ID} />
                <input type="hidden" name="amount" value={tiyin} />
                <input type="hidden" name="account[order_id]" value={order.id} />
                <button 
                  type="submit" 
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-8 py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <Image 
                    src="/payme_white.png" 
                    alt="Payme" 
                    width={80} 
                    height={24}
                    className="h-6 w-auto"
                  />
                  <span>{isLang ? "bilan to'lash" : "оплатить с"}</span>
                </button>
              </form>
            )
          })()}
          
          <OrderDetails order={order} countryCode={countryCode} />
          <Heading level="h2" className="flex flex-row text-3xl-regular">
            {isLang ? "Xulosa" : "Резюме"}
          </Heading>
          <Items order={order} />
          <CartTotals totals={order} countryCode={countryCode} />
          <ShippingDetails order={order} countryCode={countryCode} />
          <PaymentDetails order={order} countryCode={countryCode} />
          <Help countryCode={countryCode} />
        </div>
      </div>
    </div>
  )
}
