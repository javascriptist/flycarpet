"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Item from "@modules/cart/components/item"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import { t } from "@lib/util/translations"
import { useExchangeRate, useMoney } from "@lib/context/currency-context"
import { cartItemCount } from "@lib/util/carpet-helpers"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const money = useMoney()
  const exchangeRate = useExchangeRate()
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems = cartItemCount(cartState?.items)

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  const countryCode = pathname.split("/")[1]
  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  const items = [...(cartState?.items ?? [])].sort((a, b) =>
    (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
  )
  const cartLabel = t({ uz: "Savatcha", ru: "Корзина", en: "Cart" }, countryCode)

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton as="div" className="h-full">
          <LocalizedClientLink
            className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-white/10"
            href="/cart"
            data-testid="nav-cart-link"
            aria-label={`${cartLabel} (${totalItems})`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand-accent-strong px-1 text-[11px] font-medium leading-none text-white num">
                {totalItems}
              </span>
            )}
          </LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 scale-[0.97]"
          enterTo="opacity-100 scale-100"
          leave="transition ease-out duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-[0.97]"
        >
          <PopoverPanel
            static
            className="hidden small:flex flex-col absolute top-[calc(100%+8px)] right-0 w-[400px] origin-top-right overflow-hidden rounded-card bg-surface-raised text-ink shadow-float ring-1 ring-black/5"
            data-testid="nav-cart-dropdown"
          >
            <div className="flex items-baseline justify-between px-5 pt-4 pb-2">
              <h3 className="text-headline">{cartLabel}</h3>
              {totalItems > 0 && <span className="text-footnote text-ink-muted num">{totalItems}</span>}
            </div>
            {items.length ? (
              <>
                <ul className="max-h-[360px] divide-y divide-line overflow-y-auto overscroll-contain px-5">
                  {items.map((item) => (
                    <Item
                      key={item.id}
                      item={item}
                      type="preview"
                      currencyCode={cartState!.currency_code}
                      exchangeRate={exchangeRate}
                      countryCode={countryCode}
                    />
                  ))}
                </ul>
                <div className="flex flex-col gap-4 border-t border-line p-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-callout text-ink-muted">
                      {t({ uz: "Jami", ru: "Итого", en: "Subtotal" }, countryCode)}
                    </span>
                    <span className="text-headline num" data-testid="cart-subtotal" data-value={subtotal}>
                      {money(subtotal, cartState!.currency_code)}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart" className="btn-primary w-full" data-testid="go-to-cart-button">
                    {t({ uz: "Savatchaga o\u02bctish", ru: "Перейти в корзину", en: "View cart" }, countryCode)}
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 px-5 pt-6 pb-8 text-center">
                <p className="text-callout text-ink-muted">
                  {t({ uz: "Savatcha bo\u02bcsh", ru: "Корзина пуста", en: "Your cart is empty" }, countryCode)}
                </p>
                <LocalizedClientLink href="/store" className="btn-secondary" onClick={close}>
                  {t({ uz: "Katalogga o\u02bctish", ru: "Перейти в каталог", en: "Browse rugs" }, countryCode)}
                </LocalizedClientLink>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
