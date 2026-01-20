// Order Modifier Option
export interface OrderModifierOption {
  modifier_group_id: number;
  modifier_group_name: string;
  modifier_option_id: number;
  modifier_option_name: string;
  price: number;
}

// Order Item
export interface KitchenOrderItem {
  id: number;
  menu_item_id: number;
  menu_item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  status: string;
  modifiers: OrderModifierOption[] | null;
}

// Order
export interface KitchenOrder {
  id: number;
  order_number: string;
  table_id: number;
  table_name: string;
  customer_name: string;
  status: string;
  total_amount: number;
  items_count: number;
  items: KitchenOrderItem[];
  created_at: string;
  updated_at: string;
}

// Orders Response
export interface KitchenOrdersResponse {
  code: number;
  data: {
    total: number;
    page: number;
    page_size: number;
    items: KitchenOrder[];
  };
  message: string;
}

// Transform function to convert KitchenOrder to TableOrder
export function transformToTableOrder(order: KitchenOrder): TableOrder {
  const createdDate = new Date(order.created_at);
  const now = new Date();
  const diffMs = now.getTime() - createdDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  let timeAgo = '';
  if (diffMins < 1) timeAgo = 'Just now';
  else if (diffMins < 60) timeAgo = `${diffMins}m ago`;
  else if (diffMins < 1440) timeAgo = `${Math.floor(diffMins / 60)}h ago`;
  else timeAgo = `${Math.floor(diffMins / 1440)}d ago`;

  return {
    id: order.id.toString(),
    tableNumber: order.table_name,
    orderNumber: order.order_number,
    time: createdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    timeAgo,
    status: order.status as OrderStatus,
    priority: determinePriority(diffMins),
    items: order.items?.map(item => ({
      id: item.id.toString(),
      menu_item_id: item.menu_item_id,
      name: item.menu_item_name,
      quantity: item.quantity,
      category: determineCategoryFromName(item.menu_item_name),
      modifiers: item.modifiers?.map(m => ({
        name: m.modifier_group_name,
        value: m.modifier_option_name
      })) || [],
      status: item.status as 'pending' | 'done'
    })) || []
  };
}

function determinePriority(minutesAgo: number): OrderPriority {
  if (minutesAgo > 30) return 'urgent';
  if (minutesAgo > 15) return 'high';
  return 'normal';
}

export function determineCategoryFromName(name: string): 'Main Course' | 'Appetizer' | 'Dessert' | 'Beverage' {
  const lower = name.toLowerCase();
  if (lower.includes('drink') || lower.includes('water') || lower.includes('cola') || lower.includes('tea')) return 'Beverage';
  if (lower.includes('dessert') || lower.includes('cake') || lower.includes('ice cream')) return 'Dessert';
  if (lower.includes('appetizer') || lower.includes('wing') || lower.includes('roll')) return 'Appetizer';
  return 'Main Course';
}

export type OrderStatus = 'pending' | 'preparing' | 'completed' | 'delayed';

export type OrderPriority = 'urgent' | 'high' | 'normal';

export interface OrderModifier {
  name: string;
  value: string;
}

export interface OrderItem {
  id: string;
  menu_item_id?: number;
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

// Bulk update request
export interface BulkUpdateItemStatusRequest {
  order_ids: number[];
  status: string;
}

// Updated item info
export interface UpdatedItem {
  item_id: number;
  order_id: number;
  menu_item_name: string;
  status: string;
  previous_status: string;
  updated_at: string;
  updated_by: string;
}

// Bulk update response
export interface BulkUpdateItemStatusResponse {
  code: number;
  data: {
    total_updated: number;
    updated_items: UpdatedItem[];
  };
  message: string;
}

// Update order status response
export interface UpdateOrderStatusResponse {
  code: number;
  data: {
    id: number;
    order_number: string;
    status: string;
    previous_status: string;
    updated_at: string;
    updated_by: string;
  };
  message: string;
}

// Timeline event
export interface OrderTimeline {
  id: number;
  status: string;
  timestamp: string;
  updated_by: string;
  note?: string;
}

// Order detail response
export interface OrderDetail {
  id: number;
  order_number: string;
  table_id: number;
  table_name: string;
  customer_name: string;
  status: string;
  total_amount: number;
  tax_amount: number;
  discount_amount: number;
  final_amount: number;
  created_at: string;
  updated_at: string;
  is_ready_to_bill: boolean;
  is_help_needed: boolean;
  items: KitchenOrderItem[];
  timeline: OrderTimeline[];
}

// Order detail response wrapper
export interface OrderDetailResponse {
  code: number;
  data: OrderDetail;
  message: string;
}
