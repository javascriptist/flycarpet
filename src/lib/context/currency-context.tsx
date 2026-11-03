"use client"

import { createContext, useContext } from "react"
import { useParams } from "next/navigation"
import { formatMoney } from "@lib/util/money"

const ExchangeRateContext = createContext<number | undefined>(undefined)

/** Makes the USD→UZS rate (fetched on the server) available to client components. */
export function ExchangeRateProvider({
  rate,
  children,
}: {
  rate?: number
  children: React.ReactNode
}) {
  return <ExchangeRateContext.Provider value={rate}>{children}</ExchangeRateContext.Provider>
}

export const useExchangeRate = () => useContext(ExchangeRateContext)

/** `const money = useMoney(); money(cart.total, cart.currency_code)` */
export function useMoney() {
  const rate = useExchangeRate()
  const countryCode = useParams()?.countryCode as string | undefined
  return (amount: number, currencyCode?: string) =>
    formatMoney(amount, currencyCode, rate, countryCode)
}
