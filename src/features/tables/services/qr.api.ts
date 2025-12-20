import { fetcher, binaryFetcher, fileFetcher } from "../../../lib/fetcher";

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}
export interface GenerateQRData {
    url: string;
}

export const genQRApi = {
    generate: async (tableId: number): Promise<GenerateQRData> => {
        const res = await fetcher(
            `/admin/tables/${tableId}/qr/generate`,
            {
                method: "POST",
            }
        ) as ApiResponse<GenerateQRData>;

        return res.data;
    },
};

export const getQRApi = {
    fetch: async (tableId: number): Promise<GenerateQRData> => {
        const res = await fetcher(
            `/admin/tables/${tableId}/qr`,
            {
                method: "GET",
            }
        ) as ApiResponse<GenerateQRData>;

        return res.data;
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
