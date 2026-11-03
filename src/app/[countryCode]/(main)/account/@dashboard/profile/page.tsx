import { Metadata } from "next"

import ProfilePhone from "@modules/account//components/profile-phone"
import ProfileBillingAddress from "@modules/account/components/profile-billing-address"
import ProfileEmail from "@modules/account/components/profile-email"
import ProfileName from "@modules/account/components/profile-name"

import { notFound } from "next/navigation"
import { listRegions } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"
import AccountPageHeader from "@modules/account/components/page-header"
import { t } from "@lib/util/translations"

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your Premium Carpet profile.",
}

export default async function Profile(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !regions) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="profile-page-wrapper">
      <AccountPageHeader
        title={t({ uz: "Profil", ru: "Профиль", en: "Profile" }, countryCode)}
        subtitle={t(
          {
            uz: "Ism, email, telefon va hisob-kitob manzilingiz.",
            ru: "Имя, эл. почта, телефон и платёжный адрес.",
            en: "Your name, email, phone and billing address.",
          },
          countryCode
        )}
      />
      <div className="divide-y divide-line rounded-card bg-surface-raised px-5 shadow-card small:px-6">
        <ProfileName customer={customer} />
        <ProfileEmail customer={customer} />
        <ProfilePhone customer={customer} />
        <ProfileBillingAddress customer={customer} regions={regions} />
      </div>
    </div>
  )
}
