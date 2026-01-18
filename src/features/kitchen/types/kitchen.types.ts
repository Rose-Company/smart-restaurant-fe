export type OrderStatus = 'pending' | 'preparing' | 'completed' | 'delayed';

export type OrderPriority = 'urgent' | 'high' | 'normal';

export interface OrderModifier {
  name: string;
  value: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  category?: 'Main Course' | 'Appetizer' | 'Dessert' | 'Beverage';
  modifiers?: OrderModifier[];
  notes?: string;
  status?: 'pending' | 'done';
}

export interface TableOrder {
  id: string;
  tableNumber: string;
  orderNumber: string;
  time: string;
  timeAgo: string;
  status: OrderStatus;
  priority: OrderPriority;
  items: OrderItem[];
}

export interface KitchenStats {
  avgPrepTime: string;
  isConnected: boolean;
  activeOrders: number;
  pendingOrders: number;
  completedToday: number;
}

export type OrderFilterType = 'all' | 'main-course' | 'appetizers' | 'desserts' | 'beverages' | 'completed';
