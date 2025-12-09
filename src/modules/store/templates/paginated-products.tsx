import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getCollectionByHandle } from "@lib/data/collections"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { t } from "@lib/util/translations"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

// Helper function to determine size category from dimensions
const getSizeCategory = (sizeString: string): string => {
  // Parse size like "3x4", "4x6", "7x8" etc.
  const match = sizeString.match(/(\d+)x(\d+)/)
  if (!match) return "medium"
  
  const width = parseInt(match[1])
  const length = parseInt(match[2])
  const area = width * length
  
  if (area <= 12) return "small"      // up to 3x4
  if (area <= 30) return "medium"     // 4x5 to 5x6
  return "large"                       // 6x7+
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  collectionHandle,
  categoryId,
  productsIds,
  countryCode,
  carpetType,
  sizeFilter,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  collectionHandle?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  carpetType?: string
  sizeFilter?: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 100, // Fetch more to allow client-side filtering
  }

  // If collection handle is provided, get collection ID
  let effectiveCollectionId = collectionId
  if (collectionHandle && !collectionId) {
    try {
      const collection = await getCollectionByHandle(collectionHandle)
      if (collection) {
        effectiveCollectionId = collection.id
      }
    } catch (e) {
      console.error("Error fetching collection:", e)
    }
  }

  if (effectiveCollectionId) {
    queryParams["collection_id"] = [effectiveCollectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page: 1, // Get all products for filtering
    queryParams,
    sortBy,
    countryCode,
  })

  // Apply client-side filters for metadata-based filtering
  let filteredProducts = products

  // Filter by carpet type (from metadata)
  if (carpetType) {
    filteredProducts = filteredProducts.filter((p) => {
      const productCarpetType = (p.metadata as any)?.attributes?.carpet_type
      return productCarpetType === carpetType
    })
  }

  // Filter by size
  if (sizeFilter) {
    filteredProducts = filteredProducts.filter((p) => {
      // Check metadata first
      const metadataSize = (p.metadata as any)?.attributes?.size
      if (metadataSize) {
        return getSizeCategory(metadataSize) === sizeFilter
      }
      
      // Check product options (Hajm)
      const sizeOption = p.options?.find((opt) => 
        opt.title?.toLowerCase() === "hajm" || opt.title?.toLowerCase() === "size"
      )
      if (sizeOption?.values?.length) {
        // Check if any variant matches the size filter
        return sizeOption.values.some((val) => 
          getSizeCategory(val.value) === sizeFilter
        )
      }
      
      return true // Include if no size info
    })
  }

  // Recalculate count after filtering
  const filteredCount = filteredProducts.length

  // Paginate filtered results
  const pageParam = (page - 1) * PRODUCT_LIMIT
  const paginatedProducts = filteredProducts.slice(pageParam, pageParam + PRODUCT_LIMIT)

  const totalPages = Math.ceil(filteredCount / PRODUCT_LIMIT)
  
  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {paginatedProducts.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
      </ul>
      {paginatedProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 mx-auto mb-4 text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <p>{t({ uz: "Filtrlarga mos mahsulot topilmadi", ru: "Товары по вашим фильтрам не найдены", en: "No products found matching your filters" }, countryCode)}</p>
        </div>
      )}
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
