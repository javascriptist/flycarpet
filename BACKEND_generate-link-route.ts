// Backend endpoint: src/api/admin/payme-generate-link/route.ts
// This endpoint generates a Payme checkout URL for the frontend
// Uses /admin route so NO publishable key needed!

import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

/**
 * POST /admin/payme-generate-link
 * 
 * Generates a Payme checkout URL for the given order
 * 
 * Request body:
 * {
 *   orderId: string      // e.g., "cart_01HXXX"
 *   amount: number       // in cents (USD), e.g., 5000 = $50.00
 *   callbackUrl?: string // optional return URL
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   paymentUrl: string,  // https://checkout.paycom.uz/...
 *   orderId: string,
 *   amount: number
 * }
 * 
 * Note: No authentication needed since this just generates a public payment URL
 */

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { orderId, amount, callbackUrl } = req.body

    // 1. Validate inputs
    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: orderId and amount"
      })
    }

    // 2. Get exchange rate (fetch from your existing API)
    const exchangeRate = await getExchangeRate()
    
    // 3. Convert USD cents to UZS tiyin
    // Example: $50.00 = 5000 cents × 12750 rate = 63,750,000 tiyin = 637,500 UZS
    const amountInTiyin = Math.round(amount * exchangeRate)

    // 4. Build Payme checkout URL (GET method with base64)
    const merchantId = process.env.PAYME_MERCHANT_ID
    
    if (!merchantId) {
      return res.status(500).json({
        success: false,
        error: "Payme merchant ID not configured"
      })
    }

    // Build parameters string
    const params = [
      `m=${merchantId}`,
      `ac.order_id=${orderId}`,
      `a=${amountInTiyin}`,
      `l=uz` // Uzbek language
    ]

    // Add callback URL if provided
    if (callbackUrl) {
      params.push(`c=${encodeURIComponent(callbackUrl)}`)
    }

    // Join with semicolon and encode to base64
    const paramsString = params.join(";")
    const base64Params = Buffer.from(paramsString).toString("base64")
    
    // Final payment URL
    const paymentUrl = `https://checkout.paycom.uz/${base64Params}`

    // 5. Log for debugging
    console.log("Payme payment link generated:", {
      orderId,
      amountUSD: amount / 100,
      amountUZS: amountInTiyin / 100,
      exchangeRate
    })

    // 6. Return success response
    return res.status(200).json({
      success: true,
      paymentUrl,
      orderId,
      amount,
      amountInTiyin
    })

  } catch (error) {
    console.error("Payme generate-link error:", error)
    return res.status(500).json({
      success: false,
      error: "Failed to generate payment link",
      details: error.message
    })
  }
}

/**
 * Get current USD to UZS exchange rate
 * You can replace this with your actual exchange rate API
 */
async function getExchangeRate(): Promise<number> {
  try {
    // Option 1: Use your existing exchange rate API
    const apiUrl = process.env.EXCHANGE_RATE_API_URL
    if (apiUrl) {
      const response = await fetch(apiUrl)
      const data = await response.json()
      return data.rate || 12750 // Fallback rate
    }
    
    // Option 2: Use hardcoded rate (update periodically)
    // As of October 2024: 1 USD ≈ 12,750 UZS
    return 12750
    
  } catch (error) {
    console.warn("Failed to fetch exchange rate, using default:", error)
    return 12750 // Fallback rate
  }
}

/**
 * Optional: GET endpoint for testing
 * GET /store/payme-merchant/generate-link?orderId=test&amount=5000
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { orderId = "test-order", amount = "5000", callbackUrl } = req.query

  return POST(
    {
      ...req,
      body: {
        orderId,
        amount: parseInt(amount as string),
        callbackUrl
      }
    } as MedusaRequest,
    res
  )
}
