import { getBaseURL } from "@lib/util/env"
import { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "styles/globals.css"

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/satoshi/Satoshi-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // lets us pad for the notch / home indicator with env(safe-area-inset-*)
  interactiveWidget: "resizes-content", // Android keyboard resizes the layout like iOS
  themeColor: "#FAF7F3", // browser chrome matches the cream page
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className={`${satoshi.variable} font-satoshi bg-brand-cream text-ink`}>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
