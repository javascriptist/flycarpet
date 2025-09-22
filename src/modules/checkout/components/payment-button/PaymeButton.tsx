"use client"

import { useEffect, useState } from "react"
import {
  buildPaymeCheckoutUrl,
  createPaymeReceipt,
  getPaymeStatus,
} from "@lib/paymeClient"

type PaymeButtonProps = {
  amountUZS: number // e.g., 150000
  orderId: string // stable unique order reference
  className?: string
  label?: string
}

export default function PaymeButton({
  amountUZS,
  orderId,
  className,
  label = "Pay with Payme",
}: PaymeButtonProps) {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    getPaymeStatus()
      .then((s) => mounted && setEnabled(Boolean(s?.paymeEnabled)))
      .catch(() => mounted && setEnabled(false))
    return () => {
      mounted = false
    }
  }, [])

  const onClick = async () => {
    setError(null)
    setLoading(true)
    try {
      const returnUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/thank-you?orderId=${encodeURIComponent(
              orderId
            )}`
          : undefined

      const { receiptId } = await createPaymeReceipt({
        amount: amountUZS,
        orderId,
        returnUrl,
      })

      window.location.href = buildPaymeCheckoutUrl(receiptId)
    } catch (e: any) {
      setError(
        e?.message ||
          "Payment unavailable. Please choose another payment method."
      )
    } finally {
      setLoading(false)
    }
  }

  if (!enabled) return null

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={className || "btn btn-primary"}
      >
        {loading ? "Redirecting…" : label}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
