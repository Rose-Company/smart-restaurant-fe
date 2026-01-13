import { fetcher, binaryFetcher, fileFetcher } from "../../../lib/fetcher";

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

export interface QRData {
    table_id: number;
    token: string;
    create_at: string;
    expire_at: string;
}

export interface GenerateQRData {
    url: string;
    token: string;
    table_id: number;
    create_at: string;
    expire_at: string;
}

export const genQRApi = {
    generate: async (tableId: number): Promise<GenerateQRData> => {
        const res = await fetcher(
            `/admin/tables/${tableId}/qr/generate`,
            {
                method: "POST",
            }
        ) as ApiResponse<QRData>;

        // Generate URL from token and table_id
        const baseUrl = window.location.origin; // or use your configured base URL
        const url = `${baseUrl}/menu?table=${res.data.table_id}&token=${res.data.token}`;

        return {
            url,
            token: res.data.token,
            table_id: res.data.table_id,
            create_at: res.data.create_at,
            expire_at: res.data.expire_at,
        };
    },
};

export const getQRApi = {
    fetch: async (tableId: number): Promise<GenerateQRData> => {
        const res = await fetcher(
            `/admin/tables/${tableId}/qr`,
            {
                method: "GET",
            }
        ) as ApiResponse<QRData>;

        // Generate URL from token and table_id
        const baseUrl = window.location.origin; // or use your configured base URL
        const url = `${baseUrl}/menu?table=${res.data.table_id}&token=${res.data.token}`;

        return {
            url,
            token: res.data.token,
            table_id: res.data.table_id,
            create_at: res.data.create_at,
            expire_at: res.data.expire_at,
        };
    },
};

export const downloadSingleQRApi = {
    fetch: async (tableId: number, token: string): Promise<Blob> => {
        return binaryFetcher(
            `/admin/tables/${tableId}/qr/download?token=${token}`,
            { method: "GET" }
        );
    },
};

export const downloadAllQRApi = {
    zip: async (): Promise<Blob> => {
        return fileFetcher(
            `/admin/tables/qr/download-all`,
            {
                method: "GET",
            }
        );
    },
}