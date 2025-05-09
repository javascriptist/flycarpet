import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { count } from "console"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart,
  countryCode: string
}

const ItemsTemplate = ({ 
  cart,
  countryCode,
}: ItemsTemplateProps) => {
  const isLang = countryCode === "uz"
  const items = cart?.items
  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem]">
          {isLang ? "Savatchangiz" : "Ваша корзина"}
        </Heading>
      </div>
      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="!pl-0">
              {isLang ? "Mahsulot(lar)" : "Товар(ы)"}
            </Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>
              {isLang ? "Soni" : "Количество"}
            </Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">
              {isLang ? "Narxi" : "Цена"}
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              {isLang ? "Jami" : "Итого"}
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
