import LocalizedClientLink from "@modules/common/components/localized-client-link"
import OrderRow from "@modules/account/components/order-row"
import { HttpTypes } from "@medusajs/types"
import { t } from "@lib/util/translations"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
  countryCode: string
  exchangeRate?: number
}

const Overview = ({ customer, orders, countryCode, exchangeRate }: OverviewProps) => {
  const completion = getProfileCompletion(customer)

  return (
    <div className="flex flex-col gap-8" data-testid="overview-page-wrapper">
      <h1 className="hidden text-title-1 text-ink small:block" data-testid="welcome-message" data-value={customer?.first_name}>
        {t({ uz: "Salom", ru: "Здравствуйте", en: "Hello" }, countryCode)}
        {customer?.first_name ? `, ${customer.first_name}` : ""}
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <LocalizedClientLink href="/account/profile" className="flex flex-col gap-1 rounded-card bg-surface-raised p-5 shadow-card">
          <span className="text-footnote text-ink-muted">{t({ uz: "Profil", ru: "Профиль", en: "Profile" }, countryCode)}</span>
          <span className="text-title-2 text-ink num" data-testid="customer-profile-completion" data-value={completion}>
            {completion}%
          </span>
          <span className="text-footnote text-ink-muted">{t({ uz: "toʼldirilgan", ru: "заполнено", en: "complete" }, countryCode)}</span>
        </LocalizedClientLink>
        <LocalizedClientLink href="/account/addresses" className="flex flex-col gap-1 rounded-card bg-surface-raised p-5 shadow-card">
          <span className="text-footnote text-ink-muted">{t({ uz: "Manzillar", ru: "Адреса", en: "Addresses" }, countryCode)}</span>
          <span className="text-title-2 text-ink num" data-testid="addresses-count" data-value={customer?.addresses?.length || 0}>
            {customer?.addresses?.length || 0}
          </span>
          <span className="text-footnote text-ink-muted">{t({ uz: "saqlangan", ru: "сохранено", en: "saved" }, countryCode)}</span>
        </LocalizedClientLink>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-title-3 text-ink">{t({ uz: "Soʼnggi buyurtmalar", ru: "Последние заказы", en: "Recent orders" }, countryCode)}</h2>
          {orders && orders.length > 0 && (
            <LocalizedClientLink href="/account/orders" className="text-callout font-medium text-brand-accent-strong hover:underline">
              {t({ uz: "Barchasi", ru: "Все", en: "View all" }, countryCode)}
            </LocalizedClientLink>
          )}
        </div>
        <ul className="flex flex-col gap-3" data-testid="orders-wrapper">
          {orders && orders.length > 0 ? (
            orders.slice(0, 5).map((order) => (
              <li key={order.id} data-testid="order-wrapper" data-value={order.id}>
                <OrderRow order={order} countryCode={countryCode} exchangeRate={exchangeRate} />
              </li>
            ))
          ) : (
            <li className="rounded-card bg-brand-linen p-6 text-callout text-ink-muted" data-testid="no-orders-message">
              {t({ uz: "Hozircha buyurtmalar yoʼq.", ru: "Заказов пока нет.", en: "No orders yet." }, countryCode)}{" "}
              <LocalizedClientLink href="/store" className="font-medium text-brand-accent-strong hover:underline">
                {t({ uz: "Katalogga oʼtish", ru: "Перейти в каталог", en: "Browse rugs" }, countryCode)}
              </LocalizedClientLink>
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  if (!customer) return 0
  let count = 0
  if (customer.email) count++
  if (customer.first_name && customer.last_name) count++
  if (customer.phone) count++
  if (customer.addresses?.find((addr) => addr.is_default_billing)) count++
  return Math.round((count / 4) * 100)
}

export default Overview
