// Order API types
export interface ModifierRequest {
  modifier_group_id: number;
  modifier_option_id: number;
  additional_price: number;
}

export interface OrderItemRequest {
  menu_item_id: number;
  quantity: number;
  modifiers: ModifierRequest[];
  notes: string;
}

export interface CreateOrderRequest {
  table_id: number;
  items: OrderItemRequest[];
  customer_notes: string;
  dining_mode: 'in-restaurant' | 'takeaway' | 'delivery';
}

// Order response types
export interface ModifierResponse {
  id: number;
  modifier_group_id: number;
  modifier_option_id: number;
  name: string;
  additional_price: number;
}

export interface OrderItemResponse {
  id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  modifiers: ModifierResponse[];
  notes: string;
  status: string;
}

export interface CreateOrderResponse {
  id: number;
  table_id: number;
  order_number: string;
  status: string;
  total_amount: number;
  items_count: number;
  items: OrderItemResponse[];
  customer_notes: string;
  created_at: string;
  estimated_ready_time: string;
}

export interface OrderListItem {
  id: number;
  table_id: number;
  order_number: string;
  table_name: string;
  customer_id: string;
  customer_name: string;
  status: string;
  total_amount: number;
  items_count: number;
  items: Array<{
    id: number;
    menu_item_id: number;
    menu_item_name: string;
    menu_item_image: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    special_instructions: string | null;
    status: string;
    modifiers: Array<{
      modifier_group_id: number;
      modifier_group_name: string;
      modifier_option_id: number;
      modifier_option_name: string;
      price: number;
    }>;
  }>;
  created_at: string;
  updated_at: string;
  estimated_ready_time: string;
  waiter_id: string;
  waiter_name: string;
}

export interface OrdersListResponse {
  total: number;
  page: number;
  page_size: number;
  items: OrderListItem[];
}

export interface OrderDetailsResponse {
  id: number;
  table_id: number;
  order_number: string;
  status: string;
  total_amount: number;
  items: Array<{
    id: number;
    menu_item_id: number;
    name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    modifiers: Array<{
      id: number;
      name: string;
      additional_price: number;
    }>;
    notes: string;
    status: string;
    prepared_at: string | null;
  }>;
  timeline: Array<{
    id: number;
    status: string;
    changed_at: string;
    changed_by: string;
  }>;
  waiter_id: string;
  customer_notes: string;
  created_at: string;
  estimated_ready_time: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
  updated_by: string;
  reason: string;
}

export interface UpdateOrderStatusResponse {
  id: number;
  order_number: string;
  status: string;
  previous_status: string;
  updated_at: string;
  updated_by: string;
  updated_by_name: string;
  estimated_ready_time: string;
}

export interface UpdateOrderItemStatusRequest {
  order_ids: number[];
  status: string;
}

export interface UpdatedOrderItem {
  item_id: number;
  order_id: number;
  menu_item_name: string;
  status: string;
  previous_status: string;
  updated_at: string;
  updated_by: string;
  updated_by_name: string;
}

export interface UpdateOrderItemStatusResponse {
  total_updated: number;
  updated_items: UpdatedOrderItem[];
}

export interface UpdateMultipleItemsStatusRequest {
  items: Array<{
    menu_item_id: number;
    status: string;
  }>;
}

// API service
export const orderApi = {
  // TASK-001: Create Order
  createOrder: async (
    request: CreateOrderRequest
  ): Promise<CreateOrderResponse> => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to create order');
    }

    const json = await res.json();
    return json.data;
  },

  // TASK-002: Get Orders List
  getOrdersList: async (params?: {
    page?: number;
    page_size?: number;
    status?: string;
    table_id?: number;
    category?: string;
    sort?: string;
  }): Promise<OrdersListResponse> => {
    const query = new URLSearchParams();

    if (params) {
      if (params.page) query.append('page', String(params.page));
      if (params.page_size) query.append('page_size', String(params.page_size));
      if (params.status) query.append('status', params.status);
      if (params.table_id) query.append('table_id', String(params.table_id));
      if (params.category) query.append('category', params.category);
      if (params.sort) query.append('sort', params.sort);
    }

    const queryString = query.toString();
    const res = await fetch(`/api/orders${queryString ? '?' + queryString : ''}`);

    if (!res.ok) {
      throw new Error('Failed to fetch orders list');
    }

    const json = await res.json();
    return json.data;
  },

  // TASK-003: Get Order Details
  getOrderDetails: async (orderId: number): Promise<OrderDetailsResponse> => {
    const res = await fetch(`/api/orders/${orderId}`);

    if (!res.ok) {
      throw new Error('Failed to fetch order details');
    }

    const json = await res.json();
    return json.data;
  },

  // TASK-004: Update Order Status
  updateOrderStatus: async (
    orderId: number,
    request: UpdateOrderStatusRequest
  ): Promise<UpdateOrderStatusResponse> => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to update order status');
    }

    const json = await res.json();
    return json.data;
  },

  // TASK-005: Update Order Item Status (Multiple Orders)
  updateOrderItemStatusMultiple: async (
    itemId: number,
    request: UpdateOrderItemStatusRequest
  ): Promise<UpdateOrderItemStatusResponse> => {
    const res = await fetch(`/api/orders/items/${itemId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to update order item status');
    }

    const json = await res.json();
    return json.data;
  },

  // TASK-005b: Update Multiple Items Status (Single Order)
  updateMultipleItemsStatus: async (
    orderId: number,
    request: UpdateMultipleItemsStatusRequest
  ): Promise<UpdateOrderItemStatusResponse> => {
    const res = await fetch(`/api/orders/${orderId}/items/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error('Failed to update multiple items status');
    }

    const json = await res.json();
    return json.data;
  },
};
