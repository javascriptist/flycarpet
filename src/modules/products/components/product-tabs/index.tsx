"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct;
  countryCode?: string;
}

const ProductTabs = ({ product, countryCode }: ProductTabsProps) => {
  const isLang = countryCode === "uz"
  const tabs = [
    {
      label: isLang ? "Mahsulot haqida" : "О продукте",
      component: <ProductInfoTab product={product}  countryCode={countryCode}/>,
    },
    {
      label: isLang ? "Yetkazib berish" : "Доставка",
      component: <ShippingInfoTab countryCode={countryCode} />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product, countryCode }: ProductTabsProps) => {
  const isLang = countryCode === "uz"
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">
              {isLang ? "Material" : "Материал"}
            </span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">
            {isLang ? "Mamlakat" : "Страна"}
            </span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">
              {isLang ? "Turi" : "Тип"}
            </span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">
              {isLang ? "Og'irligi" : "Вес"}
            </span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">
              {isLang ? "O'lchovlar" : "Размеры"}
            </span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = ({ countryCode }: ProductTabsProps) => {
  const isLang = countryCode === "uz"
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold"> {isLang ? "Tez yetkazib berish" : "Быстрая доставка"}</span>
            <p className="max-w-sm">
              {isLang
                ? " Sizning buyurtmangiz 3-5 ish kuni ichida sizning tanlangan manzilingizga yetkaziladi."
                : " Ваша посылка будет доставлена в течение 3-5 рабочих дней в ваше место получения или в удобство вашего дома."}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold"> {isLang ? "Oson almashtirish" : "Легкий обмен"}</span>
            <p className="max-w-sm">
              {
                isLang
                  ? " Sizga kerak bo'lgan o'lchamni tanlang va biz sizga yangi mahsulotni yuboramiz."
                  : " Просто выберите нужный вам размер, и мы отправим вам новый товар."
              }
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold"> {isLang ? "Oson qaytarish" : "Легкий возврат"}</span>
            <p className="max-w-sm">
              {
                isLang
                  ? " Sizga kerak bo'lgan o'lchamni tanlang va biz sizga yangi mahsulotni yuboramiz."
                  : " Просто выберите нужный вам размер, и мы отправим вам новый товар."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
