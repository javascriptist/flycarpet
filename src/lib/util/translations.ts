/**
 * Language handling for the storefront.
 *
 * The URL country code chooses the language: /ru → Russian, /gb → English,
 * everything else (including /uz) → Uzbek.
 *
 * Usage: t({ uz: "Salom", ru: "Привет", en: "Hello" }, countryCode)
 */

export type Lang = "uz" | "ru" | "en"

type TranslationMap = Record<Lang, string>

export const getLang = (countryCode?: string): Lang => {
  const code = countryCode?.toLowerCase()
  if (code === "ru") return "ru"
  if (code === "gb" || code === "en") return "en"
  return "uz"
}

export const getTranslation = (
  translations: TranslationMap,
  countryCode?: string
): string => translations[getLang(countryCode)]

// Short alias
export const t = getTranslation
