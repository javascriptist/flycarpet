import { Badge } from "@medusajs/ui"
import { t } from "@lib/util/translations"

const PaymentTest = ({ className, countryCode }: { className?: string; countryCode?: string }) => {
  return (
    <Badge color="orange" className={className}>
      <span className="font-semibold">{t({ uz: "Diqqat:", ru: "Внимание:", en: "Attention:" }, countryCode)}</span> {t({ uz: "Faqat sinov maqsadida.", ru: "Только для тестирования.", en: "For testing purposes only." }, countryCode)}
    </Badge>
  )
}

export default PaymentTest
