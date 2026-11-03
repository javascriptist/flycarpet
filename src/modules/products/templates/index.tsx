import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import EnhancedProductActions from "@modules/products/components/enhanced-product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import { firstOrSecond } from "@lib/util/firstorsecond"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

/**
 * Product page
 * Phone:   gallery → title & price → size → Add to cart → details
 * Desktop: gallery (+ details) on the left, a sticky buy panel on the right
 */
const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div
        className="content-container grid grid-cols-1 gap-x-12 gap-y-8 pb-16 small:grid-cols-12 small:pt-8"
        data-testid="product-container"
      >
        <div className="small:col-span-7 small:row-start-1">
          <ImageGallery
            images={product.images || []}
            title={firstOrSecond(product.title, countryCode)}
          />
        </div>

        <aside className="small:col-span-5 small:row-span-2 small:row-start-1">
          <div className="flex flex-col gap-8 small:sticky small:top-24">
            <ProductInfo product={product} countryCode={countryCode} />
            <Suspense
              fallback={
                <EnhancedProductActions disabled product={product} region={region} />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
          </div>
        </aside>

        <div className="small:col-span-7 small:row-start-2">
          <ProductTabs product={product} countryCode={countryCode} />
        </div>
      </div>

      <div
        className="content-container my-16 small:my-24"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
