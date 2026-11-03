import { formatMoney } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { t } from '@lib/util/translations'

type CartTotalsProps = {
  totals: HttpTypes.StoreCart | HttpTypes.StoreOrder
  countryCode?: string
  exchangeRate?: number
}

const CartTotals = ({ totals, countryCode, exchangeRate }: CartTotalsProps) => {
  const currencyCode = totals.currency_code?.toUpperCase() || "USD"
  
  const {
    subtotal = 0,
    discount_total = 0,
    gift_card_total = 0,
    tax_total = 0,
    shipping_total = 0,
    total = 0,
  } = totals

  const formatPrice = (amount: number) =>
    formatMoney(amount, currencyCode, exchangeRate, countryCode)


  const Row = ({
    label,
    value,
    testId,
    accent,
  }: {
    label: string
    value: string
    testId: string
    accent?: boolean
  }) => (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-ink-muted">{label}</dt>
      <dd className={accent ? "text-brand-accent-strong num" : "text-ink num"} data-testid={testId}>
        {value}
      </dd>
    </div>
  )

  return (
    <dl className="flex flex-col gap-2 text-callout">
      <Row
        label={t({ uz: "Mahsulotlar", ru: "Товары", en: "Subtotal" }, countryCode)}
        value={formatPrice(subtotal)}
        testId="cart-subtotal"
      />
      {!!discount_total && (
        <Row
          label={t({ uz: "Chegirma", ru: "Скидка", en: "Discount" }, countryCode)}
          value={`− ${formatPrice(discount_total)}`}
          testId="cart-discount"
          accent
        />
      )}
      {!!gift_card_total && (
        <Row
          label={t({ uz: "Sovg\u02bca kartasi", ru: "Подарочная карта", en: "Gift card" }, countryCode)}
          value={`− ${formatPrice(gift_card_total)}`}
          testId="cart-gift-card-amount"
          accent
        />
      )}
      <Row
        label={t({ uz: "Yetkazib berish", ru: "Доставка", en: "Delivery" }, countryCode)}
        value={
          shipping_total
            ? formatPrice(shipping_total)
            : (totals as any).shipping_methods?.length
            ? t({ uz: "Bepul", ru: "Бесплатно", en: "Free" }, countryCode)
            : t({ uz: "Keyingi bosqichda", ru: "На следующем шаге", en: "Calculated next" }, countryCode)
        }
        testId="cart-shipping"
      />
      {!!tax_total && (
        <Row
          label={t({ uz: "Soliqlar", ru: "Налоги", en: "Taxes" }, countryCode)}
          value={formatPrice(tax_total)}
          testId="cart-taxes"
        />
      )}
      <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-line pt-3">
        <dt className="text-headline text-ink">{t({ uz: "Jami", ru: "Итого", en: "Total" }, countryCode)}</dt>
        <dd className="text-title-3 font-medium text-ink num" data-testid="cart-total">
          {formatPrice(total)}
        </dd>
      </div>
    </dl>
  )
}

export default CartTotals
