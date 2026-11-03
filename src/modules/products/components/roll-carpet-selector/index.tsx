"use client"

import React, { useEffect, useId, useState } from "react"
import { cx } from "@lib/util/cx"
import { formatStorePrice } from "@lib/util/money"
import {
  ROLL_LENGTH_PRESETS,
  ROLL_LENGTH_STEP,
  RollCarpetSpec,
  calculateRollCarpet,
  clampRollLength,
  formatMetres,
  metreUnit,
} from "@lib/util/carpet-helpers"
import { t } from "@lib/util/translations"

interface RollCarpetSelectorProps {
  spec: RollCarpetSpec
  length: number
  onLengthChange: (length: number) => void
  countryCode?: string
  exchangeRate?: number
  disabled?: boolean
}

/**
 * Length picker for cut-to-length roll carpets:
 * quick picks for common sizes, a −/+ stepper (10 cm steps) with a typeable
 * value, and a live "width × length = area" line. Everything updates on
 * the same frame as the input — no network round-trip.
 */
export const RollCarpetSelector: React.FC<RollCarpetSelectorProps> = ({
  spec,
  length,
  onLengthChange,
  countryCode,
  exchangeRate,
  disabled,
}) => {
  const inputId = useId()
  const hintId = useId()
  const [draft, setDraft] = useState(String(length))

  // Keep the text field in sync when length changes from the buttons
  useEffect(() => {
    setDraft(String(length))
  }, [length])

  const commit = (value: number) => onLengthChange(clampRollLength(value, spec))
  const step = (dir: 1 | -1) => commit(length + dir * ROLL_LENGTH_STEP * 5) // 50 cm per tap
  const { area } = calculateRollCarpet(spec, length)
  const presets = ROLL_LENGTH_PRESETS.filter((p) => p >= spec.minLength && p <= spec.maxLength)
  const atMin = length <= spec.minLength
  const atMax = length >= spec.maxLength

  return (
    <fieldset className="flex flex-col gap-3" disabled={disabled}>
      <div className="flex items-baseline justify-between">
        <legend className="text-headline text-ink">
          {t({ uz: "Uzunlik", ru: "Длина", en: "Length" }, countryCode)}
        </legend>
        <span className="text-footnote text-ink-muted num">
          {t({ uz: "Eni", ru: "Ширина", en: "Width" }, countryCode)} {formatMetres(spec.width, countryCode)}
        </span>
      </div>

      {presets.length > 0 && (
        <div className="flex gap-2" role="group" aria-label={t({ uz: "Tez tanlash", ru: "Быстрый выбор", en: "Quick picks" }, countryCode)}>
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => commit(p)}
              aria-pressed={length === p}
              className={cx(
                "h-10 flex-1 rounded-control text-callout num transition",
                length === p
                  ? "bg-ink text-white"
                  : "bg-surface-raised text-ink shadow-hairline hover:bg-brand-linen"
              )}
            >
              {formatMetres(p, countryCode)}
            </button>
          ))}
        </div>
      )}

      <div className="flex h-14 items-center rounded-control bg-surface-raised shadow-hairline has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-brand-accent-strong">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={atMin}
          aria-label={t({ uz: "Kamaytirish", ru: "Уменьшить", en: "Decrease" }, countryCode)}
          className="grid h-full w-14 shrink-0 place-items-center text-ink disabled:text-ink-subtle/50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M5 12h14" />
          </svg>
        </button>
        <label htmlFor={inputId} className="flex flex-1 items-baseline justify-center gap-1">
          <span className="sr-only">
            {t({ uz: "Uzunlik, metr", ru: "Длина, метры", en: "Length in metres" }, countryCode)}
          </span>
          <input
            id={inputId}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            aria-describedby={hintId}
            value={draft}
            onChange={(e) => {
              const v = e.target.value.replace(",", ".")
              if (/^\d{0,2}(\.\d?)?$/.test(v)) {
                setDraft(v)
                const n = parseFloat(v)
                if (n >= spec.minLength && n <= spec.maxLength) onLengthChange(n)
              }
            }}
            onBlur={() => commit(parseFloat(draft))}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit(parseFloat(draft))
              if (e.key === "ArrowUp") { e.preventDefault(); step(1) }
              if (e.key === "ArrowDown") { e.preventDefault(); step(-1) }
            }}
            className="w-16 bg-transparent text-right text-title-3 font-medium text-ink num outline-none"
          />
          <span className="text-title-3 text-ink-muted">{metreUnit(countryCode)}</span>
        </label>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={atMax}
          aria-label={t({ uz: "Koʼpaytirish", ru: "Увеличить", en: "Increase" }, countryCode)}
          className="grid h-full w-14 shrink-0 place-items-center text-ink disabled:text-ink-subtle/50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      <p id={hintId} className="flex justify-between text-footnote text-ink-muted num" aria-live="polite">
        <span>
          {formatMetres(spec.width, countryCode)} × {formatMetres(length, countryCode)} = {area} {metreUnit(countryCode)}²
        </span>
        <span>
          {t(
            {
              uz: `${spec.minLength}–${spec.maxLength} m, qadam 10 sm`,
              ru: `${spec.minLength}–${spec.maxLength} м, шаг 10 см`,
              en: `${spec.minLength}–${spec.maxLength} m, 10 cm steps`,
            },
            countryCode
          )}
        </span>
      </p>
    </fieldset>
  )
}
