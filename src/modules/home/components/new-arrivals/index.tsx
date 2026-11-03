import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import SectionHeader from "../section-header"
import { t } from "@lib/util/translations"

/**
 * Horizontal row of the same product cards used in the shop. Native
 * scroll-snap on phones (swipe), a 4-up grid feel on desktop.
 */
export default function NewArrivals({
  products,
  countryCode,
}: {
  products: HttpTypes.StoreProduct[]
  countryCode: string
}) {
  if (!products.length) return null

  return (
    <section aria-labelledby="new-arrivals">
      <div className="content-container">
        <SectionHeader
          id="new-arrivals"
          title={t({ uz: "Yangi kelganlar", ru: "Новинки", en: "New arrivals" }, countryCode)}
          linkHref="/store"
          linkLabel={t({ uz: "Barchasi", ru: "Все", en: "View all" }, countryCode)}
        />
      </div>
      <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-6 small:gap-6 [scroll-padding-inline:1.5rem] max-w-[1440px] mx-auto">
        {products.map((product) => (
          <li key={product.id} className="w-[68%] shrink-0 snap-start xsmall:w-[42%] small:w-[calc((100%-4.5rem)/4)]">
            <ProductPreview product={product} countryCode={countryCode} />
          </li>
        ))}
      </ul>
    </section>
  )
}
