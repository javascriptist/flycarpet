"use client"

import React, { useState } from 'react'
import { Button } from "@medusajs/ui"
import { useParams } from "next/navigation"

interface PaymePaymentButtonProps {
  cartId: string
  orderId: string
  totalAmount: number // in UZS
  onPaymentStart?: () => void
  onPaymentComplete?: (success: boolean) => void
  disabled?: boolean
}

export const PaymePaymentButton: React.FC<PaymePaymentButtonProps> = ({
  cartId,
  orderId,
  totalAmount,
  onPaymentStart,
  onPaymentComplete,
  disabled = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const countryCode = useParams().countryCode as string
  const isLang = countryCode === "uz"

  const handlePaymePayment = async () => {
    setIsProcessing(true)
    onPaymentStart?.()

    try {
      // Create Payme payment receipt
      const response = await fetch('/api/store/payme-mock', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: orderId,
          amount: totalAmount, // Amount in UZS
          returnUrl: `${window.location.origin}/${countryCode}/order/confirmed/${orderId}`
        })
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to Payme checkout page
        const paymeCheckoutUrl = `https://checkout.test.paycom.uz/${data.data._id}`
        
        // Redirect in same window
        window.location.href = paymeCheckoutUrl
        
        // Note: For production, use:
        // const paymeCheckoutUrl = `https://checkout.paycom.uz/${data.data._id}`
      } else {
        const errorMsg = isLang 
          ? "To'lovni boshlashda xatolik yuz berdi" 
          : "Ошибка инициализации платежа"
        alert(errorMsg)
        onPaymentComplete?.(false)
      }
    } catch (error) {
      console.error('Payme payment error:', error)
      const errorMsg = isLang 
        ? "To'lovni boshlashda xatolik" 
        : "Ошибка инициализации платежа"
      alert(errorMsg)
      onPaymentComplete?.(false)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button
      onClick={handlePaymePayment}
      disabled={isProcessing || disabled}
      size="large"
      className="w-full bg-[#1890FF] hover:bg-[#096DD9] text-white border-none disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
      isLoading={isProcessing}
    >
      {isProcessing ? (
        <span className="flex items-center justify-center gap-2">
          {isLang ? "To'lov tayyorlanmoqda..." : "Подготовка платежа..."}
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <span className="text-lg">💳</span>
          {isLang ? "Payme orqali to'lash" : "Оплатить через Payme"}
        </span>
      )}
    </Button>
  )
}
