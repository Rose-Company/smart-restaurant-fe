export interface Table {
    id: number;
    tableNumber: string;
    capacity: number;
    zone: string;
    status: 'Active' | 'Occupied' | 'Inactive';
    orderData?: {
        activeOrders: number;
        totalBill: number;
    };
}
