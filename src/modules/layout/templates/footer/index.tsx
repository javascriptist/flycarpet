import Image from "next/image"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { firstOrSecond } from "@lib/util/firstorsecond"
import { t } from "@lib/util/translations"

/**
 * Dark footer that bookends the dark nav: brand + promise, then three short
 * link columns (shop, collections, customer). Everything is translated.
 */
export default async function Footer({ countryCode }: { countryCode?: string }) {
  const [{ collections }, productCategories] = await Promise.all([
    listCollections({ fields: "id,handle,title" }).catch(() => ({ collections: [] as any[] })),
    listCategories().catch(() => [] as any[]),
  ])

  const tr = (m: { uz: string; ru: string; en: string }) => t(m, countryCode)
  const topCategories = (productCategories ?? []).filter((c: any) => !c.parent_category).slice(0, 6)

  const columns = [
    {
      title: tr({ uz: "Doʼkon", ru: "Магазин", en: "Shop" }),
      links: [
        { href: "/store", label: tr({ uz: "Barcha mahsulotlar", ru: "Все товары", en: "All products" }) },
        ...topCategories.map((c: any) => ({ href: `/categories/${c.handle}`, label: firstOrSecond(c.name, countryCode) })),
      ],
    },
    {
      title: tr({ uz: "Kolleksiyalar", ru: "Коллекции", en: "Collections" }),
      links: (collections ?? []).slice(0, 6).map((c: any) => ({
        href: `/collections/${c.handle}`,
        label: firstOrSecond(c.title, countryCode),
      })),
    },
    {
      title: tr({ uz: "Xaridorlar uchun", ru: "Покупателям", en: "Customer" }),
      links: [
        { href: "/account", label: tr({ uz: "Hisob", ru: "Аккаунт", en: "Account" }) },
        { href: "/account/orders", label: tr({ uz: "Buyurtmalar", ru: "Заказы", en: "Orders" }) },
        { href: "/cart", label: tr({ uz: "Savatcha", ru: "Корзина", en: "Cart" }) },
        { href: "/about", label: tr({ uz: "Biz haqimizda", ru: "О нас", en: "About us" }) },
      ],
    },
  ].filter((col) => col.links.length > 0)

  return (
    <footer className="w-full bg-[#191718] text-white/70">
      <div className="content-container flex flex-col gap-12 py-14 small:flex-row small:justify-between small:py-20">
        <div className="flex max-w-xs flex-col gap-4">
          <LocalizedClientLink href="/" aria-label="Premium Carpet" className="self-start hover:opacity-80">
            <Image src="/pclogo_tp.png" alt="Premium Carpet" width={150} height={40} />
          </LocalizedClientLink>
          <p className="text-callout">
            {tr({
              uz: "Gilamlar, rulon gilamlar va sunʼiy gazon. Oʼzbekiston boʼylab yetkazib berish.",
              ru: "Ковры, ковролин и искусственный газон. Доставка по всему Узбекистану.",
              en: "Rugs, roll carpet and artificial grass. Delivery across Uzbekistan.",
            })}
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-x-8 gap-y-10 xsmall:grid-cols-3 small:gap-x-16" aria-label="Footer">
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h2 className="text-footnote font-medium uppercase tracking-[0.08em] text-brand-peach">{col.title}</h2>
              <ul className="flex flex-col gap-2" data-testid={col.title === columns[0].title ? "footer-categories" : undefined}>
                {col.links.map((link) => (
                  <li key={link.href}>
                    <LocalizedClientLink href={link.href} className="text-callout text-white/70 transition hover:text-white">
                      {link.label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="content-container flex flex-col gap-2 py-6 text-footnote text-white/50 xsmall:flex-row xsmall:justify-between">
          <span>© {new Date().getFullYear()} Premium Carpet</span>
          <span>{tr({ uz: "Barcha huquqlar himoyalangan", ru: "Все права защищены", en: "All rights reserved" })}</span>
        </div>
      </div>
    </footer>
  )
}
