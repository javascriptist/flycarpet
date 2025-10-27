import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import OrderPaymeButton from "@modules/order/components/order-payme-button"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
  countryCode?: string
}

export default async function OrderCompletedTemplate({
  order,
  countryCode,
}: OrderCompletedTemplateProps) {
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
            <span>{isLang ? "Rahmat!" : "Спасибо!"}</span>
            <span>{isLang ? "Sizning buyurtmangiz muvaffaqiyatli yaratildi." : "Ваш заказ был успешно создан."}</span>
          </Heading>
          
          {/* Payme Payment Button - Show if order is not paid yet */}
          <OrderPaymeButton 
            orderId={order.id}
            amount={order.total || 0}
            countryCode={countryCode}
            paymentStatus={order.payment_status}
          />
          
          <OrderDetails order={order} />
          <Heading level="h2" className="flex flex-row text-3xl-regular">
            {isLang ? "Xulosa" : "Резюме"}
          </Heading>
          <Items order={order} />
          <CartTotals totals={order} countryCode={countryCode} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <Help />
        </div>
      </div>
    </div>
  )
}
