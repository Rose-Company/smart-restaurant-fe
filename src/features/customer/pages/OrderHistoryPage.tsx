import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { ReportIssueModal } from '../components/ReportIssueModal';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  time: string;
  tableNumber: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'Completed' | 'Cancelled' | 'Pending';
}

interface OrderHistoryPageProps {
  onBack?: () => void;
}

export function OrderHistoryPage({ onBack }: OrderHistoryPageProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    // Mock data for orders
    const mockOrders: Order[] = [
      {
        id: '1',
        date: 'Jan 15, 2026',
        time: '19:30',
        tableNumber: '05',
        items: [
          { id: '1', name: 'Grilled Salmon', quantity: 1, price: 24.99 },
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
          { id: '1', name: 'Margherita Pizza', quantity: 1, price: 16.50 },
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
          { id: '1', name: 'Sushi Platter', quantity: 1, price: 45.00 },
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

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Completed':
        return {
          bg: '#dcfce7',
          border: '#b9f8cf',
          text: '#008236'
        };
      case 'Cancelled':
        return {
          bg: '#ffe2e2',
          border: '#ffc9c9',
          text: '#c10007'
        };
      case 'Pending':
        return {
          bg: '#fef3c7',
          border: '#fde68a',
          text: '#92400e'
        };
    }
  };

  const getItemsSummary = (items: OrderItem[]) => {
    if (items.length <= 2) {
      return items.map(item => item.name).join(', ');
    }
    const firstTwo = items.slice(0, 2).map(item => item.name).join(', ');
    const remaining = items.length - 2;
    return `${firstTwo} + ${remaining} other${remaining > 1 ? 's' : ''}...`;
  };

  const handleReorder = (order: Order) => {
    alert(`Re-order feature for order #${order.id} coming soon!`);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleReportIssue = () => {
    setShowReportModal(true);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '3px solid #e5e7eb', 
            borderTopColor: '#52b788',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '10px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ArrowLeft style={{ width: '24px', height: '24px', color: '#1f2937' }} />
          </button>
        )}
        <h1 style={{
          fontSize: '16px',
          fontWeight: '400',
          color: '#101828',
          margin: 0,
          flex: 1
        }}>
          My Past Orders
        </h1>
      </div>

      {/* Orders List */}
      <div style={{ padding: '16px' }}>
        {orders.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>No orders yet</p>
            <p style={{ fontSize: '14px', color: '#9ca3af' }}>Your order history will appear here</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => {
              const statusColor = getStatusColor(order.status);
              return (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '16px',
                    padding: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* Date/Time and Status */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#4a5565'
                    }}>
                      <Calendar style={{ width: '16px', height: '16px' }} />
                      <span>{order.date}</span>
                      <span>•</span>
                      <Clock style={{ width: '16px', height: '16px' }} />
                      <span>{order.time}</span>
                    </div>
                    <div style={{
                      backgroundColor: statusColor.bg,
                      border: `1px solid ${statusColor.border}`,
                      borderRadius: '8px',
                      padding: '2px 8px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: statusColor.text
                    }}>
                      {order.status}
                    </div>
                  </div>

                  {/* Table and Items */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '400',
                      color: '#101828',
                      marginBottom: '4px'
                    }}>
                      Table {order.tableNumber}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#4a5565',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {getItemsSummary(order.items)}
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div style={{
                    borderTop: '1px solid #f3f4f6',
                    paddingTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '400',
                      color: '#27ae60'
                    }}>
                      ${order.totalPrice.toFixed(2)}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleViewDetails(order)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: 'transparent',
                          color: '#27ae60',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        View Details
                      </button>
                      {order.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleReorder(order)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: '#ffffff',
                            color: '#27ae60',
                            border: '1px solid #27ae60',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                        >
                          Re-order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          order={{
            id: selectedOrder.id,
            orderNumber: `ORD-2026-${selectedOrder.id.padStart(3, '0')}`,
            date: selectedOrder.date,
            time: selectedOrder.time,
            tableNumber: selectedOrder.tableNumber,
            items: selectedOrder.items.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })),
            subtotal: selectedOrder.totalPrice / 1.1, // Calculate subtotal before tax
            tax: selectedOrder.totalPrice - (selectedOrder.totalPrice / 1.1),
            total: selectedOrder.totalPrice,
            paymentMethod: 'Credit Card •••• 4242',
            status: selectedOrder.status === 'Completed' ? 'Paid' : selectedOrder.status === 'Cancelled' ? 'Cancelled' : 'Pending'
          }}
          onReorder={() => handleReorder(selectedOrder)}
          onReportIssue={handleReportIssue}
        />
      )}

      {/* Report Issue Modal */}
      {selectedOrder && (
        <ReportIssueModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          orderNumber={`ORD-2026-${selectedOrder.id.padStart(3, '0')}`}
        />
      )}
    </div>
  );
}
