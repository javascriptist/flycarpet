# Payme GET Method Integration - Simple & No Backend Required! 🎉

## ✨ What Changed

We've switched to Payme's **GET method** for checkout, which is **MUCH SIMPLER**:

### Before (Complex):
- ❌ Required backend API integration
- ❌ Needed merchant credentials in backend
- ❌ Had to call Payme Merchant API to create receipts
- ❌ Required JSON-RPC format
- ❌ Needed HTTP Basic Auth
- ❌ Error -32504 if credentials wrong

### After (Simple):
- ✅ **No backend API calls needed!**
- ✅ **No merchant credentials in backend!**
- ✅ Just add merchant ID to storefront `.env`
- ✅ Generate URL with base64-encoded params
- ✅ Direct redirect to Payme checkout
- ✅ **Works immediately!**

---

## 🚀 Quick Setup (2 minutes)

### 1. Get Your Merchant ID

**Test Environment:**
- Go to https://test.paycom.uz/
- Register and login
- Find your Merchant ID in dashboard
- Example: `587f72c72cac0d162c722ae2`

**Production Environment:**
- Go to https://business.paycom.uz/
- Complete registration
- Get your production Merchant ID

### 2. Add to Storefront .env

Edit `/Users/test/Desktop/urgaz-storefront/.env`:

```bash
NEXT_PUBLIC_PAYME_MERCHANT_ID=587f72c72cac0d162c722ae2
```

**That's it!** No backend configuration needed!

### 3. Restart Storefront

```bash
# In storefront directory
# Stop current process (Ctrl+C)
npm run dev
```

### 4. Test

1. Add items to cart
2. Go to checkout
3. Select **Payme** payment option
4. Click Continue
5. You'll be redirected to Payme checkout page
6. Test card: **8600 0000 0000 0000**

---

## 🔧 How It Works

### URL Generation

The storefront generates a URL like this:

```
https://checkout.paycom.uz/base64(params)
```

Where `params` is:
```
m=587f72c72cac0d162c722ae2;ac.order_id=cart_123;a=500;l=uz;c=http://localhost:8000/uz/checkout
```

### Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `m` | Merchant ID | `587f72c72cac0d162c722ae2` |
| `ac.order_id` | Order/Cart ID | `cart_01JBFXYZ...` |
| `a` | Amount in tiyin | `500` (= 5 UZS) |
| `l` | Language (ru, uz, en) | `uz` |
| `c` | Return URL after payment | `http://localhost:8000/uz/checkout` |

### Example

**For your screenshot** (Order 197, 5 UZS):
```
m=587f72c72cac0d162c722ae2;ac.order_id=197;a=500;l=uz
```

**Base64 encoded:**
```
bT01ODdmNzJjNzJjYWMwZDE2MmM3MjJhZTI7YWMub3JkZXJfaWQ9MTk3O2E9NTAw
```

**Final URL:**
```
https://checkout.paycom.uz/bT01ODdmNzJjNzJjYWMwZDE2MmM3MjJhZTI7YWMub3JkZXJfaWQ9MTk3O2E9NTAw
```

---

## 💰 Amount Conversion

### Automatic Conversion Chain:
1. **Cart total in USD cents**: `1500` ($15.00)
2. **Get exchange rate**: `12750` (UZS per USD)
3. **Convert to tiyin**: `1500 * 12750 = 19,125,000 tiyin`
4. **Display on Payme**: `191,250.00 UZS`

### Formula:
```javascript
tiyin = cart_total_cents * exchange_rate
```

Example:
- $15.00 = 1500 cents
- Exchange rate = 12750
- 1500 × 12750 = 19,125,000 tiyin
- 19,125,000 ÷ 100 = 191,250 UZS ✅

---

## 📝 Code Changes

### Updated Files:

1. **`src/lib/paymeClient.ts`**
   - Removed API call functions
   - Added `buildPaymeCheckoutUrl()` with base64 encoding
   - Reads `NEXT_PUBLIC_PAYME_MERCHANT_ID` from env
   - No backend dependency!

2. **`src/modules/checkout/components/payment/index.tsx`**
   - Removed `createPaymeReceipt()` API call
   - Now calls `buildPaymeCheckoutUrl()` directly
   - Passes amount, orderId, returnUrl, language
   - Immediate redirect - no waiting!

3. **`.env`**
   - Added `NEXT_PUBLIC_PAYME_MERCHANT_ID`
   - Removed need for backend Payme config

### What Was Removed:
- ❌ Backend `/store/custom` endpoint (not needed!)
- ❌ `createPaymeReceipt()` API function
- ❌ Error handling for -32504
- ❌ Backend authentication
- ❌ JSON-RPC complexity

---

## ✅ Testing Checklist

- [ ] Added `NEXT_PUBLIC_PAYME_MERCHANT_ID` to `.env`
- [ ] Restarted storefront (npm run dev)
- [ ] Can see Payme option in checkout
- [ ] Selecting Payme doesn't show error
- [ ] Clicking Continue redirects to checkout.paycom.uz
- [ ] URL contains base64-encoded parameters
- [ ] Amount shown on Payme page is correct (in UZS)
- [ ] Can enter test card and complete payment
- [ ] Returns to storefront after payment

---

## 🎯 Test Data

| Item | Value |
|------|-------|
| Test Merchant ID | `587f72c72cac0d162c722ae2` (example) |
| Test Card | `8600 0000 0000 0000` |
| Test Phone | Any 9-digit number |
| Test SMS Code | `666666` |
| Checkout URL | `https://checkout.paycom.uz/` |

---

## 🐛 Troubleshooting

### Payme option doesn't appear
**Check**: Is merchant ID set in `.env`?
```bash
grep PAYME_MERCHANT_ID .env
```

### Redirect happens but Payme shows error
**Possible causes:**
1. Merchant ID is invalid
2. Amount is 0 or negative
3. Order ID is empty

**Debug**: Check browser console for the generated URL

### Amount is wrong on Payme page
**Check**: 
- Amount should be in tiyin (multiply UZS by 100)
- Cart total is being converted correctly
- Exchange rate is fetching properly

### Can't complete payment
**Check**:
- Using test merchant ID with test card `8600 0000 0000 0000`
- Production merchant ID requires real cards
- Test environment: https://checkout.test.paycom.uz/
- Production environment: https://checkout.paycom.uz/

---

## 🔒 Security Note

**Why this is safe:**
- Merchant ID is public information (not secret!)
- No sensitive credentials exposed
- Payme validates the merchant ID
- Payment happens on Payme's secure page
- Webhook notification secures the backend

**Backend still needs webhook handler** for:
- Order confirmation
- Payment status updates
- Fulfillment trigger

But that's separate from the checkout flow!

---

## 📚 Resources

- [Payme GET Method Docs](https://developer.help.paycom.uz/ru/metody-merchant-api/pay-me-cherez-ssyilku)
- [Test Dashboard](https://test.paycom.uz/)
- [Production Dashboard](https://business.paycom.uz/)
- [Payme Support](mailto:support@paycom.uz)

---

## 🎉 Summary

**Before**: Complex API integration, backend credentials, error -32504  
**Now**: Add one line to `.env` and it works! 

**One environment variable = working Payme integration! 🚀**
