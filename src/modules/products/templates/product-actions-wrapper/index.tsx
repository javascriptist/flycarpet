import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import EnhancedProductActions from "@modules/products/components/enhanced-product-actions"
import { getExchangeRate } from "@lib/data/exchange-rate"

/**
 * Fetches real time pricing for a product and renders the enhanced product actions component.
 * Supports both regular products and roll carpets with custom length selection.
 */
export default async function ProductActionsWrapper({
  id,
  region,
}: {
  id: string
  region: HttpTypes.StoreRegion
}) {
  const product = await listProducts({
    queryParams: { id: [id] } as any,
    regionId: region.id,
  }).then(({ response }) => response.products[0])

  if (!product) {
    return null
  }

  const exchangeRate = await getExchangeRate()

  return (
    <EnhancedProductActions 
      product={product} 
      region={region} 
      exchangeRate={exchangeRate?.rate}
    />
  )
}
