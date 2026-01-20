import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency formatting utility for VNĐ
export const formatCurrency = (amount: number): string => {
  return `${amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫`;
};

// Format for display with proper spacing
export const formatPrice = (amount: number): string => {
  return formatCurrency(amount);
};

export const decodeImageUrl = (url: string): string => {
  if (!url) return '';
  return url.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
};