"use client"

import { useState } from "react"
import { Button } from "@medusajs/ui"

interface OrderPaymeButtonProps {
  orderId: string
  amount: number // Amount in cents (from order total)
  countryCode?: string
  paymentStatus: string
}

/**
 * Payme Payment Button for Order Confirmation Page
 * 
 * Shows after order is placed but before payment is made.
 * Redirects to Payme for payment with order_id for tracking.
 */
export default function OrderPaymeButton({
  orderId,
  amount,
  countryCode = "uz",
  paymentStatus,
}: OrderPaymeButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isLang = countryCode === "uz"

  // Don't show button if already paid
  if (paymentStatus === "captured" || paymentStatus === "paid") {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-700">
          <span>✓</span>
          <span className="font-medium">
            {isLang ? "To'lov qabul qilindi" : "Платёж получен"}
          </span>
        </div>
      </div>
    )
  }

  const handlePayment = async () => {
    setLoading(true)
    setError(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
      const callbackUrl = `${window.location.origin}/${countryCode}/order/${orderId}/confirmed`

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
      console.error("Payme payment error:", err)
      setError(
        err.message || isLang
          ? "To'lovni qayta ishlashda xatolik yuz berdi"
          : "Ошибка при обработке платежа"
      )
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
      <div className="flex flex-col gap-4">
        {/* Payment status indicator */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-[#14B4ED] to-[#0891BA] rounded-full flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {isLang ? "Buyurtmangiz uchun to'lov qiling" : "Оплатите ваш заказ"}
            </h3>
            <p className="text-sm text-gray-600">
              {isLang 
                ? "Buyurtmangiz yaratildi. To'lovni amalga oshirish uchun quyidagi tugmani bosing."
                : "Ваш заказ создан. Нажмите кнопку ниже для завершения оплаты."}
            </p>
          </div>
        </div>

        {/* Payment info */}
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>{isLang ? "Xavfsiz to'lov Payme orqali" : "Безопасный платёж через Payme"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💳</span>
            <span>{isLang ? "Kartalar, hamyonlar va boshqa usullar" : "Карты, кошельки и другие способы"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>{isLang ? "Buyurtma raqami: {orderId}" : "Номер заказа: {orderId}"}</span>
          </div>
        </div>

        {/* Payment button */}
        <Button
          onClick={handlePayment}
          disabled={loading}
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
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Info text */}
        <p className="text-xs text-gray-500 text-center">
          {isLang
            ? "To'lovni amalga oshirish uchun Payme sahifasiga yo'naltirilasiz"
            : "Вы будете перенаправлены на страницу Payme для оплаты"}
        </p>
      </div>
    </div>
  )
}
