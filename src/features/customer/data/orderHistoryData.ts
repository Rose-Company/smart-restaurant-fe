export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  selectedModifiers?: {
    [groupId: string]: string[];
  };
}

export interface Order {
  id: string;
  date: string;
  time: string;
  tableNumber: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'Completed' | 'Cancelled' | 'Pending';
}

export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    date: 'Jan 15, 2026',
    time: '19:30',
    tableNumber: '05',
    items: [
      { 
        id: '1', 
        name: 'Grilled Salmon', 
        quantity: 1, 
        price: 24.99,
        selectedModifiers: {
          'size': ['medium'],
          'toppings': ['cheese', 'mushrooms']
        }
      },
      { id: '2', name: 'Tiramisu', quantity: 1, price: 8.50 },
      { id: '3', name: 'Caesar Salad', quantity: 2, price: 21.01 }
    ],
    totalPrice: 54.50,
    status: 'Completed'
  },
  {
    id: '2',
    date: 'Jan 12, 2026',
    time: '13:15',
    tableNumber: '12',
    items: [
      { id: '1', name: 'Beef Wellington', quantity: 1, price: 38.00 },
      { id: '2', name: 'French Onion Soup', quantity: 1, price: 12.50 },
      { id: '3', name: 'Chocolate Lava Cake', quantity: 1, price: 12.00 }
    ],
    totalPrice: 62.50,
    status: 'Completed'
  },
  {
    id: '3',
    date: 'Jan 08, 2026',
    time: '20:45',
    tableNumber: '03',
    items: [
      { 
        id: '1', 
        name: 'Margherita Pizza', 
        quantity: 1, 
        price: 16.50,
        selectedModifiers: {
          'pizza-size': ['large'],
          'pizza-toppings': ['pepperoni', 'mushrooms', 'olives'],
          'crust-type': ['stuffed']
        }
      },
      { id: '2', name: 'Garlic Bread', quantity: 1, price: 6.00 },
      { id: '3', name: 'Tiramisu', quantity: 1, price: 25.00 }
    ],
    totalPrice: 47.50,
    status: 'Completed'
  },
  {
    id: '4',
    date: 'Jan 05, 2026',
    time: '18:00',
    tableNumber: '08',
    items: [
      { 
        id: '1', 
        name: 'Sushi Platter', 
        quantity: 1, 
        price: 45.00,
        selectedModifiers: {
          'sushi-size': ['large'],
          'sushi-extras': ['spicy-mayo', 'eel-sauce']
        }
      },
      { id: '2', name: 'Miso Soup', quantity: 1, price: 8.00 },
      { id: '3', name: 'Green Tea Ice Cream', quantity: 1, price: 8.00 }
    ],
    totalPrice: 61.00,
    status: 'Completed'
  },
  {
    id: '5',
    date: 'Jan 02, 2026',
    time: '12:30',
    tableNumber: '15',
    items: [
      { id: '1', name: 'Club Sandwich', quantity: 1, price: 14.00 },
      { id: '2', name: 'Iced Coffee', quantity: 1, price: 5.50 }
    ],
    totalPrice: 19.50,
    status: 'Cancelled'
  }
];
