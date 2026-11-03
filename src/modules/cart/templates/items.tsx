import { HttpTypes } from "@medusajs/types"
import Item from "@modules/cart/components/item"
import { t } from "@lib/util/translations"
import { cartItemCount } from "@lib/util/carpet-helpers"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
  countryCode: string
  exchangeRate?: number
}

const ItemsTemplate = ({ cart, countryCode, exchangeRate }: ItemsTemplateProps) => {
  const items = [...(cart?.items ?? [])].sort((a, b) =>
    (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
  )
  const count = cartItemCount(items)

  return (
    <section aria-labelledby="cart-heading">
      <div className="flex items-baseline justify-between border-b border-line pb-4">
        <h1 id="cart-heading" className="text-title-1 text-ink">
          {t({ uz: "Savatcha", ru: "Корзина", en: "Your cart" }, countryCode)}
        </h1>
        <span className="text-callout text-ink-muted num">
          {t(
            {
              uz: `${count} ta mahsulot`,
              ru: `${count} ${count === 1 ? "товар" : count < 5 ? "товара" : "товаров"}`,
              en: `${count} ${count === 1 ? "item" : "items"}`,
            },
            countryCode
          )}
        </span>
      </div>
      <ul>
        {items.map((item) => (
          <Item
            key={item.id}
            item={item}
            currencyCode={cart?.currency_code ?? "usd"}
            exchangeRate={exchangeRate}
            countryCode={countryCode}
          />
        ))}
      </ul>
    </section>
  )
}

export default ItemsTemplate
