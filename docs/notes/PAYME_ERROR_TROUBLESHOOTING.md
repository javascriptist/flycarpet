# Payme Error -32504: Access Denied (invalid_id)

## ⚠️ CURRENT ERROR
```
Failed to create Payme receipt: 
{"message":"Access denied.","code":-32504,"data":"invalid_id"}
```

## 🔍 What This Means

Error code `-32504` from Payme API means **"Access denied - invalid merchant ID"**. 

This happens when:
1. ❌ **No valid Payme credentials** in backend `.env`
2. ❌ **Wrong merchant ID** or secret key
3. ❌ **Test credentials with production API** (or vice versa)
4. ❌ **Backend not restarted** after adding credentials

## ✅ HOW TO FIX

### Step 1: Get Payme Credentials

You MUST register and get credentials first:

**For Testing (Sandbox):**
1. Go to https://test.paycom.uz/
2. Register test merchant account
3. Go to **Инструменты разработчика** (Developer Tools)
4. Copy your **Merchant ID** (starts with `_`)
5. Copy your **Test Key** (secret password)

**For Production:**
1. Go to https://business.paycom.uz/
2. Complete business registration
3. Get approved by Payme
4. Copy production credentials from dashboard

### Step 2: Update Backend Configuration

**Find your backend directory** (urgaztest):
```bash
cd /Users/test/Desktop/urgaztest
# or wherever your Medusa backend is
```

**Edit the `.env` file:**
```bash
nano .env
```

**Add these lines:**

For TEST environment:
```bash
PAYME_MERCHANT_ID=_your_test_merchant_id
PAYME_SECRET_KEY=your_test_secret_key
PAYME_API_URL=https://checkout.test.paycom.uz/api
```

For PRODUCTION environment:
```bash
PAYME_MERCHANT_ID=_your_production_merchant_id
PAYME_SECRET_KEY=your_production_secret_key
PAYME_API_URL=https://checkout.paycom.uz/api
```

**Save and close** (Ctrl+X, then Y, then Enter)

### Step 3: Restart Backend

**CRITICAL**: Backend MUST be restarted!

```bash
# Stop the current process (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Verify Fix

Test the endpoint:
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-publishable-api-key: pk_fe768fd98de7445ef718c37c9f15616430e92f90bf71aafb27d249faed5e158b" \
  -d '{"amount": 100000, "orderId": "test-123", "return_url": "http://localhost:8000/uz"}' \
  http://localhost:9000/store/custom
```

**Success response:**
```json
{"receiptId": "_abc123xyz..."}
```

**Still error -32504?** → Credentials are wrong, check them again!

## 📋 Payme API Requirements

According to Payme docs, here's what the backend needs to do:

### Authentication
- **Method**: HTTP Basic Auth
- **Format**: `Authorization: Basic base64(merchant_id:secret_key)`
- **Header**: `"Authorization": "Basic " + btoa("merchant_id:secret_key")`

### Create Receipt API Call
```javascript
// JSON-RPC format
{
  "method": "receipts.create",
  "params": {
    "amount": 100000,        // in tiyin (100000 = 1000 UZS)
    "account": { 
      "order_id": "123" 
    }
  },
  "id": 1
}
```

### Amount Format
- **Tiyin** is UZS smallest unit (1 UZS = 100 tiyin)
- Cart total conversion:
  - Medusa stores in cents: `$15.00 = 1500 cents`
  - Convert to UZS: `1500 / 100 * 12750 = 191,250 UZS`
  - Convert to tiyin: `191,250 * 100 = 19,125,000 tiyin`
  - **Formula**: `tiyin = cart_total_cents * exchange_rate`
  - **Simplified**: `tiyin = cart_total_cents * 127.5` (for rate 12750)

## 🔧 Debugging Checklist

- [ ] **Got Payme credentials** from test.paycom.uz or business.paycom.uz
- [ ] **Found backend directory** (urgaztest)
- [ ] **Updated .env file** with PAYME_MERCHANT_ID and PAYME_SECRET_KEY
- [ ] **Restarted backend** (npm run dev)
- [ ] **Tested with curl** - got receiptId instead of error
- [ ] **Amount is in tiyin** (automatically handled by storefront now)
- [ ] **Using correct API URL** for your credential type (test vs production)

## 🎯 Quick Reference

