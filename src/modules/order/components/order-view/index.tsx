import { HttpTypes } from "@medusajs/types"
import Item from "@modules/cart/components/item"
import CartTotals from "@modules/common/components/cart-totals"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { paymentInfoMap } from "@lib/constants"
import { formatMoney } from "@lib/util/money"
import { formatDate, t } from "@lib/util/translations"

type OrderViewProps = {
  order: HttpTypes.StoreOrder
  countryCode?: string
  exchangeRate?: number
  /** Show a note that amounts are converted at today's rate (past orders). */
  convertedNote?: boolean
}

/**
 * Everything about one order, shared by the confirmation page and the
 * account's order details: items + totals, then delivery, contact and
 * payment in a compact grid, then a help line.
 */
export default function OrderView({ order, countryCode, exchangeRate, convertedNote }: OrderViewProps) {
  const tr = (m: { uz: string; ru: string; en: string }) => t(m, countryCode)
  const address = order.shipping_address
  const method = (order as any).shipping_methods?.[0]
  const payment = order.payment_collections?.[0]?.payments?.[0]
  const paymentTitle = payment ? paymentInfoMap[payment.provider_id]?.title ?? payment.provider_id : undefined

  const card = "rounded-card bg-surface-raised p-5 shadow-card small:p-6"

  return (
    <div className="flex flex-col gap-4" data-testid="order-details-container">
      <section className={card} aria-labelledby="order-items">
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <h2 id="order-items" className="text-headline text-ink">
            {tr({ uz: "Mahsulotlar", ru: "Товары", en: "Items" })}
          </h2>
          <span className="text-footnote text-ink-muted num">
            #<span data-testid="order-id">{order.display_id}</span> ·{" "}
            <span data-testid="order-date">{formatDate(order.created_at, countryCode)}</span>
          </span>
        </div>
        <ul className="divide-y divide-line" data-testid="products-table">
          {(order.items ?? []).map((item) => (
            <Item
              key={item.id}
              item={item as any}
              type="preview"
              currencyCode={order.currency_code}
              exchangeRate={exchangeRate}
              countryCode={countryCode}
            />
          ))}
        </ul>
        <div className="mt-2 border-t border-line pt-4">
          <CartTotals totals={order} countryCode={countryCode} exchangeRate={exchangeRate} />
        </div>
        {convertedNote && exchangeRate && order.currency_code?.toLowerCase() === "usd" && (
          <p className="mt-3 text-footnote text-ink-subtle">
            {tr({
              uz: "Summalar bugungi kurs boʼyicha soʼmda koʼrsatilgan.",
              ru: "Суммы показаны в сумах по сегодняшнему курсу.",
              en: "Amounts are shown in soʼm at today’s exchange rate.",
            })}
          </p>
        )}
      </section>

      <section className={`${card} grid grid-cols-1 gap-6 xsmall:grid-cols-2`}>
        <div data-testid="shipping-address-summary">
          <h3 className="mb-1 text-footnote text-ink-muted">
            {tr({ uz: "Yetkazib berish manzili", ru: "Адрес доставки", en: "Delivery address" })}
          </h3>
          <p className="text-callout text-ink">
            {address?.first_name} {address?.last_name}
            <br />
            {address?.address_1} {address?.address_2}
            <br />
            {[address?.postal_code, address?.city].filter(Boolean).join(", ")}
          </p>
        </div>
        <div data-testid="shipping-contact-summary">
          <h3 className="mb-1 text-footnote text-ink-muted">{tr({ uz: "Aloqa", ru: "Контакт", en: "Contact" })}</h3>
          <p className="text-callout text-ink">
            {address?.phone}
            {address?.phone && <br />}
            <span data-testid="order-email">{order.email}</span>
          </p>
        </div>
        {method && (
          <div data-testid="shipping-method-summary">
            <h3 className="mb-1 text-footnote text-ink-muted">{tr({ uz: "Yetkazib berish", ru: "Доставка", en: "Delivery" })}</h3>
            <p className="text-callout text-ink">
              {method.name}
              <span className="text-ink-muted num">
                {" · "}
                {method.total
                  ? formatMoney(method.total, order.currency_code, exchangeRate, countryCode)
                  : tr({ uz: "Bepul", ru: "Бесплатно", en: "Free" })}
              </span>
            </p>
          </div>
        )}
        <div>
          <h3 className="mb-1 text-footnote text-ink-muted">{tr({ uz: "Toʼlov", ru: "Оплата", en: "Payment" })}</h3>
          <p className="text-callout text-ink" data-testid="payment-method">
            {paymentTitle ?? tr({ uz: "Payme orqali", ru: "Через Payme", en: "Via Payme" })}
            {payment?.data?.card_last4 ? <span className="text-ink-muted num"> · •••• {String(payment.data.card_last4)}</span> : null}
          </p>
        </div>
      </section>

      <p className="px-1 text-callout text-ink-muted">
        {tr({ uz: "Savollar bormi?", ru: "Есть вопросы?", en: "Questions about your order?" })}{" "}
        <LocalizedClientLink href="/about" className="font-medium text-brand-accent-strong hover:underline">
          {tr({ uz: "Biz bilan bogʼlaning", ru: "Свяжитесь с нами", en: "Get in touch" })}
        </LocalizedClientLink>
      </p>
    </div>
  )
}
