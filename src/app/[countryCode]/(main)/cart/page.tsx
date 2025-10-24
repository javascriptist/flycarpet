import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { getExchangeRate } from "@lib/data/exchange-rate"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}


export default async function Cart() {
  const cart = await retrieveCart()
  const customer = await retrieveCustomer()
  const exchangeRate = await getExchangeRate()


  if (!cart) {
    return notFound()
  }

  return <CartTemplate cart={cart} customer={customer} exchangeRate={exchangeRate?.rate} />
}
