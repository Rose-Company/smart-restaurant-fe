import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, Wifi, TrendingUp, ArrowLeft } from 'lucide-react';
import { OrderCard } from '../components/OrderCard';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { ItemSummaryModal } from '../components/ItemSummaryModal';
import { kitchenApi } from '../services/kitchen.api';
import type { TableOrder, KitchenStats, OrderFilterType } from '../types/kitchen.types';

interface KitchenDisplayPageProps {
  onBack?: () => void;
}

export function KitchenDisplayPage({ onBack }: KitchenDisplayPageProps) {
  const [orders, setOrders] = useState<TableOrder[]>([]);
  const [stats, setStats] = useState<KitchenStats | null>(null);
  const [activeFilter, setActiveFilter] = useState<OrderFilterType>('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<TableOrder | null>(null);
  const [showItemSummary, setShowItemSummary] = useState(false);

  useEffect(() => {
    loadData();
  }, []); // Only load once on mount

  const loadData = async () => {
    try {
      const [ordersData, statsData] = await Promise.all([
        kitchenApi.list('all'), // Always fetch all orders
        kitchenApi.stats()
      ]);
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load kitchen data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartOrder = async (orderId: string) => {
    try {
      await kitchenApi.updateStatus(orderId, 'preparing');
      // Update local state without reload
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: 'preparing' } : order
        )
      );
    } catch (error) {
      console.error('Failed to start order:', error);
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      await kitchenApi.updateStatus(orderId, 'completed');
      // Update local state without reload
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: 'completed' } : order
        )
      );
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to complete order:', error);
    }
  };

  const handleUpdateItem = async (orderId: string, itemId: string, isDone: boolean) => {
    // Update item status in local state
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            items: order.items.map(item => 
              item.id === itemId 
                ? { ...item, status: isDone ? 'done' : 'pending' }
                : item
            )
          };
        }
        return order;
      })
    );

    // Update selected order if it's the same
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? {
        ...prev,
        items: prev.items.map(item => 
          item.id === itemId 
            ? { ...item, status: isDone ? 'done' : 'pending' }
            : item
        )
      } : null);
    }

    // Call API to persist change
    try {
      await kitchenApi.markItemDone(orderId, itemId);
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const handleQuickUpdate = (selections: Array<{ orderId: string; itemId: string }>) => {
    // Update multiple items at once
    selections.forEach(({ orderId, itemId }) => {
      handleUpdateItem(orderId, itemId, true);
    });
  };

  if (loading) {
    return (
      <div style={{
        flex: 1,
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: '#6b7280' }}>Loading kitchen display...</div>
      </div>
    );
  }

  const filters: { label: string; value: OrderFilterType }[] = [
    { label: 'All Orders', value: 'all' },
    { label: 'Main Course', value: 'main-course' },
    { label: 'Appetizers', value: 'appetizers' },
    { label: 'Desserts', value: 'desserts' },
    { label: 'Beverages', value: 'beverages' },
    { label: 'Completed', value: 'completed' },
  ];

  // Filter orders based on active filter and item status
  const displayOrders = orders.filter(order => {
    // For completed tab, show only completed orders
    if (activeFilter === 'completed') {
      return order.status === 'completed';
    }
    
    // For other tabs, exclude completed orders
    if (order.status === 'completed') {
      return false;
    }
    
    // Filter by category
    if (activeFilter === 'main-course') {
      return order.items.some(item => item.category === 'Main Course' && item.status !== 'done');
    }
    if (activeFilter === 'appetizers') {
      return order.items.some(item => item.category === 'Appetizer' && item.status !== 'done');
    }
    if (activeFilter === 'desserts') {
      return order.items.some(item => item.category === 'Dessert' && item.status !== 'done');
    }
    if (activeFilter === 'beverages') {
      return order.items.some(item => item.category === 'Beverage' && item.status !== 'done');
    }
    
    // For 'all', exclude orders where all items are done
    return order.items.some(item => item.status !== 'done');
  });

  return (
    <div style={{
      flex: 1,
      backgroundColor: '#f9fafb',
      overflow: 'auto'
    }}>
      <div style={{
        backgroundColor: '#000000',
        minHeight: '100%',
        padding: '24px'
      }}>
        {/* Header Section */}
        <div style={{ marginBottom: '24px' }}>
          {/* Top Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            {/* Station Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {onBack && (
                <button
                  onClick={onBack}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#1e2939',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a3a4d'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e2939'}
                >
                  <ArrowLeft style={{ width: '24px', height: '24px', color: '#ffffff' }} />
                </button>
              )}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgb(255, 105, 0) 0%, rgb(231, 0, 11) 100%)'
              }}>
                <ChefHat style={{ width: '28px', height: '28px', color: '#ffffff' }} />
              </div>
              <div>
                <h1 style={{
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  lineHeight: '32px',
                  letterSpacing: '0.0703px',
                  margin: 0
                }}>
                  Main Hot Line
                </h1>
                <p style={{
                  color: '#99a1af',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.1504px',
                  margin: 0
                }}>
                  Kitchen Station
                </p>
              </div>
            </div>

            {/* Stats & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {/* Avg Prep Time */}
              <div style={{
                backgroundColor: '#1e2939',
                borderRadius: '10px',
                padding: '0 16px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Clock style={{ width: '20px', height: '20px', color: '#ffffff' }} />
                <div>
                  <p style={{
                    color: '#99a1af',
                    fontSize: '12px',
                    lineHeight: '16px',
                    margin: 0
                  }}>
                    Avg Prep Time
                  </p>
                  <p style={{
                    color: '#ffffff',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    lineHeight: '28px',
                    letterSpacing: '-0.4395px',
                    margin: 0
                  }}>
                    {stats?.avgPrepTime || '12m'}
                  </p>
                </div>
              </div>

              {/* Connection Status */}
              <div style={{
                backgroundColor: '#1e2939',
                borderRadius: '10px',
                padding: '0 16px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#00c950',
                  borderRadius: '50%',
                  opacity: 0.885
                }} />
                <Wifi style={{ width: '20px', height: '20px', color: '#ffffff' }} />
                <span style={{
                  color: '#d1d5dc',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.1504px'
                }}>
                  Connected
                </span>
              </div>

              {/* Item Summary Button */}
              <button 
                onClick={() => setShowItemSummary(true)}
                style={{
                  background: 'linear-gradient(to right, #9810fa, #8200db)',
                  borderRadius: '8px',
                  padding: '0 16px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <TrendingUp style={{ width: '16px', height: '16px', color: '#ffffff' }} />
                <span style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  letterSpacing: '-0.1504px'
                }}>
                  Item Summary
                </span>
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                style={{
                  borderRadius: '10px',
                  padding: '0 24px',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '24px',
                  letterSpacing: '-0.3125px',
                  transition: 'all 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                  ...(activeFilter === filter.value
                    ? {
                        background: 'linear-gradient(to right, #f54900, #e7000b)',
                        color: '#ffffff',
                        boxShadow: '0px 10px 15px -3px rgba(245,73,0,0.3), 0px 4px 6px -4px rgba(245,73,0,0.3)'
                      }
                    : {
                        backgroundColor: '#1e2939',
                        color: '#99a1af'
                      })
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        {displayOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '18px' }}>
              No orders to display
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
            paddingBottom: '16px'
          }}>
            {displayOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStart={handleStartOrder}
                onDone={handleCompleteOrder}
                onClick={setSelectedOrder}
                activeFilter={activeFilter}
              />
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateItem={handleUpdateItem}
          onComplete={handleCompleteOrder}
        />
      )}

      {/* Item Summary Modal */}
      <ItemSummaryModal
        orders={orders}
        isOpen={showItemSummary}
        onClose={() => setShowItemSummary(false)}
        onQuickUpdate={handleQuickUpdate}
      />
    </div>
  );
}
