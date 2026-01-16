export interface OrderHistoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  status: 'Served' | 'Preparing' | 'Pending';
}

export interface OrderRound {
  roundNumber: number;
  time: string;
  items: OrderHistoryItem[];
}

export interface OrderHistory {
  tableNumber: string;
  rounds: OrderRound[];
  subtotal: number;
  vat: number;
  total: number;
}

export const DEFAULT_ORDER_HISTORY: OrderHistory = {
  tableNumber: '05',
  rounds: [
    {
      roundNumber: 1,
      time: '7:28 PM',
      items: [
        { id: '1', name: 'Truffle Burger', quantity: 1, price: 28.50, status: 'Served' },
        { id: '2', name: 'Grilled Salmon', quantity: 1, price: 24.99, status: 'Served' },
        { id: '3', name: 'Lobster Linguine', quantity: 1, price: 38.00, status: 'Served' },
      ]
    },
    {
      roundNumber: 2,
      time: '7:28 PM',
      items: [
        { id: '4', name: 'Grilled Salmon', quantity: 2, price: 49.98, status: 'Preparing' },
      ]
    }
  ],
  subtotal: 141.47,
  vat: 11.32,
  total: 152.79
};
