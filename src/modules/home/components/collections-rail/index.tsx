import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SectionHeader from "../section-header"
import toCyrillic from "@lib/util/latintocrylic"
import { firstOrSecond } from "@lib/util/firstorsecond"
import { getLang, t } from "@lib/util/translations"

const RUG_IMAGES = 20

/** Collection names: "uz ### ru ### en" if given, else Latin → Cyrillic for Russian. */
const collectionTitle = (title: string, countryCode: string) =>
  title.includes("###")
    ? firstOrSecond(title, countryCode)
    : getLang(countryCode) === "ru"
    ? toCyrillic(title)
    : title

export default function CollectionsRail({
  collections,
  countryCode,
}: {
  collections: HttpTypes.StoreCollection[]
  countryCode: string
}) {
  if (!collections.length) return null

  return (
    <section aria-labelledby="collections">
      <div className="content-container">
        <SectionHeader
          id="collections"
          title={t({ uz: "Kolleksiyalar", ru: "Коллекции", en: "Collections" }, countryCode)}
          subtitle={t(
            {
              uz: "Uslub va rang boʼyicha tanlangan toʼplamlar.",
              ru: "Подборки по стилю и цвету.",
              en: "Curated by style and colour.",
            },
            countryCode
          )}
        />
      </div>
      <ul className="no-scrollbar mx-auto flex max-w-[1440px] snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-6 [scroll-padding-inline:1.5rem] small:gap-6">
        {collections.map((collection, i) => (
          <li key={collection.id} className="w-[60%] shrink-0 snap-start xsmall:w-[36%] small:w-[calc((100%-6rem)/5)]">
            <LocalizedClientLink href={`/collections/${collection.handle}`} className="group flex flex-col gap-3">
              <div className="aspect-square overflow-hidden rounded-card bg-brand-linen">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/rugpic/randomrug${i % RUG_IMAGES}.png`}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <span className="px-0.5 text-callout text-ink">{collectionTitle(collection.title, countryCode)}</span>
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
