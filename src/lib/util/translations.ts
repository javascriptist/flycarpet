/**
 * Simple translation helper for uz/ru/en languages
 * Usage: t({ uz: "Salom", ru: "Привет", en: "Hello" })
 */

type TranslationMap = {
  uz: string
  ru: string
  en: string
}

export const getTranslation = (
  translations: TranslationMap,
  countryCode?: string
): string => {
  const code = countryCode?.toLowerCase()
  
  if (code === "ru") return translations.ru
  if (code === "gb") return translations.en
  return translations.uz // default to Uzbek
}

// Short alias
export const t = getTranslation
