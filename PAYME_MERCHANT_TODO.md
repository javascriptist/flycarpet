# Payme Merchant API - What's Left To Do

## 📊 Current Status Overview

### ✅ Frontend (Storefront) - COMPLETE
- PaymeContainer with native form ✅
- PaymeMerchantButton component ✅  
- Official Payme button (CDN) ✅
- Liquid glass styling ✅
- Currency conversion ✅
- Error handling ✅

### ⚠️ Backend (Medusa) - INCOMPLETE

The frontend is calling this endpoint, but it doesn't exist yet:
```
POST /store/payme-merchant/generate-link
```

## 🎯 What You Need to Build in Backend

### 1. Payment Link Generator Endpoint

**File to create:** `backend/src/api/admin/payme-generate-link/route.ts`

**Purpose:** Generate Payme checkout URL for the customer

**✨ Uses /admin route - NO publishable key needed!**

**Request:**
```typescript
POST /admin/payme-generate-link
Headers:
  Content-Type: application/json

Body:
{
  "orderId": "cart_01HXXX",
  "amount": 5000,  // in cents (USD)
  "callbackUrl": "https://yoursite.com/order/confirmed?order_id=cart_01HXXX"
}
```

**Response:**
```typescript
{
  "success": true,
  "paymentUrl": "https://checkout.payme.uz/?params...",
  "orderId": "cart_01HXXX",
  "amount": 5000
}
```

**Implementation Required:**
1. Validate order exists
2. Convert amount: USD cents → UZS tiyin
3. Get exchange rate (from your existing API)
4. Generate Payme checkout URL (GET method with base64)
5. Return payment URL to frontend

### 2. Billing Endpoint (Merchant API)

**File to create:** `backend/src/api/store/payme-merchant/route.ts`

**Purpose:** Receive Payme's JSON-RPC calls during payment processing

**Methods to implement:**
```typescript
// 1. CheckPerformTransaction - Verify order can be paid
{
  "method": "CheckPerformTransaction",
  "params": {
    "account": { "order_id": "cart_01HXXX" },
    "amount": 5000000  // in tiyin
  }
}

// 2. CreateTransaction - Reserve payment
{
  "method": "CreateTransaction",
  "params": {
    "id": "transaction_id_from_payme",
    "account": { "order_id": "cart_01HXXX" },
    "amount": 5000000,
    "time": 1698765432000
  }
}

// 3. PerformTransaction - Complete payment
{
  "method": "PerformTransaction",
  "params": {
    "id": "transaction_id_from_payme"
  }
}

// 4. CancelTransaction - Cancel payment
{
  "method": "CancelTransaction",
  "params": {
    "id": "transaction_id_from_payme",
    "reason": 1
  }
}

// 5. CheckTransaction - Check payment status
{
  "method": "CheckTransaction",
  "params": {
    "id": "transaction_id_from_payme"
  }
}
```

**Implementation Required:**
1. Parse JSON-RPC request
2. Verify Payme credentials (HTTP Basic Auth)
3. Handle each method:
   - CheckPerformTransaction: Validate order exists and amount matches
   - CreateTransaction: Store transaction, mark order as "processing"
   - PerformTransaction: Mark order as "paid", complete checkout
   - CancelTransaction: Refund/cancel order
   - CheckTransaction: Return transaction status
4. Return JSON-RPC response
5. Store transactions (in-memory or database)

## 🔧 Backend Setup Steps

### Step 1: Install Dependencies (if needed)
```bash
cd backend
npm install axios
```

### Step 2: Add Environment Variables

Edit `backend/.env`:
```bash
# Payme Merchant Credentials
PAYME_MERCHANT_ID=68f905fd33df8ed4e617e169
PAYME_MERCHANT_KEY=your_secret_key_here

# Get exchange rate API (if not already set)
EXCHANGE_RATE_API_URL=https://your-api/exchange-rate
```

### Step 3: Create Transaction Store

**File:** `backend/src/services/payme-transaction.ts`

```typescript
// Simple in-memory store (for production use database!)
export class PaymeTransactionStore {
  private transactions = new Map()
  
  create(id: string, data: any) {
    this.transactions.set(id, {
      ...data,
      state: 1, // Created
      create_time: Date.now()
    })
  }
  
  perform(id: string) {
    const tx = this.transactions.get(id)
    if (tx) {
      tx.state = 2 // Performed
      tx.perform_time = Date.now()
    }
  }
  
  cancel(id: string, reason: number) {
    const tx = this.transactions.get(id)
    if (tx) {
      tx.state = -1 // Cancelled
      tx.cancel_time = Date.now()
      tx.reason = reason
    }
  }
  
  get(id: string) {
    return this.transactions.get(id)
  }
}
```

### Step 3: Create Generate Link Endpoint

**File:** `backend/src/api/admin/payme-generate-link/route.ts`

