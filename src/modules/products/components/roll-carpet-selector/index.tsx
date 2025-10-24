import React, { useState, useEffect } from 'react';
import { convertUsdToUzs, formatUzsAmount } from "@lib/util/money";
import { getCarpetWidth, formatCarpetDimensions } from "@lib/util/carpet-helpers";

interface RollCarpetSelectorProps {
  product: any;
  countryCode?: string;
  exchangeRate?: number;
  onPriceChange?: (price: number) => void;
  onLengthChange?: (length: number) => void;
}

export const RollCarpetSelector: React.FC<RollCarpetSelectorProps> = ({ 
  product, 
  countryCode,
  exchangeRate,
  onPriceChange,
  onLengthChange
}) => {
  const [customLength, setCustomLength] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const isLang = countryCode === "uz";
  const productPrice = product.variants?.[0]?.prices?.[0]?.amount || 4500; // cents
  const pricePerMeter = productPrice / 100; // convert to dollars
  const carpetWidth = getCarpetWidth(product);

  const calculatePrice = async () => {
    if (!customLength || customLength <= 0) return;
    
    setIsCalculating(true);
    try {
      // Try API calculation first
      const response = await fetch('/store/carpet-calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          length: customLength
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTotalPrice(data.data.pricing.total_price);
          onPriceChange?.(data.data.pricing.total_price);
          return;
        }
      }
    } catch (error) {
      console.error('API calculation failed:', error);
    }
    
    // Fallback calculation
    const fallbackPrice = pricePerMeter * customLength;
    setTotalPrice(fallbackPrice);
    onPriceChange?.(fallbackPrice);
    setIsCalculating(false);
  };

  useEffect(() => {
    calculatePrice();
    onLengthChange?.(customLength);
  }, [customLength]);

  const formatPrice = (price: number) => {
    if (exchangeRate && countryCode === "uz") {
      const uzsAmount = convertUsdToUzs(price, exchangeRate);
      return formatUzsAmount(uzsAmount);
    }
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="roll-carpet-selector border rounded-lg p-6 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        🎯 {isLang ? "Maxsus uzunlik gilam" : "Ковер на заказ по длине"}
      </h3>
      
      {/* Carpet Info */}
      <div className="mb-4 p-3 bg-white rounded border">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">
              {isLang ? "Eni:" : "Ширина:"}
            </span>
            <span className="ml-2 font-medium">{carpetWidth}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">
              {isLang ? "1 metr narxi:" : "Цена за метр:"}
            </span>
            <span className="ml-2 font-medium">{formatPrice(pricePerMeter)}</span>
          </div>
        </div>
      </div>

      {/* Length Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          {isLang ? "Uzunlikni kiriting (metr):" : "Введите длину (метр):"}
        </label>
        <input 
          type="number" 
          min="0.1"
          max="50"
          step="0.1"
          value={customLength}
          onChange={(e) => setCustomLength(parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={isLang ? "masalan, 7.5" : "например, 7.5"}
        />
        <small className="text-gray-500">
          {isLang 
            ? "Minimum 0.1m, Maksimum 50m" 
            : "Минимум 0.1м, Максимум 50м"
          }
        </small>
      </div>

      {/* Area Display */}
      {customLength > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {isLang ? "Umumiy maydon:" : "Общая площадь:"}
            </span>
            <span className="font-semibold">
              {(parseFloat(carpetWidth.replace('m', '')) * customLength).toFixed(1)} m²
            </span>
          </div>
        </div>
      )}

      {/* Price Display */}
      <div className="mb-4 p-4 bg-white border rounded">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold">
            {isLang ? "Umumiy narx:" : "Общая цена:"}
          </span>
          <span className="text-2xl font-bold text-green-600">
            {isCalculating 
              ? (isLang ? "Hisoblanmoqda..." : "Вычисляется...") 
              : formatPrice(totalPrice)
            }
          </span>
        </div>
        
        {customLength > 0 && !isCalculating && (
          <div className="text-sm text-gray-600">
            <div>
              {formatCarpetDimensions(carpetWidth, customLength)} = {formatPrice(pricePerMeter)} × {customLength} = {formatPrice(totalPrice)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};