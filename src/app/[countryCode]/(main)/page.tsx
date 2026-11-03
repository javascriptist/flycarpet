import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import CategoryTiles from "@modules/home/components/category-tiles"
import NewArrivals from "@modules/home/components/new-arrivals"
import CollectionsRail from "@modules/home/components/collections-rail"
import AboutBanner from "@modules/home/components/about-banner"
import Reassurance from "@modules/home/components/reassurance"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Premium Carpet",
  description: "Premium Carpet gilamlari. Oʼzbekiston boʼylab yetkazib berish.",
}

/**
 * Home: hero → categories → new arrivals → promises → collections → about.
 * One idea per section, generous spacing, the same cards as the shop.
 */
export default async function Home(props: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await props.params

  const region = await getRegion(countryCode)
  if (!region) {
    return null
  }

  const [{ response }, { collections }] = await Promise.all([
    listProducts({ pageParam: 0, queryParams: { limit: 8 }, countryCode }),
    listCollections({}),
  ])

  return (
    <div className="flex flex-col gap-16 pb-16 small:gap-24 small:pb-24">
      <Hero countryCode={countryCode} />
      <CategoryTiles countryCode={countryCode} />
      <NewArrivals products={response.products} countryCode={countryCode} />
      <Reassurance countryCode={countryCode} />
      <CollectionsRail collections={collections ?? []} countryCode={countryCode} />
      <AboutBanner countryCode={countryCode} />
    </div>
  )
}
