import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import CheckoutSteps from "@modules/checkout/components/checkout-steps"

export default async function CheckoutForm({
  cart,
  customer,
  countryCode,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  countryCode: string
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id!)

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  const card = "rounded-card bg-surface-raised p-5 shadow-card small:p-8"

  return (
    <div className="grid w-full grid-cols-1 gap-y-4">
      <div className="pb-2">
        <CheckoutSteps countryCode={countryCode} />
      </div>
      <section className={card}>
        <Addresses cart={cart} customer={customer} countryCode={countryCode} />
      </section>
      <section className={card}>
        <Shipping cart={cart} availableShippingMethods={shippingMethods} countryCode={countryCode} />
      </section>
      <section className={card}>
        <Payment cart={cart} availablePaymentMethods={paymentMethods} countryCode={countryCode} />
      </section>
      <section className={card}>
        <Review cart={cart} countryCode={countryCode} />
      </section>
    </div>
  )
}
