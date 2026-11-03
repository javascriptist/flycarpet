"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@medusajs/ui"
import { addToCart } from "@lib/data/cart"
import { formatStorePrice } from "@lib/util/money"
import {
  RollCarpetSpec,
  calculateRollCarpet,
  clampRollLength,
  formatMetres,
} from "@lib/util/carpet-helpers"
import { t } from "@lib/util/translations"

interface RollCarpetAddToCartProps {
  spec: RollCarpetSpec
  length: number
  countryCode: string
  exchangeRate?: number
  disabled?: boolean
}

/**
 * Adds a cut-to-length roll carpet to the Medusa cart.
 *
 * The variant price is the price per metre, so the line item quantity is the
 * length in metres (Medusa v2 quantities are decimal) — cart totals then come
 * out right without any custom backend pricing. The exact length is also kept
 * in metadata for the cart, the order and the warehouse.
 */
export const RollCarpetAddToCart: React.FC<RollCarpetAddToCartProps> = ({
  spec,
  length,
  countryCode,
  exchangeRate,
  disabled,
}) => {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [customerNote, setCustomerNote] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  const finalLength = clampRollLength(length, spec)
  const { total } = calculateRollCarpet(spec, finalLength)
  const isDisabled = disabled || isAdding || !spec.variantId || !spec.pricePerMeter

  const handleAddToCart = async () => {
    if (!spec.variantId) return

    setIsAdding(true)
    setError(null)
    setAdded(false)

    try {
      await addToCart({
        variantId: spec.variantId,
        quantity: finalLength,
        countryCode,
        metadata: {
          carpet_type: "roll_custom",
          custom_length: finalLength,
          width: spec.width,
          area: calculateRollCarpet(spec, finalLength).area,
          ...(customerNote.trim() ? { customer_specifications: customerNote.trim() } : {}),
        },
      })
      setCustomerNote("")
      setAdded(true)
      router.refresh()
    } catch (e) {
      setError(
        t(
          {
            uz: "Gilamni savatchaga qoʼshishda xatolik. Qayta urinib koʼring.",
            ru: "Не удалось добавить ковер в корзину. Попробуйте ещё раз.",
            en: "Couldn't add the carpet to your cart. Please try again.",
          },
          countryCode
        )
      )
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="roll-carpet-add-to-cart">
      <div className="mb-4">
        <label htmlFor="roll-note" className="block text-sm font-medium mb-2">
          {t({ uz: "Maxsus talablar (ixtiyoriy):", ru: "Особые требования (необязательно):", en: "Special requests (optional):" }, countryCode)}
        </label>
        <textarea
          id="roll-note"
          value={customerNote}
          onChange={(e) => setCustomerNote(e.target.value)}
          placeholder={t({ uz: "Har qanday maxsus talablar yoki izohlar...", ru: "Любые особые требования или примечания...", en: "Any special requests or notes..." }, countryCode)}
          className="w-full p-3 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      {error && (
        <div role="alert" className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Button
        onClick={handleAddToCart}
        disabled={isDisabled}
        isLoading={isAdding}
        size="large"
        className="w-full"
        data-testid="add-roll-carpet-button"
      >
        {t(
          {
            uz: `${formatMetres(finalLength)} qoʼshish — ${formatStorePrice(total, exchangeRate)}`,
            ru: `Добавить ${formatMetres(finalLength)} — ${formatStorePrice(total, exchangeRate)}`,
            en: `Add ${formatMetres(finalLength)} — ${formatStorePrice(total, exchangeRate)}`,
          },
          countryCode
        )}
      </Button>

      <p aria-live="polite" className="mt-2 text-sm text-ui-fg-subtle min-h-[1.25rem]">
        {added && t({ uz: "Savatchaga qoʼshildi", ru: "Добавлено в корзину", en: "Added to cart" }, countryCode)}
      </p>
    </div>
  )
}
