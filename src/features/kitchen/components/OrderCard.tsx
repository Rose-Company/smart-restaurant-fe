import React from 'react';
import type { TableOrder, OrderFilterType } from '../types/kitchen.types';

interface OrderCardProps {
  order: TableOrder;
  onStart?: (orderId: string) => void;
  onDone?: (orderId: string) => void;
  onClick?: (order: TableOrder) => void;
  activeFilter?: OrderFilterType;
}

export function OrderCard({ order, onStart, onDone, onClick, activeFilter }: OrderCardProps) {
  const getStatusColor = () => {
    switch (order.status) {
      case 'delayed':
        return '#d20009';
      case 'preparing':
        return '#155dfc';
      case 'pending':
        return '#00a63e';
      case 'completed':
        return '#6b7280';
      default:
        return '#364153';
    }
  };

  // Get category matching the active filter
  const getFilterCategory = (filter?: OrderFilterType): string | null => {
    switch (filter) {
      case 'main-course': return 'Main Course';
      case 'appetizers': return 'Appetizer';
      case 'desserts': return 'Dessert';
      case 'beverages': return 'Beverage';
      default: return null;
    }
  };

  const filterCategory = getFilterCategory(activeFilter);

  // Check if item matches the active filter
  const isItemHighlighted = (itemCategory?: string) => {
    return filterCategory && itemCategory === filterCategory;
  };

  // Sort items: matching filter first, then by category priority
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
    const aMatches = isItemHighlighted(a.category);
    const bMatches = isItemHighlighted(b.category);
    
    // Prioritize matching items
    if (aMatches && !bMatches) return -1;
    if (!aMatches && bMatches) return 1;
    
    // Then sort by category priority
    return getCategoryOrder(a.category) - getCategoryOrder(b.category);
  });

  const allItemsDone = order.items.every(item => item.status === 'done');
  const isCompleted = order.status === 'completed';
  const canStart = order.status === 'pending';
  const statusColor = getStatusColor();
  const isDelayed = order.status === 'delayed';

  return (
    <div 
      style={{
        backgroundColor: '#101828',
        border: '2px solid #364153',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.2s'
      }}
      onClick={() => onClick?.(order)}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.borderColor = '#4a5565';
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.borderColor = '#364153';
      }}
    >
      {/* Header */}
      <div style={{
        backgroundColor: statusColor,
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...(isDelayed && {
          animation: 'pulse-red 1s ease-in-out infinite'
        })
      }}>
        <style>{`
          @keyframes pulse-red {
            0%, 100% {
              opacity: 1;
              background-color: #d20009;
            }
            50% {
              opacity: 0.5;
              background-color: #ff1a1a;
            }
          }
        `}</style>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: 'bold',
            lineHeight: '28px',
            letterSpacing: '-0.4395px'
          }}>
            Table {order.tableNumber}
          </span>
          <span style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '-0.3125px'
          }}>
            •
          </span>
          <span style={{
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: 'bold',
            lineHeight: '28px',
            letterSpacing: '-0.4395px'
          }}>
            {order.orderNumber}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '20px',
            letterSpacing: '-0.1504px',
            margin: 0
          }}>
            {order.time}
          </p>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '12px',
            lineHeight: '16px',
            margin: 0
          }}>
            ({order.timeAgo})
          </p>
        </div>
      </div>

      {/* Items */}
      <div style={{
        padding: '24px',
        flex: 1
      }}>
        {sortedItems.filter(item => item.status !== 'done').map((item, index, filteredItems) => {
          const isHighlighted = isItemHighlighted(item.category);
          
          return (
          <div 
            key={item.id} 
            style={{
              ...(index < filteredItems.length - 1 ? {
                borderBottom: '1px solid #1e2939',
                paddingBottom: '24px',
                marginBottom: '24px'
              } : {}),
              ...(isHighlighted ? {
                backgroundColor: 'rgba(245, 73, 0, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                border: '2px solid rgba(245, 73, 0, 0.3)',
                marginBottom: index < filteredItems.length - 1 ? '24px' : '0'
              } : {})
            }}
          >
            <h3 style={{
              color: isHighlighted ? '#ff6900' : '#ffffff',
              fontSize: '24px',
              fontWeight: 'bold',
              lineHeight: '32px',
              letterSpacing: '0.0703px',
              margin: '0 0 8px 0'
            }}>
              {item.quantity}x {item.name}
            </h3>
            {item.modifiers && item.modifiers.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {item.modifiers.map((modifier, modIndex) => (
                  <p 
                    key={modIndex}
                    style={{
                      color: '#fdc700',
                      fontSize: '16px',
                      fontWeight: 500,
                      lineHeight: '24px',
                      letterSpacing: '-0.3125px',
                      paddingLeft: '16px',
                      margin: 0
                    }}
                  >
                    • {modifier.value}
                  </p>
                ))}
              </div>
            )}
            {item.notes && (
              <p style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                lineHeight: '20px',
                paddingLeft: '16px',
                marginTop: '8px',
                margin: '8px 0 0 0'
              }}>
                Note: {item.notes}
              </p>
            )}
          </div>
        );
        })}
      </div>

      {/* Action Button */}
      <div style={{ padding: '0 24px 24px 24px' }}>
        {canStart ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStart?.(order.id);
            }}
            style={{
              width: '100%',
              backgroundColor: '#364153',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 'bold',
              lineHeight: '28px',
              letterSpacing: '-0.4492px',
              padding: '18px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a5568'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#364153'}
          >
            START
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (allItemsDone) {
                onDone?.(order.id);
              }
            }}
            disabled={!allItemsDone || isCompleted}
            style={{
              width: '100%',
              backgroundColor: allItemsDone && !isCompleted ? '#00a63e' : '#364153',
              color: allItemsDone && !isCompleted ? '#ffffff' : '#6a7282',
              fontSize: '20px',
              fontWeight: 'bold',
              lineHeight: '28px',
              letterSpacing: '-0.4492px',
              padding: '18px',
              borderRadius: '8px',
              border: 'none',
              cursor: allItemsDone && !isCompleted ? 'pointer' : 'not-allowed',
              opacity: allItemsDone && !isCompleted ? 1 : 0.5,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (allItemsDone && !isCompleted) {
                e.currentTarget.style.backgroundColor = '#009650';
              }
            }}
            onMouseLeave={(e) => {
              if (allItemsDone && !isCompleted) {
                e.currentTarget.style.backgroundColor = '#00a63e';
              }
            }}
          >
            DONE
          </button>
        )}
      </div>
    </div>
  );
}
