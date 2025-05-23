import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct,
  countryCode?: string
}

const ProductInfo = ({ product, countryCode }: ProductInfoProps) => {
  const isLang = countryCode === "uz"

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-[#D4682D] -muted hover:text-[#FF6A1A] transition-all duration-200"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-3xl leading-10 text-ui-fg-base"
          data-testid="product-title"
        >
          {product.title.includes("###") ? isLang ? product.title.split("###")[0] : product.title.split("###")[1] : product.title}
        </Heading>

        <Text
          className="text-medium text-ui-fg-subtle whitespace-pre-line"
          data-testid="product-description"
        >
          {
            product.description?.includes("###") ? isLang ? product.description.split("###")[0] : product.description.split("###")[1] : product.description
}
          {product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
