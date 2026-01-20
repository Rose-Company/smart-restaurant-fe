import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, Wifi, TrendingUp, ArrowLeft } from 'lucide-react';
import { OrderCard } from '../components/OrderCard';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { ItemSummaryModal } from '../components/ItemSummaryModal';
import { kitchenApi } from '../services/kitchen.api';
import { transformToTableOrder, determineCategoryFromName } from '../types/kitchen.types';
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
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Clear orders list before loading new data
      setOrders([]);
      
      const params: any = { page: 1, page_size: 100 };

      if (activeFilter === 'completed') {
        params.status = 'completed';
      } else if (activeFilter === 'main-course') {
        params.category = 'maincourse';
      } else if (activeFilter === 'appetizers') {
        params.category = 'appetizer';
      } else if (activeFilter === 'desserts') {
        params.category = 'dessert';
      } else if (activeFilter === 'beverages') {
        params.category = 'beverage';
      }

      const response = await kitchenApi.list(params);
      const transformedOrders = response.data.items.map(transformToTableOrder);
      
      // Mark orders as 'delayed' if over 30 minutes and not completed
      const now = new Date();
      const ordersWithDelayedStatus = transformedOrders.map(order => {
        // Don't mark completed orders as delayed
        if (order.status === 'completed') {
          return order;
        }
        
        // Calculate time difference in minutes
        const orderTime = new Date(response.data.items.find((o: any) => o.id.toString() === order.id)?.created_at || '');
        const minutesSinceCreated = (now.getTime() - orderTime.getTime()) / 60000;
        
        // Mark as delayed if over 30 minutes
        if (minutesSinceCreated > 30) {
          return { ...order, status: 'delayed' as const };
        }
        
        return order;
      });
      
      setOrders(ordersWithDelayedStatus);
      
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
    try {
      await kitchenApi.updateStatus(orderId, 'confirmed');
      await kitchenApi.updateStatus(orderId, 'preparing');
      await loadData();
    } catch (error) {
      console.error('Failed to start order:', error);
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    setIsUpdating(true);
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      // Update all items to completed
      const itemsToUpdate = order.items.map(item => ({
        menu_item_id: item.menu_item_id || parseInt(item.id),
        status: 'completed'
      }));
      await kitchenApi.updateItemsInOrder(orderId, itemsToUpdate);
      
      // Update order status to completed
      await kitchenApi.updateStatus(orderId, 'completed');
      
      setSelectedOrder(null);
      await loadData();
    } catch (error) {
      console.error('Failed to complete order:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateItem = async (orderId: string, itemId: string, status: 'completed' | 'pending') => {
    setIsUpdating(true);
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const item = order.items.find(i => i.id === itemId);
      if (!item) return;

      const menuItemId = item.menu_item_id || parseInt(item.id);
      await kitchenApi.updateItemsInOrder(orderId, [
        { menu_item_id: menuItemId, status: status }
      ]);
      
      // Reload to get fresh data
      await loadData();
    } catch (error) {
      console.error('Failed to update item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle batch update with auto-completion
  const handleBatchUpdate = async (orderId: string, updates: Record<string, 'done' | 'pending'>) => {
    setIsUpdating(true);
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      // Check if all items will be done after this update
      const allDone = Object.values(updates).every(status => status === 'done') 
                      && Object.keys(updates).length === order.items.length;

      // Prepare all item updates with correct final status
      const itemsToUpdate = Object.entries(updates).map(([itemId, status]) => {
        const item = order.items.find(i => i.id === itemId);
        if (!item) return null;
        
        return {
          menu_item_id: item.menu_item_id || parseInt(item.id),
          // Convert 'done' to 'completed' for API, keep 'pending' as is
          status: status === 'done' ? 'completed' : status
        };
      }).filter(Boolean) as Array<{ menu_item_id: number; status: string }>;

      if (itemsToUpdate.length === 0) return;

      // Update all items (API will auto-complete order if all items completed)
      await kitchenApi.updateItemsInOrder(orderId, itemsToUpdate);

      setSelectedOrder(null);
      await loadData();
    } catch (error) {
      console.error('Failed to batch update items:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickUpdate = (selections: Array<{ orderId: string; itemId: string }>) => {
    console.log('Quick update:', selections);
  };

  const handleOrderCardClick = async (order: TableOrder) => {
    try {
      const orderDetail = await kitchenApi.detail(order.id);
      console.log('Fresh order detail from API:', orderDetail);
      
      // Calculate if order is delayed (over 30 minutes and not completed)
      let modalStatus = order.status;
      if (orderDetail.status === 'completed') {
        modalStatus = 'completed';
      } else {
        const now = new Date();
        const orderTime = new Date(orderDetail.created_at);
        const minutesSinceCreated = (now.getTime() - orderTime.getTime()) / 60000;
        
        if (minutesSinceCreated > 30) {
          modalStatus = 'delayed';
        }
      }
      
      // Transform fresh order detail to TableOrder format
      const freshOrder: TableOrder = {
        id: orderDetail.id.toString(),
        tableNumber: orderDetail.table_name,
        orderNumber: orderDetail.order_number,
        time: order.time,
        timeAgo: order.timeAgo,
        status: modalStatus, // Use calculated status
        priority: order.priority,
        items: orderDetail.items.map(item => ({
          id: item.id.toString(),
          menu_item_id: item.menu_item_id,
          name: item.menu_item_name,
          quantity: item.quantity,
          category: determineCategoryFromName(item.menu_item_name),
          modifiers: item.modifiers?.map(m => ({
            name: m.modifier_group_name,
            value: m.modifier_option_name
          })) || [],
          // Map item status: API might return 'completed' but we use 'done' in UI
          status: (item.status === 'completed' ? 'done' : item.status) as 'pending' | 'done'
        }))
      };
      
      setSelectedOrderDetail([orderDetail]);
      setSelectedOrder(freshOrder);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };



  const filters: { label: string; value: OrderFilterType }[] = [
    { label: 'All Orders', value: 'all' },
    { label: 'Main Course', value: 'main-course' },
    { label: 'Appetizers', value: 'appetizers' },
    { label: 'Desserts', value: 'desserts' },
    { label: 'Beverages', value: 'beverages' },
    { label: 'Completed', value: 'completed' },
  ];

  const displayOrders = orders.filter(order => {
    if (order.items.length === 0) {
      return false;
    }
    
    if (activeFilter === 'completed') {
      return order.status === 'completed';
    }
    
    if (order.status === 'completed') {
      return false;
    }
    
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
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

        {loading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            gap: '20px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgb(255, 105, 0) 0%, rgb(231, 0, 11) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'spin 1s linear infinite'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#000000'
              }} />
            </div>
            <p style={{
              color: '#99a1af',
              fontSize: '16px',
              margin: 0
            }}>
              Fetching orders...
            </p>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : displayOrders.length === 0 ? (
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

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onBatchUpdate={handleBatchUpdate}
          onComplete={handleCompleteOrder}
          isLoading={isUpdating}
        />
      )}

      <ItemSummaryModal
        orders={orders.filter(o => o.items.some(item => item.status !== 'done'))}
        orderDetails={[]}
        isOpen={showItemSummary}
        onClose={() => setShowItemSummary(false)}
        onQuickUpdate={handleQuickUpdate}
      />
    </div>
  );
}