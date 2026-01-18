export interface Voucher {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount: number;
}

export const AVAILABLE_VOUCHERS: Voucher[] = [
  { code: 'WELCOME10', discount: 10, type: 'percentage', minAmount: 50 },
  { code: 'SAVE20', discount: 20, type: 'percentage', minAmount: 100 },
  { code: 'FREESHIP', discount: 5, type: 'fixed', minAmount: 10 },
  { code: 'VIP50', discount: 50, type: 'fixed', minAmount: 200 },
];

export function findVoucherByCode(code: string): Voucher | undefined {
  return AVAILABLE_VOUCHERS.find(v => v.code.toUpperCase() === code.toUpperCase());
}
