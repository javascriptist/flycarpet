import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    : amount.toString()
}

/**
 * Convert USD amount to UZS using the current exchange rate
 * @param usdAmount - Amount in USD cents (e.g., 5000 = $50.00)
 * @param rate - Exchange rate (UZS per USD)
 * @returns Amount in UZS (whole number)
 */
export function convertUsdToUzs(usdAmount: number, rate: number): number {
  // Convert cents to dollars, multiply by rate
  const usdDollars = usdAmount
  return Math.round(usdDollars * rate)
}

/** "so'm" in Uzbek/English, "сум" in Russian */
export const currencyWord = (countryCode?: string): string =>
  countryCode?.toLowerCase() === "ru" ? "сум" : "so\u02bcm"

/**
 * Format UZS amounts as whole numbers with the local currency word.
 * Uses en-US grouping (1,530,000) for consistency across languages.
 */
export const formatUzsAmount = (amount: number, countryCode?: string): string =>
  new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) +
  " " +
  currencyWord(countryCode)

/**
 * Format a store price (USD, major units) for display.
 * When an exchange rate is known, prices are shown in UZS — matching
 * ProductPrice and the cart — otherwise in USD.
 */
export const formatStorePrice = (
  usdAmount: number,
  exchangeRate?: number,
  countryCode?: string
): string => {
  if (exchangeRate) {
    return formatUzsAmount(convertUsdToUzs(usdAmount, exchangeRate), countryCode)
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(usdAmount)
}

/**
 * One formatter for any Medusa amount (cart, line items, shipping, discounts).
 * USD amounts are shown in UZS when a rate is available; UZS amounts are
 * shown as-is; anything else falls back to the locale currency format.
 */
export const formatMoney = (
  amount: number,
  currencyCode: string | undefined,
  exchangeRate?: number,
  countryCode?: string
): string => {
  const code = (currencyCode || "usd").toLowerCase()
  if (code === "uzs") return formatUzsAmount(amount, countryCode)
  if (code === "usd") return formatStorePrice(amount, exchangeRate, countryCode)
  return convertToLocale({ amount, currency_code: code })
}
