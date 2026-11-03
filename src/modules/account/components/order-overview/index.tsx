import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import OrderRow from "@modules/account/components/order-row"
import { t } from "@lib/util/translations"

const OrderOverview = ({
  orders,
  countryCode,
  exchangeRate,
}: {
  orders: HttpTypes.StoreOrder[]
  countryCode: string
  exchangeRate?: number
}) => {
  if (orders?.length) {
    return (
      <ul className="flex w-full flex-col gap-3">
        {orders.map((o) => (
          <li key={o.id}>
            <OrderRow order={o} countryCode={countryCode} exchangeRate={exchangeRate} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="flex w-full flex-col items-center gap-3 rounded-card bg-brand-linen px-6 py-12 text-center" data-testid="no-orders-container">
      <h2 className="text-title-3 text-ink">{t({ uz: "Hozircha buyurtmalar yoʼq", ru: "Заказов пока нет", en: "No orders yet" }, countryCode)}</h2>
      <p className="text-callout text-ink-muted">
        {t({ uz: "Birinchi gilamingizni tanlang.", ru: "Выберите свой первый ковёр.", en: "Find your first rug." }, countryCode)}
      </p>
      <LocalizedClientLink href="/store" className="btn-primary mt-2" data-testid="continue-shopping-button">
        {t({ uz: "Katalogga oʼtish", ru: "Перейти в каталог", en: "Browse rugs" }, countryCode)}
      </LocalizedClientLink>
    </div>
  )
}

export default OrderOverview
