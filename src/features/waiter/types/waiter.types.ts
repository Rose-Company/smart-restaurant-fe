export type TaskType = 'kitchen_ready' | 'customer_request' | 'payment_request';
export type TaskStatus = 'pending' | 'completed';

export interface TaskItem {
  id: string;
  name: string;
  quantity: number;
}

export interface WaiterTask {
  id: string;
  tableNumber: string;
  type: TaskType;
  status: TaskStatus;
  createdAt: Date;
  items?: TaskItem[];
  note?: string;
  totalAmount?: number;
}

export type TaskFilterType = 'all' | 'kitchen' | 'requests' | 'payment';