| Item | Test | Production |
|------|------|------------|
| Dashboard | https://test.paycom.uz/ | https://business.paycom.uz/ |
| API URL | https://checkout.test.paycom.uz/api | https://checkout.paycom.uz/api |
| Credentials | From test dashboard | From business dashboard |
| Test Card | 8600 0000 0000 0000 | Real cards only |

## ⚠️ Important Notes

1. **Test and production credentials are COMPLETELY DIFFERENT**
   - You can't use test credentials in production
   - You can't use production credentials in test environment

2. **Merchant ID format**
   - Usually starts with underscore: `_123456789`
   - Copy it exactly as shown in dashboard

3. **Backend must be restarted**
   - Environment variables only load on startup
   - After changing .env, always restart: `npm run dev`

4. **Amount conversion is now automatic**
   - Storefront converts cart total → tiyin
   - Formula: `cart_total_cents * 127.5 = tiyin`
   - Example: $15 (1500 cents) = 19,125,000 tiyin = 191,250 UZS

## 🆘 Still Getting Error -32504?

### Check Backend Logs
The backend console should show what's being sent to Payme:
```bash
# Watch backend terminal while testing checkout
# You should see the Payme API request/response
```

### Verify Environment Variables Loaded
```bash
# In backend directory
node -e "console.log('PAYME_MERCHANT_ID:', process.env.PAYME_MERCHANT_ID)"
node -e "console.log('PAYME_SECRET_KEY:', process.env.PAYME_SECRET_KEY)"
```

If these show `undefined`, the .env file isn't being loaded!

### Check Backend Implementation
Make sure the backend code:
1. Uses HTTP Basic Auth: `Authorization: Basic base64(merchant_id:secret_key)`
2. Sends JSON-RPC format with `receipts.create` method
3. Amount is in tiyin (integer)
4. Includes account.order_id in params

### Contact Payme Support
If credentials are definitely correct but still not working:
- Email: support@paycom.uz
- Provide your merchant ID
- Describe the exact error you're getting

## ✅ Expected Behavior When Working

1. Select Payme in checkout
2. Click "Continue to review"
3. See loading state
4. Automatically redirect to `checkout.paycom.uz/{receiptId}`
5. Enter test card: **8600 0000 0000 0000**
6. Complete payment
7. Return to your site

---

**Bottom line**: You need valid Payme merchant credentials in your backend `.env` file. Register at https://test.paycom.uz/ to get them!

1. **Get valid Payme credentials** (see above)

2. **Update backend .env file** in the urgaztest directory:
   ```bash
   cd /path/to/urgaztest
   nano .env  # or use your preferred editor
   ```

3. **Add or update these lines**:
   ```bash
   PAYME_MERCHANT_ID=your_actual_merchant_id
   PAYME_AUTH=Paycom:your_actual_secret_key
   PAYME_API_URL=https://checkout.test.paycom.uz/api
   ```

4. **Restart the backend**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Test again** in the storefront checkout

## Verification Steps

After updating credentials, test with curl:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-publishable-api-key: pk_fe768fd98de7445ef718c37c9f15616430e92f90bf71aafb27d249faed5e158b" \
  -d '{
    "amount": 100000,
    "orderId": "test-order-123",
    "return_url": "http://localhost:8000/uz"
  }' \
  http://localhost:9000/store/custom
```

**Expected success response**:
```json
{
  "receiptId": "_abc123xyz456..."
}
```

**If still getting errors**, check:
- Merchant ID format is correct (usually starts with underscore)
- AUTH string format: `Paycom:secret_key` (exactly this format)
- Using correct API URL for your environment (test vs production)
- Backend service restarted after .env changes

## Test vs Production Environments

| Environment | API URL | Credentials |
|------------|---------|-------------|
| Test | `https://checkout.test.paycom.uz/api` | From test.paycom.uz |
| Production | `https://checkout.paycom.uz/api` | From business.paycom.uz |

**Note**: Test and production use completely different merchant IDs and credentials!

## Common Mistakes

1. ❌ Using production credentials with test API URL
2. ❌ Using test credentials with production API URL  
3. ❌ Wrong AUTH format (should be `Paycom:secret`, not just `secret`)
4. ❌ Merchant ID typo or missing underscore prefix
5. ❌ Not restarting backend after .env changes

## Next Steps

1. Verify backend has valid Payme credentials
2. Make sure you're using the correct environment (test vs production)
3. Restart both backend and frontend
4. Test the checkout flow again

If you don't have Payme credentials yet, you need to register at:
- Test: https://test.paycom.uz/
- Production: https://business.paycom.uz/
