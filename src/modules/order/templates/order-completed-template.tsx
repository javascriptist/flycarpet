import { getExchangeRate } from "@lib/data/exchange-rate"
import { convertUsdToUzs, formatUzsAmount } from "@lib/util/money"
import Image from "next/image"

import OrderView from "@modules/order/components/order-view"
import { HttpTypes } from "@medusajs/types"
import { t } from "@lib/util/translations"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
  countryCode?: string
}

const PAID_STATUSES = ["captured", "partially_captured", "refunded", "partially_refunded", "canceled"]

/**
 * Order confirmation. The order exists; payment happens next with Payme
 * (post-order flow), so paying is the one primary action on the page.
 */
export default async function OrderCompletedTemplate({
  order,
  countryCode,
}: OrderCompletedTemplateProps) {
  const exchangeRateObj = await getExchangeRate()
  const exchangeRate = exchangeRateObj?.rate || 12750
  const tr = (m: { uz: string; ru: string; en: string }) => t(m, countryCode)

  // Same conversion the Payme form has always used (amount in tiyin)
  const uzs = convertUsdToUzs(order.total, exchangeRate)
  const tiyin = Math.round(uzs * 100)
  const needsPayment = order.total > 0 && !PAID_STATUSES.includes(String((order as any).payment_status ?? ""))

  return (
    <div className="py-8 small:py-12">
      <div className="content-container mx-auto flex max-w-3xl flex-col gap-6" data-testid="order-complete-container">
        <header className="flex flex-col items-center gap-3 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-700" aria-hidden>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <h1 className="text-title-1 text-ink">
            {tr({ uz: "Buyurtma qabul qilindi", ru: "Заказ принят", en: "Order received" })}
          </h1>
          <p className="max-w-[48ch] text-callout text-ink-muted">
            {tr({
              uz: "Tasdiqlash xati yuborildi:",
              ru: "Подтверждение отправлено на",
              en: "We’ve sent a confirmation to",
            })}{" "}
            <span className="font-medium text-ink">{order.email}</span>
          </p>
        </header>

        {needsPayment && (
          <section className="flex flex-col items-center gap-4 rounded-card bg-surface-raised p-6 text-center shadow-card">
            <div className="flex flex-col gap-1">
              <span className="text-footnote text-ink-muted">
                {tr({ uz: "Toʼlov uchun", ru: "К оплате", en: "Amount to pay" })}
              </span>
              <span className="text-title-1 text-ink num">{formatUzsAmount(uzs, countryCode)}</span>
            </div>
            <form method="POST" action="https://checkout.paycom.uz" className="w-full small:w-auto">
              <input type="hidden" name="merchant" value={process.env.NEXT_PUBLIC_PAYME_MERCHANT_ID} />
              <input type="hidden" name="amount" value={tiyin} />
              <input type="hidden" name="account[order_id]" value={order.id} />
              <button
                type="submit"
                className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#007D8A] px-10 font-medium text-white shadow-card transition hover:bg-[#006E7A] small:w-auto"
                data-testid="payme-button"
              >
                <span>{tr({ uz: "Toʼlash", ru: "Оплатить через", en: "Pay with" })}</span>
                <Image src="/payme_white.png" alt="Payme" width={80} height={24} className="h-6 w-auto" />
              </button>
            </form>
            <p className="max-w-[44ch] text-footnote text-ink-subtle">
              {tr({
                uz: "Siz Payme xavfsiz toʼlov sahifasiga oʼtasiz. Toʼlovdan soʼng buyurtmangiz tayyorlanadi.",
                ru: "Вы перейдёте на защищённую страницу Payme. После оплаты мы начнём готовить заказ.",
                en: "You’ll continue on Payme’s secure page. We start preparing your order once it’s paid.",
              })}
            </p>
          </section>
        )}

        <OrderView order={order} countryCode={countryCode} exchangeRate={exchangeRate} />
      </div>
    </div>
  )
}
