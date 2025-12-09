"use client"

import { HttpTypes } from "@medusajs/types"
import { usePathname } from "next/navigation"
import { t } from "@lib/util/translations"

type CollectionFilterProps = {
  collections: HttpTypes.StoreCollection[]
  selectedCollection?: string
  setQueryParams: (name: string, value: string) => void
  "data-testid"?: string
}

const CollectionFilter = ({
  collections,
  selectedCollection,
  setQueryParams,
  "data-testid": dataTestId,
}: CollectionFilterProps) => {
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1]

  const handleChange = (value: string) => {
    setQueryParams("collection", value)
  }

  return (
    <div className="flex flex-col gap-y-3" data-testid={dataTestId}>
      <span className="text-base-semi font-semibold text-brand-brown">
        {t({ uz: "Kolleksiyalar", ru: "Коллекции", en: "Collections" }, countryCode)}
      </span>
      <div className="flex flex-col gap-y-2">
        {/* All option */}
        <label className="flex items-center gap-x-2 cursor-pointer group">
          <input
            type="radio"
            name="collection"
            value=""
            checked={!selectedCollection}
            onChange={() => handleChange("")}
            className="h-4 w-4 text-brand-peach border-gray-300 focus:ring-brand-peach accent-brand-peach"
          />
          <span className={`text-sm ${!selectedCollection ? 'text-brand-peach font-medium' : 'text-gray-600 group-hover:text-brand-brown'}`}>
            {t({ uz: "Barchasi", ru: "Все", en: "All" }, countryCode)}
          </span>
        </label>
        
        {/* Collection options */}
        {collections.map((collection) => (
          <label key={collection.id} className="flex items-center gap-x-2 cursor-pointer group">
            <input
              type="radio"
              name="collection"
              value={collection.handle}
              checked={selectedCollection === collection.handle}
              onChange={() => handleChange(collection.handle)}
              className="h-4 w-4 text-brand-peach border-gray-300 focus:ring-brand-peach accent-brand-peach"
            />
            <span className={`text-sm ${selectedCollection === collection.handle ? 'text-brand-peach font-medium' : 'text-gray-600 group-hover:text-brand-brown'}`}>
              {collection.title}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default CollectionFilter
