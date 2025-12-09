"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"
import { usePathname } from "next/navigation"
import { t } from "@lib/util/translations"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1]

  const sortOptions = [
    {
      value: "created_at",
      label: t({ uz: "Eng so\u02bcngi", ru: "Новейшие", en: "Latest" }, countryCode),
    },
    {
      value: "price_asc",
      label: t({ uz: "Narxi: Past → Yuqori", ru: "Цена: Низкая → Высокая", en: "Price: Low → High" }, countryCode),
    },
    {
      value: "price_desc",
      label: t({ uz: "Narxi: Yuqori → Past", ru: "Цена: Высокая → Низкая", en: "Price: High → Low" }, countryCode),
    },
  ]

  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <FilterRadioGroup
      title={
        <div className="flex items-center gap-2 text-brand-brown font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
          </svg>
          {t({ uz: "Saralash", ru: "Сортировка", en: "Sort" }, countryCode)}
        </div>
      }
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default SortProducts
