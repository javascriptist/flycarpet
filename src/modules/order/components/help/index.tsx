import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"
import { t } from "@lib/util/translations"

type HelpProps = {
  countryCode?: string
}

const Help = ({ countryCode }: HelpProps) => {
  
  return (
    <div className="mt-6">
      <Heading className="text-base-semi">
        {t({ uz: "Yordam kerakmi?", ru: "Нужна помощь?", en: "Need help?" }, countryCode)}
      </Heading>
      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <LocalizedClientLink href="/contact">
              {t({ uz: "Aloqa", ru: "Контакты", en: "Contact" }, countryCode)}
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/contact">
              {t({ uz: "Qaytarish va almashtirish", ru: "Возврат и обмен", en: "Returns & exchanges" }, countryCode)}
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
