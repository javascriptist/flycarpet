"use server"

import { sdk } from "@lib/config"
import { cache } from "react"

export type ExchangeRate = {
  rate: number
  currency_from: string
  currency_to: string
  updated_at: string
}

const fetchExchangeRateFromAPI = async (): Promise<ExchangeRate | null> => {
  try {
    const response = await sdk.client.fetch<ExchangeRate>(
      "/store/exchange-rate",
      {
        method: "GET",
        next: {
          revalidate: 3600, // 1 hour
        },
      }
    )
    return response
  } catch (error) {
    console.error("Failed to fetch exchange rate:", error)
    return null
  }
}

// Use React cache for request-level deduplication
export const getExchangeRate = cache(async (): Promise<ExchangeRate | null> => {
  const rate = await fetchExchangeRateFromAPI()
  
  // Fallback to default if API fails
  if (!rate) {
    return {
      rate: 12750,
      currency_from: "USD",
      currency_to: "UZS",
      updated_at: new Date().toISOString(),
    }
  }
  
  return rate
})
