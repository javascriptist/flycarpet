"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { t } from "@lib/util/translations"

import SortProducts, { SortOptions } from "./sort-products"
import CollectionFilter from "./collection-filter"
import CarpetTypeFilter from "./carpet-type-filter"
import SizeFilter from "./size-filter"

type RefinementListProps = {
  sortBy: SortOptions
  collections?: HttpTypes.StoreCollection[]
  selectedCollection?: string
  selectedCarpetType?: string
  selectedSize?: string
  search?: boolean
  'data-testid'?: string
}

const RefinementList = ({ 
  sortBy, 
  collections = [],
  selectedCollection,
  selectedCarpetType,
  selectedSize,
  'data-testid': dataTestId 
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const countryCode = pathname.split("/")[1]
  const [isOpen, setIsOpen] = useState(false)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      // Reset to page 1 when filtering
      if (name !== "page") {
        params.delete("page")
      }
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}${query ? `?${query}` : ""}`)
  }

  const activeFiltersCount = [selectedCollection, selectedCarpetType, selectedSize].filter(Boolean).length

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="small:hidden w-full mb-4 px-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-brand-cream rounded-2xl border border-brand-peach/20"
        >
          <span className="flex items-center gap-2 text-brand-brown font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            {t({ uz: "Filtrlar", ru: "Фильтры", en: "Filters" }, countryCode)}
            {activeFiltersCount > 0 && (
              <span className="bg-brand-peach text-white text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className={`size-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* Filters Container */}
      <div className={`
        ${isOpen ? 'block' : 'hidden'} small:block
        small:flex small:flex-col gap-8 py-4 mb-8 small:px-0 px-6 small:min-w-[250px] small:ml-[1.675rem]
        bg-brand-cream/50 small:bg-transparent rounded-2xl small:rounded-none p-4 small:p-0 mx-4 small:mx-0
      `}>
        {/* Sorting */}
        <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
        
        {/* Divider */}
        <div className="hidden small:block w-full h-px bg-gray-200 my-2" />
        
        {/* Collection Filter */}
        {collections.length > 0 && (
          <CollectionFilter 
            collections={collections} 
            selectedCollection={selectedCollection}
            setQueryParams={setQueryParams} 
          />
        )}
        
        {/* Divider */}
        <div className="hidden small:block w-full h-px bg-gray-200 my-2" />
        
        {/* Carpet Type Filter */}
        <CarpetTypeFilter 
          selectedType={selectedCarpetType}
          setQueryParams={setQueryParams} 
        />
        
        {/* Divider */}
        <div className="hidden small:block w-full h-px bg-gray-200 my-2" />
        
        {/* Size Filter */}
        <SizeFilter 
          selectedSize={selectedSize}
          setQueryParams={setQueryParams} 
        />

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <button
            onClick={() => {
              router.push(pathname)
            }}
            className="mt-4 text-sm text-brand-peach hover:text-brand-terracotta underline"
          >
            {t({ uz: "Filtrlarni tozalash", ru: "Очистить фильтры", en: "Clear Filters" }, countryCode)}
          </button>
        )}
      </div>
    </>
  )
}

export default RefinementList
