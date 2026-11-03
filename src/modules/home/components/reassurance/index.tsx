import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import { t } from "@lib/util/translations"

/** Three short promises, shown once on the home page. */
export default function Reassurance({ countryCode }: { countryCode: string }) {
  const items = [
    {
      icon: <FastDelivery size="24" />,
      title: t({ uz: "3–5 kunda yetkazish", ru: "Доставка за 3–5 дней", en: "Delivery in 3–5 days" }, countryCode),
      text: t({ uz: "Oʼzbekiston boʼylab", ru: "По всему Узбекистану", en: "Across Uzbekistan" }, countryCode),
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      ),
      title: t({ uz: "Oʼlchamingizga kesamiz", ru: "Режем по вашему размеру", en: "Cut to your size" }, countryCode),
      text: t({ uz: "Rulon gilamlar 10 sm aniqlikda", ru: "Ковролин с точностью до 10 см", en: "Roll carpet to the nearest 10 cm" }, countryCode),
    },
    {
      icon: <Refresh size="24" />,
      title: t({ uz: "Oson almashtirish", ru: "Лёгкий обмен", en: "Easy exchanges" }, countryCode),
      text: t({ uz: "Biz bilan bogʼlaning — hal qilamiz", ru: "Свяжитесь с нами — решим", en: "Get in touch and we'll sort it" }, countryCode),
    },
  ]

  return (
    <section className="content-container">
      <ul className="grid grid-cols-1 gap-6 border-y border-line py-8 small:grid-cols-3 small:gap-10">
        {items.map((item) => (
          <li key={item.title} className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-linen text-brand-accent-strong">
              {item.icon}
            </span>
            <div>
              <p className="text-headline text-ink">{item.title}</p>
              <p className="text-callout text-ink-muted">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
