import { fetcher } from '../../../lib/fetcher';
import type { MenuItem } from '../../menu/types/menu.types';

export interface CustomerMenuResponse {
  items: MenuItem[];
  tableNumber?: string;
  restaurantName?: string;
}

export const customerMenuApi = {
  /**
   * Fetch menu items for a specific table using QR token
   * @param token - QR token from scanned QR code
   */
  fetchMenuByToken: async (token: string): Promise<CustomerMenuResponse> => {
    return fetcher<CustomerMenuResponse>(`/api/customer/menu?token=${token}`);
  },
};

