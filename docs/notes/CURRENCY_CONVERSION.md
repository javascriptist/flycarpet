# Currency Conversion: USD to UZS

This storefront automatically converts all USD prices to Uzbek Som (UZS) using a live exchange rate from your backend API.

## How It Works

### Exchange Rate API
The exchange rate is fetched from your Medusa backend:
```
GET http://localhost:9000/store/exchange-rate
```

Response:
```json
{
  "rate": 12750,
  "currency_from": "USD",
  "currency_to": "UZS",
  "updated_at": "2025-10-02T..."
}
```

### Caching
- Exchange rates are cached for **1 hour** to reduce API calls
- If the API fails, the last cached rate is used
- Fallback rate: **12750** UZS per USD

### Where Prices Are Converted

All price displays across the site show UZS when the backend currency is USD:

1. **Product Pages**
   - Product detail price (`ProductPrice`)
   - Variant prices

2. **Product Listings**
   - Product preview cards (`PreviewPrice`)
   - All store/category/collection grids

3. **Cart**
   - Line item prices
   - Unit prices
   - Subtotals and totals

4. **Checkout**
   - Cart summary sidebar
   - Review page totals

5. **Order Confirmation**
   - Final order totals

### Conversion Logic

```typescript
// USD cents → UZS (whole numbers)
const usdDollars = usdCents
const uzsAmount = Math.round(usdDollars * exchangeRate)
```

Example:
- USD: $50.00 (5000 cents)
- Rate: 12750
- UZS: 637,500 so'm

### Display Format

UZS amounts are formatted with:
- Thousand separators
- No decimal places (whole numbers only)
- " so'm" suffix

Example: `637 500 so'm`

## Files Modified

### Core Utilities
- `src/lib/data/exchange-rate.ts` - API client with caching
- `src/lib/util/money.ts` - `formatUzsAmount()` formatter

### Components Updated
- `src/modules/products/components/product-price/index.tsx`
- `src/modules/products/components/product-preview/price.tsx`
- `src/modules/common/components/line-item-price/index.tsx`
- `src/modules/common/components/line-item-unit-price/index.tsx`
- `src/modules/common/components/cart-totals/index.tsx`
- `src/modules/cart/components/item/index.tsx`
- `src/modules/cart/templates/items.tsx`
- `src/modules/cart/templates/preview.tsx`
- `src/modules/cart/templates/summary.tsx`
- `src/modules/cart/templates/index.tsx`
- `src/modules/checkout/templates/checkout-summary/index.tsx`

### Pages Updated
- `src/app/[countryCode]/(main)/cart/page.tsx`

## Testing

1. **Check exchange rate endpoint:**
   ```bash
   curl http://localhost:9000/store/exchange-rate
   ```

2. **Verify conversion on storefront:**
   - Browse products - prices should show in UZS
   - Add to cart - cart totals in UZS
   - Go through checkout - all amounts in UZS

3. **Test rate updates:**
   - Change the rate on backend
   - Wait 1 hour or restart dev server
   - Prices should reflect new rate

## Fallback Behavior

If the exchange rate API is unreachable:
- Uses last cached rate (up to 1 hour old)
- If no cache exists, uses fallback: **12750**
- Logs error to console but continues working

## Future Enhancements

- Real-time rate updates without page reload
- Admin UI to view/override current rate
- Support for other currencies (EUR, RUB, etc.)
- Historical rate tracking
