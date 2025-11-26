"use client"

import Link from "next/link"
import React from "react"

type Props = React.ComponentProps<typeof Link> & {
  className?: string
}

/**
 * Minimal LocalizedClientLink placeholder.
 *
 * Many parts of the app import this helper to render links that are
 * aware of the app's localized routing. The original project likely
 * prefixes routes with a country or locale segment (e.g. `/uz`).
 *
 * This minimal implementation simply proxies to `next/link` and
 * forwards props. It's intentionally small so it fixes the import
 * error without changing routing behavior. If you need automatic
 * locale/country prefixing, I can add that logic (it requires
 * agreeing on how to obtain the current locale/countryCode).
 */

export default function LocalizedClientLink({ href, children, ...rest }: Props) {
  // If href is a string, pass through. If it's an object, pass as-is.
  return (
    // eslint-disable-next-line @next/next/link-passhref
    <Link href={href} {...(rest as any)}>
      {children as React.ReactNode}
    </Link>
  )
}
