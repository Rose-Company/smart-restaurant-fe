import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, Wifi, TrendingUp, ArrowLeft } from 'lucide-react';
import { OrderCard } from '../components/OrderCard';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { ItemSummaryModal } from '../components/ItemSummaryModal';
import { kitchenApi } from '../services/kitchen.api';
import { transformToTableOrder } from '../types/kitchen.types';
import type { TableOrder, KitchenStats, OrderFilterType, KitchenOrder, OrderDetail } from '../types/kitchen.types';

interface KitchenDisplayPageProps {
  onBack?: () => void;
}

export function KitchenDisplayPage({ onBack }: KitchenDisplayPageProps) {
  const [orders, setOrders] = useState<TableOrder[]>([]);
  const [stats, setStats] = useState<KitchenStats | null>(null);
  const [activeFilter, setActiveFilter] = useState<OrderFilterType>('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<TableOrder | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderDetail[]>([]);
  const [showItemSummary, setShowItemSummary] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeFilter]); // Only load once on mount

  const loadData = async () => {
    try {
      // Build API params based on active filter
      const params: any = { page: 1, page_size: 100 };

      if (activeFilter === 'completed') {
        // Filter by status completed
        params.status = 'completed';
      } else if (activeFilter === 'main-course') {
        // Filter by category
        params.category = 'maincourse';
      } else if (activeFilter === 'appetizers') {
        params.category = 'appetizer';
      } else if (activeFilter === 'desserts') {
        params.category = 'dessert';
      } else if (activeFilter === 'beverages') {
        params.category = 'beverage';
      }
      // For 'all', don't add any category/status filter

      const response = await kitchenApi.list(params);
      
      // Transform API response to TableOrder format
      const transformedOrders = response.data.items.map(transformToTableOrder);
      
      // Mark orders as 'delayed' if urgent (over 30 minutes)
      const ordersWithDelayedStatus = transformedOrders.map(order => 
        order.priority === 'urgent' ? { ...order, status: 'delayed' as const } : order
      );
      
      setOrders(ordersWithDelayedStatus);
      
      // Calculate stats from orders
      const stats = calculateStats(response.data.items);
      setStats(stats);
    } catch (error) {
      console.error('Failed to load kitchen data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orders: KitchenOrder[]): KitchenStats => {
    const activeOrders = orders.filter(o => o.status !== 'completed').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedToday = orders.filter(o => o.status === 'completed').length;
    
    // Calculate average prep time from order timestamps
    const now = new Date();
    const avgMins = orders.length > 0 
      ? Math.round(
          orders
            .filter(o => o.status === 'processing' || o.status === 'completed')
            .reduce((sum, o) => {
              const createdDate = new Date(o.created_at);
              return sum + (now.getTime() - createdDate.getTime()) / 60000;
            }, 0) / Math.max(orders.filter(o => o.status !== 'pending').length, 1)
        )
      : 0;

    return {
      avgPrepTime: avgMins > 0 ? `${avgMins}m` : '12m',
      isConnected: true,
      activeOrders,
      pendingOrders,
      completedToday
    };
  };

  const handleStartOrder = async (orderId: string) => {
    try {      // First transition: pending → confirmed
      await kitchenApi.updateStatus(orderId, 'confirmed');
      await kitchenApi.updateStatus(orderId, 'preparing');
      // Reload data from API
      await loadData();
    } catch (error) {
      console.error('Failed to start order:', error);
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    // TODO: Implement when needed
    console.log('Complete order:', orderId);
  };

  const handleUpdateItem = async (orderId: string, itemId: string, isDone: boolean) => {
    // TODO: Implement when needed
    console.log('Update item:', orderId, itemId, isDone);
  };

  const handleQuickUpdate = (selections: Array<{ orderId: string; itemId: string }>) => {
    // TODO: Implement when needed
    console.log('Quick update:', selections);
  };

  const handleOrderCardClick = async (order: TableOrder) => {
    try {
      const orderDetail = await kitchenApi.detail(order.id);
      setSelectedOrderDetail([orderDetail]);
      setSelectedOrder(order);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
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
    // Skip orders with no items
    if (order.items.length === 0) {
      return false;
    }
    
    // For completed tab, show only completed orders
    if (activeFilter === 'completed') {
      return order.status === 'completed';
    }
    
    // For other tabs, exclude completed orders
    if (order.status === 'completed') {
      return false;
    }
    
    // For other filters (appetizers, desserts, beverages, main-course, all),
    // exclude orders where all items are done
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
                onClick={handleOrderCardClick}
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
        orderDetails={[]}
        isOpen={showItemSummary}
        onClose={() => setShowItemSummary(false)}
        onQuickUpdate={handleQuickUpdate}
      />
    </div>
  );
}
