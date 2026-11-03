"use client"

import { updateRegion } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { useParams, usePathname } from "next/navigation"
import { useTransition } from "react"

const LANGS = [
  { code: "uz", label: "Oʼzbekcha" },
  { code: "ru", label: "Русский" },
  { code: "gb", label: "English" },
]

/**
 * Language = URL country code. A segmented control (works by tap, unlike
 * the old hover-only listbox). Only languages that exist as regions show.
 */
export default function LanguageSwitch({
  regions,
}: {
  regions: HttpTypes.StoreRegion[] | null
}) {
  const { countryCode } = useParams() as { countryCode: string }
  const currentPath = usePathname().split(`/${countryCode}`)[1] ?? ""
  const [pending, startTransition] = useTransition()

  const available = new Set(
    (regions ?? []).flatMap((r) => r.countries?.map((c) => c.iso_2) ?? [])
  )
  const langs = LANGS.filter((l) => available.size === 0 || available.has(l.code))

  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className={`grid gap-1 rounded-full bg-ink/5 p-1 ${pending ? "opacity-60" : ""}`}
      style={{ gridTemplateColumns: `repeat(${langs.length}, minmax(0, 1fr))` }}
    >
      {langs.map((l) => {
        const active = l.code === countryCode
        return (
          <button
            key={l.code}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => !active && startTransition(() => updateRegion(l.code, currentPath))}
            className={`h-9 rounded-full px-3 text-footnote transition ${
              active ? "bg-surface-raised text-ink shadow-card" : "text-ink-muted hover:text-ink"
            }`}
          >
            {l.label}
          </button>
        )
      })}
    </div>
  )
}
