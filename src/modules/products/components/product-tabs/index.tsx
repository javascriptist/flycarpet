"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"
import { t } from "@lib/util/translations"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct;
  countryCode?: string;
}

const ProductTabs = ({ product, countryCode }: ProductTabsProps) => {
  const tabs = [
    {
      label: t({ uz: "Mahsulot haqida", ru: "О продукте", en: "Product Info" }, countryCode),
      component: <ProductInfoTab product={product}  countryCode={countryCode}/>,
    },
    {
      label: t({ uz: "Yetkazib berish", ru: "Доставка", en: "Shipping" }, countryCode),
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
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">
              {t({ uz: "Material", ru: "Материал", en: "Material" }, countryCode)}
            </span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">
            {t({ uz: "Mamlakat", ru: "Страна", en: "Country" }, countryCode)}
            </span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">
              {t({ uz: "Turi", ru: "Тип", en: "Type" }, countryCode)}
            </span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">
              {t({ uz: "Og\u02bcirligi", ru: "Вес", en: "Weight" }, countryCode)}
            </span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">
              {t({ uz: "O\u02bclchovlar", ru: "Размеры", en: "Dimensions" }, countryCode)}
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
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold"> {t({ uz: "Tez yetkazib berish", ru: "Быстрая доставка", en: "Fast Delivery" }, countryCode)}</span>
            <p className="max-w-sm">
              {t({ 
                uz: "Sizning buyurtmangiz 3-5 ish kuni ichida sizning tanlangan manzilingizga yetkaziladi.",
                ru: "Ваша посылка будет доставлена в течение 3-5 рабочих дней в ваше место получения или в удобство вашего дома.",
                en: "Your package will be delivered within 3-5 business days to your chosen delivery location or the convenience of your home."
              }, countryCode)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold"> {t({ uz: "Oson almashtirish", ru: "Легкий обмен", en: "Easy Exchange" }, countryCode)}</span>
            <p className="max-w-sm">
              {t({ 
                uz: "Sizga kerak bo\u02bclgan o\u02bclchamni tanlang va biz sizga yangi mahsulotni yuboramiz.",
                ru: "Просто выберите нужный вам размер, и мы отправим вам новый товар.",
                en: "Simply select the size you need and we will send you a new product."
              }, countryCode)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold"> {t({ uz: "Oson qaytarish", ru: "Легкий возврат", en: "Easy Return" }, countryCode)}</span>
            <p className="max-w-sm">
              {t({ 
                uz: "Sizga kerak bo\u02bclgan o\u02bclchamni tanlang va biz sizga yangi mahsulotni yuboramiz.",
                ru: "Просто выберите нужный вам размер, и мы отправим вам новый товар.",
                en: "Simply select the size you need and we will send you a new product."
              }, countryCode)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
