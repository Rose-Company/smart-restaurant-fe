import { fetcher } from "../../../lib/fetcher";
import { MenuItem } from "../types/menu.types";

/**
 * GET /api/admin/menu/items
 */
export type MenuItemSort = "name" | "price_asc" | "price_desc" | "last_update";

type ListParams = {
  page?: number;
  page_size?: number;
  category?: string;
  status?: string;
  search?: string;
  sort?: MenuItemSort;
};
export const menuItemApi = {
  // List menu items (pagination + filter + search + sort)
  list: (params?: ListParams) => {
    const query = new URLSearchParams(
      Object.entries(params || {}).reduce(
        (acc, [k, v]) =>
          v !== undefined && v !== "" && v !== "all"
            ? { ...acc, [k]: String(v) }
            : acc,
        {}
      )
    ).toString();

    const url = `/admin/menu/items${query ? `?${query}` : ""}`;

    return fetcher(url);
  },
  create: async (data: {
    name: string;
    price: number;
    category_id: number;
    status: "available" | "unavailable" | "sold_out";
    preparation_time?: number;
    description?: string;
    chef_recommended?: boolean;
    imageFiles?: File[]; 
    modifiers?: {
      modifier_group_id: string;
    }[];
  }) => {
    let images: { url: string; is_primary: boolean }[] = [];

    // Upload từng ảnh lên cloud trước
    if (data.imageFiles && data.imageFiles.length > 0) {
      const uploadPromises = data.imageFiles.map((file) =>
        menuItemApi.uploadImage(file)
      );

      const uploadResults = await Promise.all(uploadPromises);

      // Lấy URL từ response.data.url
      images = uploadResults.map((result, index) => ({
        url: result.data.url,
        is_primary: index === 0, // Ảnh đầu tiên là primary
      }));
    }

    // Loại bỏ imageFiles khỏi payload
    const { imageFiles, ...payload } = data;

    // Gọi API create với URLs đã upload
    const response = await fetcher("/admin/menu/items", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        images: images.length > 0 ? images : undefined,
      }),
    });

    return response.data || response;
  },

  detail: async (id: number | string) => {
    const response = await fetcher<any>(`/admin/menu/items/${id}`);
    return response.data || response;
  },

  update: async (
    id: number | string,
    data: {
      name?: string;
      price?: number;
      category_id?: number;
      status?: "available" | "unavailable" | "sold_out";
      preparation_time?: number;
      description?: string;
      chef_recommended?: boolean;
      images?: {
        url: string;
        is_primary?: boolean;
      }[];
      modifiers?: {
        modifier_group_id: string;
      }[];
    }
  ) => {
    const response = await fetcher<any>(`/admin/menu/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data || response;
  },

  delete: async (id: number | string): Promise<void> => {
    await fetcher(`/admin/menu/items/${id}`, {
      method: "DELETE",
    });
  },

  updateStatus: async (
    id: number | string,
    status: "available" | "unavailable" | "sold_out"
  ) => {
    const response = await fetcher<any>(`/admin/menu/items/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return response.data || response;
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetcher<{
      code: number;
      message: string;
      data: {
        url: string;
      };
    }>("/admin/upload", {
      method: "POST",
      body: formData,
    });

    return response;
  },
};
