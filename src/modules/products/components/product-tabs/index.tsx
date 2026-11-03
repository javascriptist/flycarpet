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
  const attrs = (product.metadata as any)?.attributes ?? {}
  const rows = [
    { label: t({ uz: "Material", ru: "Материал", en: "Material" }, countryCode), value: product.material },
    { label: t({ uz: "Ishlab chiqarilgan", ru: "Страна", en: "Made in" }, countryCode), value: product.origin_country?.toUpperCase() },
    { label: t({ uz: "Turi", ru: "Тип", en: "Type" }, countryCode), value: product.type?.value },
    {
      label: t({ uz: "O\u02bclcham", ru: "Размер", en: "Size" }, countryCode),
      value: attrs.width && attrs.length && attrs.carpet_type !== "roll"
        ? `${attrs.width} × ${attrs.length}`
        : attrs.width
        ? `${t({ uz: "Eni", ru: "Ширина", en: "Width" }, countryCode)} ${attrs.width}`
        : undefined,
    },
    { label: t({ uz: "Og\u02bcirligi", ru: "Вес", en: "Weight" }, countryCode), value: product.weight ? `${product.weight} g` : undefined },
  ].filter((r) => !!r.value)

  if (!rows.length) {
    return <p className="text-callout text-ink-muted">—</p>
  }

  return (
    <dl className="grid grid-cols-[auto,1fr] gap-x-6 gap-y-2 text-callout">
      {rows.map((r) => (
        <div key={r.label} className="contents">
          <dt className="text-ink-muted">{r.label}</dt>
          <dd className="text-ink">{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}

const ShippingInfoTab = ({ countryCode }: ProductTabsProps) => {
  return (
    <div className="text-callout">
      <div className="grid grid-cols-1 gap-y-5">
        <div className="flex items-start gap-x-3 text-ink-muted">
          <FastDelivery />
          <div>
            <span className="font-medium text-ink">{t({ uz: "Tez yetkazib berish", ru: "Быстрая доставка", en: "Fast Delivery" }, countryCode)}</span>
            <p className="max-w-[65ch]">
              {t({ 
                uz: "Sizning buyurtmangiz 3-5 ish kuni ichida sizning tanlangan manzilingizga yetkaziladi.",
                ru: "Доставим заказ в течение 3–5 рабочих дней по выбранному адресу или прямо к вам домой.",
                en: "Your package will be delivered within 3-5 business days to your chosen delivery location or the convenience of your home."
              }, countryCode)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-3 text-ink-muted">
          <Refresh />
          <div>
            <span className="font-medium text-ink">{t({ uz: "Oson almashtirish", ru: "Легкий обмен", en: "Easy Exchange" }, countryCode)}</span>
            <p className="max-w-[65ch]">
              {t({ 
                uz: "Sizga kerak bo\u02bclgan o\u02bclchamni tanlang va biz sizga yangi mahsulotni yuboramiz.",
                ru: "Просто выберите нужный вам размер, и мы отправим вам новый товар.",
                en: "Simply select the size you need and we will send you a new product."
              }, countryCode)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-3 text-ink-muted">
          <Back />
          <div>
            <span className="font-medium text-ink">{t({ uz: "Oson qaytarish", ru: "Легкий возврат", en: "Easy Return" }, countryCode)}</span>
            <p className="max-w-[65ch]">
              {t({ 
                uz: "Mahsulot to\u02bcg\u02bcri kelmasa, biz bilan bog\u02bclaning \u2014 qaytarishni tashkil qilamiz.",
                ru: "Если товар не подошёл, свяжитесь с нами \u2014 мы организуем возврат.",
                en: "If it isn\u2019t right, get in touch and we\u2019ll arrange the return."
              }, countryCode)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
