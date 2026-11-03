import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { t } from "@lib/util/translations"

export default function AboutBanner({ countryCode }: { countryCode: string }) {
  return (
    <section className="content-container">
      <div className="relative isolate overflow-hidden rounded-card px-6 py-14 text-white small:px-16 small:py-20">
        <Image src="/aboutuslink.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        <div className="flex max-w-xl flex-col items-start gap-4">
          <span className="text-footnote font-medium uppercase tracking-[0.12em] text-brand-peach">
            {t({ uz: "Biz haqimizda", ru: "О нас", en: "About us" }, countryCode)}
          </span>
          <h2 className="text-title-1 text-balance">
            {t({ uz: "12 yillik ishonch va sifat", ru: "12 лет доверия и качества", en: "12 years of trust and quality" }, countryCode)}
          </h2>
          <p className="text-body text-white/85">
            {t(
              {
                uz: "Gilam tanlashda maslahat beramiz, oʼlchamni aniqlashga yordam beramiz va uyingizgacha yetkazamiz.",
                ru: "Поможем выбрать ковёр, подобрать размер и доставим до двери.",
                en: "We help you choose, get the size right, and deliver to your door.",
              },
              countryCode
            )}
          </p>
          <LocalizedClientLink
            href="/about"
            className="mt-2 inline-flex h-12 items-center rounded-full bg-white px-6 font-medium text-ink transition hover:bg-brand-linen"
          >
            {t({ uz: "Batafsil", ru: "Подробнее", en: "Our story" }, countryCode)}
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
