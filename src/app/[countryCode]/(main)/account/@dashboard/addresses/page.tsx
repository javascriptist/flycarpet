import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

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

  const isLang = countryCode === "uz"
  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">
          {isLang ? "Manzillar" : "Адреса"}
        </h1>
        <p className="text-base-regular">
          {isLang
            ? "Barcha manzillarni ko'ring va yangilang"
            : "Просмотрите и обновите все адреса"}
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
