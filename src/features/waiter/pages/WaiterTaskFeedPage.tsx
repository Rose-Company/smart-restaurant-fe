import React, { useState, useEffect } from 'react';
import { ChefHat, MessageCircle, Receipt, Bell } from 'lucide-react';
import { WaiterTask, TaskFilterType } from '../types/waiter.types';
import { waiterApi } from '../services/waiter.api';
import { serveApi, Table, TableDetail } from '../services/serve.api';
import { WaiterTaskCard } from '../components/WaiterTaskCard';
import { SuccessNotification } from '../components/SuccessNotification';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { PaymentModal } from '../components/PaymentModal';
import { TableMapModal } from '../components/TableMapModal';

export const WaiterTaskFeedPage: React.FC = () => {
  const [tasks, setTasks] = useState<WaiterTask[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<TaskFilterType>('all');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedTask, setSelectedTask] = useState<WaiterTask | null>(null);
  const [selectedTableDetail, setSelectedTableDetail] = useState<TableDetail | null>(null);
  const [paymentTask, setPaymentTask] = useState<WaiterTask | null>(null);
  const [paymentTableDetail, setPaymentTableDetail] = useState<TableDetail | null>(null);
  const [showTableMap, setShowTableMap] = useState(false);

  useEffect(() => {
    // Check for payment callback result in URL
    const searchParams = new URLSearchParams(window.location.search);
    const paymentSuccess = searchParams.get('payment_success');
    const paymentError = searchParams.get('payment_error');
    const paymentId = searchParams.get('payment_id');

    if (paymentSuccess === 'true') {
      setNotificationMessage(`Payment ${paymentId} completed successfully!`);
      setShowNotification(true);
      // Clear URL params
      window.history.replaceState({}, '', '/admin/waiter');
      // Reload tasks to refresh list
      loadTasks();
    } else if (paymentError === 'true') {
      setNotificationMessage('Payment failed. Please try again.');
      setShowNotification(true);
      // Clear URL params
      window.history.replaceState({}, '', '/admin/waiter');
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [activeFilter]);

  /**
   * Transform Table from API to WaiterTask format
   */
  const transformTableToTask = (table: Table): WaiterTask => {
    let taskType: 'kitchen_ready' | 'customer_request' | 'payment_request';
    
    if (table.is_ready_to_bill) {
      taskType = 'payment_request';
    } else if (table.is_help_needed) {
      taskType = 'customer_request';
    } else {
      taskType = 'kitchen_ready';
    }

    return {
      id: String(table.id),
      tableNumber: table.table_number,
      type: taskType,
      status: 'pending',
      createdAt: new Date(table.updated_at),
      items: table.orders?.[0]?.items?.map(item => ({
        id: String(item.id),
        name: item.item_name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        status: item.status
      })) || [],
      totalAmount: table.total_bill,
      //capacity: table.capacity,
      //location: table.location,
      //tableStatus: table.status,
      //activeOrdersCount: table.active_orders_count,
      //guestCount: 0,
      //isHelpNeeded: table.is_help_needed,
      //isReadyToBill: table.is_ready_to_bill
    };
  };

  /**
   * Load tasks from API based on active filter
   */
  const loadTasks = async () => {
    try {
      setLoading(true);
      
      let tablesData: Table[] = [];
      
      // Get token
      const token = localStorage.getItem('admin_auth_token');
      if (!token) {
        console.log('No admin token found, using fallback mock data');
        const mockData = await waiterApi.list(activeFilter);
        setTasks(mockData);
        return;
      }

      // Fetch tables based on active filter with correct parameters
      switch (activeFilter) {
        case 'kitchen':
          // Kitchen tab: occupied tables (excluding help needed and ready to bill)
          tablesData = await serveApi.getTablesList(
            { status: 'occupied' },
            token
          ).then(res => res.items);
          // Filter out help needed and ready to bill from kitchen view
          tablesData = tablesData.filter(t => !t.is_help_needed && !t.is_ready_to_bill);
          break;
          
        case 'requests':
          // Requests tab: occupied tables with help needed
          tablesData = await serveApi.getTablesList(
            { status: 'occupied', is_help_needed: true },
            token
          ).then(res => res.items);
          break;
          
        case 'payment':
          // Payment tab: occupied tables ready for billing
          tablesData = await serveApi.getTablesList(
            { status: 'occupied', is_ready_to_bill: true },
            token
          ).then(res => res.items);
          break;
          
        default:
          // All tab: all occupied tables
          tablesData = await serveApi.getTablesList(
            { status: 'occupied' },
            token
          ).then(res => res.items);
      }
      
      // Transform tables to tasks
      const transformedTasks = tablesData.map(transformTableToTask);
      setTasks(transformedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      // Fallback to mock data if API fails
      try {
        const mockData = await waiterApi.list(activeFilter);
        setTasks(mockData);
      } catch (mockError) {
        console.error('Failed to load mock tasks:', mockError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string, taskType: string) => {
    if (taskType === 'customer_request') {
      // Show success notification for customer request
      setNotificationMessage('Chấp nhận yêu cầu của khách hàng thành công');
      setShowNotification(true);
      
      // Remove task from list after notification
      setTimeout(() => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
      }, 500);
    } else if (taskType === 'kitchen_ready') {
      // Open order detail modal for kitchen ready tasks
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        console.log('🔄 handleCompleteTask called', { taskId, taskType, task });
        setSelectedTask(task);
        
        // Fetch table detail for order items mapping
        try {
          const tableId = parseInt(task.id);
          const token = localStorage.getItem('admin_auth_token');
          
          if (token) {
            console.log('🍽️ Fetching order detail for table:', tableId);
            const tableDetail = await serveApi.getTableDetail(tableId, token);
            
            if (tableDetail) {
              console.log('✅ Order detail received:', tableDetail);
              setSelectedTableDetail(tableDetail);
            } else {
              console.log('❌ No table detail returned');
            }
          }
        } catch (error) {
          console.error('❌ Failed to fetch table details:', error);
        }
      }
    } else if (taskType === 'payment_request') {
      // Open payment modal for payment requests
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        console.log('💳 handleCompleteTask called for payment_request', { taskId, taskType, task });
        setPaymentTask(task);
        
        // Fetch table detail for payment modal
        try {
          const tableId = parseInt(task.id);
          const token = localStorage.getItem('admin_auth_token');
          
          if (token) {
            console.log('🧾 Fetching order detail for table:', tableId);
            const tableDetail = await serveApi.getTableDetail(tableId, token);
            
            if (tableDetail) {
              console.log('✅ Order detail received for payment:', tableDetail);
              setPaymentTableDetail(tableDetail);
            } else {
              console.log('❌ No table detail returned');
            }
          }
        } catch (error) {
          console.error('❌ Failed to fetch table details:', error);
        }
      }
    } else {
      // For other requests, complete normally
      try {
        await waiterApi.completeTask(taskId);
        setTasks(prev => prev.filter(t => t.id !== taskId));
      } catch (error) {
        console.error('Failed to complete task:', error);
      }
    }
  };

  const handleMarkServed = (itemId: string) => {
    console.log('Mark item as served:', itemId);
    // In real app, call API to mark item as served
  };

  const handleUndoServed = (itemId: string) => {
    console.log('Undo served item:', itemId);
    // In real app, call API to undo served status
  };

  const getTaskCounts = () => {
    const allTasks = tasks;
    return {
      kitchen: allTasks.filter(t => t.type === 'kitchen_ready').length,
      requests: allTasks.filter(t => t.type === 'customer_request').length,
      payment: allTasks.filter(t => t.type === 'payment_request').length,
      total: allTasks.length
    };
  };

  const counts = getTaskCounts();

  return (
    <div style={{
      minHeight: '100vh',
      height: '100vh',
      background: '#f9fafb',
      paddingTop: '193px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '111px',
        background: 'linear-gradient(to right, #101828, #1e2939)',
        borderBottom: '1px solid #364153',
        boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 50
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <h1 style={{
            color: '#ffffff',
            fontSize: '30px',
            fontWeight: 'bold',
            lineHeight: '36px',
            margin: 0,
            letterSpacing: '0.3955px'
          }}>
            My Tasks
          </h1>
          
          <div style={{
            background: 'rgba(0, 153, 102, 0.2)',
            border: '1px solid rgba(0, 188, 125, 0.5)',
            borderRadius: '100px',
            padding: '4px 12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            width: 'fit-content'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#00bc7d',
              opacity: 0.507,
              borderRadius: '50%'
            }} />
            <span style={{
              color: '#00d492',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '20px',
              letterSpacing: '-0.1504px'
            }}>
              Waiter Mode
            </span>
          </div>
        </div>

        {/* Total Tasks Badge */}
        <div style={{
          background: 'rgba(231, 0, 11, 0.2)',
          border: '1px solid #fb2c36',
          borderRadius: '100px',
          padding: '13px 17px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Bell style={{
            width: '20px',
            height: '20px',
            color: '#ff6467',
            opacity: 0.507
          }} />
          <span style={{
            color: '#ff6467',
            fontSize: '18px',
            fontWeight: 'bold',
            lineHeight: '28px',
            letterSpacing: '-0.4395px'
          }}>
            {counts.total}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        position: 'fixed',
        top: '111px',
        left: 0,
        right: 0,
        height: '82px',
        background: '#2d3748',
        borderBottom: '2px solid #364153',
        boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        zIndex: 40
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          height: '48px'
        }}>
          {/* All Tab */}
          <button
            onClick={() => setActiveFilter('all')}
            style={{
              background: activeFilter === 'all' ? '#096' : '#364153',
              color: activeFilter === 'all' ? '#ffffff' : '#d1d5dc',
              fontSize: '16px',
              fontWeight: 'bold',
              lineHeight: '24px',
              letterSpacing: '-0.3125px',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '100px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s'
            }}
          >
            All
            {activeFilter === 'all' && (
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '48px',
                height: '4px',
                background: '#00d492',
                borderRadius: '100px'
              }} />
            )}
          </button>

          {/* Kitchen Tab */}
          <button
            onClick={() => setActiveFilter('kitchen')}
            style={{
              background: activeFilter === 'kitchen' ? '#096' : '#364153',
              color: activeFilter === 'kitchen' ? '#ffffff' : '#d1d5dc',
              fontSize: '16px',
              fontWeight: 'bold',
              lineHeight: '24px',
              letterSpacing: '-0.3125px',
              padding: '12px 24px',
              paddingLeft: '44px',
              border: 'none',
              borderRadius: '100px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s'
            }}
          >
            <ChefHat style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px'
            }} />
            Kitchen
            {counts.kitchen > 0 && (
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '4px',
                background: '#e7000b',
                border: '2px solid #2d3748',
                borderRadius: '100px',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {counts.kitchen}
              </div>
            )}
          </button>

          {/* Requests Tab */}
          <button
            onClick={() => setActiveFilter('requests')}
            style={{
              background: activeFilter === 'requests' ? '#096' : '#364153',
              color: activeFilter === 'requests' ? '#ffffff' : '#d1d5dc',
              fontSize: '16px',
              fontWeight: 'bold',
              lineHeight: '24px',
              letterSpacing: '-0.3125px',
              padding: '12px 24px',
              paddingLeft: '44px',
              border: 'none',
              borderRadius: '100px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s'
            }}
          >
            <MessageCircle style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px'
            }} />
            Requests
            {counts.requests > 0 && (
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '4px',
                background: '#e7000b',
                border: '2px solid #2d3748',
                borderRadius: '100px',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {counts.requests}
              </div>
            )}
          </button>

          {/* Payment Tab */}
          <button
            onClick={() => setActiveFilter('payment')}
            style={{
              background: activeFilter === 'payment' ? '#096' : '#364153',
              color: activeFilter === 'payment' ? '#ffffff' : '#ff6467',
              fontSize: '16px',
              fontWeight: 'bold',
              lineHeight: '24px',
              letterSpacing: '-0.3125px',
              padding: '12px 24px',
              paddingLeft: '44px',
              border: 'none',
              borderRadius: '100px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s'
            }}
          >
            <Receipt style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px'
            }} />
            Payment
            {counts.payment > 0 && (
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '4px',
                background: '#e7000b',
                border: '2px solid #2d3748',
                borderRadius: '100px',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 'bold',
                opacity: 0.507
              }}>
                {counts.payment}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Task Grid */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        paddingBottom: '100px'
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            color: '#99a1af'
          }}>
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            color: '#99a1af'
          }}>
            No tasks available
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            maxWidth: '1512px',
            margin: '0 auto'
          }}>
            {tasks.map((task) => (
              <WaiterTaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowTableMap(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, #155dfc 0%, #1447e6 100%)',
          border: 'none',
          borderRadius: '50%',
          boxShadow: '0px 25px 50px -12px rgba(21, 93, 252, 0.5)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          zIndex: 30
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Success Notification */}
      {showNotification && (
        <SuccessNotification
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
        />
      )}

      {/* Order Detail Modal */}
      {selectedTask && (
        <OrderDetailModal
          task={selectedTask}
          tableDetail={selectedTableDetail || undefined}
          isOpen={!!selectedTask}
          onClose={() => {
            setSelectedTask(null);
            setSelectedTableDetail(null);
          }}
          onMarkServed={handleMarkServed}
          onUndoServed={handleUndoServed}
          onCheckout={() => {
            // Close order detail modal and open payment modal
            setPaymentTask(selectedTask);
            setSelectedTask(null);
            setSelectedTableDetail(null);
          }}
        />
      )}

      {/* Payment Modal */}
      {paymentTask && (
        <PaymentModal
          task={paymentTask}
          tableDetail={paymentTableDetail || undefined}
          isOpen={!!paymentTask}
          onClose={() => {
            setPaymentTask(null);
            setPaymentTableDetail(null);
          }}
          onPaymentComplete={() => {
            // Remove task from list after payment
            if (paymentTask) {
              setTasks(prev => prev.filter(t => t.id !== paymentTask.id));
            }
            setPaymentTask(null);
            setPaymentTableDetail(null);
            // Show success notification
            setNotificationMessage('Payment completed successfully');
            setShowNotification(true);
          }}
        />
      )}

      {/* Table Map Modal */}
      <TableMapModal
        isOpen={showTableMap}
        onClose={() => setShowTableMap(false)}
        onTableSelect={(tableId) => {
          console.log('Selected table:', tableId);
          // Don't close the map modal, let the detail modal handle it
        }}
      />
    </div>
  );
};
