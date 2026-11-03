"use client"

import { updateLineItem, deleteLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { firstOrSecond } from "@lib/util/firstorsecond"
import { formatMetres } from "@lib/util/carpet-helpers"
import { t } from "@lib/util/translations"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
  exchangeRate?: number
  countryCode?: string
}

const MAX_QTY = 10

/**
 * One cart line, for both regular rugs and cut-to-length rolls.
 * "full" (cart page): thumbnail, title, details, −/+ quantity, Remove.
 * "preview" (checkout summary): compact, read-only.
 */
const Item = ({ item, type = "full", currencyCode, exchangeRate, countryCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isRoll = item.metadata?.carpet_type === "roll_custom"
  const length = Number(item.metadata?.custom_length ?? item.quantity)
  const width = Number(item.metadata?.width)
  const note = item.metadata?.customer_specifications as string | undefined
  const title = firstOrSecond(item.product_title ?? item.title, countryCode)
  const href = `/products/${item.product_handle}`
  const image = item.thumbnail || (item.variant?.product?.images?.[0] as any)?.url

  const details = isRoll
    ? [
        t({ uz: "Kesib beriladi", ru: "На отрез", en: "Cut to length" }, countryCode),
        width ? `${formatMetres(width, countryCode)} × ${formatMetres(length, countryCode)}` : formatMetres(length, countryCode),
      ].join(" · ")
    : (item.variant?.options ?? [])
        .map((o) => o.value)
        .filter(Boolean)
        .join(" · ") ||
      (item.variant?.title && item.variant.title !== "Default" ? item.variant.title : "")

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)
    try {
      await updateLineItem({ lineId: item.id, quantity })
    } catch (e: any) {
      setError(e?.message ?? "Error")
    } finally {
      setUpdating(false)
    }
  }

  const remove = async () => {
    setRemoving(true)
    try {
      await deleteLineItem(item.id)
    } catch {
      setRemoving(false)
    }
  }

  const thumb = (size: string) => (
    <LocalizedClientLink href={href} className={`${size} shrink-0 overflow-hidden rounded-control bg-brand-linen`} tabIndex={-1} aria-hidden>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
      )}
    </LocalizedClientLink>
  )

  if (type === "preview") {
    return (
      <li className="flex items-center gap-3 py-3" data-testid="product-row">
        {thumb("h-16 w-14")}
        <div className="min-w-0 flex-1">
          <p className="truncate text-callout text-ink" data-testid="product-title">{title}</p>
          <p className="text-footnote text-ink-muted num">
            {isRoll
              ? formatMetres(length, countryCode)
              : [details, item.quantity > 1 ? `${t({ uz: "Soni", ru: "Кол-во", en: "Qty" }, countryCode)} ${item.quantity}` : ""]
                  .filter(Boolean)
                  .join(" · ")}
          </p>
        </div>
        <LineItemPrice
          item={item}
          style="tight"
          currencyCode={currencyCode}
          exchangeRate={exchangeRate}
          countryCode={countryCode}
        />
      </li>
    )
  }

  return (
    <li
      className={`flex gap-4 border-b border-line py-5 transition-opacity ${removing ? "opacity-40" : ""}`}
      data-testid={isRoll ? "custom-carpet-row" : "product-row"}
    >
      {thumb("h-28 w-[5.5rem] small:h-32 small:w-24")}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <LocalizedClientLink href={href} className="line-clamp-2 text-callout text-ink hover:underline" data-testid="product-title">
            {title}
          </LocalizedClientLink>
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
            exchangeRate={exchangeRate}
            countryCode={countryCode}
          />
        </div>
        {details && <p className="text-footnote text-ink-muted num" data-testid="product-variant">{details}</p>}
        {note && <p className="text-footnote italic text-ink-subtle">“{note}”</p>}

        <div className="mt-auto flex items-center justify-between pt-2">
          {isRoll ? (
            <span className="text-footnote text-ink-muted">
              {t({ uz: "Oʼlchamga koʼra tayyorlanadi", ru: "Изготавливается по размеру", en: "Made to your size" }, countryCode)}
            </span>
          ) : (
            <div
              className="flex h-9 items-center rounded-full bg-surface-raised shadow-hairline"
              role="group"
              aria-label={t({ uz: "Soni", ru: "Количество", en: "Quantity" }, countryCode)}
            >
              <button
                type="button"
                onClick={() => changeQuantity(item.quantity - 1)}
                disabled={updating || item.quantity <= 1}
                aria-label={t({ uz: "Kamaytirish", ru: "Уменьшить", en: "Decrease" }, countryCode)}
                className="grid h-9 w-9 place-items-center text-ink disabled:text-ink-subtle/40"
                data-testid="product-select-button"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M5 12h14" /></svg>
              </button>
              <span className={`w-6 text-center text-callout num ${updating ? "text-ink-subtle" : "text-ink"}`} aria-live="polite">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => changeQuantity(item.quantity + 1)}
                disabled={updating || item.quantity >= MAX_QTY}
                aria-label={t({ uz: "Koʼpaytirish", ru: "Увеличить", en: "Increase" }, countryCode)}
                className="grid h-9 w-9 place-items-center text-ink disabled:text-ink-subtle/40"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={remove}
            disabled={removing}
            className="no-press -mr-2 rounded-full px-2 py-1 text-footnote text-ink-muted hover:text-ink hover:underline"
            data-testid="product-delete-button"
          >
            {t({ uz: "Olib tashlash", ru: "Удалить", en: "Remove" }, countryCode)}
          </button>
        </div>
        {error && <p role="alert" className="text-footnote text-red-700" data-testid="product-error-message">{error}</p>}
      </div>
    </li>
  )
}

export default Item
