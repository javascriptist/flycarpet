import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import AccountPageHeader from "@modules/account/components/page-header"
import { getExchangeRate } from "@lib/data/exchange-rate"
import { t } from "@lib/util/translations"
import TransferRequestForm from "@modules/account/components/transfer-request-form"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const orders = await listOrders()
  const rate = await getExchangeRate()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <AccountPageHeader
        title={t({ uz: "Buyurtmalar", ru: "Заказы", en: "Orders" }, countryCode)}
        subtitle={t(
          {
            uz: "Buyurtmalaringiz holati va tafsilotlari.",
            ru: "Статус и детали ваших заказов.",
            en: "The status and details of your orders.",
          },
          countryCode
        )}
      />
      <OrderOverview orders={orders} countryCode={countryCode} exchangeRate={rate?.rate} />
      <div className="mt-12 border-t border-line pt-8">
        <TransferRequestForm />
      </div>
    </div>
  )
}
