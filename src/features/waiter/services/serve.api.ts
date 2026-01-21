// Staff/Waiter API for table management
// Uses admin_auth_token from localStorage

// Handle 401 response - token expired
const handleUnauthorized = () => {
  console.error('❌ Token expired (401 Unauthorized)');
  localStorage.removeItem('admin_auth_token');
  window.location.href = '/';
};

export interface OrderItem {
  id: number;
  item_name: string;
  quantity: number;
  unit_price: number;
  status: 'pending' | 'completed';
}

export interface Order {
  id: number;
  order_number: string;
  status: 'completed' | 'pending' | 'preparing';
  total_amount: number;
  is_ready_to_bill: boolean;
  is_help_needed: boolean;
  items_count: number;
  items: OrderItem[];
  created_at: string;
  customer_name: string;
}

export interface Table {
  id: number;
  table_number: string;
  capacity: number;
  location: string;
  status: 'occupied' | 'available' | 'reserved' | 'cleaning';
  orders: Order[];
  active_orders_count: number;
  total_bill: number;
  is_help_needed: boolean;
  is_ready_to_bill: boolean;
  created_at: string;
  updated_at: string;
}

// Bill info in table detail
export interface BillInfo {
  id: number;
  bill_number: string;
  order_id: number;
  restaurant_id: number;
  table_id: number;
  customer_id: number | null;
  subtotal: number;
  tax_amount: number;
  tax_rate: number;
  discount_amount: number;
  discount_code: string | null;
  service_charge: number;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  type: 'generated' | 'manual';
  payment_method: string | null;
  requested_by: string;
  requested_by_id: number | null;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
}

// Table detail response (different structure from list response)
export interface TableDetail {
  id: number;
  table_number: string;
  capacity: number;
  location: string;
  status: 'occupied' | 'available' | 'reserved' | 'cleaning';
  guest_count: number;
  total_bill: number;
  order_items: OrderItem[];
  all_orders_count: number;
  bill?: BillInfo;
  created_at: string;
}

// Payment request/response
export interface PaymentRequest {
  bill_id: number;
  amount: number;
  method: 'cash' | 'vnpay';
  received_amount?: number;
  change_amount?: number;
}

export interface PaymentResponse {
  id?: number;
  payment_id?: string;
  bill_id: number;
  bill_number?: string;
  amount: number;
  method: 'cash' | 'vnpay';
  status: 'pending' | 'completed' | 'failed';
  vnpay_url?: string;
  received_amount?: number;
  change_amount?: number;
  created_at: string;
  updated_at?: string;
  processed_at?: string | null;
}

export interface TablesResponse {
  total: number;
  page: number;
  page_size: number;
  items: Table[];
  extra: any;
}

interface FetchTablesParams {
  page?: number;
  page_size?: number;
  status?: 'occupied' | 'available' | 'reserved' | 'cleaning';
  location?: string;
  is_help_needed?: boolean;
  is_ready_to_bill?: boolean;
}

