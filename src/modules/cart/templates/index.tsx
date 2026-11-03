"use client"

import ItemsTemplate from "./items"
import Summary, { getCheckoutStep } from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { formatMoney } from "@lib/util/money"
import { t } from "@lib/util/translations"

/**
 * Cart page
 * Desktop: items on the left, a sticky summary card on the right.
 * Phone: items, then summary; a bottom bar keeps the total and Checkout in reach.
 */
const CartTemplate = ({
  cart,
  customer,
  exchangeRate,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  exchangeRate: number | undefined
}) => {
  const countryCode = useParams().countryCode as string
  const summaryRef = useRef<HTMLDivElement>(null)
  const [summaryVisible, setSummaryVisible] = useState(false)

  useEffect(() => {
    const el = summaryRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setSummaryVisible(e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [cart?.items?.length])

  if (!cart?.items?.length) {
    return (
      <div className="content-container" data-testid="cart-container">
        <EmptyCartMessage countryCode={countryCode} />
      </div>
    )
  }

  const total = formatMoney(cart.total ?? 0, cart.currency_code, exchangeRate, countryCode)

  return (
    <div className="content-container pb-28 pt-8 small:pb-16 small:pt-12" data-testid="cart-container">
      <div className="grid grid-cols-1 gap-10 small:grid-cols-[1fr_380px] small:gap-16">
        <div className="flex flex-col gap-6">
          {!customer && <SignInPrompt countryCode={countryCode} />}
          <ItemsTemplate cart={cart} countryCode={countryCode} exchangeRate={exchangeRate} />
        </div>
        <div>
          <div ref={summaryRef} className="small:sticky small:top-24">
            {cart.region && (
              <Summary cart={cart as any} countryCode={countryCode} exchangeRate={exchangeRate} />
            )}
          </div>
        </div>
      </div>

      {/* Phone: total + Checkout always in reach */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 small:hidden"
        style={{
          transform: summaryVisible ? "translateY(100%)" : "translateY(0)",
          transition: "transform 250ms var(--ease-out)",
        }}
        aria-hidden={summaryVisible}
        inert={summaryVisible ? true : undefined}
      >
        <div className="glass flex items-center gap-4 border-t border-line px-4 pt-3 pb-safe">
          <div className="flex-1">
            <p className="text-footnote text-ink-muted">{t({ uz: "Jami", ru: "Итого", en: "Total" }, countryCode)}</p>
            <p className="text-headline text-ink num">{total}</p>
          </div>
          <LocalizedClientLink
            href={"/checkout?step=" + getCheckoutStep(cart)}
            className="btn-primary h-11 px-6"
            data-testid="mobile-checkout-button"
          >
            {t({ uz: "Rasmiylashtirish", ru: "Оформить", en: "Checkout" }, countryCode)}
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default CartTemplate
