import React, { useState, useEffect } from 'react';
import { X, Clock, Printer, Check, Loader2 } from 'lucide-react';
import type { TableOrder, OrderItem } from '../types/kitchen.types';

interface OrderDetailModalProps {
  order: TableOrder;
  isOpen: boolean;
  onClose: () => void;
  onBatchUpdate: (orderId: string, updates: Record<string, 'done' | 'pending'>) => void;
  onComplete: (orderId: string) => void;
  isLoading?: boolean;
}

export function OrderDetailModal({ 
  order, 
  isOpen, 
  onClose, 
  onBatchUpdate,
  onComplete,
  isLoading = false
}: OrderDetailModalProps) {
  // Local state to track ALL item statuses
  const [localItems, setLocalItems] = useState<Record<string, 'done' | 'pending'>>({});
  const [hasChanges, setHasChanges] = useState(false);
  
  // Initialize localItems with ALL items from order
  useEffect(() => {
    if (isOpen) {
      console.log('Order Detail Modal opened with order:', order);
      const initialState: Record<string, 'done' | 'pending'> = {};
      order.items.forEach(item => {
        initialState[item.id] = item.status || 'pending';
      });
      setLocalItems(initialState);
      setHasChanges(false);
    }
  }, [isOpen, order.items]);
  
  if (!isOpen) return null;

  const getStatusColor = () => {
    // Don't show 'delayed' color if order is completed
    if (order.status === 'completed') {
      return '#364153'; // gray for completed
    }
    
    switch (order.status) {
      case 'delayed':
        return '#e7000b';
      case 'preparing':
        return '#155dfc';
      case 'pending':
        return '#00a63e';
      default:
        return '#364153';
    }
  };

  // Get item status (local changes override order status)
  const getItemStatus = (item: OrderItem) => {
    return localItems[item.id] || item.status || 'pending';
  };

  const toggleItemStatus = (itemId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'pending' : 'done';
    setLocalItems(prev => ({
      ...prev,
      [itemId]: newStatus
    }));
    setHasChanges(true);
  };

  const handleUpdate = () => {
    if (!hasChanges) {
      onClose();
      return;
    }

    // Send batch update to parent
    onBatchUpdate(order.id, localItems);
  };

  const handleComplete = () => {
    if (!allItemsDone) return;
    onComplete(order.id);
  };

  // Sort items by category priority
  const getCategoryOrder = (category?: string) => {
    switch (category) {
      case 'Appetizer': return 1;
      case 'Main Course': return 2;
      case 'Dessert': return 3;
      case 'Beverage': return 4;
      default: return 5;
    }
  };

  const sortedItems = [...order.items].sort((a, b) => {
    return getCategoryOrder(a.category) - getCategoryOrder(b.category);
  });

  const completedItems = Object.values(localItems).filter(status => status === 'done').length;
  const totalItems = order.items.length;
  const allItemsDone = completedItems === totalItems;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: '#101828',
        border: '2px solid #364153',
        borderRadius: '24px',
        width: '896px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: getStatusColor(),
          padding: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{
              fontSize: '30px',
              fontWeight: 'bold',
              lineHeight: '36px',
              letterSpacing: '0.3955px',
              color: '#ffffff',
              margin: '0 0 8px 0'
            }}>
              Table {order.tableNumber} • {order.orderNumber}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock style={{ width: '16px', height: '16px', color: 'rgba(255, 255, 255, 0.9)' }} />
              <span style={{
                fontSize: '18px',
                lineHeight: '28px',
                letterSpacing: '-0.4395px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                {order.time}
              </span>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>•</span>
              <span style={{
                fontSize: '18px',
                fontWeight: 500,
                lineHeight: '28px',
                letterSpacing: '-0.4395px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                {order.timeAgo}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '14px',
              padding: '12px 24px'
            }}>
              <p style={{
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '20px',
                letterSpacing: '-0.1504px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '0 0 4px 0'
              }}>
                Progress
              </p>
              <p style={{
                fontSize: '24px',
                fontWeight: 'bold',
                lineHeight: '32px',
                letterSpacing: '0.0703px',
                color: '#ffffff',
                margin: 0
              }}>
                {completedItems}/{totalItems}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            >
              <X style={{ width: '24px', height: '24px', color: '#ffffff' }} />
            </button>
          </div>
        </div>

        {/* Items List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 32px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sortedItems.map((item) => {
              const itemStatus = getItemStatus(item);
              const isDone = itemStatus === 'done';
              
              return (
              <div
                key={item.id}
                style={{
                  backgroundColor: isDone ? 'rgba(30, 41, 57, 0.5)' : '#1e2939',
                  border: isDone ? '2px solid #364153' : '2px solid #4a5565',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  transition: 'all 0.2s'
                }}
              >
                {/* Quantity Badge */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...(isDone 
                    ? { backgroundColor: '#364153' }
                    : { background: 'linear-gradient(135deg, rgb(255, 105, 0) 0%, rgb(245, 73, 0) 100%)' }
                  )
                }}>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    lineHeight: '32px',
                    letterSpacing: '0.0703px',
                    color: isDone ? '#6a7282' : '#ffffff'
                  }}>
                    {item.quantity}x
                  </span>
                </div>

                {/* Item Details */}
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    lineHeight: '32px',
                    letterSpacing: '0.0703px',
                    color: isDone ? '#6a7282' : '#ffffff',
                    margin: '0 0 8px 0',
                    ...(isDone && {
                      textDecoration: 'line-through'
                    })
                  }}>
                    {item.name}
                  </h3>
                  {item.modifiers && item.modifiers.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {item.modifiers.map((modifier, idx) => (
                        <p
                          key={idx}
                          style={{
                            fontSize: '16px',
                            fontWeight: 500,
                            lineHeight: '24px',
                            letterSpacing: '-0.3125px',
                            color: isDone ? '#4a5565' : '#fdc700',
                            margin: 0,
                            ...(isDone && {
                              textDecoration: 'line-through'
                            })
                          }}
                        >
                          • {modifier.value}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Checkbox */}
                <button
                  onClick={() => toggleItemStatus(item.id, itemStatus)}
                  disabled={isLoading}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    border: isDone ? '4px solid #00a63e' : '4px solid #4a5565',
                    backgroundColor: isDone ? '#00a63e' : 'transparent',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isDone && !isLoading) {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 166, 62, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDone && !isLoading) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {isLoading && !isDone ? (
                    <Loader2 style={{ width: '24px', height: '24px', color: '#4a5565', animation: 'spin 1s linear infinite' }} />
                  ) : isDone ? (
                    <Check style={{ width: '32px', height: '32px', color: '#ffffff' }} />
                  ) : null}
                </button>
              </div>
            );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          backgroundColor: 'rgba(30, 41, 57, 0.5)',
          borderTop: '2px solid #364153',
          padding: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            style={{
              height: '52px',
              padding: '0 24px',
              border: '2px solid #4a5565',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 500,
              lineHeight: '28px',
              letterSpacing: '-0.4395px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(74, 85, 101, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Printer style={{ width: '16px', height: '16px' }} />
            PRINT TICKET
          </button>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={handleUpdate}
              disabled={isLoading}
              style={{
                height: '48px',
                padding: '0 24px',
                border: 'none',
                borderRadius: '8px',
                background: isLoading ? '#4a5565' : 'linear-gradient(to right, #155dfc, #1447e6)',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: 'bold',
                lineHeight: '28px',
                letterSpacing: '-0.4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: isLoading ? 'none' : '0px 10px 15px -3px rgba(21,93,252,0.3), 0px 4px 6px -4px rgba(21,93,252,0.3)',
                transition: 'opacity 0.2s',
                opacity: isLoading ? 0.6 : 1,
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.currentTarget.style.opacity = '1';
              }}
            >
              {allItemsDone ? 'COMPLETE' : 'UPDATE'}
            </button>

            <button
              onClick={handleComplete}
              disabled={!allItemsDone || isLoading}
              style={{
                height: '48px',
                padding: '0 24px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: allItemsDone && !isLoading ? '#00a63e' : '#364153',
                color: allItemsDone ? '#ffffff' : '#6a7282',
                fontSize: '18px',
                fontWeight: 'bold',
                lineHeight: '28px',
                letterSpacing: '-0.4px',
                cursor: allItemsDone && !isLoading ? 'pointer' : 'not-allowed',
                opacity: allItemsDone ? 1 : 0.5,
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (allItemsDone && !isLoading) e.currentTarget.style.backgroundColor = '#009633';
              }}
              onMouseLeave={(e) => {
                if (allItemsDone && !isLoading) e.currentTarget.style.backgroundColor = '#00a63e';
              }}
            >
              {isLoading ? (
                <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
              ) : (
                <span>✓</span>
              )}
              DONE ({completedItems}/{totalItems})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}