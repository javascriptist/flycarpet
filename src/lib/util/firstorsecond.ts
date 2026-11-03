import { getLang } from "./translations"

/**
 * Picks the right language from a multilingual product field written as
 * "Uzbek ### Russian ### English". Missing parts fall back to Uzbek.
 */
export function firstOrSecond(text: string | null | undefined, countryCode?: string): string {
  if (!text) return ""
  if (!text.includes("###")) return text

  const [uz, ru, en] = text.split("###").map((part) => part.trim())
  const lang = getLang(countryCode)
  const picked = lang === "ru" ? ru : lang === "en" ? en : uz

  return picked || uz || text
}

export const localizedText = firstOrSecond
