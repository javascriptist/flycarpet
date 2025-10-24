/**
 * Payme Currency Conversion Utilities
 * Payme works with Tiyin (1 UZS = 100 Tiyin)
 */

/**
 * Convert UZS to Tiyin
 * @param amountUzs Amount in UZS
 * @returns Amount in Tiyin
 */
export const uzsToTiyin = (amountUzs: number): number => {
  return Math.round(amountUzs * 100)
}

/**
 * Convert Tiyin to UZS
 * @param amountTiyin Amount in Tiyin
 * @returns Amount in UZS
 */
export const tiyinToUzs = (amountTiyin: number): number => {
  return amountTiyin / 100
}

/**
 * Format UZS amount for display
 * @param amount Amount in UZS
 * @returns Formatted string
 */
export const formatUzsForPayme = (amount: number): string => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Convert cents to UZS based on exchange rate
 * @param cents Amount in cents (Medusa stores prices in cents)
 * @param exchangeRate Exchange rate USD to UZS
 * @returns Amount in UZS
 */
export const centsToUzs = (cents: number, exchangeRate: number): number => {
  const dollars = cents / 100
  return Math.round(dollars * exchangeRate)
}

/**
 * Example usage:
 * 
 * const cartTotal = 5000000 // 50,000 UZS
 * const tiyinAmount = uzsToTiyin(cartTotal) // 5,000,000,000 Tiyin
 * 
 * // For Medusa cart (prices in cents)
 * const cartTotalCents = 5000 // $50.00
 * const exchangeRate = 12500 // 1 USD = 12,500 UZS
 * const uzsAmount = centsToUzs(cartTotalCents, exchangeRate) // 625,000 UZS
 */
