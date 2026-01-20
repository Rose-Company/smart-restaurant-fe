import { BestSellingDish, CategorySale, RevenueDataPoint, DateRangeKey } from '../types/analytics.types';

// Data organized by date range
export const ANALYTICS_DATA_BY_RANGE = {
  today: {
    metrics: [
      { iconType: 'dollar', label: 'Total Revenue', value: '31,250,000', change: '+12%', isPositive: true, bgColor: '#00bc7d' },
      { iconType: 'cart', label: 'Total Orders', value: '45', change: '+8%', isPositive: true, bgColor: '#3b82f6' },
      { iconType: 'coins', label: 'Average Value', value: '695,000', change: '+3%', isPositive: true, bgColor: '#a855f7' }
    ],
    bestSellingDishes: [
      { id: 1, name: 'Ribeye Steak', orders: 12, revenue: 12600000, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400' },
      { id: 2, name: 'Grilled Salmon', orders: 10, revenue: 6250000, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400' },
      { id: 3, name: 'Margherita Pizza', orders: 8, revenue: 3300000, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
      { id: 4, name: 'Caesar Salad', orders: 7, revenue: 1850000, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400' },
      { id: 5, name: 'Tiramisu', orders: 8, revenue: 1700000, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' }
    ],
    categorySales: [
      { name: 'Main Course', percentage: 48, color: '#00bc7d' },
      { name: 'Drinks', percentage: 28, color: '#3b82f6' },
      { name: 'Desserts', percentage: 24, color: '#ef4444' }
    ],
    revenueData: Array.from({ length: 24 }, (_, i) => ({
      day: i,
      revenue: Math.floor(Math.random() * 2000) + 750
    }))
  },
  yesterday: {
    metrics: [
      { iconType: 'dollar', label: 'Total Revenue', value: '29,500,000', change: '+5%', isPositive: true, bgColor: '#00bc7d' },
      { iconType: 'cart', label: 'Total Orders', value: '42', change: '+2%', isPositive: true, bgColor: '#3b82f6' },
      { iconType: 'coins', label: 'Average Value', value: '702,500', change: '+3%', isPositive: true, bgColor: '#a855f7' }
    ],
    bestSellingDishes: [
      { id: 1, name: 'Grilled Salmon', orders: 11, revenue: 6875000, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400' },
      { id: 2, name: 'Ribeye Steak', orders: 10, revenue: 10500000, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400' },
      { id: 3, name: 'Tiramisu', orders: 9, revenue: 1925000, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' },
      { id: 4, name: 'Margherita Pizza', orders: 7, revenue: 2900000, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
      { id: 5, name: 'Caesar Salad', orders: 5, revenue: 1325000, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400' }
    ],
    categorySales: [
      { name: 'Main Course', percentage: 50, color: '#00bc7d' },
      { name: 'Drinks', percentage: 26, color: '#3b82f6' },
      { name: 'Desserts', percentage: 24, color: '#ef4444' }
    ],
    revenueData: Array.from({ length: 24 }, (_, i) => ({
      day: i,
      revenue: Math.floor(Math.random() * 1875) + 625
    }))
  },
  last7Days: {
    metrics: [
      { iconType: 'dollar', label: 'Total Revenue', value: '216,000,000', change: '+7%', isPositive: true, bgColor: '#00bc7d' },
      { iconType: 'cart', label: 'Total Orders', value: '312', change: '+6%', isPositive: true, bgColor: '#3b82f6' },
      { iconType: 'coins', label: 'Average Value', value: '692,500', change: '+2%', isPositive: true, bgColor: '#a855f7' }
    ],
    bestSellingDishes: [
      { id: 1, name: 'Grilled Salmon', orders: 89, revenue: 55625000, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400' },
      { id: 2, name: 'Ribeye Steak', orders: 72, revenue: 75600000, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400' },
      { id: 3, name: 'Margherita Pizza', orders: 58, revenue: 23925000, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
      { id: 4, name: 'Caesar Salad', orders: 52, revenue: 13650000, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400' },
      { id: 5, name: 'Tiramisu', orders: 41, revenue: 8725000, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' }
    ],
    categorySales: [
      { name: 'Main Course', percentage: 46, color: '#00bc7d' },
      { name: 'Drinks', percentage: 29, color: '#3b82f6' },
      { name: 'Desserts', percentage: 25, color: '#ef4444' }
    ],
    revenueData: [
      { day: 1, revenue: 29500 },
      { day: 2, revenue: 31250 },
      { day: 3, revenue: 28000 },
      { day: 4, revenue: 33500 },
      { day: 5, revenue: 29750 },
      { day: 6, revenue: 37000 },
      { day: 7, revenue: 27000 }
    ]
  },
  last30Days: {
    metrics: [
      { iconType: 'dollar', label: 'Total Revenue', value: '918,750,000', change: '+5%', isPositive: true, bgColor: '#00bc7d' },
      { iconType: 'cart', label: 'Total Orders', value: '1,326', change: '+4%', isPositive: true, bgColor: '#3b82f6' },
      { iconType: 'coins', label: 'Average Value', value: '687,500', change: '+1%', isPositive: true, bgColor: '#a855f7' }
    ],
    bestSellingDishes: [
      { id: 1, name: 'Grilled Salmon', orders: 378, revenue: 236250000, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400' },
      { id: 2, name: 'Ribeye Steak', orders: 315, revenue: 330750000, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400' },
      { id: 3, name: 'Margherita Pizza', orders: 245, revenue: 101050000, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
      { id: 4, name: 'Caesar Salad', orders: 215, revenue: 56450000, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400' },
      { id: 5, name: 'Tiramisu', orders: 173, revenue: 36775000, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' }
    ],
    categorySales: [
      { name: 'Main Course', percentage: 45, color: '#00bc7d' },
      { name: 'Drinks', percentage: 30, color: '#3b82f6' },
      { name: 'Desserts', percentage: 25, color: '#ef4444' }
    ],
    revenueData: [
      { day: 1, revenue: 26250 },
      { day: 2, revenue: 24500 },
      { day: 3, revenue: 30000 },
      { day: 4, revenue: 33500 },
      { day: 5, revenue: 27500 },
      { day: 6, revenue: 35500 },
      { day: 7, revenue: 34500 },
      { day: 8, revenue: 30500 },
      { day: 9, revenue: 23000 },
      { day: 10, revenue: 27000 },
      { day: 11, revenue: 33500 },
      { day: 12, revenue: 30000 },
      { day: 13, revenue: 40500 },
      { day: 14, revenue: 44500 },
      { day: 15, revenue: 35500 },
      { day: 16, revenue: 30500 },
      { day: 17, revenue: 35500 },
      { day: 18, revenue: 35000 },
      { day: 19, revenue: 28000 },
      { day: 20, revenue: 33500 },
      { day: 21, revenue: 29500 },
      { day: 22, revenue: 31250 },
      { day: 23, revenue: 28000 },
      { day: 24, revenue: 33500 },
      { day: 25, revenue: 29750 },
      { day: 26, revenue: 37000 },
      { day: 27, revenue: 27000 },
      { day: 28, revenue: 28750 },
      { day: 29, revenue: 29500 },
      { day: 30, revenue: 31250 }
    ]
  }
};

// Helper function to get data by date range
export function getAnalyticsDataByRange(range: DateRangeKey) {
  return ANALYTICS_DATA_BY_RANGE[range];
}
