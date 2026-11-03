# Roll Carpet Test Instructions

## 🧪 **How to Test the Roll Carpet System**

### **Step 1: Create a Test Product**

1. **Go to your Medusa Admin** (http://localhost:7001)
2. **Create or Edit a Product**
3. **Add this to the product metadata**:

```json
{
  "attributes": {
    "carpet_type": "roll",
    "width": "3m", 
    "length": "50m"
  }
}
```

### **Step 2: Test the Frontend**

1. **Visit the product page**: `http://localhost:3000/uz/products/[product-handle]`
2. **You should see**:
   - Custom length input field instead of regular "Add to Cart"
   - Live price calculation as you type
   - Area calculation (width × length)
   - Special instructions field
   - Custom "Add to Cart" button with length

### **Step 3: Verify Detection**

The system detects roll carpets using this logic:
```typescript
// In carpet-helpers.ts
export const isRollCarpet = (product: any): boolean => {
  return product?.metadata?.attributes?.carpet_type === "roll";
};
```

### **Step 4: Debug if Not Working**

If the custom selector doesn't appear:

1. **Check product metadata** - Make sure `carpet_type: "roll"` is set
2. **Check browser console** for any JavaScript errors
3. **Verify the product structure** by logging:

```javascript
// Add this to EnhancedProductActions temporarily
console.log('Product metadata:', product?.metadata)
console.log('Is roll carpet:', isRollCarpet(product))
```

### **Expected Behavior:**

- **Regular products**: Show normal add to cart button
- **Roll carpets**: Show custom length selector with live pricing
- **Both**: Maintain full Uzbek/Russian translation support
- **Both**: Show prices in UZS with USD tooltips

---

## 🔍 **Alternative Test Method**

If you can't access admin, you can modify the detection temporarily:

```typescript
// In enhanced-product-actions/index.tsx
// Replace this line:
const isRoll = isRollCarpet(product)

// With this for testing:
const isRoll = product.handle === "test-carpet" // Replace with your product handle
```

This will force the roll carpet interface for that specific product.