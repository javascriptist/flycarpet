"use client"

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react"
import { HttpTypes } from "@medusajs/types"
import { Fragment, useState } from "react"
import { usePathname } from "next/navigation"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import LanguageSwitch from "../language-switch"
import { t } from "@lib/util/translations"

const ITEMS = [
  { href: "/", uz: "Bosh sahifa", ru: "Главная", en: "Home" },
  { href: "/store", uz: "Katalog", ru: "Каталог", en: "Shop" },
  { href: "/about", uz: "Biz haqimizda", ru: "О нас", en: "About us" },
  { href: "/account", uz: "Hisob", ru: "Аккаунт", en: "Account" },
  { href: "/cart", uz: "Savatcha", ru: "Корзина", en: "Cart" },
]

/**
 * Menu panel that slides in from the left edge (where its button is) and
 * leaves the same way. Focus is trapped while open; Escape or the scrim closes.
 */
const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const countryCode = pathname.split("/")[1]
  const current = "/" + pathname.split("/").slice(2).join("/")

  return (
    <div className="flex h-full items-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-testid="nav-menu-button"
        aria-label={t({ uz: "Menyu", ru: "Меню", en: "Menu" }, countryCode)}
        className="-ml-2.5 grid h-11 w-11 place-items-center rounded-full hover:bg-white/10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5M3.75 12h16.5m-16.5 4.5h16.5" />
        </svg>
      </button>

      <Transition show={open} as={Fragment}>
        <Dialog onClose={setOpen} className="relative z-[90]">
          <TransitionChild
            as={Fragment}
            enter="transition-opacity duration-200 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200 ease-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" aria-hidden />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="transition-transform duration-[400ms] ease-drawer"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition-transform duration-300 ease-drawer"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <DialogPanel
              className="fixed inset-y-0 left-0 flex w-[min(22rem,88vw)] flex-col bg-surface pt-safe shadow-float"
              data-testid="nav-menu-popup"
            >
              <div className="flex h-16 items-center justify-between px-5">
                <DialogTitle className="text-headline text-ink">Premium Carpet</DialogTitle>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  data-testid="close-menu-button"
                  aria-label={t({ uz: "Yopish", ru: "Закрыть", en: "Close" }, countryCode)}
                  className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-ink-muted hover:bg-brand-linen hover:text-ink"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3">
                <ul className="flex flex-col">
                  {ITEMS.map((item) => {
                    const active = item.href === "/" ? current === "/" : current.startsWith(item.href)
                    return (
                      <li key={item.href}>
                        <LocalizedClientLink
                          href={item.href}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`flex h-12 items-center rounded-control px-3 text-title-3 transition ${
                            active ? "bg-brand-linen text-ink" : "text-ink hover:bg-brand-linen/60"
                          }`}
                        >
                          {t(item, countryCode)}
                        </LocalizedClientLink>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              <div className="flex flex-col gap-4 border-t border-line px-5 pt-5 pb-safe">
                <LanguageSwitch regions={regions} />
                <p className="text-caption text-ink-subtle">
                  © {new Date().getFullYear()} Premium Carpet
                </p>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </div>
  )
}

export default SideMenu
