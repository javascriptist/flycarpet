import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { t } from "@lib/util/translations"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
  countryCode?: string
}

const OrderDetails = ({ order, showStatus, countryCode }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div>
      <Text>
        {t({ uz: "Buyurtma tasdig\u02bci tafsilotlari quyidagi manzilga yuborildi: ", ru: "Мы отправили подтверждение заказа на адрес: ", en: "We have sent the order confirmation details to " }, countryCode)}
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2">
        {t({ uz: "Buyurtma sanasi: ", ru: "Дата заказа: ", en: "Order Date: " }, countryCode)}
        <span data-testid="order-date">
          {new Date(order.created_at).toDateString()}
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        {t({ uz: "Buyurtma raqami: ", ru: "Номер заказа: ", en: "Order Number: " }, countryCode)}
        <span data-testid="order-id">{order.display_id}</span>
      </Text>

      <div className="flex items-center text-compact-small gap-x-4 mt-4">
        {showStatus && (
          <>
            <Text>
              {t({ uz: "Buyurtma holati: ", ru: "Статус заказа: ", en: "Order Status: " }, countryCode)}
              <span className="text-ui-fg-subtle " data-testid="order-status">
                {/* TODO: Check where the statuses should come from */}
                {/* {formatStatus(order.fulfillment_status)} */}
              </span>
            </Text>
            <Text>
              {t({ uz: "To\u02bclov holati: ", ru: "Статус оплаты: ", en: "Payment Status: " }, countryCode)}
              <span
                className="text-ui-fg-subtle "
                sata-testid="order-payment-status"
              >
                {/* {formatStatus(order.payment_status)} */}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
