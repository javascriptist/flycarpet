import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SectionHeader from "../section-header"
import { t } from "@lib/util/translations"

/**
 * Three big tiles; the whole tile is the link and the description is
 * always visible (it used to appear only on hover, i.e. never on phones).
 */
export default function CategoryTiles({ countryCode }: { countryCode: string }) {
  const tiles = [
    {
      href: "/categories/gilam",
      image: "/gilam-stock.png",
      title: t({ uz: "Gilamlar", ru: "Ковры", en: "Rugs" }, countryCode),
      text: t(
        {
          uz: "Anʼanaviy qoʼlda toʼqilgan va zamonaviy mashina gilamlari.",
          ru: "Традиционные ковры ручной работы и современные машинные.",
          en: "Traditional hand-knotted rugs and modern machine-woven designs.",
        },
        countryCode
      ),
      className: "small:row-span-2 aspect-[4/3] small:aspect-auto",
    },
    {
      href: "/categories/tufting",
      image: "/tufting.png",
      title: t({ uz: "Tafting", ru: "Тафтинг", en: "Tufted" }, countryCode),
      text: t(
        {
          uz: "Tafting texnologiyasidagi gilamlar va rulonlar.",
          ru: "Ковры и ковролин по технологии тафтинга.",
          en: "Tufted rugs and roll carpet, cut to your size.",
        },
        countryCode
      ),
      className: "aspect-[4/3] small:aspect-[16/9]",
    },
    {
      href: "/categories/gazon",
      image: "/alawn.png",
      title: t({ uz: "Sunʼiy gazon", ru: "Искусственный газон", en: "Artificial grass" }, countryCode),
      text: t(
        {
          uz: "Ichki va tashqi foydalanish uchun.",
          ru: "Для дома, террасы и улицы.",
          en: "For indoor and outdoor spaces.",
        },
        countryCode
      ),
      className: "aspect-[4/3] small:aspect-[16/9]",
    },
  ]

  return (
    <section className="content-container" aria-labelledby="categories">
      <SectionHeader
        id="categories"
        title={t({ uz: "Turkumlar", ru: "Категории", en: "Shop by category" }, countryCode)}
      />
      <div className="grid grid-cols-1 gap-4 small:grid-cols-2">
        {tiles.map((tile) => (
          <LocalizedClientLink
            key={tile.href}
            href={tile.href}
            className={`group relative isolate flex overflow-hidden rounded-card bg-brand-linen ${tile.className}`}
          >
            <Image
              src={tile.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="-z-10 object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="mt-auto flex w-full items-end justify-between gap-4 p-5 text-white small:p-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-title-2">{tile.title}</h3>
                <p className="max-w-[40ch] text-callout text-white/85">{tile.text}</p>
              </div>
              <span
                aria-hidden
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-md transition group-hover:bg-white group-hover:text-ink"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </section>
  )
}
