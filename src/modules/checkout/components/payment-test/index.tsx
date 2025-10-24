import { Badge } from "@medusajs/ui"

const PaymentTest = ({ className, countryCode }: { className?: string; countryCode?: string }) => {
  const isLang = countryCode === "uz"
  return (
    <Badge color="orange" className={className}>
      <span className="font-semibold">{isLang ? "Diqqat:" : "Внимание:"}</span> {isLang ? "Faqat sinov maqsadida." : "Только для тестирования."}
    </Badge>
  )
}

export default PaymentTest
