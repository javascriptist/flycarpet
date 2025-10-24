# Quick Start: Enable Payme Payment

## What You Have Now ✅
- ✅ Storefront UI ready for Payme
- ✅ Client code that handles Payme payments
- ✅ Automatic detection of Payme availability

## What's Missing ⏳
The backend API that connects to Payme.uz

## Quick Setup (3 Steps)

### Step 1: Get Payme Credentials
1. Go to https://business.payme.uz/
2. Register as a merchant
3. Get your **Merchant ID** and **Secret Key**

### Step 2: Create Backend API

In your **Medusa backend** project, create this file:

**File:** `src/api/store/custom/route.ts`

```typescript
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

// Check if Payme is enabled
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.json({
    status: "ok",
    paymeEnabled: process.env.PAYME_ENABLED === "true",
  })
}

// Create Payme receipt
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { amount, orderId, returnUrl } = req.body
    const merchantId = process.env.PAYME_MERCHANT_ID
    const secretKey = process.env.PAYME_SECRET_KEY

    if (!merchantId || !secretKey) {
      return res.status(503).json({ message: "Payme not configured" })
    }

    // Call Payme API
    const auth = Buffer.from(`${merchantId}:${secretKey}`).toString("base64")
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
          account: { order_id: orderId },
        },
      }),
    })

    const result = await paymeResponse.json()
    
    if (result.error) {
      throw new Error(result.error.message)
    }

    res.json({ success: true, raw: result })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
```

### Step 3: Add Environment Variables

In your **Medusa backend** `.env` file:

```env
PAYME_ENABLED=true
PAYME_MERCHANT_ID=your_merchant_id_here
PAYME_SECRET_KEY=your_secret_key_here
```

In your **storefront** `.env` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:9000
```

## That's It! 🎉

Restart both servers and Payme will appear as a payment option in checkout!

## How It Works

1. Customer goes to checkout
2. Storefront checks `GET /store/custom` → sees `paymeEnabled: true`
3. Payme appears as payment option
4. Customer selects Payme and clicks continue
5. Storefront calls `POST /store/custom` with amount
6. Backend creates Payme receipt
7. Customer redirected to Payme.uz to pay
8. After payment, customer returns to your store
9. Order is completed!

## Testing

Use Payme test credentials for development (get from Payme.uz documentation).

## Need Help?

- See `PAYME_SETUP.md` for detailed documentation
- Payme.uz docs: https://developer.paycom.uz/
- Contact Payme.uz support for merchant account setup
