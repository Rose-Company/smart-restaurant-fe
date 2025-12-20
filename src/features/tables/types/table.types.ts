export type TableStatus = 'active' | 'occupied' | 'inactive';

export interface Table {
    id: number;
    table_number: string;
    capacity: number;
    location: string;
    status: TableStatus;
    order_data?: {
        active_orders: number;
        total_bill: number;
    };
    created_at?: string;
    updated_at?: string;
}

export interface TableListResponse {
    code: number;
    message: string;
    data: {
        total: number;
        page: number;
        page_size: number;
        items: Table[];
        extra?: any;
    };
}
