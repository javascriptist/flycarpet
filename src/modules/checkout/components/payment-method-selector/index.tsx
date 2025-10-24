"use client"

import React from 'react'
import { useParams } from "next/navigation"

export type PaymentMethod = 'payme' | 'stripe' | 'manual'

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod
  onMethodChange: (method: PaymentMethod) => void
  availableMethods?: PaymentMethod[]
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  availableMethods = ['payme', 'stripe', 'manual']
}) => {
  const countryCode = useParams().countryCode as string
  const isLang = countryCode === "uz"

  const paymentMethods = [
    {
      id: 'payme' as PaymentMethod,
      name: isLang ? "Payme" : "Payme",
      description: isLang 
        ? "Kartalar, hamyonlar va boshqalar orqali to'lash" 
        : "Оплата картами, кошельками и другими способами",
      icon: "💳",
      color: "border-blue-500 bg-blue-50",
      available: availableMethods.includes('payme')
    },
    {
      id: 'stripe' as PaymentMethod,
      name: isLang ? "Xalqaro kartalar" : "Международные карты",
      description: isLang 
        ? "Stripe orqali xalqaro kartalar bilan to'lash" 
        : "Оплата международными картами через Stripe",
      icon: "💳",
      color: "border-purple-500 bg-purple-50",
      available: availableMethods.includes('stripe')
    },
    {
      id: 'manual' as PaymentMethod,
      name: isLang ? "Naqd pul" : "Наличные",
      description: isLang 
        ? "Mahsulotni olganda to'lash" 
        : "Оплата при получении товара",
      icon: "💵",
      color: "border-green-500 bg-green-50",
      available: availableMethods.includes('manual')
    }
  ]

  return (
    <div className="payment-method-selector">
      <h3 className="text-lg font-semibold mb-4">
        {isLang ? "To'lov usulini tanlang" : "Выберите способ оплаты"}
      </h3>
      
      <div className="space-y-3">
        {paymentMethods.filter(m => m.available).map((method) => (
          <label
            key={method.id}
            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedMethod === method.id
                ? `${method.color} border-2`
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="payment-method"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={(e) => onMethodChange(e.target.value as PaymentMethod)}
              className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{method.icon}</span>
                <span className="font-semibold text-gray-900">{method.name}</span>
                {method.id === 'payme' && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    {isLang ? "Tavsiya etiladi" : "Рекомендуется"}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{method.description}</p>
            </div>
          </label>
        ))}
      </div>

      {/* Payment Security Notice */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <span className="text-green-600">🔒</span>
          <p>
            {isLang 
              ? "Barcha to'lovlar xavfsiz SSL shifrlash orqali himoyalangan" 
              : "Все платежи защищены безопасным SSL-шифрованием"
            }
          </p>
        </div>
      </div>
    </div>
  )
}
