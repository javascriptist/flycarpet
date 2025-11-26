import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import HeroCollections from "@modules/home/components/hero/hero-collections"
import AboutUsLink from "@modules/home/components/hero/aboutuslink"
import CollectionSlide from "@modules/home/components/hero/collectionslide"
import ProductSlide from "@modules/home/components/hero/productsslide"
export const metadata: Metadata = {
  title: "Premium Carpet Store",
  description:
    "Premium Carpet Gilamlari. O'zbekiston bo'ylab yetkazib berish.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)
  const { response: { products, count },} = await listProducts({
    pageParam: 0,
    queryParams: {
      limit: 10
    },
    countryCode,
  })
  const productsToPass = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      img: product.images?.[0]?.url || null
    }
  })
  const { collections } = await listCollections({})
  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero countryCode={countryCode} />
      <div className="py-12">
        <HeroCollections countryCode={countryCode} />
      </div>
      <div className="py-12">
        <ProductSlide listOfProducts={productsToPass} countryCode={countryCode} />
      </div>
      <div className="py-12">
        <AboutUsLink countryCode={countryCode} />
      </div>
      <div className="py-12">
        <CollectionSlide listOfCollections={collections} countryCode={countryCode} />
      </div>
    </>
  )
}
