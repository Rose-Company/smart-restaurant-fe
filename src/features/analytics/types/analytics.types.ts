export interface MetricCard {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  bgColor: string;
}

export interface BestSellingDish {
  id: number;
  name: string;
  orders: number;
  revenue: number;
  image: string;
}

export interface CategorySale {
  name: string;
  percentage: number;
  color: string;
}

export interface RevenueDataPoint {
  day: number;
  revenue: number;
}

export type DateRangeKey = 'today' | 'yesterday' | 'last7Days' | 'last30Days';
