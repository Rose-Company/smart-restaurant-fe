import { fetcher } from "../../../lib/fetcher";
import type { TableOrder, KitchenStats, OrderFilterType } from '../types/kitchen.types';

// Mock data for development
const mockOrders: TableOrder[] = [
  {
    id: '1',
    tableNumber: '02',
    orderNumber: '#002',
    time: '02:28 PM',
    timeAgo: '27m ago',
    status: 'delayed',
    priority: 'urgent',
    items: [
      {
        id: '1-1',
        name: 'Ribeye Steak',
        quantity: 1,
        category: 'Main Course',
        modifiers: [
          { name: 'Size', value: '12oz' },
          { name: 'Doneness', value: 'Well Done' }
        ],
        status: 'pending'
      }
    ]
  },
  {
    id: '2',
    tableNumber: '08',
    orderNumber: '#003',
    time: '02:42 PM',
    timeAgo: '13m ago',
    status: 'preparing',
    priority: 'high',
    items: [
      {
        id: '2-1',
        name: 'Grilled Salmon',
        quantity: 1,
        category: 'Main Course',
        modifiers: [
          { name: 'Size', value: 'Medium' },
          { name: 'Toppings', value: 'Extra Cheese' }
        ],
        status: 'done'
      },
      {
        id: '2-2',
        name: 'Caesar Salad',
        quantity: 1,
        category: 'Appetizer',
        status: 'pending'
      }
    ]
  },
  {
    id: '3',
    tableNumber: '12',
    orderNumber: '#005',
    time: '02:45 PM',
    timeAgo: '10m ago',
    status: 'pending',
    priority: 'normal',
    items: [
      {
        id: '3-1',
        name: 'Lobster Bisque',
        quantity: 2,
        category: 'Appetizer',
        status: 'pending'
      },
      {
        id: '3-2',
        name: 'French Onion Soup',
        quantity: 1,
        category: 'Appetizer',
        status: 'pending'
      },
      {
        id: '3-3',
        name: 'Chocolate Lava Cake',
        quantity: 2,
        category: 'Dessert',
        status: 'pending'
      }
    ]
  },
  {
    id: '4',
    tableNumber: '15',
    orderNumber: '#006',
    time: '02:47 PM',
    timeAgo: '8m ago',
    status: 'pending',
    priority: 'normal',
    items: [
      {
        id: '4-1',
        name: 'Lobster Linguine',
        quantity: 1,
        category: 'Main Course',
        modifiers: [
          { name: 'Spice Level', value: 'Medium' },
          { name: 'Add-ons', value: 'Extra Parmesan' }
        ],
        status: 'pending'
      },
      {
        id: '4-2',
        name: 'Caprese Salad',
        quantity: 1,
        category: 'Appetizer',
        status: 'pending'
      },
      {
        id: '4-3',
        name: 'Tiramisu',
        quantity: 1,
        category: 'Dessert',
        status: 'pending'
      }
    ]
  },
  {
    id: '5',
    tableNumber: '05',
    orderNumber: '#004',
    time: '02:48 PM',
    timeAgo: '7m ago',
    status: 'pending',
    priority: 'normal',
    items: [
      {
        id: '5-1',
        name: 'Truffle Burger',
        quantity: 2,
        category: 'Main Course',
        modifiers: [
          { name: 'Doneness', value: 'Medium Rare' },
          { name: 'Add Toppings', value: 'Bacon, Avocado' }
        ],
        status: 'pending'
      },
      {
        id: '5-2',
        name: 'Garlic Bread',
        quantity: 1,
        category: 'Appetizer',
        status: 'pending'
      },
      {
        id: '5-3',
        name: 'Iced Coffee',
        quantity: 2,
        category: 'Beverage',
        status: 'pending'
      }
    ]
  },
  {
    id: '6',
    tableNumber: '20',
    orderNumber: '#007',
    time: '02:50 PM',
    timeAgo: '5m ago',
    status: 'pending',
    priority: 'normal',
    items: [
      {
        id: '6-1',
        name: 'Pad Thai',
        quantity: 1,
        category: 'Main Course',
        modifiers: [
          { name: 'Protein Choice', value: 'Shrimp' },
          { name: 'Spice Level', value: 'Extra Spicy' }
        ],
        status: 'pending'
      },
      {
        id: '6-2',
        name: 'Tom Yum Soup',
        quantity: 1,
        category: 'Appetizer',
        status: 'pending'
      },
      {
        id: '6-3',
        name: 'Mango Sticky Rice',
        quantity: 2,
        category: 'Dessert',
        status: 'pending'
      }
    ]
  },
  {
    id: '7',
    tableNumber: '18',
    orderNumber: '#008',
    time: '02:52 PM',
    timeAgo: '3m ago',
    status: 'pending',
    priority: 'normal',
    items: [
      {
        id: '7-1',
        name: 'Sushi Platter',
        quantity: 1,
        category: 'Main Course',
        modifiers: [
          { name: 'Platter Size', value: 'Large (24 pieces)' },
          { name: 'Add-ons', value: 'Spicy Mayo, Eel Sauce' }
        ],
        status: 'pending'
      },
      {
        id: '7-2',
        name: 'Miso Soup',
        quantity: 2,
        category: 'Appetizer',
        status: 'pending'
      },
      {
        id: '7-3',
        name: 'Latte',
        quantity: 1,
        category: 'Beverage',
        modifiers: [
          { name: 'Size', value: 'Large (16oz)' },
          { name: 'Milk Type', value: 'Oat Milk' }
        ],
        status: 'pending'
      }
    ]
  },
  {
    id: '8',
    tableNumber: '10',
    orderNumber: '#009',
    time: '02:54 PM',
    timeAgo: '1m ago',
    status: 'pending',
    priority: 'high',
    items: [
      {
        id: '8-1',
        name: 'Caesar Salad',
        quantity: 2,
        category: 'Appetizer',
        status: 'pending'
      },
      {
        id: '8-2',
        name: 'French Onion Soup',
        quantity: 2,
        category: 'Appetizer',
        status: 'pending'
      },
      {
        id: '8-3',
        name: 'Grilled Salmon',
        quantity: 3,
        category: 'Main Course',
        modifiers: [
          { name: 'Size', value: 'Large' }
        ],
        status: 'pending'
      },
      {
        id: '8-4',
        name: 'Ribeye Steak',
        quantity: 2,
        category: 'Main Course',
        modifiers: [
          { name: 'Size', value: '16oz' },
          { name: 'Doneness', value: 'Medium Rare' }
        ],
        status: 'pending'
      },
      {
        id: '8-5',
        name: 'Lobster Linguine',
        quantity: 1,
        category: 'Main Course',
        modifiers: [
          { name: 'Spice Level', value: 'Spicy' }
        ],
        status: 'pending'
      },
      {
        id: '8-6',
        name: 'Chocolate Lava Cake',
        quantity: 2,
        category: 'Dessert',
        status: 'pending'
      },
      {
        id: '8-7',
        name: 'Tiramisu',
        quantity: 3,
        category: 'Dessert',
        status: 'pending'
      },
      {
        id: '8-8',
        name: 'Latte',
        quantity: 2,
        category: 'Beverage',
        modifiers: [
          { name: 'Size', value: 'Medium (12oz)' }
        ],
        status: 'pending'
      },
      {
        id: '8-9',
        name: 'Iced Coffee',
        quantity: 2,
        category: 'Beverage',
        status: 'pending'
      },
      {
        id: '8-10',
        name: 'Green Tea Ice Cream',
        quantity: 2,
        category: 'Dessert',
        status: 'pending'
      }
    ]
  },
  {
    id: '9',
    tableNumber: '22',
    orderNumber: '#010',
    time: '02:55 PM',
    timeAgo: 'Just now',
    status: 'pending',
    priority: 'normal',
    items: [
      {
        id: '9-1',
        name: 'Bruschetta',
        quantity: 1,
        category: 'Appetizer',
        status: 'pending'
      },
      {
        id: '9-2',
        name: 'Beef Wellington',
        quantity: 2,
        category: 'Main Course',
        status: 'pending'
      },
      {
        id: '9-3',
        name: 'Cheesecake',
        quantity: 2,
        category: 'Dessert',
        status: 'pending'
      }
    ]
  },
  {
    id: '10',
    tableNumber: '07',
    orderNumber: '#011',
    time: '02:56 PM',
    timeAgo: 'Just now',
    status: 'pending',
    priority: 'normal',
    items: [
      {
        id: '10-1',
        name: 'Truffle Burger',
        quantity: 2,
        category: 'Main Course',
        modifiers: [
          { name: 'Doneness', value: 'Medium' },
          { name: 'Add Toppings', value: 'Extra Cheese, Fried Egg' }
        ],
        status: 'pending'
      },
      {
        id: '10-2',
        name: 'Tiramisu',
        quantity: 1,
        category: 'Dessert',
        status: 'pending'
      },
      {
        id: '10-3',
        name: 'Latte',
        quantity: 2,
        category: 'Beverage',
        modifiers: [
          { name: 'Size', value: 'Large (16oz)' },
          { name: 'Add-ons', value: 'Vanilla Syrup' }
        ],
        status: 'pending'
      }
    ]
  }
];

