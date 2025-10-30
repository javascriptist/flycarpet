import React from "react"

const PaymeForm = ({
  merchantId,
  orderId,
  amountTiyin,
  lang = "ru",
  buttonType = "svg",
  buttonColor = "colored",
}) => {
  React.useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://cdn.paycom.uz/integration/js/checkout.min.js"
    script.async = true
    document.body.appendChild(script)
    script.onload = () => {
      if (window.Paycom && window.Paycom.Button) {
        window.Paycom.Button("#form-payme", "#button-container")
      }
    }
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <form
      id="form-payme"
      method="POST"
      action="https://checkout.paycom.uz/"
      style={{ display: "inline-block" }}
    >
      <input type="hidden" name="merchant" value={merchantId} />
      <input type="hidden" name="account[order_id]" value={orderId} />
      <input type="hidden" name="amount" value={amountTiyin} />
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="button" data-type={buttonType} value={buttonColor} />
      <div id="button-container"></div>
    </form>
  )
}

export default PaymeForm
