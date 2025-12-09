import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { listCollections } from "@lib/data/collections"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    collection?: string
    carpetType?: string
    size?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, collection, carpetType, size } = searchParams

  // Fetch collections for filter with error handling
  let collections = []
  try {
    const result = await listCollections()
    collections = result.collections || []
  } catch (error) {
    console.error('Error fetching collections:', error)
  }

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      collections={collections}
      selectedCollection={collection}
      selectedCarpetType={carpetType}
      selectedSize={size}
    />
  )
}
