// Minimal Payme API client for the storefront

export type PaymeStatus = { status: string; paymeEnabled: boolean }

export type CreatePaymeInput = {
  amount: number // in UZS (integer)
  orderId: string
  returnUrl?: string
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || ""

function buildUrl(path: string) {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`
}

export async function getPaymeStatus(): Promise<PaymeStatus> {
  const res = await fetch(buildUrl("/store/custom"), {
    method: "GET",
    cache: "no-store",
  })
  if (!res.ok) {
    // Treat any non-200 as disabled in UI context
    return { status: "error", paymeEnabled: false }
  }
  return res.json()
}

export async function createPaymeReceipt(input: CreatePaymeInput) {
  const res = await fetch(buildUrl("/store/custom"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  const payload = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message =
      payload?.message ||
      (res.status === 400
        ? "Invalid payment parameters"
        : res.status === 503
        ? "Payme is disabled or not configured"
        : "Failed to create Payme receipt")
    throw new Error(message)
  }

  const raw = payload?.raw
  const receiptId: string | undefined =
    raw?.result?.receipt?._id || raw?.result?.receipt?.id

  if (!receiptId) {
    throw new Error("Missing receipt id in response")
  }

  return { receiptId, raw, response: payload }
}

export function buildPaymeCheckoutUrl(receiptId: string) {
  return `https://checkout.paycom.uz/${receiptId}`
}
