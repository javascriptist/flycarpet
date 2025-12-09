import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { count } from "console"
import { t } from '@lib/util/translations'

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart,
  countryCode: string
  exchangeRate?: number
}

const ItemsTemplate = ({ 
  cart,
  countryCode,
  exchangeRate,
}: ItemsTemplateProps) => {
  const isLang = countryCode === "uz"
  const items = cart?.items

  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem]">
          {t({ uz: 'Savatchangiz', ru: 'Ваша корзина', en: 'Your cart' }, countryCode)}
        </Heading>
      </div>
      <Table className="bg-brand-cream">
        <Table.Header className="border-t-0 bg-brand-cream">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus bg-brand-cream">
            <Table.HeaderCell className="!pl-0 bg-brand-cream">
              {t({ uz: 'Mahsulot(lar)', ru: 'Товар(ы)', en: 'Product(s)' }, countryCode)}
            </Table.HeaderCell>
            <Table.HeaderCell className="bg-brand-cream"></Table.HeaderCell>
            <Table.HeaderCell className="bg-brand-cream">
              {t({ uz: 'Soni', ru: 'Количество', en: 'Quantity' }, countryCode)}
            </Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell bg-brand-cream">
              {t({ uz: 'Narxi', ru: 'Цена', en: 'Price' }, countryCode)}
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right bg-brand-cream">
              {t({ uz: 'Jami', ru: 'Итого', en: 'Total' }, countryCode)}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                      exchangeRate={exchangeRate}
                      countryCode={countryCode}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
