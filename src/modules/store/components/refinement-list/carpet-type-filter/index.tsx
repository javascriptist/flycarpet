"use client"

import { usePathname } from "next/navigation"
import { t } from "@lib/util/translations"

type CarpetTypeFilterProps = {
  selectedType?: string
  setQueryParams: (name: string, value: string) => void
  "data-testid"?: string
}

const CarpetTypeFilter = ({
  selectedType,
  setQueryParams,
  "data-testid": dataTestId,
}: CarpetTypeFilterProps) => {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1]

  const carpetTypes = [
    { value: "", label: { uz: "Barchasi", ru: "Все", en: "All" } },
    { value: "fixed", label: { uz: "Tayyor o\u02bclcham", ru: "Фиксированный размер", en: "Fixed Size" } },
    { value: "roll", label: { uz: "Rulonli gilam", ru: "Рулонный ковер", en: "Roll Carpet" } },
  ]

  const handleChange = (value: string) => {
    setQueryParams("carpetType", value)
  }

  return (
    <div className="flex flex-col gap-y-3" data-testid={dataTestId}>
      <span className="text-base-semi font-semibold text-brand-brown">
        {t({ uz: "Gilam turi", ru: "Тип ковра", en: "Carpet Type" }, countryCode)}
      </span>
      <div className="flex flex-col gap-y-2">
        {carpetTypes.map((type) => (
          <label key={type.value} className="flex items-center gap-x-2 cursor-pointer group">
            <input
              type="radio"
              name="carpetType"
              value={type.value}
              checked={selectedType === type.value || (!selectedType && type.value === "")}
              onChange={() => handleChange(type.value)}
              className="h-4 w-4 text-brand-peach border-gray-300 focus:ring-brand-peach accent-brand-peach"
            />
            <span className={`text-sm ${(selectedType === type.value || (!selectedType && type.value === "")) ? 'text-brand-peach font-medium' : 'text-gray-600 group-hover:text-brand-brown'}`}>
              {t(type.label, countryCode)}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default CarpetTypeFilter
