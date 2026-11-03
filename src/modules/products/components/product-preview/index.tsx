import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PreviewPrice from "./price"
import { firstOrSecond } from "@lib/util/firstorsecond"
import { isRollCarpet } from "@lib/util/carpet-helpers"

/**
 * Product card: 4:5 image, title (max two lines), price underneath.
 * The whole card is one link; the image lifts slightly on hover (mouse only).
 */
export default async function ProductPreview({
  product,
  countryCode,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region?: HttpTypes.StoreRegion
  countryCode?: string
}) {
  const { cheapestPrice } = getProductPrice({ product })
  const image = product.thumbnail || product.images?.[0]?.url
  const title = firstOrSecond(product.title, countryCode)

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group flex flex-col gap-3 rounded-card outline-offset-4"
      data-testid="product-wrapper"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-brand-linen">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-1 px-0.5">
        <h3 className="line-clamp-2 text-callout text-ink" data-testid="product-title">
          {title}
        </h3>
        {cheapestPrice && (
          <PreviewPrice
            price={cheapestPrice}
            countryCode={countryCode}
            perMetre={isRollCarpet(product)}
          />
        )}
      </div>
    </LocalizedClientLink>
  )
}
