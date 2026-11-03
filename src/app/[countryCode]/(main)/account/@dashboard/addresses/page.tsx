import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"
import { t } from "@lib/util/translations"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">
          {t({ uz: "Manzillar", ru: "Адреса", en: "Addresses" }, countryCode)}
        </h1>
        <p className="text-base-regular">
          {t({ uz: "Barcha manzillarni ko'ring va yangilang", ru: "Просмотрите и обновите все адреса", en: "View and update your saved addresses" }, countryCode)}
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
