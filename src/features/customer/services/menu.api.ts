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
      items: (json.items ?? []).map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        status: item.status?.toLowerCase() === 'available' ? 'available' : 'unavailable',
        lastUpdate: item.last_update,
        chefRecommended: item.chef_recommended ?? false,
        imageUrl: item.image_url,
        description: item.description,
        preparationTime: item.preparation_time,
      })),
      total: json.total ?? 0,
      page: json.page ?? 1,
      page_size: json.page_size ?? 20,
      table_number: json.table_number,
    };
  },

  fetchItemDetail: async (itemId: number): Promise<MenuItem> => {
    const res = await fetch(`/api/menu/items/${itemId}`);

    if (!res.ok) {
      throw new Error('Failed to fetch item details');
    }

    const json = await res.json();

    // Map API response to MenuItem type
    const itemData = json.data;
    return {
      id: itemData.id,
      name: itemData.name,
      category: itemData.category,
      price: itemData.price,
      status: itemData.status.toLowerCase() === 'available' ? 'available' : 'unavailable',
      lastUpdate: itemData.last_update,
      chefRecommended: itemData.chef_recommended ?? false,
      imageUrl: itemData.image_url,
      description: itemData.description,
      preparationTime: itemData.preparation_time,
      images: itemData.images?.map((img: any) => ({
        id: img.id,
        url: img.url,
        isPrimary: img.is_primary ?? false,
      })),
      modifiers: itemData.modifiers?.map((mod: any) => ({
        id: String(mod.id),
        name: mod.name,
        required: mod.is_required ?? false,
        selectionType: mod.selection_type?.toLowerCase() === 'multiple' ? 'Multi' : 'Single',
        options: mod.options?.map((opt: any) => ({
          id: String(opt.id),
          name: opt.name,
          price: opt.price_adjustment ?? 0,
        })),
      })),
    };
  },
};
