import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"
import { t } from '@lib/util/translations'
import { HttpTypes } from "@medusajs/types"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  collections,
  selectedCollection,
  selectedCarpetType,
  selectedSize,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  collections?: HttpTypes.StoreCollection[]
  selectedCollection?: string
  selectedCarpetType?: string
  selectedSize?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList 
        sortBy={sort} 
        collections={collections}
        selectedCollection={selectedCollection}
        selectedCarpetType={selectedCarpetType}
        selectedSize={selectedSize}
      />
      <div className="w-full">
        <div className="mb-8 text-2xl-semi inline-block border-b-4 border-brand-peach">
          <h1 className="text-brand-brown" data-testid="store-page-title ">{t({ uz: 'Mahsulotlar', ru: 'Продукты', en: 'Products' }, countryCode)}</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            collectionHandle={selectedCollection}
            carpetType={selectedCarpetType}
            sizeFilter={selectedSize}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
