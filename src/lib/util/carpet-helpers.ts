/**
 * Single source of truth for carpet dimensions and roll-carpet pricing.
 *
 * Roll carpets are products with `metadata.attributes.carpet_type === "roll"`.
 * Their (first) variant price is the price per running metre, in the region
 * currency's major unit (Medusa v2 does not use cents).
 */

export const ROLL_LENGTH_MIN = 0.5
export const ROLL_LENGTH_MAX_DEFAULT = 50
export const ROLL_LENGTH_STEP = 0.1
export const ROLL_LENGTH_PRESETS = [2, 3, 4, 5]

const attrs = (product: any) => product?.metadata?.attributes ?? {}

const parseMetres = (value: unknown): number => {
  const n = parseFloat(String(value ?? "").replace(",", "."))
  return Number.isFinite(n) && n > 0 ? n : 0
}

export const isRollCarpet = (product: any): boolean =>
  attrs(product).carpet_type === "roll"

/** Width in metres (defaults to 3 m, the most common roll width). */
export const getCarpetWidth = (product: any): number =>
  parseMetres(attrs(product).width) || 3

/** Length in metres for fixed-size rugs, or remaining stock for rolls. */
export const getStockLength = (product: any): number =>
  parseMetres(attrs(product).stock_length || attrs(product).length)

export const getCarpetSize = (product: any) => ({
  width: getCarpetWidth(product),
  length: getStockLength(product) || 2,
})

export type RollCarpetSpec = {
  variantId?: string
  width: number
  pricePerMeter: number
  currencyCode?: string
  minLength: number
  maxLength: number
}

export const getRollCarpetSpec = (product: any): RollCarpetSpec => {
  const variant = product?.variants?.[0]
  const stock = getStockLength(product)

  return {
    variantId: variant?.id,
    width: getCarpetWidth(product),
    pricePerMeter: Number(variant?.calculated_price?.calculated_amount) || 0,
    currencyCode: variant?.calculated_price?.currency_code,
    minLength: ROLL_LENGTH_MIN,
    maxLength: stock > 0 ? Math.min(stock, ROLL_LENGTH_MAX_DEFAULT) : ROLL_LENGTH_MAX_DEFAULT,
  }
}

/** Round to the 10 cm cutting step and keep within the allowed range. */
export const clampRollLength = (length: number, spec: RollCarpetSpec): number => {
  if (!Number.isFinite(length)) return spec.minLength
  const stepped = Math.round(length / ROLL_LENGTH_STEP) * ROLL_LENGTH_STEP
  const clamped = Math.min(spec.maxLength, Math.max(spec.minLength, stepped))
  return Math.round(clamped * 10) / 10
}

export const calculateRollCarpet = (spec: RollCarpetSpec, length: number) => {
  const area = Math.round(spec.width * length * 100) / 100
  const total = Math.round(spec.pricePerMeter * length * 100) / 100
  return { length, area, total }
}

export const formatMetres = (value: number): string =>
  `${Number.isInteger(value) ? value : value.toFixed(1)} m`
