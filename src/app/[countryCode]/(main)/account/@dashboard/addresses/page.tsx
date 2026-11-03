import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"
import { t } from "@lib/util/translations"
import AccountPageHeader from "@modules/account/components/page-header"

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
      <AccountPageHeader
        title={t({ uz: "Manzillar", ru: "Адреса", en: "Addresses" }, countryCode)}
        subtitle={t({ uz: "Yetkazib berish manzillaringiz.", ru: "Ваши адреса доставки.", en: "Your saved delivery addresses." }, countryCode)}
      />
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
