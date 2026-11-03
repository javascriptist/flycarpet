# Payme Integration - HTML Form POST Method

## ✅ Current Implementation

We're now using **HTML form POST** method for Payme checkout - the cleanest approach!

### Why Form POST is Better:

**vs GET method (base64 URL):**
- ✅ Cleaner - no parameters in URL
- ✅ More secure - data in request body
- ✅ Standard HTML form approach
- ✅ Recommended by Payme

**vs API method (JSON-RPC):**
- ✅ No backend needed
- ✅ No credentials required
- ✅ Simple and direct

---

## 🚀 How It Works

### Form Structure

```html
<form method="POST" action="https://checkout.paycom.uz">
  <input type="hidden" name="merchant" value="68c46ba9acdb1e860a342a87"/>
  <input type="hidden" name="amount" value="5555500"/>
  <input type="hidden" name="account[order_id]" value="cart_123"/>
  <input type="hidden" name="callback" value="http://localhost:8000/uz/checkout"/>
</form>
```

### Parameters

| Field | Description | Example |
|-------|-------------|---------|
| `merchant` | Your merchant ID | `68c46ba9acdb1e860a342a87` |
| `amount` | Amount in tiyin | `5555500` (= 55,555 UZS) |
| `account[order_id]` | Order/cart ID | `cart_01JBFXYZ...` |
| `callback` | Return URL after payment | `http://localhost:8000/uz/checkout` |

### JavaScript Implementation

```typescript
export function submitPaymeForm(
  amount: number,
  orderId: string,
  returnUrl?: string
): void {
  // Create form
  const form = document.createElement("form")
  form.method = "POST"
  form.action = "https://checkout.paycom.uz"
  
  // Add fields
  form.appendChild(createInput("merchant", MERCHANT_ID))
  form.appendChild(createInput("amount", amount.toString()))
  form.appendChild(createInput("account[order_id]", orderId))
  if (returnUrl) {
    form.appendChild(createInput("callback", returnUrl))
  }
  
  // Submit and cleanup
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}
```

---

## 💰 Amount Conversion

Same as before - automatic conversion from USD to tiyin:

```javascript
// Cart: $15.00 = 1,500 cents
// Exchange rate: 12,750 UZS/USD
// Formula: cents * exchange_rate = tiyin

1500 * 12750 = 19,125,000 tiyin
= 191,250 UZS
```

---

## 📋 Setup

### Environment Variable (.env)

```bash
NEXT_PUBLIC_PAYME_MERCHANT_ID=68c46ba9acdb1e860a342a87
```

Get your merchant ID from:
- Test: https://test.paycom.uz/
- Production: https://business.paycom.uz/

### That's It!

No other configuration needed. Just restart:
```bash
npm run dev
```

---

## 🧪 Testing

1. Add item to cart
2. Go to checkout
3. Select **Payme** payment
4. Click **Continue**
5. Form submits to checkout.paycom.uz
6. Enter test card: `8600 0000 0000 0000`
7. Complete payment
8. Returns to your site via callback URL

---

## 🎯 Code Changes

### Updated Files:

1. **`src/lib/paymeClient.ts`**
   - Added `submitPaymeForm()` - creates and submits HTML form
   - Form posts to `https://checkout.paycom.uz`
   - Fields: merchant, amount, account[order_id], callback

2. **`src/modules/checkout/components/payment/index.tsx`**
   - Changed from `buildPaymeCheckoutUrl()` to `submitPaymeForm()`
   - Same conversion logic (USD cents → tiyin)
   - Cleaner implementation

---

## ✨ Advantages

### Simple
- No URL encoding
- No base64 encoding
- Just standard HTML form POST

### Clean
- Parameters not visible in URL
- More professional
- Better UX

### Standard
- Recommended by Payme docs
- Works in all browsers
- No JavaScript issues

### Secure
- Data in POST body
- Not exposed in browser history
- Not visible in network logs (in URL)

---

## 📝 Form Fields Reference

### Required Fields

```javascript
{
  merchant: "68c46ba9acdb1e860a342a87",  // Your merchant ID
  amount: "5555500",                      // Amount in tiyin (integer)
  "account[order_id]": "cart_123"         // Your order identifier
}
```

### Optional Fields

```javascript
{
  callback: "http://localhost:8000/checkout",  // Return URL
  callback_timeout: "15000",                   // Timeout in ms
  lang: "uz"                                   // Language (uz, ru, en)
}
```

### Account Object

You can pass custom account fields:

```javascript
{
  "account[order_id]": "123",
  "account[user_id]": "456",
  "account[custom_field]": "value"
}
```

These must match your Payme merchant settings!

---

## 🎨 Optional: Add Payme Button

If you want a visual Payme button:

```html
<button type="submit">
  <img 
    src="http://cdn.payme.uz/buttons/button_ru.svg" 
    alt="Pay with Payme"
    width="200"
  />
</button>
```

Available button images:
- `button_ru.svg` - Russian
- `button_uz.svg` - Uzbek
- `button_en.svg` - English
- `buttonsmall_RU.svg` - Small version

---

## 🔧 Troubleshooting

### Form doesn't submit
**Check**: Browser console for JavaScript errors

### Redirects to wrong URL
**Check**: `NEXT_PUBLIC_PAYME_MERCHANT_ID` in `.env`

### Amount is wrong on Payme page
**Check**: Amount should be in tiyin (multiply UZS by 100)

### Doesn't return after payment
**Check**: Callback URL is correct and accessible

---

## ✅ Status

**Implementation**: ✅ Complete  
**Method**: HTML Form POST  
**Backend Needed**: ❌ No  
**Configuration**: Just merchant ID  
**Ready**: ✅ Yes  

---

## 🎉 Summary

The simplest and cleanest Payme integration:

1. Add merchant ID to `.env`
2. Form submits to Payme on checkout
3. Customer pays on Payme page
4. Returns to your site
5. Done! 🚀

**No backend, no API, no complexity - just works!**
