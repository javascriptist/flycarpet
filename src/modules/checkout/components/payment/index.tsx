"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripe as isStripeFunc, paymentInfoMap, isPayme } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import PaymeContainer from "@modules/checkout/components/payme-container"
import PaymeMerchantButton from "@modules/checkout/components/payme-merchant-button"
import Divider from "@modules/common/components/divider"
import { getPaymeStatus } from "@lib/paymeClient"
import { getExchangeRate } from "@lib/data/exchange-rate"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

// Helper function to get translated payment method titles
const getTranslatedPaymentInfoMap = (countryCode: string): typeof paymentInfoMap => {
  const isLang = countryCode === "uz"
  
  return {
    ...paymentInfoMap,
    pp_system_default: {
      ...paymentInfoMap.pp_system_default,
      title: isLang ? "Tizim standartlari" : "Системный стандарт"
    },
    pp_stripe_stripe: {
      ...paymentInfoMap.pp_stripe_stripe,
      title: isLang ? "Kredit karta" : "Кредитная карта"
    }
  }
}

const Payment = ({
  cart,
  availablePaymentMethods,
  countryCode,
}: {
  cart: any
  availablePaymentMethods: any[]
  countryCode: string
}) => {
  const isLang = countryCode === "uz"
  const translatedPaymentInfoMap = getTranslatedPaymentInfoMap(countryCode)
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const isStripe = isStripeFunc(selectedPaymentMethod)
  const [paymeEnabled, setPaymeEnabled] = useState(false)
  const [paymeMerchantEnabled, setPaymeMerchantEnabled] = useState(true) // Merchant API is always available if backend supports it
  const [paymeAmount, setPaymeAmount] = useState(0)
  const [exchangeRate, setExchangeRate] = useState(12750)

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeFunc(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
      // Refresh to re-fetch cart and mount Stripe Elements with client_secret
      router.refresh()
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // If Payme Merchant is selected, the button handles the payment redirect
      if (selectedPaymentMethod === "pp_payme_merchant") {
        // The PaymeMerchantButton component will handle the redirect
        // This is just to show the loading state
        return
      }

      // If Payme v2 Native Form is selected, the form will handle submission
      if (isPayme(selectedPaymentMethod)) {
        // Payme form will submit directly, but we still want to show review page
        // Note: The form submission will redirect to Payme, so this won't actually execute
        return
      }

      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession && !isPayme(selectedPaymentMethod)) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
        // Ensure UI picks up new session (Stripe Elements)
        router.refresh()
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  // Check Payme availability on mount
  useEffect(() => {
    let mounted = true
    getPaymeStatus()
      .then((s) => mounted && setPaymeEnabled(Boolean(s?.paymeEnabled)))
      .catch(() => mounted && setPaymeEnabled(false))
    return () => {
      mounted = false
    }
  }, [])

  // Calculate Payme amount when cart changes
  useEffect(() => {
    const calculatePaymeAmount = async () => {
      if (cart?.total) {
        const exchangeRateData = await getExchangeRate()
        const rate = exchangeRateData?.rate || 12750
        setExchangeRate(rate)
        
        // Convert cart total (cents) to tiyin
        const cartTotalInCents = Math.max(0, cart.total)
        const amountInTiyin = Math.round(cartTotalInCents * rate)
        setPaymeAmount(amountInTiyin)
      }
    }
    
    calculatePaymeAmount()
  }, [cart?.total])

  // If Payme is enabled and no method is selected (and there are no other providers), auto-select Payme
  useEffect(() => {
    if (paymeEnabled && !selectedPaymentMethod && (!availablePaymentMethods || availablePaymentMethods.length === 0)) {
      setSelectedPaymentMethod("pp_payme_custom")
    }
  }, [paymeEnabled, selectedPaymentMethod, availablePaymentMethods])

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          {isLang ? "To'lov usuli" : "Способ оплаты"}
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              {isLang ? "Tahrirlash" : "Редактировать"}
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && (availablePaymentMethods?.length || paymeEnabled || paymeMerchantEnabled) && (
            <>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
              >
                {availablePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isStripeFunc(paymentMethod.id) ? (
                      <StripeCardContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={translatedPaymentInfoMap}
                        setCardBrand={setCardBrand}
                        setError={setError}
                        setCardComplete={setCardComplete}
                      />
                    ) : (
                      <PaymentContainer
                        paymentInfoMap={translatedPaymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        countryCode={countryCode}
                      />
                    )}
                  </div>
                ))}
                {paymeEnabled && (
                  <PaymeContainer
                    paymentInfoMap={translatedPaymentInfoMap}
                    paymentProviderId="pp_payme_custom"
                    selectedPaymentOptionId={selectedPaymentMethod}
                    merchantId={process.env.NEXT_PUBLIC_PAYME_MERCHANT_ID || ""}
                    amount={paymeAmount}
                    orderId={cart?.id || "order"}
                  />
                )}
                {paymeMerchantEnabled && (
                  <PaymeMerchantButton
                    paymentProviderId="pp_payme_merchant"
                    selectedPaymentOptionId={selectedPaymentMethod}
                    orderId={cart?.id || "order"}
                    amount={cart?.total || 0}
                    countryCode={countryCode}
                  />
                )}
              </RadioGroup>
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {isLang ? "To'lov usuli" : "Способ оплаты"}
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                {isLang ? "Sovg'a kartasi" : "Подарочная карта"}
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={
              (isStripe && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard) ||
              selectedPaymentMethod === "pp_payme_merchant" // Disable for Merchant API - handled by component button
            }
            data-testid="submit-payment-button"
          >
            {!activeSession && isStripeFunc(selectedPaymentMethod)
              ? (isLang ? "Karta ma'lumotlarini kiriting" : "Введите данные карты")
              : selectedPaymentMethod === "pp_payme_merchant"
              ? (isLang ? "Yuqoridagi tugmani bosing" : "Нажмите кнопку выше")
              : (isLang ? "Ko'rib chiqishga o'tish" : "Перейти к обзору")}
          </Button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  {isLang ? "To'lov usuli" : "Способ оплаты"}
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {translatedPaymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  {isLang ? "To'lov tafsilotlari" : "Детали оплаты"}
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {translatedPaymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {isStripeFunc(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : selectedPaymentMethod === "pp_system_default"
                      ? (isLang ? "Qo'lda to'lov" : "Ручная оплата")
                      : selectedPaymentMethod === "pp_payme_merchant"
                      ? (isLang ? "Payme (To'lov havolasi)" : "Payme (Платёжная ссылка)")
                      : isPayme(selectedPaymentMethod)
                      ? "Payme"
                      : (isLang ? "Boshqa qadam paydo bo'ladi" : "Появится другой шаг")}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {isLang ? "To'lov usuli" : "Способ оплаты"}
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                {isLang ? "Sovg'a kartasi" : "Подарочная карта"}
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
