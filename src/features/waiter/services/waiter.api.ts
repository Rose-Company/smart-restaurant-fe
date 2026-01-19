import { WaiterTask, TaskFilterType } from '../types/waiter.types';

// Mock data
const mockTasks: WaiterTask[] = [
  {
    id: '1',
    tableNumber: '05',
    type: 'kitchen_ready',
    status: 'pending',
    createdAt: new Date(Date.now()),
    items: [
      { id: '1', name: 'Burger', quantity: 2 },
      { id: '2', name: 'Fries', quantity: 1 }
    ]
  },
  {
    id: '2',
    tableNumber: '02',
    type: 'customer_request',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
    note: 'Customer needs Napkins'
  },
  {
    id: '3',
    tableNumber: '12',
    type: 'payment_request',
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    totalAmount: 45.00
  },
  {
    id: '4',
    tableNumber: '08',
    type: 'kitchen_ready',
    status: 'pending',
    createdAt: new Date(Date.now() - 3 * 60 * 1000),
    items: [
      { id: '3', name: 'Salmon', quantity: 1 },
      { id: '4', name: 'Caesar Salad', quantity: 1 }
    ]
  },
  {
    id: '5',
    tableNumber: '15',
    type: 'kitchen_ready',
    status: 'pending',
    createdAt: new Date(Date.now() - 4 * 60 * 1000),
    items: [
      { id: '5', name: 'Pasta', quantity: 2 }
    ]
  },
  {
    id: '6',
    tableNumber: '20',
    type: 'payment_request',
    status: 'pending',
    createdAt: new Date(Date.now() - 6 * 60 * 1000),
    totalAmount: 78.50
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const waiterApi = {
  async list(filter: TaskFilterType = 'all'): Promise<WaiterTask[]> {
    await delay(300);
    
    let filtered = mockTasks.filter(task => task.status === 'pending');
    
    if (filter !== 'all') {
      if (filter === 'kitchen') {
        filtered = filtered.filter(task => task.type === 'kitchen_ready');
      } else if (filter === 'requests') {
        filtered = filtered.filter(task => task.type === 'customer_request');
      } else if (filter === 'payment') {
        filtered = filtered.filter(task => task.type === 'payment_request');
      }
    }
    
    return filtered;
  },

  async completeTask(taskId: string): Promise<void> {
    await delay(200);
    const task = mockTasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'completed';
    }
  }
};
