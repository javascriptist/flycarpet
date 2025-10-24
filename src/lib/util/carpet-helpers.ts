// utils/carpetHelpers.ts
export const isRollCarpet = (product: any): boolean => {
  return product?.metadata?.attributes?.carpet_type === "roll";
};

export const getStockLength = (product: any): number => {
  return parseFloat(product?.metadata?.attributes?.stock_length || product?.metadata?.attributes?.length || "0");
};

export const getCarpetWidth = (product: any): string => {
  return product?.metadata?.attributes?.width || "3m";
};

export const formatCarpetDimensions = (width: string, length: number): string => {
  const widthNum = parseFloat(width.replace('m', ''));
  return `${width} × ${length}m = ${(widthNum * length).toFixed(1)} m²`;
};