```typescript
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { getExchangeRate } from "../../../../utils/exchange-rate"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { orderId, amount, callbackUrl } = req.body
    
    // 1. Validate inputs
    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        error: "Missing orderId or amount"
      })
    }
    
    // 2. Get exchange rate
    const rate = await getExchangeRate() // Your existing function
    
    // 3. Convert USD cents to UZS tiyin
    const amountInTiyin = Math.round(amount * rate)
    
    // 4. Build Payme checkout URL
    const merchantId = process.env.PAYME_MERCHANT_ID
    
    const params = [
      `m=${merchantId}`,
      `ac.order_id=${orderId}`,
      `a=${amountInTiyin}`,
      `l=uz`
    ]
    
    if (callbackUrl) {
      params.push(`c=${encodeURIComponent(callbackUrl)}`)
    }
    
    const paramsString = params.join(";")
    const base64Params = Buffer.from(paramsString).toString("base64")
    const paymentUrl = `https://checkout.paycom.uz/${base64Params}`
    
    // 5. Return payment URL
    res.status(200).json({
      success: true,
      paymentUrl,
      orderId,
      amount
    })
    
  } catch (error) {
    console.error("Payme generate-link error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to generate payment link"
    })
  }
}
```

### Step 5: Create Billing Endpoint

**File:** `backend/src/api/store/payme-merchant/route.ts`

**OR if your webhook is at:**  
`backend/src/api/admin/payme-webhook/route.ts`

**✅ You already have this!** This is your working webhook that handles:
- CheckPerformTransaction
- CreateTransaction
- PerformTransaction  
- CancelTransaction
- CheckTransaction

**No changes needed here!**

```typescript
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { PaymeTransactionStore } from "../../../services/payme-transaction"

const transactionStore = new PaymeTransactionStore()

// Payme error codes
const ERRORS = {
  INVALID_AMOUNT: { code: -31001, message: "Invalid amount" },
  ORDER_NOT_FOUND: { code: -31050, message: "Order not found" },
  TRANSACTION_NOT_FOUND: { code: -31003, message: "Transaction not found" },
  CANNOT_PERFORM: { code: -31008, message: "Cannot perform transaction" }
}

function verifyAuth(req: MedusaRequest): boolean {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Basic ')) return false
  
  const credentials = Buffer.from(auth.slice(6), 'base64').toString()
  const [username, password] = credentials.split(':')
  
  return username === process.env.PAYME_MERCHANT_ID && 
         password === process.env.PAYME_MERCHANT_KEY
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    // 1. Verify authentication
    if (!verifyAuth(req)) {
      return res.status(200).json({
        id: req.body.id,
        error: { code: -32504, message: "Insufficient privileges" }
      })
    }
    
    const { method, params, id } = req.body
    
    // 2. Handle each method
    switch (method) {
      case "CheckPerformTransaction":
        return handleCheckPerform(req, res, params, id)
        
      case "CreateTransaction":
        return handleCreateTransaction(req, res, params, id)
        
      case "PerformTransaction":
        return handlePerformTransaction(req, res, params, id)
        
      case "CancelTransaction":
        return handleCancelTransaction(req, res, params, id)
        
      case "CheckTransaction":
        return handleCheckTransaction(req, res, params, id)
        
      default:
        return res.status(200).json({
          id,
          error: { code: -32601, message: "Method not found" }
        })
    }
    
  } catch (error) {
    console.error("Payme billing endpoint error:", error)
    res.status(500).json({
      id: req.body.id,
      error: { code: -32400, message: "Internal error" }
    })
  }
}

async function handleCheckPerform(req, res, params, id) {
  const { account, amount } = params
  const orderId = account.order_id
  
  // TODO: Check if order exists in Medusa
  // const order = await getOrder(orderId)
  // if (!order) return error response
  
  // For now, accept all
  return res.status(200).json({
    id,
    result: { allow: true }
  })
}

async function handleCreateTransaction(req, res, params, id) {
  const { id: txId, account, amount, time } = params
  const orderId = account.order_id
  
  // Store transaction
  transactionStore.create(txId, {
    orderId,
    amount,
    time
  })
  
  return res.status(200).json({
    id,
    result: {
      transaction: txId,
      state: 1,
      create_time: Date.now()
    }
  })
}

async function handlePerformTransaction(req, res, params, id) {
  const { id: txId } = params
  
  const tx = transactionStore.get(txId)
  if (!tx) {
    return res.status(200).json({
      id,
      error: ERRORS.TRANSACTION_NOT_FOUND
    })
  }
  
  // Mark transaction as performed
  transactionStore.perform(txId)
  
  // TODO: Mark order as paid in Medusa
  // await completeOrder(tx.orderId)
  
  return res.status(200).json({
    id,
    result: {
      transaction: txId,
      state: 2,
      perform_time: Date.now()
    }
  })
}

async function handleCancelTransaction(req, res, params, id) {
  const { id: txId, reason } = params
  
  const tx = transactionStore.get(txId)
  if (!tx) {
    return res.status(200).json({
      id,
      error: ERRORS.TRANSACTION_NOT_FOUND
    })
  }
  
  transactionStore.cancel(txId, reason)
  
  // TODO: Cancel order in Medusa if needed
  
  return res.status(200).json({
    id,
    result: {
      transaction: txId,
      state: -1,
      cancel_time: Date.now()
    }
  })
}

