import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Input from "@modules/common/components/input"
import { mapKeys } from "lodash"
import React, { useEffect, useMemo, useState } from "react"
import AddressSelect from "../address-select"

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
}: {
  customer: HttpTypes.StoreCustomer | null
  cart: HttpTypes.StoreCart | null
  checked: boolean
  onChange: () => void
}) => {
  // Helper: normalize Uzbek phone numbers to +998XXXXXXXXX
  const normalizeUzPhone = (input: string) => {
    let digits = (input || "").replace(/\D/g, "")
    if (digits.startsWith("00")) digits = digits.slice(2)
    if (digits.startsWith("998")) {
      // already in international format
    } else if (digits.startsWith("8") && digits.length === 11) {
      digits = "998" + digits.slice(1)
    } else if (digits.startsWith("0")) {
      digits = "998" + digits.replace(/^0+/, "")
    } else if (digits.length <= 9) {
      digits = "998" + digits
    }
    // Keep max 12 digits (998 + 9 local digits)
    digits = digits.slice(0, 12)
    return `+${digits}`
  }

  // Helper: mask phone as +998 90 123 45 67 while typing
  const formatUzPhone = (input: string) => {
    let digits = (input || "").replace(/\D/g, "")
    if (digits.startsWith("00")) digits = digits.slice(2)
    if (digits.startsWith("998")) {
      digits = digits.slice(3)
    } else if (digits.startsWith("8") && digits.length === 11) {
      digits = digits.slice(1)
    } else if (digits.startsWith("0")) {
      digits = digits.replace(/^0+/, "")
    }
    // Limit to 9 local digits
    digits = digits.slice(0, 9)
    const p1 = digits.slice(0, 2)
    const p2 = digits.slice(2, 5)
    const p3 = digits.slice(5, 7)
    const p4 = digits.slice(7, 9)
    let out = "+998"
    if (p1) out += ` ${p1}`
    if (p2) out += ` ${p2}`
    if (p3) out += ` ${p3}`
    if (p4) out += ` ${p4}`
    return out
  }

  // Simplified for Uzbekistan: only need address line, city, phone; email optional.
  const [formData, setFormData] = useState<Record<string, any>>({
    // Required by backend: first_name; we treat user single name as first name.
    "shipping_address.first_name": cart?.shipping_address?.first_name || "",
    // Backend may still require last_name; auto-populate with first name if user doesn't provide one separately (we don't show separate field).
    "shipping_address.last_name": cart?.shipping_address?.last_name || cart?.shipping_address?.first_name || "",
    "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
    "shipping_address.city": cart?.shipping_address?.city || "",
  "shipping_address.company": cart?.shipping_address?.company || "N/A",
    // Force Uzbekistan
    "shipping_address.country_code": "uz",
    "shipping_address.phone": cart?.shipping_address?.phone
      ? formatUzPhone(cart.shipping_address.phone)
      : "",
    // Hidden fallback placeholders for fields some backends mark required; adjust as needed.
    "shipping_address.postal_code": cart?.shipping_address?.postal_code || "100000", // default Uzbek postal code placeholder
    "shipping_address.province": cart?.shipping_address?.province || "Berilmagan", // placeholder province
    email: cart?.email || "",
    // Billing placeholders (backend may require). We'll keep them in sync when checkbox is checked.
    "billing_address.first_name": cart?.billing_address?.first_name || "",
    "billing_address.last_name":
      cart?.billing_address?.last_name ||
      cart?.billing_address?.first_name ||
      "",
    "billing_address.address_1": cart?.billing_address?.address_1 || "",
    "billing_address.city": cart?.billing_address?.city || "",
    "billing_address.company": cart?.billing_address?.company || "N/A",
    "billing_address.country_code": "uz",
    "billing_address.phone": cart?.billing_address?.phone
      ? normalizeUzPhone(cart.billing_address.phone)
      : "",
    "billing_address.postal_code": cart?.billing_address?.postal_code || "100000",
    "billing_address.province": cart?.billing_address?.province || "Berilmagan",
  })

  const countriesInRegion = useMemo(
    () => cart?.region?.countries?.map((c) => c.iso_2),
    [cart?.region]
  )

  // check if customer has saved addresses that are in the current region
  const addressesInRegion = useMemo(
    () =>
      customer?.addresses.filter(
        (a) => a.country_code && countriesInRegion?.includes(a.country_code)
      ),
    [customer?.addresses, countriesInRegion]
  )

  const setFormAddress = (address?: HttpTypes.StoreCartAddress, email?: string) => {
    address &&
      setFormData((prev) => ({
        ...prev,
        "shipping_address.first_name": address?.first_name || prev["shipping_address.first_name"],
        "shipping_address.last_name": address?.last_name || prev["shipping_address.last_name"] || address?.first_name || prev["shipping_address.first_name"],
        "shipping_address.address_1": address?.address_1 || "",
        "shipping_address.city": address?.city || "",
  "shipping_address.company": prev["shipping_address.company"] || "N/A",
        // Always enforce Uzbekistan
        "shipping_address.country_code": "uz",
        "shipping_address.phone": address?.phone
          ? formatUzPhone(address.phone)
          : prev["shipping_address.phone"],
        "shipping_address.postal_code": prev["shipping_address.postal_code"],
        "shipping_address.province": prev["shipping_address.province"],
        // Always mirror billing to shipping
        "billing_address.first_name": address?.first_name || prev["shipping_address.first_name"],
        "billing_address.last_name": address?.last_name || address?.first_name || prev["shipping_address.first_name"],
        "billing_address.address_1": address?.address_1 || "",
        "billing_address.city": address?.city || "",
        "billing_address.company": prev["billing_address.company"] || "N/A",
        "billing_address.country_code": "uz",
        "billing_address.phone": address?.phone
          ? normalizeUzPhone(address.phone)
          : prev["shipping_address.phone"],
        "billing_address.postal_code": prev["shipping_address.postal_code"],
        "billing_address.province": prev["shipping_address.province"],
      }))
    email && setFormData((prev) => ({ ...prev, email }))
  }

  useEffect(() => {
    // Ensure cart is not null and has a shipping_address before setting form data
    if (cart && cart.shipping_address) {
      setFormAddress(cart?.shipping_address, cart?.email)
    }

    if (cart && !cart.email && customer?.email) {
      setFormAddress(undefined, customer.email)
    }
  }, [cart]) // Add cart as a dependency

  // Safety net: ensure required fields never end up empty/null
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      "shipping_address.last_name": prev["shipping_address.last_name"] || prev["shipping_address.first_name"] || "Customer",
      "billing_address.last_name": prev["billing_address.last_name"] || prev["billing_address.first_name"] || prev["shipping_address.first_name"] || "Customer",
      "shipping_address.company": prev["shipping_address.company"] || "N/A",
      "billing_address.company": prev["billing_address.company"] || "N/A",
    }))
  }, [formData["shipping_address.first_name"], formData["billing_address.first_name"]])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const next: Record<string, any> = { ...prev, [name]: value }
      // Keep last_name synced if user changes first_name and last_name is same or empty
      if (name === "shipping_address.first_name") {
        if (!prev["shipping_address.last_name"] || prev["shipping_address.last_name"] === prev["shipping_address.first_name"]) {
          next["shipping_address.last_name"] = value
        }
        // Always mirror to billing
        if (!prev["billing_address.first_name"]) next["billing_address.first_name"] = value
        if (!prev["billing_address.last_name"] || prev["billing_address.last_name"] === prev["billing_address.first_name"]) {
          next["billing_address.last_name"] = value
        }
      }
      // Live mask for phone input
      if (name === "shipping_address.phone") {
        next[name] = formatUzPhone(value)
        next["billing_address.phone"] = formatUzPhone(value)
      }
      // Guard country code to 'uz' regardless of UI
      if (name === "shipping_address.country_code") {
        next["shipping_address.country_code"] = "uz"
        next["billing_address.country_code"] = "uz"
      }
      // Always mirror basic address fields
      if (name === "shipping_address.address_1") next["billing_address.address_1"] = value
      if (name === "shipping_address.city") next["billing_address.city"] = value
      return next
    })
  }

  const handlePhoneBlur = () => {
    setFormData((prev) => ({
      ...prev,
      "shipping_address.phone": normalizeUzPhone(prev["shipping_address.phone"] || ""),
      "billing_address.phone": normalizeUzPhone(prev["shipping_address.phone"] || ""),
    }))
  }

  // Ensure last_name has safe fallbacks before submit flow reads state (do not auto-fill email visually)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      "shipping_address.last_name": prev["shipping_address.last_name"] || prev["shipping_address.first_name"] || "Customer",
      "billing_address.last_name": prev["billing_address.last_name"] || prev["billing_address.first_name"] || prev["shipping_address.first_name"] || "Customer",
    }))
  }, [])

  return (
    <>
      {customer && (addressesInRegion?.length || 0) > 0 && (
        <Container className="mb-6 flex flex-col gap-y-4 p-5">
          <p className="text-small-regular">
            {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
          </p>
          <AddressSelect
            addresses={customer.addresses}
            addressInput={
              mapKeys(formData, (_, key) =>
                key.replace("shipping_address.", "")
              ) as HttpTypes.StoreCartAddress
            }
            onSelect={setFormAddress}
          />
        </Container>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Ism" // First name required
          name="shipping_address.first_name"
          autoComplete="given-name"
          value={formData["shipping_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-first-name-input"
        />
        <Input
          label="Manzil" // Address
          name="shipping_address.address_1"
          autoComplete="address-line1"
          value={formData["shipping_address.address_1"]}
          onChange={handleChange}
          required
          data-testid="shipping-address-input"
        />
        <Input
          label="Shahar" // City
          name="shipping_address.city"
          autoComplete="address-level2"
          value={formData["shipping_address.city"]}
          onChange={handleChange}
          required
          data-testid="shipping-city-input"
        />
        <Input
          label="Telefon (+998 …)"
          name="shipping_address.phone"
          autoComplete="tel"
          value={formData["shipping_address.phone"]}
          onChange={handleChange}
          onBlur={handlePhoneBlur}
          required
          data-testid="shipping-phone-input"
        />
        {/* Country selector removed in UI; force 'uz' */}
        <input type="hidden" name="shipping_address.country_code" value="uz" />
        {/* Hidden shipping fields to satisfy backend if required */}
        <input type="hidden" name="shipping_address.last_name" value={formData["shipping_address.last_name"] || formData["shipping_address.first_name"] || "Customer"} />
        <input type="hidden" name="shipping_address.company" value={formData["shipping_address.company"] || "N/A"} />
  <input type="hidden" name="shipping_address.postal_code" value={formData["shipping_address.postal_code"] || "100000"} />
  <input type="hidden" name="shipping_address.province" value={formData["shipping_address.province"] || "Toshkent"} />
        {/* Hidden billing fields to satisfy backend if required */}
        <input type="hidden" name="billing_address.first_name" value={formData["billing_address.first_name"] || formData["shipping_address.first_name"] || "Customer"} />
        <input type="hidden" name="billing_address.last_name" value={formData["billing_address.last_name"] || formData["billing_address.first_name"] || formData["shipping_address.first_name"] || "Customer"} />
        <input type="hidden" name="billing_address.address_1" value={formData["billing_address.address_1"] || formData["shipping_address.address_1"]} />
        <input type="hidden" name="billing_address.city" value={formData["billing_address.city"] || formData["shipping_address.city"]} />
        <input type="hidden" name="billing_address.company" value={formData["billing_address.company"] || "N/A"} />
        <input type="hidden" name="billing_address.country_code" value="uz" />
        <input type="hidden" name="billing_address.phone" value={normalizeUzPhone(formData["billing_address.phone"] || formData["shipping_address.phone"] || "")} />
        <input type="hidden" name="billing_address.postal_code" value={formData["billing_address.postal_code"]} />
        <input type="hidden" name="billing_address.province" value={formData["billing_address.province"]} />
      </div>
      {/* Billing is always same as shipping; checkbox removed. */}
      <div className="grid grid-cols-2 gap-4 mb-4 mt-4">
        <Input
          label="Email (ixtiyoriy)"
          name="email_display"
          type="email"
          title="Enter a valid email address."
          autoComplete="email"
          value={formData.email || ""}
          onChange={handleChange}
          data-testid="shipping-email-input"
        />
        {/* Hidden email actually submitted; uses fallback only if user left it empty */}
        <input
          type="hidden"
          name="email"
          value={formData.email || `guest+${Date.now()}@example.com`}
        />
        {/* Hidden normalized phone version for backend if it needs strict E.164 */}
        <input type="hidden" name="shipping_address.phone_normalized" value={normalizeUzPhone(formData["shipping_address.phone"] || "")} />
      </div>
    </>
  )
}

export default ShippingAddress