const mockStats: KitchenStats = {
  avgPrepTime: '12m',
  isConnected: true,
  activeOrders: 5,
  pendingOrders: 3,
  completedToday: 42,
};

export const kitchenApi = {
  /**
   * Get all kitchen orders (mock implementation)
   */
  list: async (filter?: OrderFilterType): Promise<TableOrder[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // TODO: Replace with real API call
    // return fetcher('/api/kitchen/orders', { params: { filter } });
    
    if (filter === 'completed') {
      return mockOrders.filter(order => order.status === 'completed');
    }
    
    if (filter === 'appetizers') {
      return mockOrders.filter(order => 
        order.items.some(item => item.category === 'Appetizer')
      );
    }
    
    if (filter === 'main-course') {
      return mockOrders.filter(order => 
        order.items.some(item => item.category === 'Main Course')
      );
    }
    
    if (filter === 'desserts') {
      return mockOrders.filter(order => 
        order.items.some(item => item.category === 'Dessert')
      );
    }
    
    if (filter === 'beverages') {
      return mockOrders.filter(order => 
        order.items.some(item => item.category === 'Beverage')
      );
    }
    
    return mockOrders;
  },

  /**
   * Get kitchen statistics (mock implementation)
   */
  stats: async (): Promise<KitchenStats> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // TODO: Replace with real API call
    // return fetcher('/api/kitchen/stats');
    
    return mockStats;
  },

  /**
   * Update order status (mock implementation)
   */
  updateStatus: async (orderId: string, status: 'preparing' | 'completed'): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // TODO: Replace with real API call
    // return fetcher(`/api/kitchen/orders/${orderId}/status`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ status })
    // });
    
    console.log(`Order ${orderId} status updated to ${status}`);
  },

  /**
   * Mark order item as done (mock implementation)
   */
  markItemDone: async (orderId: string, itemId: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // TODO: Replace with real API call
    // return fetcher(`/api/kitchen/orders/${orderId}/items/${itemId}/done`, {
    //   method: 'PATCH'
    // });
    
    console.log(`Order ${orderId}, item ${itemId} marked as done`);
  }
};

/**
 * Get kitchen statistics (mock implementation)
 */
export async function getKitchenStats(): Promise<KitchenStats> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return mockStats;
}

/**
 * Update order status (mock implementation)
 */
export async function updateOrderStatus(orderId: string, status: 'preparing' | 'completed'): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  console.log(`Order ${orderId} status updated to ${status}`);
}

/**
 * Mark order item as done (mock implementation)
 */
export async function markItemDone(orderId: string, itemId: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  console.log(`Order ${orderId}, item ${itemId} marked as done`);
}
