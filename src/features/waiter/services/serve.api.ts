import { fetcher } from '../../../lib/fetcher';

// Types
export interface TableOrder {
  id: number;
  order_number: string;
  status: 'pending' | 'completed' | 'preparing';
  total_amount: number;
  is_ready_to_bill: boolean;
  is_help_needed: boolean;
  items_count: number;
  items: TableOrderItem[];
  created_at: string;
  customer_name: string;
}

export interface TableOrderItem {
  id: number;
  item_name: string;
  quantity: number;
  unit_price: number;
  status: string;
}

export interface Table {
  id: number;
  table_number: string;
  capacity: number;
  location: string;
  status: 'occupied' | 'available' | 'reserved' | 'cleaning';
  orders: TableOrder[];
  active_orders_count: number;
  total_bill: number;
  is_help_needed: boolean;
  is_ready_to_bill: boolean;
  created_at: string;
  updated_at: string;
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
}

export const serveApi = {
  // Get list of tables with authorization
  getTablesList: async (params?: FetchTablesParams, token?: string): Promise<TablesResponse> => {
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', String(params.page));
      if (params?.page_size) queryParams.append('page_size', String(params.page_size));
      if (params?.status) queryParams.append('status', params.status);
      if (params?.location) queryParams.append('location', params.location);

      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

      // Get token from localStorage if not provided
      const authToken = token || localStorage.getItem('auth_token') || '';

      const response = await fetch(`/api/staff/tables${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Invalid or expired token');
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
      throw error;
    }
  },

  // Get single table details
  getTableDetail: async (tableId: number, token?: string): Promise<Table> => {
    try {
      const authToken = token || localStorage.getItem('auth_token') || '';

      const response = await fetch(`/api/staff/tables/${tableId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
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
      console.error('Error fetching table:', error);
      throw error;
    }
  },

  // Get occupied tables (for serving)
  getOccupiedTables: async (token?: string): Promise<Table[]> => {
    const response = await serveApi.getTablesList({ status: 'occupied' }, token);
    return response.items;
  },

  // Mark table as help needed
  markHelpNeeded: async (tableId: number, token?: string): Promise<void> => {
    try {
      const authToken = token || localStorage.getItem('auth_token') || '';

      const response = await fetch(`/api/staff/tables/${tableId}/help-needed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to mark help needed: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Error marking help needed:', error);
      throw error;
    }
  },

  // Update table status
  updateTableStatus: async (
    tableId: number,
    status: 'occupied' | 'available' | 'reserved' | 'cleaning',
    token?: string
  ): Promise<void> => {
    try {
      const authToken = token || localStorage.getItem('auth_token') || '';

      const response = await fetch(`/api/staff/tables/${tableId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`Failed to update table status: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Error updating table status:', error);
      throw error;
    }
  }
};
