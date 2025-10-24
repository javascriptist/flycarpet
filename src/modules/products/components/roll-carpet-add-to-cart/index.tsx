import React, { useState } from 'react';
import { Button } from "@medusajs/ui";
import { convertUsdToUzs, formatUzsAmount } from "@lib/util/money";

interface RollCarpetAddToCartProps {
  product: any;
  customLength: number;
  totalPrice: number;
  countryCode?: string;
  exchangeRate?: number;
  cartId?: string;
  onSuccess?: () => void;
}

export const RollCarpetAddToCart: React.FC<RollCarpetAddToCartProps> = ({
  product,
  customLength,
  totalPrice,
  countryCode,
  exchangeRate,
  cartId,
  onSuccess
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [customerNote, setCustomerNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isLang = countryCode === "uz";

  const formatPrice = (price: number) => {
    if (exchangeRate && countryCode === "uz") {
      const uzsAmount = convertUsdToUzs(price, exchangeRate);
      return formatUzsAmount(uzsAmount);
    }
    return `$${price.toFixed(2)}`;
  };

  const handleAddToCart = async () => {
    if (!customLength || customLength <= 0) {
      setError(isLang ? "Iltimos, to'g'ri uzunlik kiriting" : "Пожалуйста, введите правильную длину");
      return;
    }

    if (!cartId) {
      setError(isLang ? "Savatcha mavjud emas" : "Корзина недоступна");
      return;
    }

    setIsAdding(true);
    setError(null);
    
    try {
      console.log('Attempting to add carpet to cart:', {
        cartId,
        productId: product.id,
        length: customLength,
        customerNote
      });

      const response = await fetch('/api/store/cart/custom-carpet', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
        },
        body: JSON.stringify({
          cartId: cartId,
          productId: product.id,
          length: customLength,
          quantity: 1,
          customerNote: customerNote,
          metadata: {
            carpet_type: "roll_custom",
            custom_length: customLength,
            customer_specifications: customerNote
          }
        })
      });

      console.log('API Response status:', response.status);
      console.log('API Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add to cart');
      }
      
      const data = await response.json();
      if (data.success) {
        onSuccess?.();
        
        // Reset form
        setCustomerNote("");
        
        // Show success in a better way
        setError(null);
        
        // Reload the page to refresh cart
        window.location.reload();
      } else {
        throw new Error(data.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      setError(isLang 
        ? "Gilamni savatchaga qo'shishda xatolik" 
        : "Ошибка при добавлении ковра в корзину"
      );
    } finally {
      setIsAdding(false);
    }
  };

  const isDisabled = isAdding || !customLength || customLength <= 0;

  return (
    <div className="roll-carpet-add-to-cart">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          {isLang 
            ? "Maxsus talablar (ixtiyoriy):" 
            : "Особые требования (необязательно):"
          }
        </label>
        <textarea
          value={customerNote}
          onChange={(e) => setCustomerNote(e.target.value)}
          placeholder={isLang 
            ? "Har qanday maxsus talablar yoki izohlar..." 
            : "Любые особые требования или примечания..."
          }
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <Button
        onClick={handleAddToCart}
        disabled={isDisabled}
        size="large"
        className={`w-full ${
          isDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isAdding 
          ? (isLang ? "Savatchaga qo'shilmoqda..." : "Добавляется в корзину...")
          : (isLang 
              ? `${customLength}m gilam qo'shish - ${formatPrice(totalPrice)}`
              : `Добавить ковер ${customLength}м - ${formatPrice(totalPrice)}`
            )
        }
      </Button>
    </div>
  );
};