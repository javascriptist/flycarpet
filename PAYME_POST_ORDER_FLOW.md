# Payme Post-Order Payment Flow

## Overview

Payme payment now happens **AFTER** order creation, allowing proper tracking of `order_id` and `amount` in the backend webhook.

## Payment Flow

### Old Flow (Before)
```
Checkout → Select Payme → Pay immediately → Order created → Confirmation
```

**Problem:** Backend webhook received payment without knowing which order it belongs to.

### New Flow (After)
```
Checkout → Select Payme → Review → Place Order (creates unpaid order) → 
Confirmation page → OrderPaymeButton → Generate payment link → 
Redirect to Payme → Pay → Webhook updates order → Return to confirmation
```

**Benefits:**
- ✅ Order created first → Backend has `order_id` before payment
- ✅ Payment link includes `order_id` → Perfect tracking
- ✅ User can return to pay later if needed
- ✅ Webhook receives clear `order_id` and `amount` mapping
- ✅ Better handling of failed/incomplete payments

## Implementation Details

### 1. Order Confirmation Page

**File:** `src/modules/order/templates/order-completed-template.tsx`

Shows payment button on confirmation page:

```tsx
<OrderPaymeButton 
  orderId={order.id}
  amount={order.total || 0}
  countryCode={countryCode}
  paymentStatus={order.payment_status}
/>
```

### 2. Payment Button Component

**File:** `src/modules/order/components/order-payme-button/index.tsx`

Features:
- Checks if order already paid → Shows "Payment received" badge
- Generates payment link via `/admin/payme-generate-link`
- Passes `orderId` and `amount` to backend
- Redirects to Payme payment page
- Includes callback URL to return to confirmation page
- Multilingual (uz/ru)
- Error handling and loading states

### 3. Checkout Payment Button

**File:** `src/modules/checkout/components/payment-button/index.tsx`

Updated to handle Payme:

```tsx
case isPayme(paymentSession?.provider_id):
  // Payme payment happens AFTER order creation on confirmation page
  return <ManualTestPaymentButton notReady={notReady} countryCode={countryCode} />
```

This treats Payme like manual payment - just creates the order without immediate payment.

### 4. Backend Integration

**Endpoint:** `/admin/payme-generate-link`

Request:
```json
{
  "orderId": "order_01...",
  "amount": 50000,
  "callbackUrl": "https://urgaz.uz/uz/order/confirmed/order_01..."
}
```

Response:
```json
{
  "paymentUrl": "https://checkout.paycom.uz/..."
}
```

**Webhook:** `/admin/payme-webhook`

Receives JSON-RPC calls from Payme with `order_id` in transaction params:
```json
{
  "method": "CheckPerformTransaction",
  "params": {
    "account": {
      "order_id": "order_01..."
    },
    "amount": 5000000
  }
}
```

Backend can now properly map payment to order!

## Payment Status

The order's `payment_status` field tracks payment state:

- **`not_paid`**: Order created, awaiting payment (shows payment button)
- **`captured` / `paid`**: Payment completed (shows success badge)
- **`awaiting`**: Payment processing
- **`canceled`**: Payment failed/canceled

## User Experience

### Happy Path:
1. User adds items to cart
2. Goes through checkout
3. Selects "Payme" payment method
4. Clicks "Buyurtma berish" (Place Order)
5. Sees "Thank you! Your order was placed successfully"
6. Sees blue "Pay with Payme" button
7. Clicks button → Redirected to Payme
8. Completes payment
9. Returns to confirmation page
10. Sees "✓ Payment received" badge

### Payment Later:
1. User places order but doesn't pay immediately
2. Closes browser
3. Later finds order in "My Orders" section
4. Clicks on order → Goes to order details
5. If unpaid, sees payment button
6. Can complete payment anytime

### Failed Payment:
1. User clicks "Pay with Payme"
2. Gets redirected to Payme
3. Payment fails or user cancels
4. Returns to confirmation page
5. Payment button still available
6. Can try again

## Testing Checklist

- [ ] Create order with Payme payment method
- [ ] Verify order is created immediately (even before payment)
- [ ] Check confirmation page shows OrderPaymeButton
- [ ] Click "Pay with Payme" → Redirects to Payme correctly
- [ ] Complete test payment on Payme
- [ ] Verify webhook receives order_id and amount
- [ ] Check order payment_status updates to "captured"
- [ ] Verify confirmation page now shows "Payment received" badge
- [ ] Test payment cancellation (button should remain)
- [ ] Test returning to unpaid order later (button should work)

## Environment Variables

Required in `.env`:

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_PAYME_MERCHANT_ID=your_merchant_id
```

## Files Modified

### Created:
- `src/modules/order/components/order-payme-button/index.tsx`

### Updated:
- `src/modules/order/templates/order-completed-template.tsx`
- `src/modules/checkout/components/payment-button/index.tsx`

### Already Existing:
- `src/lib/constants.tsx` (has `isPayme()` helper)
- Backend endpoints: `/admin/payme-generate-link`, `/admin/payme-webhook`

## Notes

- Payment provider ID must start with `pp_payme_` (e.g., `pp_payme_custom`)
- Backend must be running for payment link generation
- Webhook must be configured in Payme merchant dashboard
- Orders can exist in "not_paid" state indefinitely
- Users can have multiple unpaid orders

## Related Documentation

- `PAYME_FINAL_STATUS.md` - Overall Payme integration status
- `PAYME_MERCHANT_TODO.md` - Backend implementation guide
- `PAYME_FRONTEND_COMPLETE.md` - Frontend integration details
- `ENV_SETUP.md` - Environment variable setup

## Status

✅ **COMPLETE** - Ready for testing (October 27, 2025)
