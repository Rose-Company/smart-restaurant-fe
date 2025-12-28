import { fetcher } from "../../../../lib/fetcher";
import { Category } from "../types/category.types";

export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  display_order: number;
  item_count?: number;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  is_active?: boolean;
  display_order?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
  status?: "active" | "inactive";
  display_order?: number;
}

function mapCategoryResponseToCategory(response: CategoryResponse): Category {
  return {
    id: response.id,
    name: response.name,
    description: response.description,
    isActive: response.is_active,
    displayOrder: response.display_order,
    itemCount: response.item_count || 0,
  };
}

export const categoryApi = {
  list: async (): Promise<Category[]> => {
    const response = await fetcher<any>("/admin/menu/categories");
    const categories = response.data?.items || response.data || response;
    const categoryArray = Array.isArray(categories) ? categories : [];
    return categoryArray.map(mapCategoryResponseToCategory);
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await fetcher<CategoryResponse>("/admin/menu/categories", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        is_active: data.is_active !== undefined ? data.is_active : true,
        display_order: data.display_order || 0,
      }),
    });
    return mapCategoryResponseToCategory(response.data || response);
  },

  update: async (id: number, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await fetcher<CategoryResponse>(`/admin/menu/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return mapCategoryResponseToCategory(response.data || response);
  },

  delete: async (id: number): Promise<void> => {
    await fetcher(`/admin/menu/categories/${id}`, {
      method: "DELETE",
    });
  },

  updateStatus: async (id: number, isActive: boolean, displayOrder?: number): Promise<Category> => {
    const requestData: any = { 
      status: isActive ? 'active' : 'inactive',
    };
    
    if (displayOrder !== undefined) {
      requestData.display_order = displayOrder;
    }
    
    const response = await fetcher<CategoryResponse>(`/admin/menu/categories/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(requestData),
    });
    return mapCategoryResponseToCategory(response.data || response);
  },

  updateOrder: async (id: number, displayOrder: number): Promise<Category> => {
    const response = await fetcher<CategoryResponse>(`/admin/menu/categories/${id}/order`, {
      method: "PATCH",
      body: JSON.stringify({ display_order: displayOrder }),
    });
    return mapCategoryResponseToCategory(response.data || response);
  },
};
