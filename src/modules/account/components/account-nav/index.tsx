"use client"

import { useParams, usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"
import { t } from "@lib/util/translations"

const LINKS = [
  { href: "/account", testId: "overview-link", uz: "Umumiy", ru: "Обзор", en: "Overview" },
  { href: "/account/orders", testId: "orders-link", uz: "Buyurtmalar", ru: "Заказы", en: "Orders" },
  { href: "/account/profile", testId: "profile-link", uz: "Profil", ru: "Профиль", en: "Profile" },
  { href: "/account/addresses", testId: "addresses-link", uz: "Manzillar", ru: "Адреса", en: "Addresses" },
]

/**
 * Phone: on the overview, a grouped list of sections; on a sub-page, a
 * "‹ Account" back link. Desktop: a sidebar with the current page highlighted.
 */
const AccountNav = ({ customer }: { customer: HttpTypes.StoreCustomer | null }) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }
  const current = route.split(`/${countryCode}`)[1] || "/"
  const onOverview = current === "/account"

  const logout = () => signout(countryCode)
  const logoutLabel = t({ uz: "Chiqish", ru: "Выйти", en: "Sign out" }, countryCode)

  return (
    <nav aria-label={t({ uz: "Hisob", ru: "Аккаунт", en: "Account" }, countryCode)}>
      {/* Phone */}
      <div className="small:hidden" data-testid="mobile-account-nav">
        {onOverview ? (
          <div className="flex flex-col gap-4">
            <h1 className="text-title-1 text-ink">
              {t({ uz: "Salom", ru: "Здравствуйте", en: "Hello" }, countryCode)}
              {customer?.first_name ? `, ${customer.first_name}` : ""}
            </h1>
            <ul className="divide-y divide-line overflow-hidden rounded-card bg-surface-raised shadow-card">
              {LINKS.slice(1).map((link) => (
                <li key={link.href}>
                  <LocalizedClientLink
                    href={link.href}
                    className="flex h-14 items-center justify-between px-5 text-body text-ink"
                    data-testid={link.testId}
                  >
                    {t(link, countryCode)}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-ink-subtle" aria-hidden>
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </LocalizedClientLink>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={logout}
                  className="no-press flex h-14 w-full items-center px-5 text-body text-red-700"
                  data-testid="logout-button"
                >
                  {logoutLabel}
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <LocalizedClientLink
            href="/account"
            className="-ml-1 inline-flex items-center gap-1 text-callout text-brand-accent-strong"
            data-testid="account-main-link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M15 18l-6-6 6-6" />
            </svg>
            {t({ uz: "Hisob", ru: "Аккаунт", en: "Account" }, countryCode)}
          </LocalizedClientLink>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden small:block" data-testid="account-nav">
        <p className="mb-3 px-3 text-footnote text-ink-muted">{customer?.email}</p>
        <ul className="flex flex-col gap-1">
          {LINKS.map((link) => {
            const active = current === link.href
            return (
              <li key={link.href}>
                <LocalizedClientLink
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-10 items-center rounded-control px-3 text-callout transition ${
                    active ? "bg-brand-linen font-medium text-ink" : "text-ink-muted hover:bg-brand-linen/60 hover:text-ink"
                  }`}
                  data-testid={link.testId}
                >
                  {t(link, countryCode)}
                </LocalizedClientLink>
              </li>
            )
          })}
          <li className="mt-3 border-t border-line pt-3">
            <button
              type="button"
              onClick={logout}
              className="no-press flex h-10 w-full items-center rounded-control px-3 text-callout text-ink-muted hover:text-red-700"
              data-testid="logout-button"
            >
              {logoutLabel}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default AccountNav
