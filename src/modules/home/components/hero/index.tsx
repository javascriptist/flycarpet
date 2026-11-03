"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { t } from "@lib/util/translations"

const IMAGES = ["/rug-hero.jpg", "/heroimg1.jpg", "/heroimg2.jpg", "/heroimg3.jpg"]
const INTERVAL_MS = 7000

/**
 * Full-bleed hero: a slow cross-fade between interior photos (paused when
 * the user prefers reduced motion), copy on a bottom scrim, two actions.
 */
const Hero = ({ countryCode }: { countryCode: string }) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setInterval(() => setCurrent((i) => (i + 1) % IMAGES.length), INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section className="relative isolate h-[min(88svh,760px)] min-h-[520px] w-full overflow-hidden bg-[#191718]">
      {IMAGES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="100vw"
          priority={i === 0}
          className="-z-10 object-cover"
          style={{
            opacity: i === current ? 1 : 0,
            transition: "opacity 900ms var(--ease-in-out)",
          }}
        />
      ))}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/30 to-black/0"
      />

      <div className="content-container flex h-full flex-col justify-end pb-12 small:pb-20">
        <div className="flex max-w-2xl flex-col gap-4 text-white">
          <span className="text-footnote font-medium uppercase tracking-[0.12em] text-brand-peach">
            Premium Carpet
          </span>
          <h1 className="text-display text-balance">
            {t(
              {
                uz: "Uyingizga Sharq iliqligini olib keling",
                ru: "Тепло Востока — в вашем доме",
                en: "Bring the warmth of the East home",
              },
              countryCode
            )}
          </h1>
          <p className="max-w-[48ch] text-body text-white/85 small:text-title-3 small:font-normal">
            {t(
              {
                uz: "Qoʼlda toʼqilgan va zamonaviy gilamlar, oʼlchamingizga kesiladigan rulonlar va Oʼzbekiston boʼylab yetkazib berish.",
                ru: "Ковры ручной работы и современные модели, ковролин на отрез по вашему размеру и доставка по всему Узбекистану.",
                en: "Hand-knotted and modern rugs, roll carpet cut to your size, and delivery across Uzbekistan.",
              },
              countryCode
            )}
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <LocalizedClientLink href="/store" className="btn-primary">
              {t({ uz: "Katalogni koʼrish", ru: "Смотреть каталог", en: "Shop rugs" }, countryCode)}
            </LocalizedClientLink>
            <a
              href="#categories"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white/15 px-6 font-medium text-white ring-1 ring-white/30 backdrop-blur-md transition hover:bg-white/25"
            >
              {t({ uz: "Turkumlar", ru: "Категории", en: "Categories" }, countryCode)}
            </a>
          </div>
        </div>

        <div className="mt-8 flex gap-1.5" aria-hidden>
          {IMAGES.map((src, i) => (
            <span
              key={src}
              className={`h-1 rounded-full transition-[width,background-color] duration-300 ${
                i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
