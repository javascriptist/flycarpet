import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import BackToCart from "@modules/checkout/components/back-to-cart"
import { getExchangeRate } from "@lib/data/exchange-rate"
import { ExchangeRateProvider } from "@lib/context/currency-context"

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const exchangeRate = await getExchangeRate()

  return (
    <ExchangeRateProvider rate={exchangeRate?.rate}>
    <div className="w-full relative small:min-h-dvh">
      <header className="sticky top-0 z-50 h-16 bg-[#191718]/90 backdrop-blur-xl backdrop-saturate-150">
        <nav className="content-container flex h-full items-center justify-between text-brand-peach">
          <BackToCart />
          <LocalizedClientLink href="/" data-testid="store-link" aria-label="Premium Carpet" className="hover:opacity-80">
            <Image src="/pclogo_tp.png" alt="Premium Carpet" width={150} height={40} />
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </header>
      <div className="relative" data-testid="checkout-container">{children}</div>
    </div>
    </ExchangeRateProvider>
  )
}
