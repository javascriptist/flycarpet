export async function convertUsdToUzs(usdAmount: number): Promise<number> {
  const apiUrl = 'https://cbu.uz/uz/arkhiv-kursov-valyut/json/';
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch exchange rates');
  }
  const data = await response.json();
  // Find USD rate (code: "USD")
  const usdRateObj = data.find((item: any) => item.Ccy === 'USD');
  if (!usdRateObj) {
    throw new Error('USD rate not found');
  }
  const usdToUzs = parseFloat(usdRateObj.Rate.replace(',', '.'));
  if (isNaN(usdToUzs)) {
    throw new Error('Invalid USD rate');
  }
  return Math.round(usdAmount * usdToUzs);
}

// make it look like this:calculated_price
// : 
// "$15.00"
// calculated_price_number
// : 
// 15
// currency_code
// : 
// "usd"
// original_price
// : 
// "$15.00"
// original_price_number
// : 
// 15
// percentage_diff
// : 
// "0"
// price_type
// : 
// null
export function formatPrice(price: number, currencyCode: string): {
  calculated_price: string;
  calculated_price_number: number;
  original_price: string;
  original_price_number: number;
  percentage_diff: string;
  price_type: string | null;
} {
  const formattedPrice = price.toFixed(2);
  return {
    calculated_price: `$${formattedPrice}`,
    calculated_price_number: price,
    original_price: `$${formattedPrice}`,
    original_price_number: price,
    percentage_diff: "0",
    price_type: null,
  };
}