import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { ReportIssueModal } from '../components/ReportIssueModal';
import { ReorderSuccessModal } from '../components/ReorderSuccessModal';
import type { MenuItem } from '../../menu/types/menu.types';
import { findMenuItemByName } from '../data/menuData';
import { MOCK_ORDERS, type Order, type OrderItem } from '../data/orderHistoryData';

interface OrderHistoryPageProps {
  onBack?: () => void;
}

export function OrderHistoryPage({ onBack }: OrderHistoryPageProps) {
  const { t } = useTranslation('customer');
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReorderSuccessModal, setShowReorderSuccessModal] = useState(false);
  const [reorderedItemCount, setReorderedItemCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setOrders(MOCK_ORDERS);
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
    // Add all items from the order to cart
    order.items.forEach(orderItem => {
      // Try to find the actual menu item by name
      const actualMenuItem = findMenuItemByName(orderItem.name);
      
      // Convert order item to MenuItem format
      const menuItem: MenuItem = actualMenuItem ? {
        ...actualMenuItem,
        // Keep the price from order history in case it's different
        price: orderItem.price
      } : {
        // Fallback if item not found in menu
        id: parseInt(orderItem.id),
        name: orderItem.name,
        price: orderItem.price,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        category: 'Main Course',
        status: 'available' as const,
        lastUpdate: new Date().toISOString(),
        chefRecommended: false,
        description: '',
        modifiers: []
      };
      
      // Calculate modifier price if modifiers exist
      let modifierPrice = 0;
      if (orderItem.selectedModifiers && actualMenuItem?.modifiers) {
        Object.entries(orderItem.selectedModifiers).forEach(([groupId, optionIds]) => {
          const group = actualMenuItem.modifiers?.find(g => g.id === groupId);
          if (group && optionIds) {
            optionIds.forEach(optionId => {
              const option = group.options?.find(opt => opt.id === optionId);
              if (option && option.price) {
                modifierPrice += option.price;
              }
            });
          }
        });
      }
      
      // Add to cart with modifiers and modifier price
      addToCart(menuItem, orderItem.quantity, orderItem.selectedModifiers, modifierPrice);
    });
    
    // Show success modal
    setReorderedItemCount(order.items.length);
    setShowReorderSuccessModal(true);
  };

  const handleViewCart = () => {
    setShowReorderSuccessModal(false);
    // Navigate back to menu which will open cart automatically
    if (onBack) {
      onBack();
      // Small delay to ensure navigation completes before opening cart
      setTimeout(() => {
        // Trigger cart drawer open event or directly manipulate if you have access
        // For now, user can manually open cart from menu
      }, 100);
    }
  };

  const handleContinueBrowsing = () => {
    setShowReorderSuccessModal(false);
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
          <p style={{ color: '#6b7280', fontSize: '16px' }}>{t('orderHistory.loadingOrders')}</p>
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
          {t('orderHistory.title')}
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
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>{t('orderHistory.noOrders')}</p>
            <p style={{ fontSize: '14px', color: '#9ca3af' }}>{t('orderHistory.noOrdersMessage')}</p>
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
                      {t('orderHistory.table')} {order.tableNumber}
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
                        {t('orderHistory.details')}
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
                          {t('orderHistory.reorder')}
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
              price: item.price,
              selectedModifiers: item.selectedModifiers
            })),
            subtotal: selectedOrder.totalPrice / 1.1, // Calculate subtotal before tax
            tax: selectedOrder.totalPrice - (selectedOrder.totalPrice / 1.1),
            total: selectedOrder.totalPrice,
            paymentMethod: 'Cash',
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

      {/* Reorder Success Modal */}
      <ReorderSuccessModal
        isOpen={showReorderSuccessModal}
        itemCount={reorderedItemCount}
        onViewCart={handleViewCart}
        onContinue={handleContinueBrowsing}
      />
    </div>
  );
}
