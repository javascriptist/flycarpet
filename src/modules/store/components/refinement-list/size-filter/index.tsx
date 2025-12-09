"use client"

import { usePathname } from "next/navigation"
import { t } from "@lib/util/translations"

type SizeFilterProps = {
  selectedSize?: string
  setQueryParams: (name: string, value: string) => void
  "data-testid"?: string
}

const SizeFilter = ({
  selectedSize,
  setQueryParams,
  "data-testid": dataTestId,
}: SizeFilterProps) => {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1]

  const sizeOptions = [
    { value: "", label: { uz: "Barchasi", ru: "Все", en: "All" } },
    { value: "small", label: { uz: "Kichik (3x4 gacha)", ru: "Маленький (до 3x4)", en: "Small (up to 3x4)" } },
    { value: "medium", label: { uz: "O\u02bcrta (4x5 - 5x6)", ru: "Средний (4x5 - 5x6)", en: "Medium (4x5 - 5x6)" } },
    { value: "large", label: { uz: "Katta (6x7 dan)", ru: "Большой (от 6x7)", en: "Large (6x7+)" } },
  ]

  const handleChange = (value: string) => {
    setQueryParams("size", value)
  }

  return (
    <div className="flex flex-col gap-y-3" data-testid={dataTestId}>
      <span className="text-base-semi font-semibold text-brand-brown">
        {t({ uz: "O\u02bclcham", ru: "Размер", en: "Size" }, countryCode)}
      </span>
      <div className="flex flex-col gap-y-2">
        {sizeOptions.map((size) => (
          <label key={size.value} className="flex items-center gap-x-2 cursor-pointer group">
            <input
              type="radio"
              name="size"
              value={size.value}
              checked={selectedSize === size.value || (!selectedSize && size.value === "")}
              onChange={() => handleChange(size.value)}
              className="h-4 w-4 text-brand-peach border-gray-300 focus:ring-brand-peach accent-brand-peach"
            />
            <span className={`text-sm ${(selectedSize === size.value || (!selectedSize && size.value === "")) ? 'text-brand-peach font-medium' : 'text-gray-600 group-hover:text-brand-brown'}`}>
              {t(size.label, countryCode)}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default SizeFilter
