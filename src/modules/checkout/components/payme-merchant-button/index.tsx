"use client"

import { useState } from "react"
import { Button, Text, clx } from "@medusajs/ui"
import { RadioGroup } from "@headlessui/react"

interface PaymeMerchantButtonProps {
  orderId: string
  amount: number // Amount in cents (USD)
  countryCode?: string
  paymentProviderId: string
  selectedPaymentOptionId: string
  disabled?: boolean
}

/**
 * Payme Merchant API Payment Button
 * 
 * This component integrates with Payme's Merchant API (billing endpoint)
 * Unlike the native form method, this:
 * - Calls your backend to generate a payment link
 * - Redirects to Payme's hosted payment page
 * - Supports more payment tracking and control
 */
export default function PaymeMerchantButton({
  orderId,
  amount,
  countryCode = "uz",
  paymentProviderId,
  selectedPaymentOptionId,
  disabled = false,
}: PaymeMerchantButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isLang = countryCode === "uz"
  const isSelected = selectedPaymentOptionId === paymentProviderId

  const handlePaymePayment = async () => {
    if (disabled || !isSelected) return

    setLoading(true)
    setError(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
      const callbackUrl = `${window.location.origin}/${countryCode}/order/confirmed?order_id=${orderId}`

      // Call backend to generate Payme payment link
      const response = await fetch(`${backendUrl}/admin/payme-generate-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
          amount: amount, // Amount in cents
          callbackUrl: callbackUrl,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.paymentUrl) {
        // Redirect to Payme payment page
        window.location.href = data.paymentUrl
      } else {
        throw new Error(data.error || isLang 
          ? "To'lov havolasini yaratib bo'lmadi" 
          : "Не удалось создать ссылку на оплату"
        )
      }
    } catch (err: any) {
      console.error("Payme Merchant API error:", err)
      setError(
        err.message || isLang
          ? "To'lovni qayta ishlashda xatolik yuz berdi"
          : "Ошибка при обработке платежа"
      )
      setLoading(false)
    }
  }

  return (
    <RadioGroup.Option
      value={paymentProviderId}
      disabled={disabled}
      className={clx(
        "flex flex-col gap-y-2 text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
        {
          "border-ui-border-interactive": isSelected,
        }
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <RadioGroup.Label className="flex items-center gap-x-2">
            {/* Payme Logo */}
            <div className="w-12 h-8 flex items-center justify-center bg-gradient-to-r from-[#14B4ED] to-[#0891BA] rounded">
              <span className="text-white font-bold text-sm">Pay</span>
            </div>
            
            <div className="flex flex-col">
              <Text className="text-base-regular">
                {isLang ? "Payme" : "Payme"}
              </Text>
              <Text className="text-xs text-gray-500">
                {isLang ? "Merchant API" : "Merchant API"}
              </Text>
            </div>
          </RadioGroup.Label>
        </div>
        
        {/* Radio indicator */}
        <RadioGroup.Description className="flex items-center justify-center w-5 h-5">
          <div
            className={clx(
              "w-5 h-5 rounded-full border flex items-center justify-center",
              {
                "border-ui-border-interactive": isSelected,
                "border-gray-300": !isSelected,
              }
            )}
          >
            {isSelected && (
              <div className="w-3 h-3 rounded-full bg-ui-border-interactive" />
            )}
          </div>
        </RadioGroup.Description>
      </div>

      {/* Payment details when selected */}
      {isSelected && (
        <div className="w-full mt-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            {/* Security indicators */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>🔒</span>
                <span>
                  {isLang
                    ? "SSL shifrlangan xavfsiz to'lov"
                    : "Безопасный платёж с SSL-шифрованием"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>✓</span>
                <span>
                  {isLang
                    ? "Payme to'lov sahifasiga yo'naltirilasiz"
                    : "Перенаправление на платёжную страницу Payme"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>💳</span>
                <span>
                  {isLang
                    ? "Kartalar, hamyonlar va boshqa usullar"
                    : "Карты, кошельки и другие способы"}
                </span>
              </div>
            </div>

            {/* Payment button */}
            <Button
              onClick={handlePaymePayment}
              disabled={loading || disabled}
              isLoading={loading}
              className="w-full bg-gradient-to-r from-[#14B4ED] to-[#0891BA] hover:from-[#0891BA] hover:to-[#14B4ED] text-white transition-all duration-200"
              size="large"
            >
              {loading
                ? isLang
                  ? "To'lov havolasi yaratilmoqda..."
                  : "Создание платёжной ссылки..."
                : isLang
                ? "Payme orqali to'lash"
                : "Оплатить через Payme"}
            </Button>

            {/* Error message */}
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Info text */}
            <p className="mt-3 text-xs text-gray-500 text-center">
              {isLang
                ? "Tugmani bosganingizdan so'ng Payme to'lov sahifasiga yo'naltirilasiz"
                : "После нажатия кнопки вы будете перенаправлены на страницу оплаты Payme"}
            </p>
          </div>
        </div>
      )}
    </RadioGroup.Option>
  )
}
