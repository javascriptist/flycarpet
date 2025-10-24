"use client"

import { Radio as RadioGroupOption } from "@headlessui/react"
import { Text, clx } from "@medusajs/ui"
import React, { useEffect, useRef, useState } from "react"
import Radio from "@modules/common/components/radio"

type PaymeContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  merchantId: string
  amount: number
  orderId: string
}

// Extend Window interface for Paycom
declare global {
  interface Window {
    Paycom?: {
      Button: (formSelector: string, buttonContainerSelector: string) => void
    }
  }
}

const PaymeContainer: React.FC<PaymeContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  merchantId,
  amount,
  orderId,
}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const buttonContainerRef = useRef<HTMLDivElement>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [useOfficialButton, setUseOfficialButton] = useState(true)
  const isSelected = selectedPaymentOptionId === paymentProviderId

  // Load Payme CDN script when component mounts
  useEffect(() => {
    // Check if script already loaded
    if (window.Paycom) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.paycom.uz/integration/js/checkout.min.js'
    script.async = true
    script.onload = () => setScriptLoaded(true)
    script.onerror = () => {
      console.warn('Failed to load Payme button script, using fallback')
      setUseOfficialButton(false)
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup if needed
    }
  }, [])

  // Generate official Payme button when script loads and component is selected
  useEffect(() => {
    if (scriptLoaded && isSelected && useOfficialButton && window.Paycom && formRef.current && buttonContainerRef.current) {
      try {
        // Clear container first
        buttonContainerRef.current.innerHTML = ''
        
        // Generate the official Payme button
        window.Paycom.Button('#payme-form-' + orderId, '#payme-button-container-' + orderId)
      } catch (error) {
        console.warn('Failed to generate Payme button, using fallback:', error)
        setUseOfficialButton(false)
      }
    }
  }, [scriptLoaded, isSelected, useOfficialButton, orderId])

  return (
    <RadioGroupOption
      key={paymentProviderId}
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
          <Radio checked={isSelected} />
          <Text className="text-base-regular">
            {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
          </Text>
        </div>
        <span className="justify-self-end text-ui-fg-base">
          {paymentInfoMap[paymentProviderId]?.icon}
        </span>
      </div>

      {/* Payme v2 Native Form - only show when selected */}
      {isSelected && (
        <div className="mt-4 p-4 rounded-lg border border-gray-200 liquid-glass-card">
          <div className="mb-3 text-sm text-gray-700">
            <p className="font-medium mb-1">✓ Xavfsiz to'lov</p>
            <p className="text-xs">Payme orqali kartalar, hamyonlar va boshqa usullar bilan to'lash mumkin</p>
          </div>
          
          <form
            ref={formRef}
            id={'payme-form-' + orderId}
            method="POST"
            action="https://checkout.paycom.uz"
            className="w-full"
          >
            <input type="hidden" name="merchant" value={merchantId} />
            <input type="hidden" name="amount" value={amount.toString()} />
            <input
              type="hidden"
              name="account[order_id]"
              value={orderId}
            />
            <input
              type="hidden"
              name="callback"
              value={typeof window !== 'undefined' ? `${window.location.origin}/order/confirmed/${orderId}` : ''}
            />
            <input
              type="hidden"
              name="callback_timeout"
              value="15000"
            />
            
            {/* Official Payme Button Container */}
            {useOfficialButton && (
              <div 
                ref={buttonContainerRef}
                id={'payme-button-container-' + orderId}
                className="w-full"
              />
            )}
            
            {/* Fallback Custom Button - shown if official button fails to load */}
            {!useOfficialButton && (
              <button
                type="submit"
                className="w-full h-[54px] bg-white border-2 border-[#14B4ED] rounded-lg hover:bg-[#14B4ED] hover:border-[#14B4ED] transition-all duration-200 group flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <img
                  className="h-[28px] transition-opacity duration-200"
                  src="https://cdn.payme.uz/buttons/button_big_uz.svg"
                  alt="Payme orqali to'lash"
                  onError={(e) => {
                    // Fallback if CDN image fails
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-[#14B4ED] group-hover:text-white font-semibold text-lg">💳 Payme orqali to\'lash</span>'
                  }}
                />
              </button>
            )}
          </form>
          
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>🔒</span>
            <span>SSL shifrlangan xavfsiz to'lov</span>
          </div>
        </div>
      )}
    </RadioGroupOption>
  )
}

export default PaymeContainer
