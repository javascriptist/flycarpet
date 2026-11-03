"use client"

import { HttpTypes } from "@medusajs/types"
import Item from "@modules/cart/components/item"

type ItemsTemplateProps = {
  cart: HttpTypes.StoreCart
  exchangeRate: number | undefined
  countryCode?: string
}

/** Compact, read-only list of cart lines for the checkout summary. */
const ItemsPreviewTemplate = ({ cart, exchangeRate, countryCode }: ItemsTemplateProps) => {
  const items = [...(cart.items ?? [])].sort((a, b) =>
    (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
  )

  return (
    <ul
      className="max-h-[420px] divide-y divide-line overflow-y-auto overscroll-contain"
      data-testid="items-table"
    >
      {items.map((item) => (
        <Item
          key={item.id}
          item={item}
          type="preview"
          currencyCode={cart.currency_code}
          exchangeRate={exchangeRate}
          countryCode={countryCode}
        />
      ))}
    </ul>
  )
}

export default ItemsPreviewTemplate