async function handleCheckTransaction(req, res, params, id) {
  const { id: txId } = params
  
  const tx = transactionStore.get(txId)
  if (!tx) {
    return res.status(200).json({
      id,
      error: ERRORS.TRANSACTION_NOT_FOUND
    })
  }
  
  return res.status(200).json({
    id,
    result: {
      transaction: txId,
      state: tx.state,
      create_time: tx.create_time,
      perform_time: tx.perform_time || 0,
      cancel_time: tx.cancel_time || 0,
      reason: tx.reason || null
    }
  })
}
```

### Step 6: Configure Payme Dashboard

1. Go to: https://test.paycom.uz/ (or production)
2. Login to merchant account
3. Go to: **Настройки** → **Billing**
4. Set **Billing URL**: `https://your-ngrok-url/store/payme-merchant`
5. Click **Verify** to test connection
6. Save settings

## 🧪 Testing Checklist

### Backend Tests:

- [ ] **Generate Link Endpoint:**
  ```bash
  curl -X POST http://localhost:9000/admin/payme-generate-link \
    -H "Content-Type: application/json" \
    -d '{"orderId":"test-123","amount":5000}'
  ```
  Expected: `{ "success": true, "paymentUrl": "https://..." }`

- [ ] **Billing Endpoint - CheckPerformTransaction:**
  ```bash
  curl -X POST http://localhost:9000/store/payme-merchant \
    -u "68f905fd33df8ed4e617e169:your_key" \
    -H "Content-Type: application/json" \
    -d '{
      "id": 1,
      "method": "CheckPerformTransaction",
      "params": {
        "account": {"order_id": "test-123"},
        "amount": 5000000
      }
    }'
  ```
  Expected: `{ "id": 1, "result": { "allow": true } }`

### Integration Tests:

- [ ] Frontend → generate-link → Get payment URL
- [ ] Click payment button → Redirect to Payme
- [ ] Complete payment → Billing endpoint called
- [ ] Order marked as paid

## 📊 Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PaymeMerchantButton.tsx                                    │
│  ├─ onClick → fetch('/store/payme-merchant/generate-link') │
│  └─ window.location.href = paymentUrl                       │
│                                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ POST /generate-link
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Medusa)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  /store/payme-merchant/generate-link ⚠️ TO BUILD           │
│  ├─ Validate order                                          │
│  ├─ Convert USD → UZS                                       │
│  ├─ Build Payme URL (base64)                                │
│  └─ Return { paymentUrl }                                   │
│                                                             │
│  /store/payme-merchant ⚠️ TO BUILD                          │
│  ├─ Verify HTTP Basic Auth                                  │
│  ├─ CheckPerformTransaction                                 │
│  ├─ CreateTransaction                                       │
│  ├─ PerformTransaction → Mark order paid                    │
│  ├─ CancelTransaction                                       │
│  └─ CheckTransaction                                        │
│                                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Billing calls
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     PAYME SERVER                            │
│  - Processes payment                                        │
│  - Calls your billing endpoint                              │
│  - Sends transaction updates                                │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Priority Order

### Must Have (Critical):
1. ✅ `/store/payme-merchant/generate-link` - **Required for frontend to work**
2. ✅ `/store/payme-merchant` billing endpoint - **Required for payment completion**
3. ✅ Transaction storage (in-memory is okay for testing)
4. ✅ Order validation logic

### Should Have (Important):
5. Database storage for transactions (instead of in-memory)
6. Order status updates in Medusa
7. Email notifications on payment success
8. Error monitoring and logging

### Nice to Have (Optional):
9. Admin panel for transaction history
10. Refund handling
11. Payment analytics
12. Webhook retry logic

## 📝 Quick Start Command

```bash
# In your backend directory
cd backend

# Create the directory
mkdir -p src/api/admin/payme-generate-link

# Create the file (use code from BACKEND_generate-link-route.ts)
# Copy to: src/api/admin/payme-generate-link/route.ts

# Your webhook is already working at:
# src/api/admin/payme-webhook/route.ts ✅

# Restart backend
npm run dev
```

## 🔗 Useful Resources

- **Payme Merchant API Docs**: https://developer.help.paycom.uz/metody-merchant-api
- **Billing Endpoint Guide**: https://developer.help.paycom.uz/initsializatsiya-platezhey/billing
- **Test Dashboard**: https://test.paycom.uz/
- **Test Card**: 8600 0000 0000 0000
- **Test SMS Code**: 666666

## ✨ Summary

**Frontend:** ✅ Complete and ready  
**Backend:** ⚠️ Needs 2 endpoints + transaction storage  
**Estimated Time:** 2-4 hours for full implementation  
**Difficulty:** Medium (mainly JSON-RPC handling)

Once the backend endpoints are built, the entire flow will work end-to-end! 🚀
