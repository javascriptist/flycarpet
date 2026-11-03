"use client"

import { useSearchParams } from "next/navigation"
import { t } from "@lib/util/translations"

const STEPS = [
  { key: "address", uz: "Manzil", ru: "Адрес", en: "Address" },
  { key: "delivery", uz: "Yetkazish", ru: "Доставка", en: "Delivery" },
  { key: "payment", uz: "Toʼlov", ru: "Оплата", en: "Payment" },
  { key: "review", uz: "Tasdiqlash", ru: "Проверка", en: "Review" },
]

/** Where am I, what's left: a 4-step progress indicator driven by ?step= */
export default function CheckoutSteps({ countryCode }: { countryCode: string }) {
  const step = useSearchParams().get("step") ?? "address"
  const current = Math.max(0, STEPS.findIndex((s) => s.key === step))

  return (
    <ol className="flex items-center gap-2" aria-label={t({ uz: "Bosqichlar", ru: "Шаги", en: "Steps" }, countryCode)}>
      {STEPS.map((s, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={s.key} className="flex flex-1 flex-col gap-2" aria-current={active ? "step" : undefined}>
            <span
              className={`h-1 rounded-full transition-colors duration-200 ${
                done || active ? "bg-brand-accent-strong" : "bg-ink/10"
              }`}
            />
            <span className={`text-footnote ${active ? "font-medium text-ink" : done ? "text-ink-muted" : "text-ink-subtle"}`}>
              {i + 1}. {t(s, countryCode)}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
