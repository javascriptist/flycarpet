import { HttpTypes } from "@medusajs/types"
import { cx } from "@lib/util/cx"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (optionId: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

/** Option values (e.g. sizes) as a row of chips. Selected = solid ink. */
const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const values = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="text-headline text-ink">{title}</span>
        {current && <span className="text-footnote text-ink-muted">{current}</span>}
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={title} data-testid={dataTestId}>
        {values.map((v) => {
          const selected = v === current
          return (
            <button
              type="button"
              key={v}
              onClick={() => updateOption(option.id, v)}
              aria-pressed={selected}
              disabled={disabled}
              className={cx(
                "h-11 min-w-[4.5rem] rounded-control px-4 text-callout num transition disabled:opacity-50",
                selected
                  ? "bg-ink text-white"
                  : "bg-surface-raised text-ink shadow-hairline hover:bg-brand-linen"
              )}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
