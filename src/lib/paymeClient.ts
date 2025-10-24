// Minimal Payme API client for the storefront

export type PaymeStatus = { status: string; paymeEnabled: boolean }

export type CreatePaymeInput = {
  amount: number // in tiyin (UZS smallest unit)
  orderId: string
  returnUrl?: string
}

export type PaymeReceiptResponse = {
  receiptId: string
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || ""

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

// Payme merchant ID for direct checkout (no API needed!)
const PAYME_MERCHANT_ID = process.env.NEXT_PUBLIC_PAYME_MERCHANT_ID || ""

function buildUrl(path: string) {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`
}

export async function getPaymeStatus(): Promise<PaymeStatus> {
  // Check if Payme merchant ID is configured
  const paymeEnabled = Boolean(PAYME_MERCHANT_ID)
  
  return {
    status: "ok",
    paymeEnabled,
  }
}

/**
 * Generate Payme payment form and submit it
 * This uses POST method which is cleaner than GET with base64 URL
 * 
 * @param amount - Amount in tiyin (1 UZS = 100 tiyin)
 * @param orderId - Order/cart ID
 * @param returnUrl - URL to return after payment
 */
export function submitPaymeForm(
  amount: number,
  orderId: string,
  returnUrl?: string
): void {
  // Create a form element
  const form = document.createElement("form")
  form.method = "POST"
  form.action = "https://checkout.paycom.uz"
  
  // Add merchant ID
  const merchantInput = document.createElement("input")
  merchantInput.type = "hidden"
  merchantInput.name = "merchant"
  merchantInput.value = PAYME_MERCHANT_ID
  form.appendChild(merchantInput)
  
  // Add amount
  const amountInput = document.createElement("input")
  amountInput.type = "hidden"
  amountInput.name = "amount"
  amountInput.value = amount.toString()
  form.appendChild(amountInput)
  
  // Add order ID as account parameter
  const accountInput = document.createElement("input")
  accountInput.type = "hidden"
  accountInput.name = "account[order_id]"
  accountInput.value = orderId
  form.appendChild(accountInput)
  
  // Add return URL if provided
  if (returnUrl) {
    const returnInput = document.createElement("input")
    returnInput.type = "hidden"
    returnInput.name = "callback"
    returnInput.value = returnUrl
    form.appendChild(returnInput)
  }
  
  // Append form to body and submit
  document.body.appendChild(form)
  form.submit()
  
  // Clean up
  document.body.removeChild(form)
}

// Deprecated: Use submitPaymeForm instead
export function buildPaymeCheckoutUrl(
  amount: number,
  orderId: string,
  returnUrl?: string,
  language: string = "uz"
): string {
  // Build params string
  const params = [
    `m=${PAYME_MERCHANT_ID}`,
    `ac.order_id=${orderId}`,
    `a=${amount}`,
    `l=${language}`,
  ]
  
  if (returnUrl) {
    params.push(`c=${encodeURIComponent(returnUrl)}`)
  }
  // console log url without base64 for debugging
  console.log("Payme checkout params:", params.join(";"))
  // Join with semicolon
  const paramsString = params.join(";")
  
  // Base64 encode
  const base64Params = Buffer.from(paramsString).toString("base64")
  
  // Return checkout URL
  return `https://checkout.paycom.uz/${base64Params}`
}

// Legacy function for backward compatibility (not used with GET method)
export async function createPaymeReceipt(
  input: CreatePaymeInput
): Promise<PaymeReceiptResponse> {
  // This is no longer needed with GET method!
  // Just return a fake receipt ID - we'll use buildPaymeCheckoutUrl instead
  throw new Error("Use buildPaymeCheckoutUrl() instead - no API call needed!")
}
