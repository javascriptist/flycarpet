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

/**
 * Format UZS amounts without decimals (whole numbers only)
 * Using en-US locale for consistent formatting (commas as separators)
 */
export const formatUzsAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " so'm"
}

/**
 * Format a store price (USD, major units) for display.
 * When an exchange rate is known, prices are shown in UZS — matching
 * ProductPrice and the cart — otherwise in USD.
 */
export const formatStorePrice = (usdAmount: number, exchangeRate?: number): string => {
  if (exchangeRate) {
    return formatUzsAmount(convertUsdToUzs(usdAmount, exchangeRate))
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(usdAmount)
}
