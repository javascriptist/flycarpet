# Payme.uz Integration Setup Guide

## Overview
Your storefront has Payme integration code ready. You need to set up the backend API in your Medusa server.

## Backend Setup (Medusa Server)

### 1. Install Payme SDK
In your Medusa backend project:
```bash
npm install @paycom/checkout-sdk
# or
yarn add @paycom/checkout-sdk
```

### 2. Add Environment Variables
Add these to your Medusa backend `.env` file:

```env
# Payme Configuration
PAYME_MERCHANT_ID=your_merchant_id_here
PAYME_SECRET_KEY=your_secret_key_here
PAYME_ENABLED=true
```

Get these credentials from: https://checkout.paycom.uz/

### 3. Create Custom API Route

Create a file in your Medusa backend: `src/api/store/custom/route.ts`

```typescript
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { Checkout } from "@paycom/checkout-sdk"

// GET /store/custom - Check Payme status
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const paymeEnabled = process.env.PAYME_ENABLED === "true"
  
  res.json({
    status: "ok",
    paymeEnabled,
  })
}

// POST /store/custom - Create Payme receipt
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const paymeEnabled = process.env.PAYME_ENABLED === "true"
    
    if (!paymeEnabled) {
      return res.status(503).json({
        message: "Payme is not enabled",
      })
    }

    const { amount, orderId, returnUrl } = req.body

    if (!amount || !orderId) {
      return res.status(400).json({
        message: "Missing required fields: amount, orderId",
      })
    }

    // Initialize Payme Checkout
    const checkout = new Checkout(
      process.env.PAYME_MERCHANT_ID!,
      process.env.PAYME_SECRET_KEY!
    )

    // Create receipt
    const receipt = await checkout.createReceipt({
      amount: amount, // Amount in UZS (integer)
      order: orderId,
      return_url: returnUrl || process.env.STORE_URL,
    })

    res.json({
      success: true,
      raw: receipt,
    })
  } catch (error: any) {
    console.error("Payme receipt creation error:", error)
    res.status(500).json({
      message: error.message || "Failed to create Payme receipt",
    })
  }
}
```

### 4. Alternative: Without SDK

If you prefer to use direct API calls without the SDK:

```typescript
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import crypto from "crypto"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { amount, orderId, returnUrl } = req.body
    const merchantId = process.env.PAYME_MERCHANT_ID!
    const secretKey = process.env.PAYME_SECRET_KEY!

    // Generate authorization header
    const auth = Buffer.from(`${merchantId}:${secretKey}`).toString("base64")

    // Payme API request
    const paymeResponse = await fetch("https://checkout.paycom.uz/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        method: "receipts.create",
        params: {
          amount: amount,
          account: {
            order_id: orderId,
          },
        },
      }),
    })

    const result = await paymeResponse.json()

    if (result.error) {
      throw new Error(result.error.message || "Payme API error")
    }

    res.json({
      success: true,
      raw: result,
    })
  } catch (error: any) {
    console.error("Payme error:", error)
    res.status(500).json({
      message: error.message || "Failed to create Payme receipt",
    })
  }
}
```

## Storefront Configuration

### Update Environment Variables

Add to your storefront `.env`:

```env
# Payme is enabled via backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:9000
```

The `NEXT_PUBLIC_API_BASE_URL` should point to your Medusa backend.

## Payment Flow

1. **Customer selects Payme** in checkout
2. **Storefront calls** `POST /store/custom` with order amount and ID
3. **Backend creates** Payme receipt and returns receipt ID
4. **Storefront redirects** customer to `https://checkout.paycom.uz/{receiptId}`
5. **Customer pays** on Payme.uz website
6. **Payme redirects** back to your store with payment result
7. **Order is completed** in Medusa

## Testing

### Test Credentials
Payme provides test credentials for development:
- Test merchant ID and keys available at: https://developer.paycom.uz/

### Test Flow
1. Enable Payme in backend: `PAYME_ENABLED=true`
2. Add your test credentials
3. Go through checkout and select Payme
4. You'll be redirected to Payme's test environment
5. Use test card numbers provided by Payme

## Production Checklist

- [ ] Get production credentials from Payme.uz
- [ ] Update `PAYME_MERCHANT_ID` and `PAYME_SECRET_KEY` in production
- [ ] Set `PAYME_ENABLED=true` in production
- [ ] Test full payment flow
- [ ] Configure webhook for payment confirmations (optional but recommended)

## Webhook Setup (Recommended)

For production, you should set up webhooks to receive payment confirmations:

Create `src/api/webhooks/payme/route.ts` in your Medusa backend:

```typescript
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  // Verify webhook signature
  // Update order status based on payment confirmation
  // See Payme documentation for webhook payload structure
  
  res.json({ success: true })
}
```

## Support

- Payme.uz Documentation: https://developer.paycom.uz/
- Payme.uz Support: https://help.paycom.uz/
- Merchant Dashboard: https://checkout.paycom.uz/

## Current Implementation Status

✅ Storefront UI ready (payment selection, redirect logic)  
✅ Client-side Payme integration code  
⏳ Backend API endpoint (needs to be created)  
⏳ Payme merchant account credentials (needs to be obtained)  

Once you create the backend API endpoint and add your Payme credentials, the payment option will work automatically!
