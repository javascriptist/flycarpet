"use client"

import { useActionState } from "react"
import { useParams } from "next/navigation"
import { t } from "@lib/util/translations"
import { createTransferRequest } from "@lib/data/orders"
import { Text, Heading, Input, Button, IconButton, Toaster } from "@medusajs/ui"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { CheckCircleMiniSolid, XCircleSolid } from "@medusajs/icons"
import { useEffect, useState } from "react"

export default function TransferRequestForm() {
  const [showSuccess, setShowSuccess] = useState(false)

  const [state, formAction] = useActionState(createTransferRequest, {
    success: false,
    error: null,
    order: null,
  })

  useEffect(() => {
    if (state.success && state.order) {
      setShowSuccess(true)
    }
  }, [state.success, state.order])

  const countryCode = useParams()?.countryCode as string | undefined
  const tr = (m: { uz: string; ru: string; en: string }) => t(m, countryCode)

  return (
    <div className="flex flex-col gap-y-4 w-full">
      <div className="grid sm:grid-cols-2 items-center gap-x-8 gap-y-4 w-full">
        <div className="flex flex-col gap-y-1">
          <Heading level="h3" className="text-headline text-ink">
            {tr({ uz: "Buyurtmani biriktirish", ru: "Привязать заказ", en: "Link an order" })}
          </Heading>
          <Text className="text-callout text-ink-muted">
            {tr({
              uz: "Buyurtmangiz ro\u02bcyxatda yo\u02bcqmi? Uni hisobingizga biriktiring.",
              ru: "Не видите свой заказ? Привяжите его к аккаунту.",
              en: "Can\u2019t find an order? Connect it to your account.",
            })}
          </Text>
        </div>
        <form
          action={formAction}
          className="flex flex-col gap-y-1 sm:items-end"
        >
          <div className="flex flex-col gap-y-2 w-full">
            <Input className="w-full" name="order_id" placeholder={tr({ uz: "Buyurtma ID", ru: "ID заказа", en: "Order ID" })} />
            <SubmitButton
              variant="secondary"
              className="w-fit whitespace-nowrap self-end"
            >
              {tr({ uz: "So\u02bcrov yuborish", ru: "Отправить запрос", en: "Request transfer" })}
            </SubmitButton>
          </div>
        </form>
      </div>
      {!state.success && state.error && (
        <Text className="text-base-regular text-rose-500 text-right">
          {state.error}
        </Text>
      )}
      {showSuccess && (
        <div className="flex justify-between p-4 bg-neutral-50 shadow-borders-base w-full self-stretch items-center">
          <div className="flex gap-x-2 items-center">
            <CheckCircleMiniSolid className="w-4 h-4 text-emerald-500" />
            <div className="flex flex-col gap-y-1">
              <Text className="text-medim-pl text-neutral-950">
                {tr({ uz: "So\u02bcrov yuborildi:", ru: "Запрос отправлен:", en: "Transfer requested for" })} {state.order?.id}
              </Text>
              <Text className="text-base-regular text-neutral-600">
                {tr({ uz: "Tasdiqlash xati yuborildi:", ru: "Письмо отправлено на", en: "Confirmation email sent to" })} {state.order?.email}
              </Text>
            </div>
          </div>
          <IconButton
            variant="transparent"
            className="h-fit"
            onClick={() => setShowSuccess(false)}
          >
            <XCircleSolid className="w-4 h-4 text-neutral-500" />
          </IconButton>
        </div>
      )}
    </div>
  )
}
