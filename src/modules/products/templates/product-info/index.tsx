import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { firstOrSecond } from "@lib/util/firstorsecond"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  countryCode?: string
}

const ProductInfo = ({ product, countryCode }: ProductInfoProps) => {
  const description = firstOrSecond(product.description, countryCode)

  return (
    <div id="product-info" className="flex flex-col gap-3">
      {product.collection && (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle}`}
          className="self-start text-footnote font-medium uppercase tracking-[0.06em] text-ink-muted hover:text-brand-accent-strong"
        >
          {firstOrSecond(product.collection.title, countryCode)}
        </LocalizedClientLink>
      )}
      <h1 className="text-title-1 text-ink text-balance" data-testid="product-title">
        {firstOrSecond(product.title, countryCode)}
      </h1>
      {description && (
        <p
          className="max-w-[65ch] whitespace-pre-line text-callout text-ink-muted"
          data-testid="product-description"
        >
          {description}
        </p>
      )}
    </div>
  )
}

export default ProductInfo
