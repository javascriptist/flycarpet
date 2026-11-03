"use client"

import React from "react"
import { formatStorePrice } from "@lib/util/money"
import {
  RollCarpetSpec,
  calculateRollCarpet,
  clampRollLength,
  formatMetres,
} from "@lib/util/carpet-helpers"
import { t } from "@lib/util/translations"

interface RollCarpetSelectorProps {
  spec: RollCarpetSpec
  length: number
  onLengthChange: (length: number) => void
  countryCode?: string
  exchangeRate?: number
}

/**
 * Controlled length picker for roll carpets. Pricing is computed locally from
 * the product's real price per metre, so it updates instantly as you type.
 */
export const RollCarpetSelector: React.FC<RollCarpetSelectorProps> = ({
  spec,
  length,
  onLengthChange,
  countryCode,
  exchangeRate,
}) => {
  const { area, total } = calculateRollCarpet(spec, length)
  const price = (usd: number) => formatStorePrice(usd, exchangeRate)

  return (
    <div className="roll-carpet-selector border rounded-lg p-6 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">
        {t({ uz: "Maxsus uzunlik gilam", ru: "Ковер на заказ по длине", en: "Cut-to-length carpet" }, countryCode)}
      </h3>

      <div className="mb-4 p-3 bg-white rounded border grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-gray-600">
            {t({ uz: "Eni:", ru: "Ширина:", en: "Width:" }, countryCode)}
          </span>
          <span className="ml-2 font-medium">{formatMetres(spec.width)}</span>
        </div>
        <div>
          <span className="text-sm text-gray-600">
            {t({ uz: "1 metr narxi:", ru: "Цена за метр:", en: "Price per metre:" }, countryCode)}
          </span>
          <span className="ml-2 font-medium tabular-nums">{price(spec.pricePerMeter)}</span>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="roll-length" className="block text-sm font-medium mb-2">
          {t({ uz: "Uzunlikni kiriting (metr):", ru: "Введите длину (метр):", en: "Length (metres):" }, countryCode)}
        </label>
        <input
          id="roll-length"
          type="number"
          inputMode="decimal"
          min={spec.minLength}
          max={spec.maxLength}
          step={0.1}
          value={length}
          onChange={(e) => onLengthChange(parseFloat(e.target.value) || 0)}
          onBlur={() => onLengthChange(clampRollLength(length, spec))}
          className="w-full px-3 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <small className="text-gray-500">
          {t(
            {
              uz: `Minimum ${spec.minLength} m, maksimum ${spec.maxLength} m`,
              ru: `Минимум ${spec.minLength} м, максимум ${spec.maxLength} м`,
              en: `Minimum ${spec.minLength} m, maximum ${spec.maxLength} m`,
            },
            countryCode
          )}
        </small>
      </div>

      <div className="p-4 bg-white border rounded">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold">
            {t({ uz: "Umumiy narx:", ru: "Общая цена:", en: "Total:" }, countryCode)}
          </span>
          <span className="text-2xl font-bold tabular-nums">{price(total)}</span>
        </div>
        <div className="text-sm text-gray-600 tabular-nums">
          {formatMetres(spec.width)} × {formatMetres(length)} = {area} m² · {price(spec.pricePerMeter)} × {length}
        </div>
      </div>
    </div>
  )
}
