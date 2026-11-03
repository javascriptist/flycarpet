"use client"

import { useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { t } from "@lib/util/translations"

export default function BackToCart() {
  const { countryCode } = useParams() as { countryCode: string }

  return (
    <LocalizedClientLink
      href="/cart"
      className="-ml-2 flex flex-1 basis-0 items-center gap-1 rounded-full px-2 py-2 text-callout hover:text-white"
      data-testid="back-to-cart-link"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {t({ uz: "Savatcha", ru: "Корзина", en: "Cart" }, countryCode)}
    </LocalizedClientLink>
  )
}
