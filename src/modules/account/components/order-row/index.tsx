import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { formatMoney } from "@lib/util/money"
import { cartItemCount } from "@lib/util/carpet-helpers"
import { formatDate, t } from "@lib/util/translations"

/**
 * One past order: up to three thumbnails, number, date, item count and
 * total, linking to the details page. Totals are converted at today's rate,
 * so they're marked "≈" — the order itself keeps its original currency.
 */
export default function OrderRow({
  order,
  countryCode,
  exchangeRate,
}: {
  order: HttpTypes.StoreOrder
  countryCode: string
  exchangeRate?: number
}) {
  const count = cartItemCount(order.items as any)
  const converted = exchangeRate && order.currency_code?.toLowerCase() === "usd"

  return (
    <LocalizedClientLink
      href={`/account/orders/details/${order.id}`}
      className="flex items-center gap-4 rounded-card bg-surface-raised p-4 shadow-card transition hover:shadow-float"
      data-testid="order-card"
    >
      <div className="flex shrink-0 -space-x-6 xsmall:-space-x-3">
        {(order.items ?? []).slice(0, 3).map((item) => (
          <div key={item.id} className="h-14 w-12 overflow-hidden rounded-control bg-brand-linen ring-2 ring-surface-raised">
            {item.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.thumbnail} alt="" className="h-full w-full object-cover" loading="lazy" />
            )}
          </div>
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-callout text-ink">
          {t({ uz: "Buyurtma", ru: "Заказ", en: "Order" }, countryCode)}{" "}
          <span className="num" data-testid="order-display-id">#{order.display_id}</span>
        </p>
        <p className="text-footnote text-ink-muted num">
          <span data-testid="order-created-at">{formatDate(order.created_at, countryCode)}</span>
          {" · "}
          {t(
            {
              uz: `${count} ta mahsulot`,
              ru: `${count} ${count === 1 ? "товар" : count < 5 ? "товара" : "товаров"}`,
              en: `${count} ${count === 1 ? "item" : "items"}`,
            },
            countryCode
          )}
        </p>
        <p className="text-callout font-medium text-ink num xsmall:hidden">
          {converted ? "≈ " : ""}
          {formatMoney(order.total, order.currency_code, exchangeRate, countryCode)}
        </p>
      </div>
      <span className="hidden shrink-0 text-callout font-medium text-ink num xsmall:block" data-testid="order-amount">
        {converted ? "≈ " : ""}
        {formatMoney(order.total, order.currency_code, exchangeRate, countryCode)}
      </span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-ink-subtle" aria-hidden>
        <path d="M9 6l6 6-6 6" />
      </svg>
    </LocalizedClientLink>
  )
}
