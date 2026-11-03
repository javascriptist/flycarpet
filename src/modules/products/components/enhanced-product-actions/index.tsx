"use client"

import { addRollCarpetToCart, addToCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { cx } from "@lib/util/cx"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import { isEqual } from "lodash"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import { RollCarpetSelector } from "../roll-carpet-selector"
import { ARToggleButton } from "../ar-toggle-button"
import {
  isRollCarpet,
  getCarpetSize,
  getRollCarpetSpec,
  clampRollLength,
  calculateRollCarpet,
  formatMetres,
} from "@lib/util/carpet-helpers"
import { formatStorePrice } from "@lib/util/money"
import { firstOrSecond } from "@lib/util/firstorsecond"
import { t } from "@lib/util/translations"

type EnhancedProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  exchangeRate?: number
}

type BuyState = "idle" | "adding" | "added" | "error"

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) =>
  variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})

/**
 * True once the element has scrolled up and out of view (not while it's
 * still below the fold), so the sticky bar only appears after the user has
 * passed the main button.
 */
const useScrolledPast = (ref: React.RefObject<HTMLElement | null>) => {
  const [past, setPast] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) =>
      setPast(!e.isIntersecting && e.boundingClientRect.top < 0)
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return past
}

export default function EnhancedProductActions({
  product,
  disabled,
  exchangeRate,
}: EnhancedProductActionsProps) {
  const router = useRouter()
  const countryCode = useParams().countryCode as string
  const tr = (m: { uz: string; ru: string; en: string }) => t(m, countryCode)

  const isRoll = isRollCarpet(product)
  const rollSpec = useMemo(() => getRollCarpetSpec(product), [product])
  const [length, setLength] = useState<number>(() => clampRollLength(2, rollSpec))
  const [note, setNote] = useState("")
  const [noteOpen, setNoteOpen] = useState(false)

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [buyState, setBuyState] = useState<BuyState>("idle")

  const optionsRef = useRef<HTMLDivElement>(null)
  const buyRef = useRef<HTMLDivElement>(null)
  const showBar = useScrolledPast(buyRef)

  const carpetImage = product.thumbnail || product.images?.[0]?.url || ""
  const title = firstOrSecond(product.title, countryCode)

  // Preselect when there's only one variant
  useEffect(() => {
    if (product.variants?.length === 1) {
      setOptions(optionsAsKeymap(product.variants[0].options) ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (isRoll) return product.variants?.[0]
    return product.variants?.find((v) =>
      isEqual(optionsAsKeymap(v.options), options)
    )
  }, [isRoll, product.variants, options])

  const inStock = useMemo(() => {
    if (!selectedVariant) return false
    if (!selectedVariant.manage_inventory || selectedVariant.allow_backorder) return true
    return (selectedVariant.inventory_quantity || 0) > 0
  }, [selectedVariant])

  // The "Added" confirmation fades back to the normal label
  useEffect(() => {
    if (buyState !== "added") return
    const id = window.setTimeout(() => setBuyState("idle"), 2400)
    return () => window.clearTimeout(id)
  }, [buyState])

  const rollLength = clampRollLength(length, rollSpec)
  const rollTotal = calculateRollCarpet(rollSpec, rollLength)
  const needsSelection = !isRoll && !selectedVariant
  const canBuy =
    !disabled &&
    buyState !== "adding" &&
    !!selectedVariant &&
    inStock &&
    (!isRoll || rollSpec.pricePerMeter > 0)

  const handleBuy = useCallback(async () => {
    if (needsSelection) {
      optionsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      optionsRef.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true })
      return
    }
    if (!canBuy || !selectedVariant?.id) return

    setBuyState("adding")
    try {
      if (isRoll) {
        // priced on the server: price per metre × length, one line item
        await addRollCarpetToCart({
          variantId: selectedVariant.id,
          length: rollLength,
          note: note.trim() || undefined,
          countryCode,
        })
        setNote("")
        setNoteOpen(false)
      } else {
        await addToCart({ variantId: selectedVariant.id, quantity: 1, countryCode })
      }
      setBuyState("added")
      router.refresh()
    } catch {
      setBuyState("error")
    }
  }, [needsSelection, canBuy, selectedVariant, isRoll, rollLength, note, countryCode, router])

  const priceLabel = isRoll
    ? formatStorePrice(rollTotal.total, exchangeRate, countryCode)
    : null

  const buttonLabel = (compact = false) => {
    if (buyState === "adding") return tr({ uz: "Qoʼshilmoqda…", ru: "Добавляем…", en: "Adding…" })
    if (buyState === "added") return tr({ uz: "Savatchada", ru: "В корзине", en: "Added" })
    if (needsSelection) return tr({ uz: "Oʼlchamni tanlang", ru: "Выберите размер", en: "Choose a size" })
    if (!inStock) return tr({ uz: "Mavjud emas", ru: "Нет в наличии", en: "Out of stock" })
    if (isRoll && !compact)
      return tr({
        uz: `${formatMetres(rollLength, countryCode)} — savatchaga`,
        ru: `${formatMetres(rollLength, countryCode)} — в корзину`,
        en: `Add ${formatMetres(rollLength, countryCode)} to cart`,
      })
    return tr({ uz: "Savatchaga qoʼshish", ru: "В корзину", en: "Add to cart" })
  }

  const renderPrimaryButton = (compact = false) => (
    <button
      type="button"
      onClick={handleBuy}
      disabled={!needsSelection && !canBuy && buyState !== "added"}
      aria-disabled={buyState === "adding"}
      className={cx("btn-primary", compact ? "h-11 px-5 text-callout" : "w-full")}
      data-testid={compact ? "mobile-cart-button" : "add-product-button"}
    >
      {buyState === "adding" && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
      )}
      {buyState === "added" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      )}
      <span>{buttonLabel(compact)}</span>
    </button>
  )

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Price */}
        {isRoll ? (
          <div className="flex flex-col gap-1">
            <span className="text-title-2 text-ink num" data-testid="product-price">
              {priceLabel}
            </span>
            <span className="text-footnote text-ink-muted num">
              {formatStorePrice(rollSpec.pricePerMeter, exchangeRate, countryCode)} {tr({ uz: "/ metr", ru: "/ метр", en: "per metre" })}
            </span>
          </div>
        ) : (
          <ProductPrice product={product} variant={selectedVariant} exchangeRate={exchangeRate} />
        )}

        {/* Size */}
        {isRoll ? (
          <RollCarpetSelector
            spec={rollSpec}
            length={length}
            onLengthChange={setLength}
            countryCode={countryCode}
            exchangeRate={exchangeRate}
            disabled={disabled || buyState === "adding"}
          />
        ) : (
          (product.variants?.length ?? 0) > 1 && (
            <div ref={optionsRef} className="flex flex-col gap-5">
              {(product.options || []).map((option) => (
                <OptionSelect
                  key={option.id}
                  option={option}
                  current={options[option.id]}
                  updateOption={(id, value) => setOptions((prev) => ({ ...prev, [id]: value }))}
                  title={option.title ?? ""}
                  data-testid="product-options"
                  disabled={!!disabled || buyState === "adding"}
                />
              ))}
            </div>
          )
        )}

        {/* Optional note for cut-to-length orders */}
        {isRoll && (
          <div>
            {noteOpen ? (
              <label className="flex flex-col gap-2">
                <span className="text-footnote text-ink-muted">
                  {tr({ uz: "Izoh (ixtiyoriy)", ru: "Комментарий (необязательно)", en: "Note (optional)" })}
                </span>
                <textarea
                  autoFocus
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder={tr({ uz: "Masalan: chetlarini oʼrash kerak", ru: "Например: нужна обработка краёв", en: "e.g. edges need binding" })}
                  className="rounded-control bg-surface-raised p-3 text-body text-ink shadow-hairline outline-none placeholder:text-ink-subtle focus:ring-2 focus:ring-brand-accent-strong"
                />
              </label>
            ) : (
              <button
                type="button"
                onClick={() => setNoteOpen(true)}
                className="text-callout text-brand-accent-strong hover:underline"
              >
                + {tr({ uz: "Izoh qoʼshish", ru: "Добавить комментарий", en: "Add a note" })}
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div ref={buyRef} className="flex flex-col gap-3">
          {renderPrimaryButton()}
          <ARToggleButton
            product={product}
            carpetImage={carpetImage}
            carpetSize={isRoll ? { width: rollSpec.width, length: rollLength } : getCarpetSize(product)}
          />
        </div>

        <p aria-live="polite" className="-mt-3 min-h-[1.25rem] text-footnote">
          {buyState === "added" && (
            <span className="text-ink-muted">
              {tr({ uz: "Savatchaga qoʼshildi.", ru: "Добавлено в корзину.", en: "Added to your cart." })}{" "}
              <LocalizedClientLink href="/cart" className="font-medium text-brand-accent-strong hover:underline">
                {tr({ uz: "Savatchani koʼrish", ru: "Открыть корзину", en: "View cart" })}
              </LocalizedClientLink>
            </span>
          )}
          {buyState === "error" && (
            <span role="alert" className="text-red-700">
              {tr({
                uz: "Qoʼshib boʼlmadi. Qayta urinib koʼring.",
                ru: "Не удалось добавить. Попробуйте ещё раз.",
                en: "Couldn't add to cart. Please try again.",
              })}
            </span>
          )}
        </p>

        {/* Reassurance */}
        <ul className="flex flex-col gap-3 border-t border-line pt-5 text-footnote text-ink-muted">
          <li className="flex items-center gap-3">
            <FastDelivery size="20" />
            {tr({ uz: "Oʼzbekiston boʼylab 3–5 kunda yetkazib berish", ru: "Доставка по Узбекистану за 3–5 дней", en: "Delivery across Uzbekistan in 3–5 days" })}
          </li>
          <li className="flex items-center gap-3">
            <Refresh size="20" />
            {tr({ uz: "Oson almashtirish va qaytarish", ru: "Лёгкий обмен и возврат", en: "Easy exchanges and returns" })}
          </li>
        </ul>
      </div>

      {/* Phone: buy bar slides up when the main button scrolls away */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 small:hidden"
        style={{
          transform: showBar ? "translateY(0)" : "translateY(100%)",
          transition: "transform 250ms var(--ease-out)",
        }}
        aria-hidden={!showBar}
        inert={showBar ? undefined : true}
        data-testid="mobile-actions"
      >
        <div className="glass flex items-center gap-3 border-t border-line px-4 pt-3 pb-safe">
          <div className="min-w-0 flex-1">
            <p className="truncate text-footnote text-ink-muted" data-testid="mobile-title">{title}</p>
            <div className="text-headline text-ink num">
              {isRoll ? (
                <>
                  {priceLabel} <span className="text-footnote text-ink-muted">· {formatMetres(rollLength, countryCode)}</span>
                </>
              ) : (
                <ProductPrice product={product} variant={selectedVariant} exchangeRate={exchangeRate} compact />
              )}
            </div>
          </div>
          {renderPrimaryButton(true)}
        </div>
      </div>
    </>
  )
}
