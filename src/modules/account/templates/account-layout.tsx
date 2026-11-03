import React from "react"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

/** Sidebar nav on desktop, list-style nav on phones; content on a card. */
const AccountLayout: React.FC<AccountLayoutProps> = ({ customer, children }) => {
  return (
    <div className="flex-1 py-8 small:py-12" data-testid="account-page">
      <div className="content-container mx-auto max-w-5xl">
        {customer ? (
          <div className="grid grid-cols-1 gap-8 small:grid-cols-[220px_1fr] small:gap-12">
            <AccountNav customer={customer} />
            <div className="min-w-0">{children}</div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default AccountLayout
