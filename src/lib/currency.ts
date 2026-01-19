// Currency formatting utility for VNĐ
export const formatCurrency = (amount: number): string => {
  return `${amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫`;
};

// Format for display with proper spacing
export const formatPrice = (amount: number): string => {
  return formatCurrency(amount);
};
