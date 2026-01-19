// src/features/customer/services/customerMenu.api.ts
import { MenuItem } from "../../menu/types/menu.types";

export interface CustomerMenuResponse {
  items: MenuItem[];
  total: number;
  page: number;
  page_size: number;
  table_number?: string;
}

interface FetchMenuParams {
  table: string;
  token: string;
  page?: number;
  page_size?: number;
  search?: string;
  sort?: 'id' | 'name' | 'price_asc' | 'price_desc' | 'last_update';
  category?: string;
}

export const customerMenuApi = {
  fetchMenu: async (params: FetchMenuParams): Promise<CustomerMenuResponse> => {
    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== '') {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const res = await fetch(`/api/menu?${query}`);

    if (!res.ok) {
      throw new Error('Failed to fetch menu');
    }

    const json = await res.json();

    // Backend đang trả flat object
    return {
      items: json.items ?? [],
      total: json.total ?? 0,
      page: json.page ?? 1,
      page_size: json.page_size ?? 20,
      table_number: json.table_number,
    };
  },
};
