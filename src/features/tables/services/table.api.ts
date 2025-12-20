import { fetcher } from "../../../lib/fetcher";
import { TableStatus } from "../types/table.types";

type ListParams = {
    page?: number;
    page_size?: number;
    search?: string;
    status?: TableStatus;
    zone?: string;
    sort?: string;
};

export const tableApi = {
    // List tables (pagination + search + filter + sort)
    list: (params?: ListParams) => {
        const query = new URLSearchParams(
            Object.entries(params || {}).reduce(
                (acc, [k, v]) => (v ? { ...acc, [k]: String(v) } : acc),
                {}
            )
        ).toString();

        return fetcher(`/admin/tables${query ? `?${query}` : ""}`);
    },

    // Get detail
    detail: (id: number | string) =>
        fetcher(`/admin/tables/${id}`),

    // Create
    create: (data: {
        table_number: string;
        capacity: number;
        location: string;
        status: TableStatus;
    }) =>
        fetcher(`/admin/tables`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // Update (PUT)
    update: (
        id: number | string,
        data: Partial<{
            table_number: string;
            capacity: number;
            location: string;
            status: TableStatus;
        }>
    ) =>
        fetcher(`/admin/tables/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    // Update status (PATCH)
    updateStatus: (
        id: number | string,
        status: TableStatus
    ) =>
        fetcher(`/admin/tables/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        }),
};
