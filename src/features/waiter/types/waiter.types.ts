export type TaskType = 'kitchen_ready' | 'customer_request' | 'payment_request';
export type TaskStatus = 'pending' | 'completed';

export interface TaskItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice?: number;
  status?: 'pending' | 'completed';
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
  // Properties from Table API response
  capacity?: number;
  location?: string;
  tableStatus?: 'occupied' | 'available' | 'reserved' | 'cleaning';
  activeOrdersCount?: number;
  guestCount?: number;
  // Flags for coloring
  isHelpNeeded?: boolean;
  isReadyToBill?: boolean;
}

export type TaskFilterType = 'all' | 'kitchen' | 'requests' | 'payment';
