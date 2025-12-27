import { fetcher } from "../../../../lib/fetcher";
import { Category } from "../types/category.types";

/**
 * GET api/admin/menu/categories
 */
export type MenuItemSort =
    | "name"
    | "price_asc"
    | "price_desc"
    | "last_update";

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

        console.log("[menuItemApi] GET", url);

        return fetcher(url);
    },

    // // Get detail
    // detail: (id: number | string) =>
    //     fetcher(`/admin/menu/items/${id}`),

    // // Create
    // create: (data: {
    //     name: string;
    //     category: string;
    //     price: number;
    //     status: MenuItem["status"];
    //     description?: string;
    //     preparation_time?: number;
    //     chef_recommended?: boolean;
    //     image_url?: string;
    // }) =>
    //     fetcher(`/admin/menu/items`, {
    //         method: "POST",
    //         body: JSON.stringify(data),
    //     }),

    // // Update (PUT)
    // update: (
    //     id: number | string,
    //     data: Partial<{
    //         name: string;
    //         category: string;
    //         price: number;
    //         status: MenuItem["status"];
    //         description?: string;
    //         preparation_time?: number;
    //         chef_recommended?: boolean;
    //         image_url?: string;
    //     }>
    // ) =>
    //     fetcher(`/admin/menu/items/${id}`, {
    //         method: "PUT",
    //         body: JSON.stringify(data),
    //     }),

    // // Update status (PATCH)
    // updateStatus: (
    //     id: number | string,
    //     status: MenuItem["status"]
    // ) =>
    //     fetcher(`/admin/menu/items/${id}/status`, {
    //         method: "PATCH",
    //         body: JSON.stringify({ status }),
    //     }),

    /**
 * POST /api/admin/menu/items/upload-image
 */
    create: (data: {
        name: string;
        price: number;
        category_id: number;
        status: "available" | "unavailable" | "sold_out";
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
    }) =>
        fetcher("/admin/menu/items", {
            method: "POST",
            body: JSON.stringify(data),
        }),
        
    uploadImage: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        return fetcher("/admin/menu/items/upload-image", {
            method: "POST",
            body: formData,
        });
    },
};

