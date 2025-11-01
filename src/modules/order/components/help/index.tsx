import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

type HelpProps = {
  countryCode?: string
}

const Help = ({ countryCode }: HelpProps) => {
  const isLang = countryCode === "uz"
  
  return (
    <div className="mt-6">
      <Heading className="text-base-semi">
        {isLang ? "Yordam kerakmi?" : "Нужна помощь?"}
      </Heading>
      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <LocalizedClientLink href="/contact">
              {isLang ? "Aloqa" : "Контакты"}
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/contact">
              {isLang ? "Qaytarish va almashtirish" : "Возврат и обмен"}
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