export const serveApi = {
  /**
   * Fetch tables from API with optional filters
   * Uses admin_auth_token from localStorage
   */
  getTablesList: async (
    params?: FetchTablesParams,
    token?: string
  ): Promise<TablesResponse> => {
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', String(params.page));
      if (params?.page_size) queryParams.append('page_size', String(params.page_size));
      if (params?.status) queryParams.append('status', params.status);
      if (params?.location) queryParams.append('location', params.location);
      if (params?.is_help_needed !== undefined) queryParams.append('is_help_needed', String(params.is_help_needed));
      if (params?.is_ready_to_bill !== undefined) queryParams.append('is_ready_to_bill', String(params.is_ready_to_bill));

      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

      // Get token from localStorage if not provided
      const authToken = token || localStorage.getItem('admin_auth_token') || '';

      if (!authToken) {
        console.warn('[serveApi.getTablesList] No admin token found, returning empty response');
        return {
          total: 0,
          page: 1,
          page_size: 10,
          items: [],
          extra: null
        };
      }

      const fetchUrl = `/api/staff/tables${query}`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      };

      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleUnauthorized();
          return { total: 0, page: 1, page_size: 10, items: [], extra: null };
        }
        throw new Error(`Failed to fetch tables: ${response.statusText}`);
      }

      const json = await response.json();

      if (json.code === 200 && json.data) {
        return json.data;
      }

      throw new Error(json.message || 'Failed to fetch tables');
    } catch (error: any) {
      console.error('Error fetching tables:', error);
      return {
        total: 0,
        page: 1,
        page_size: 10,
        items: [],
        extra: null
      };
    }
  },

  /**
   * Get occupied tables with all orders
   */
  getOccupiedTables: async (token?: string): Promise<Table[]> => {
    const response = await serveApi.getTablesList(
      { status: 'occupied' },
      token
    );
    return response.items;
  },

  /**
   * Get tables with customer requests (help needed)
   */
  getRequestTables: async (token?: string): Promise<Table[]> => {
    const response = await serveApi.getTablesList(
      { status: 'occupied', is_help_needed: true },
      token
    );
    return response.items;
  },

  /**
   * Get tables ready for billing
   */
  getBillingTables: async (token?: string): Promise<Table[]> => {
    const response = await serveApi.getTablesList(
      { status: 'occupied', is_ready_to_bill: true },
      token
    );
    return response.items;
  },

  /**
   * Get kitchen ready tables (occupied tables without help needed or ready to bill)
   */
  getKitchenReadyTables: async (token?: string): Promise<Table[]> => {
    // For kitchen tab, we want all occupied tables (then filter in component)
    const response = await serveApi.getTablesList(
      { status: 'occupied' },
      token
    );
    return response.items;
  },

  /**
   * Get single table details
   */
  getTableDetail: async (tableId: number, token?: string): Promise<TableDetail | null> => {
    try {
      const authToken = token || localStorage.getItem('admin_auth_token') || '';

      if (!authToken) {
        console.warn('[serveApi.getTableDetail] No admin token found');
        return null;
      }

      const fetchUrl = `/api/staff/tables/${tableId}`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      };

      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Invalid or expired token');
        }
        throw new Error(`Failed to fetch table: ${response.statusText}`);
      }

      const json = await response.json();

      if (json.code === 200 && json.data) {
        return json.data;
      }

      throw new Error(json.message || 'Failed to fetch table');
    } catch (error: any) {
      console.error('Error fetching table detail:', error);
      return null;
    }
  },

  /**
   * Mark table as help needed
   */
  markHelpNeeded: async (tableId: number, token?: string): Promise<void> => {
    try {
      const authToken = token || localStorage.getItem('admin_auth_token') || '';

      if (!authToken) {
        throw new Error('Authorization token is required');
      }

      const fetchUrl = `/api/staff/tables/${tableId}/help-needed`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      };

      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers
      });

      if (!response.ok) {
        throw new Error(`Failed to mark table as help needed: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Error marking help needed:', error);
      throw error;
    }
  },

  /**
   * Update table status
   */
  updateTableStatus: async (
    tableId: number,
    status: 'occupied' | 'available' | 'reserved' | 'cleaning',
    token?: string
  ): Promise<void> => {
    try {
      const authToken = token || localStorage.getItem('admin_auth_token') || '';

      if (!authToken) {
        throw new Error('Authorization token is required');
      }

      const fetchUrl = `/api/staff/tables/${tableId}/status`;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      };

      const response = await fetch(fetchUrl, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`Failed to update table status: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Error updating table status:', error);
      throw error;
    }
  },

  /**
   * Process payment for a bill
   * POST /api/payments
   */
  processPayment: async (
    billId: number,
    amount: number,
    method: 'cash' | 'vnpay',
    token?: string,
    receivedAmount?: number,
    changeAmount?: number
  ): Promise<PaymentResponse | null> => {
    try {
      const authToken = token || localStorage.getItem('admin_auth_token') || '';

      if (!authToken) {
        console.warn('[serveApi.processPayment] No admin token found');
        return null;
      }

      const requestBody: PaymentRequest = {
        bill_id: billId,
        amount,
        method
      };

      // Add cash-specific fields if provided
      if (method === 'cash') {
        if (receivedAmount !== undefined) {
          requestBody.received_amount = receivedAmount;
        }
        if (changeAmount !== undefined) {
          requestBody.change_amount = changeAmount;
        }
      }

      const res = await fetch(`/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        console.error('Failed to process payment:', res.status);
        return null;
      }

      const payment: PaymentResponse = await res.json();
      console.log('💳 Payment processed successfully:', payment);
      return payment;
    } catch (error) {
      console.error('Error processing payment:', error);
      return null;
    }
  },

  /**
   * Handle VNPay callback
   * POST /api/vnpay/callback
   */
  handleVNPayCallback: async (
    queryParams: Record<string, string>,
    token?: string
  ): Promise<{ success: boolean; message: string } | null> => {
    try {
      const authToken = token || localStorage.getItem('admin_auth_token') || '';
  
      const queryString = new URLSearchParams(queryParams).toString();
      const url = `/api/vnpay/callback?${queryString}`;
  
      console.log('📤 Calling VNPay callback API:', url);
  
      const res = await fetch(url, {
        method: 'GET',
        headers: authToken
          ? { Authorization: `Bearer ${authToken}` }
          : undefined,
      });
  
      console.log('📥 Response status:', res.status);
  
      if (!res.ok) {
        console.error('❌ Failed to handle VNPay callback:', res.status);
        const errorText = await res.text();
        console.error('❌ Error response:', errorText);
        return null;
      }
  
      const result = await res.json();
      console.log('✅ VNPay callback handled:', result);
      return result;
    } catch (error) {
      console.error('❌ Error handling VNPay callback:', error);
      return null;
    }
  }


};
