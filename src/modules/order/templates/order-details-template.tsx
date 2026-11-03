import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import OrderView from "@modules/order/components/order-view"
import { t } from "@lib/util/translations"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
  countryCode?: string
  exchangeRate?: number
}

const OrderDetailsTemplate = ({ order, countryCode, exchangeRate }: OrderDetailsTemplateProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <LocalizedClientLink
          href="/account/orders"
          className="-ml-1 inline-flex items-center gap-1 self-start text-callout text-brand-accent-strong"
          data-testid="back-to-overview-button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {t({ uz: "Buyurtmalar", ru: "Заказы", en: "Orders" }, countryCode)}
        </LocalizedClientLink>
        <h1 className="text-title-1 text-ink">
          {t({ uz: "Buyurtma", ru: "Заказ", en: "Order" }, countryCode)} <span className="num">#{order.display_id}</span>
        </h1>
      </div>
      <OrderView order={order} countryCode={countryCode} exchangeRate={exchangeRate} convertedNote />
    </div>
  )
}

export default OrderDetailsTemplate
