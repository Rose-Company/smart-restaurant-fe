import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Clock, CheckCircle, ChefHat, Edit3 } from 'lucide-react';
import { WaiterTask, TaskItem } from '../types/waiter.types';
import { TableDetail } from '../services/serve.api';
import { EditItemModal } from './EditItemModal';
import { formatPrice } from '../../../lib/utils';

// UI-friendly representation of order item
interface UIOrderItem {
  id: string;
  name: string;
  quantity: number;
  status: 'pending' | 'completed';
  modifiers?: string[];
  note?: string;
  price: number;
}

interface OrderDetailModalProps {
  task: WaiterTask;
  tableDetail?: TableDetail;
  isOpen: boolean;
  onClose: () => void;
  onMarkServed: (itemId: string) => void;
  onUndoServed: (itemId: string) => void;
  onCheckout?: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  task,
  tableDetail,
  isOpen,
  onClose,
  onMarkServed,
  onUndoServed,
  onCheckout
}) => {
  const [activeTab, setActiveTab] = useState<'items' | 'bill'>('items');
  const [editingItem, setEditingItem] = useState<UIOrderItem | null>(null);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number; type: 'percentage' | 'fixed' } | null>(null);

  // Get order items from real API data
  const getOrderItems = (): UIOrderItem[] => {
    if (tableDetail && 'order_items' in tableDetail && tableDetail.order_items && tableDetail.order_items.length > 0) {
      return tableDetail.order_items.map(item => ({
        id: String(item.id),
        name: item.item_name,
        quantity: item.quantity,
        status: item.status,
        price: item.unit_price,
        modifiers: [],
        note: ''
      }));
    }
    // Return empty array if no real data available
    return [];
  };

  const [orderItems, setOrderItems] = useState<UIOrderItem[]>(getOrderItems());

  // Update orderItems when tableDetail changes
  useEffect(() => {
    if (tableDetail && 'order_items' in tableDetail && tableDetail.order_items && tableDetail.order_items.length > 0) {
      const items = tableDetail.order_items.map(item => ({
        id: String(item.id),
        name: item.item_name,
        quantity: item.quantity,
        status: item.status,
        price: item.unit_price,
        modifiers: [],
        note: ''
      }));
      console.log('📦 OrderDetailModal: Mapped order items from tableDetail:', {
        itemCount: items.length,
        items: items,
        tableDetail: tableDetail
      });
      setOrderItems(items);
    }
  }, [tableDetail]);

  if (!isOpen) return null;

  const handleMarkServed = (itemId: string) => {
    setOrderItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, status: 'completed' as const } : item
      )
    );
    onMarkServed(itemId);
  };

  const handleUndoServed = (itemId: string) => {
    setOrderItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, status: 'pending' as const } : item
      )
    );
    onUndoServed(itemId);
  };

  const handleSaveItem = (updatedItem: UIOrderItem) => {
    setOrderItems(prev => 
      prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  const pendingItems = orderItems.filter(item => item.status === 'pending');
  const completedItems = orderItems.filter(item => item.status === 'completed');

  // Bill calculations
  const calculateSubtotal = () => {
    const sum = orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    return sum;
  };

  const subtotal = calculateSubtotal();
  const vatRate = 0.08; // 8% VAT
  const vat = subtotal * vatRate;
  const serviceCharge = subtotal * 0.05; // 5% service charge
  
  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === 'percentage') {
      discount = subtotal * (appliedVoucher.discount / 100);
    } else {
      discount = appliedVoucher.discount;
    }
  }
  
  const total = subtotal + vat + serviceCharge - discount;

  console.log('💰 OrderDetailModal: Bill calculated:', {
    subtotal: subtotal,
    vat: vat,
    serviceCharge: serviceCharge,
    discount: discount,
    appliedVoucher: appliedVoucher,
    total: total,
    orderItems: orderItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      itemTotal: item.price * item.quantity
    }))
  });

  const handleApplyVoucher = () => {
    const code = voucherCode.toUpperCase();
    // Mock voucher validation
    if (code === 'SAVE20') {
      setAppliedVoucher({ code, discount: 20, type: 'percentage' });
    } else if (code === 'VIP50') {
      setAppliedVoucher({ code, discount: 50, type: 'fixed' });
    } else {
      alert('Invalid voucher code');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        background: '#030712',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(to right, #101828, #1e2939)',
          borderBottom: '1px solid #364153',
          padding: '24px'
        }}>
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <button
              onClick={onClose}
              style={{
                width: '40px',
                height: '40px',
                background: '#1e2939',
                border: 'none',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2d3748';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1e2939';
              }}
            >
              <ArrowLeft style={{ width: '24px', height: '24px', color: '#ffffff' }} />
            </button>

            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
                <h1 style={{
                  color: '#ffffff',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  lineHeight: '36px',
                  margin: 0,
                  letterSpacing: '0.3955px'
                }}>
                  Table {task.tableNumber}
                </h1>
                
                <div style={{
                  background: 'rgba(21, 93, 252, 0.2)',
                  border: '1px solid #155dfc',
                  borderRadius: '100px',
                  padding: '4px 16px'
                }}>
                  <span style={{
                    color: '#51a2ff',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    letterSpacing: '-0.1504px'
                  }}>
                    Occupied
                  </span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Users style={{ width: '16px', height: '16px', color: '#99a1af' }} />
                  <span style={{
                    color: '#99a1af',
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.1504px'
                  }}>
                    {tableDetail?.guest_count || 0} Guests
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Clock style={{ width: '16px', height: '16px', color: '#99a1af' }} />
                  <span style={{
                    color: '#99a1af',
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.1504px'
                  }}>
                    Elapsed: 45m
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            <button
              onClick={() => setActiveTab('items')}
              style={{
                flex: 1,
                height: '44px',
                background: activeTab === 'items' ? '#00a63e' : '#1e2939',
                color: activeTab === 'items' ? '#ffffff' : '#99a1af',
                fontSize: '16px',
                fontWeight: 'bold',
                lineHeight: '24px',
                letterSpacing: '-0.3125px',
                border: 'none',
                borderRadius: '10px',
                boxShadow: activeTab === 'items' ? '0px 10px 15px -3px rgba(0, 166, 62, 0.3), 0px 4px 6px -4px rgba(0, 166, 62, 0.3)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Ordered Items
            </button>

            <button
              onClick={() => setActiveTab('bill')}
              style={{
                flex: 1,
                height: '44px',
                background: activeTab === 'bill' ? '#00a63e' : '#1e2939',
                color: activeTab === 'bill' ? '#ffffff' : '#99a1af',
                fontSize: '16px',
                fontWeight: 'bold',
                lineHeight: '24px',
                letterSpacing: '-0.3125px',
                border: 'none',
                borderRadius: '10px',
                boxShadow: activeTab === 'bill' ? '0px 10px 15px -3px rgba(0, 166, 62, 0.3), 0px 4px 6px -4px rgba(0, 166, 62, 0.3)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Bill Info
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          paddingBottom: '120px'
        }}>
          {activeTab === 'items' ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              {/* Pending Section */}
              {pendingItems.length > 0 && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      background: '#ff8904',
                      opacity: 0.928,
                      borderRadius: '50%'
                    }} />
                    <h2 style={{
                      color: '#ff8904',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      lineHeight: '28px',
                      margin: 0,
                      letterSpacing: '-0.4492px'
                    }}>
                      Pending
                    </h2>
                    <span style={{
                      color: '#99a1af',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.1504px'
                    }}>
                      ({pendingItems.length})
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {pendingItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          background: 'linear-gradient(to right, rgba(13, 84, 43, 0.3), #101828)',
                          borderLeft: '4px solid #00c950',
                          borderRadius: '14px',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'start',
                          justifyContent: 'space-between'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '8px'
                            }}>
                              <span style={{
                                color: '#ffffff',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                lineHeight: '32px',
                                letterSpacing: '0.0703px'
                              }}>
                                {item.quantity}x
                              </span>
                              <h3 style={{
                                color: '#ffffff',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                lineHeight: '28px',
                                margin: 0,
                                letterSpacing: '-0.4492px'
                              }}>
                                {item.name}
                              </h3>
                            </div>

                            {item.modifiers && item.modifiers.length > 0 && (
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                marginLeft: '48px'
                              }}>
                                {item.modifiers.map((modifier, idx) => (
                                  <span
                                    key={idx}
                                    style={{
                                      color: '#fdc700',
                                      fontSize: '14px',
                                      fontWeight: 500,
                                      lineHeight: '20px',
                                      letterSpacing: '-0.1504px'
                                    }}
                                  >
                                    • {modifier}
                                  </span>
                                ))}
                              </div>
                            )}

                            {item.note && (
                              <div style={{
                                marginTop: '8px',
                                marginLeft: '48px',
                                padding: '8px 12px',
                                background: 'rgba(21, 93, 252, 0.1)',
                                border: '1px solid rgba(21, 93, 252, 0.3)',
                                borderRadius: '8px'
                              }}>
                                <span style={{
                                  color: '#51a2ff',
                                  fontSize: '13px',
                                  lineHeight: '18px',
                                  fontStyle: 'italic'
                                }}>
                                  📝 {item.note}
                                </span>
                              </div>
                            )}
                          </div>

                          <div style={{
                            display: 'flex',
                            gap: '8px',
                            flexShrink: 0
                          }}>
                            <button
                              onClick={() => setEditingItem(item)}
                              style={{
                                width: '56px',
                                height: '56px',
                                background: '#155dfc',
                                border: 'none',
                                borderRadius: '14px',
                                boxShadow: '0px 10px 15px -3px rgba(21, 93, 252, 0.3), 0px 4px 6px -4px rgba(21, 93, 252, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                flexShrink: 0,
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              <Edit3 style={{ width: '24px', height: '24px', color: '#ffffff' }} />
                            </button>

                            <button
                              onClick={() => handleMarkServed(item.id)}
                              style={{
                                width: '56px',
                                height: '56px',
                                background: '#00a63e',
                                border: 'none',
                                borderRadius: '14px',
                                boxShadow: '0px 10px 15px -3px rgba(0, 166, 62, 0.3), 0px 4px 6px -4px rgba(0, 166, 62, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                flexShrink: 0,
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              <CheckCircle style={{ width: '28px', height: '28px', color: '#ffffff' }} />
                            </button>
                          </div>
                        </div>

                        <div style={{
                          background: 'rgba(16, 24, 40, 0.5)',
                          borderRadius: '10px',
                          padding: '8px 16px'
                        }}>
                          <p style={{
                            color: '#05df72',
                            fontSize: '14px',
                            fontWeight: 500,
                            lineHeight: '20px',
                            margin: 0,
                            letterSpacing: '-0.1504px'
                          }}>
                            Swipe or tap checkbox to mark as served
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Section */}
              {completedItems.length > 0 && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px'
                  }}>
                    <CheckCircle style={{ width: '20px', height: '20px', color: '#00c950' }} />
                    <h2 style={{
                      color: '#05df72',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      lineHeight: '28px',
                      margin: 0,
                      letterSpacing: '-0.4492px'
                    }}>
                      Completed
                    </h2>
                    <span style={{
                      color: '#99a1af',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.1504px'
                    }}>
                      ({completedItems.length})
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {completedItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleUndoServed(item.id)}
                        style={{
                          background: 'rgba(16, 24, 40, 0.5)',
                          border: '1px solid #1e2939',
                          borderRadius: '14px',
                          padding: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(16, 24, 40, 0.7)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(16, 24, 40, 0.5)';
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <CheckCircle style={{ width: '32px', height: '32px', color: '#00c950' }} />
                          <span style={{
                            color: '#6a7282',
                            fontSize: '18px',
                            lineHeight: '28px',
                            letterSpacing: '-0.4395px',
                            textDecoration: 'line-through'
                          }}>
                            {item.quantity}x {item.name}
                          </span>
                        </div>

                        <span style={{
                          color: '#4a5565',
                          fontSize: '12px',
                          lineHeight: '16px'
                        }}>
                          Tap to undo
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              {/* Order Items List */}
              <div style={{
                background: '#101828',
                borderRadius: '14px',
                padding: '20px',
                border: '1px solid #1e2939'
              }}>
                <h2 style={{
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  lineHeight: '28px',
                  marginBottom: '16px',
                  letterSpacing: '-0.4395px'
                }}>
                  Order Items
                </h2>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {orderItems.map((item) => {
                    const itemTotal = (item.price) * item.quantity;
                    return (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          padding: '12px 0',
                          borderBottom: '1px solid #1e2939'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '4px'
                          }}>
                            <span style={{
                              color: '#ffffff',
                              fontSize: '16px',
                              fontWeight: 600,
                              lineHeight: '24px'
                            }}>
                              {item.quantity}x
                            </span>
                            <span style={{
                              color: '#ffffff',
                              fontSize: '16px',
                              lineHeight: '24px'
                            }}>
                              {item.name}
                            </span>
                            {item.status === 'completed' && (
                              <CheckCircle style={{ width: '16px', height: '16px', color: '#00c950' }} />
                            )}
                            {item.status === 'pending' && (
                              <ChefHat style={{ width: '16px', height: '16px', color: '#ff8904' }} />
                            )}
                          </div>

                          {item.modifiers && item.modifiers.length > 0 && (
                            <div style={{
                              marginLeft: '32px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px'
                            }}>
                              {item.modifiers.map((modifier, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    color: '#99a1af',
                                    fontSize: '13px',
                                    lineHeight: '18px'
                                  }}
                                >
                                  • {modifier}
                                </span>
                              ))}
                            </div>
                          )}

                          <div style={{
                            marginLeft: '32px',
                            marginTop: '4px',
                            color: '#6a7282',
                            fontSize: '13px'
                          }}>
                            {formatPrice(item.price)}
                          </div>
                        </div>

                        <div style={{
                          color: '#ffffff',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          lineHeight: '24px'
                        }}>
                          {formatPrice(itemTotal)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Voucher Section */}
              <div style={{
                background: '#101828',
                borderRadius: '14px',
                padding: '20px',
                border: '1px solid #1e2939'
              }}>
                <h2 style={{
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  lineHeight: '28px',
                  marginBottom: '16px',
                  letterSpacing: '-0.4395px'
                }}>
                  Promotion / Voucher
                </h2>

                {appliedVoucher ? (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(0, 166, 62, 0.1), rgba(21, 93, 252, 0.1))',
                    border: '1px solid #00a63e',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{
                        color: '#05df72',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '4px'
                      }}>
                        {appliedVoucher.code}
                      </div>
                      <div style={{
                        color: '#99a1af',
                        fontSize: '13px'
                      }}>
                        {appliedVoucher.type === 'percentage' 
                          ? `${appliedVoucher.discount}% off` 
                          : `$${appliedVoucher.discount} off`}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setAppliedVoucher(null);
                        setVoucherCode('');
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid #ff4444',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        color: '#ff4444',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      placeholder="Enter voucher code"
                      style={{
                        flex: 1,
                        height: '48px',
                        background: '#1e2939',
                        border: '1px solid #364153',
                        borderRadius: '8px',
                        padding: '0 16px',
                        color: '#ffffff',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#155dfc';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#364153';
                      }}
                    />
                    <button
                      onClick={handleApplyVoucher}
                      disabled={!voucherCode}
                      style={{
                        height: '48px',
                        padding: '0 24px',
                        background: voucherCode ? '#155dfc' : '#2d3748',
                        border: 'none',
                        borderRadius: '8px',
                        color: voucherCode ? '#ffffff' : '#6a7282',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        cursor: voucherCode ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (voucherCode) {
                          e.currentTarget.style.background = '#1e4fcc';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (voucherCode) {
                          e.currentTarget.style.background = '#155dfc';
                        }
                      }}
                    >
                      Apply
                    </button>
                  </div>
                )}

                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: 'rgba(21, 93, 252, 0.05)',
                  border: '1px solid rgba(21, 93, 252, 0.2)',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    color: '#51a2ff',
                    fontSize: '12px',
                    lineHeight: '18px'
                  }}>
                    💡 Try: <strong>SAVE20</strong> (20% off) or <strong>VIP50</strong> ($50 off)
                  </div>
                </div>
              </div>

              {/* Bill Summary */}
              <div style={{
                background: 'linear-gradient(to bottom, #101828, #0a1018)',
                borderRadius: '14px',
                padding: '20px',
                border: '2px solid #1e2939'
              }}>
                <h2 style={{
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  lineHeight: '28px',
                  marginBottom: '20px',
                  letterSpacing: '-0.4395px'
                }}>
                  Bill Summary
                </h2>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}>
                  {/* Subtotal */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      color: '#99a1af',
                      fontSize: '15px',
                      lineHeight: '22px'
                    }}>
                      Subtotal
                    </span>
                    <span style={{
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: 600,
                      lineHeight: '24px'
                    }}>
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {/* VAT */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      color: '#99a1af',
                      fontSize: '15px',
                      lineHeight: '22px'
                    }}>
                      VAT (8%)
                    </span>
                    <span style={{
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: 600,
                      lineHeight: '24px'
                    }}>
                      {formatPrice(vat)}
                    </span>
                  </div>

                  {/* Service Charge */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      color: '#99a1af',
                      fontSize: '15px',
                      lineHeight: '22px'
                    }}>
                      Service Charge (5%)
                    </span>
                    <span style={{
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: 600,
                      lineHeight: '24px'
                    }}>
                      {formatPrice(serviceCharge)}
                    </span>
                  </div>

                  {/* Discount */}
                  {discount > 0 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: 'rgba(0, 166, 62, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 166, 62, 0.3)'
                    }}>
                      <span style={{
                        color: '#05df72',
                        fontSize: '15px',
                        fontWeight: 600,
                        lineHeight: '22px'
                      }}>
                        Discount ({appliedVoucher?.code})
                      </span>
                      <span style={{
                        color: '#05df72',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        lineHeight: '24px'
                      }}>
                        -{formatPrice(discount)}
                      </span>
                    </div>
                  )}

                  {/* Divider */}
                  <div style={{
                    height: '1px',
                    background: 'linear-gradient(to right, transparent, #364153, transparent)',
                    margin: '8px 0'
                  }} />

                  {/* Total */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: 'linear-gradient(135deg, rgba(0, 166, 62, 0.15), rgba(21, 93, 252, 0.15))',
                    borderRadius: '10px',
                    border: '1px solid rgba(0, 166, 62, 0.3)'
                  }}>
                    <span style={{
                      color: '#ffffff',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      lineHeight: '28px',
                      letterSpacing: '-0.4492px'
                    }}>
                      Total
                    </span>
                    <span style={{
                      color: '#05df72',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      lineHeight: '36px',
                      letterSpacing: '0.0703px'
                    }}>
                      {formatPrice(total)}
                    </span>
                  </div>

                  {/* You Save */}
                  {discount > 0 && (
                    <div style={{
                      textAlign: 'center',
                      padding: '12px',
                      background: 'rgba(0, 166, 62, 0.05)',
                      borderRadius: '8px'
                    }}>
                      <span style={{
                        color: '#05df72',
                        fontSize: '14px',
                        fontWeight: 600
                      }}>
                        🎉 You save {formatPrice(discount)} with this promotion!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#101828',
          borderTop: '1px solid #364153',
          padding: '17px 20px',
          display: 'flex',
          gap: '12px',
          zIndex: 1001
        }}>
          <button
            style={{
              flex: 1,
              height: '34px',
              background: '#1e2939',
              border: '2px solid #4a5565',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 'bold',
              lineHeight: '28px',
              letterSpacing: '-0.4395px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2d3748';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1e2939';
            }}
          >
            + New Order
          </button>

          <button
            onClick={() => {
              if (onCheckout) {
                onCheckout();
              }
            }}
            style={{
              flex: 1,
              height: '34px',
              background: 'linear-gradient(to right, #00a63e, #008236)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0px 10px 15px -3px rgba(0, 166, 62, 0.3), 0px 4px 6px -4px rgba(0, 166, 62, 0.3)',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 'bold',
              lineHeight: '28px',
              letterSpacing: '-0.4395px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            $ Checkout
          </button>
        </div>
      </div>

      {editingItem && (
        <EditItemModal
          item={editingItem}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveItem}
        />
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
};
