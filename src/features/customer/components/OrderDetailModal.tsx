import React, { useState } from 'react';
import { ArrowLeft, Star, AlertCircle } from 'lucide-react';
import { findMenuItemByName } from '../data/menuData';
import { formatPrice } from '../../../lib/currency';

interface OrderDetailItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  rating?: number;
  selectedModifiers?: {
    [groupId: string]: string[];
  };
}

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    orderNumber: string;
    date: string;
    time: string;
    tableNumber: string;
    items: OrderDetailItem[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    status: 'Paid' | 'Pending' | 'Cancelled';
  } | null;
  onReorder?: () => void;
  onReportIssue?: () => void;
}

export function OrderDetailModal({ isOpen, onClose, order, onReorder, onReportIssue }: OrderDetailModalProps) {
  const [itemRatings, setItemRatings] = useState<{ [key: string]: number }>({});
  const [hoveredRating, setHoveredRating] = useState<{ [key: string]: number }>({});

  if (!isOpen || !order) return null;

  const handleRatingClick = (itemId: string, rating: number) => {
    setItemRatings({ ...itemRatings, [itemId]: rating });
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'Paid':
        return '#00a63e';
      case 'Pending':
        return '#f59e0b';
      case 'Cancelled':
        return '#c10007';
      default:
        return '#6b7280';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 10000
      }}>
        <button
          onClick={onClose}
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
        <h1 style={{
          fontSize: '16px',
          fontWeight: '400',
          color: '#101828',
          margin: 0
        }}>
          Order Details
        </h1>
      </div>

      {/* Content Container */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        paddingTop: '88px',
        paddingBottom: '100px'
      }}>
        <div style={{ padding: '16px' }}>
          {/* Main Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '16px'
          }}>
            {/* Restaurant Header with Gradient */}
            <div style={{
              background: 'linear-gradient(to bottom, #27ae60, #229954)',
              padding: '32px 32px',
              textAlign: 'center',
              color: 'white'
            }}>
              
              <h2 style={{
                fontSize: '20px',
                fontWeight: '400',
                margin: '0 0 8px 0',
                letterSpacing: '-0.4px'
              }}>
                RestaurantOS
              </h2>
              <p style={{
                fontSize: '14px',
                margin: 0,
                color: 'rgba(255,255,255,0.9)',
                letterSpacing: '-0.15px'
              }}>
                Thank you for dining with us!
              </p>
            </div>

            {/* Order Info */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '18px',
                color: '#101828',
                margin: '0 0 4px 0',
                letterSpacing: '-0.44px'
              }}>
                Receipt #{order.orderNumber}
              </p>
              <p style={{
                fontSize: '16px',
                color: '#4a5565',
                margin: '0 0 4px 0',
                letterSpacing: '-0.31px'
              }}>
                {order.date} • {order.time}
              </p>
              <p style={{
                fontSize: '16px',
                color: '#4a5565',
                margin: 0,
                letterSpacing: '-0.31px'
              }}>
                Table {order.tableNumber}
              </p>
            </div>

            {/* Order Items */}
            <div style={{ padding: '24px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '400',
                color: '#101828',
                margin: '0 0 16px 0',
                letterSpacing: '-0.31px'
              }}>
                Order Items
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {order.items.map((item) => {
                  const menuItem = findMenuItemByName(item.name);
                  return (
                  <div key={item.id} style={{
                    borderBottom: '1px solid #f3f4f6',
                    paddingBottom: '12px'
                  }}>
                    {/* Item with Image */}
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      {/* Item Image */}
                      {menuItem?.imageUrl && (
                        <img
                          src={menuItem.imageUrl}
                          alt={item.name}
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '12px',
                            objectFit: 'cover',
                            flexShrink: 0
                          }}
                        />
                      )}

                      {/* Item Info */}
                      <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        {/* Item Name and Price */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start'
                        }}>
                          <span style={{
                            fontSize: '16px',
                            color: '#101828',
                            letterSpacing: '-0.31px',
                            fontWeight: '500'
                          }}>
                            {item.quantity}x {item.name}
                          </span>
                          <span style={{
                            fontSize: '16px',
                            color: '#101828',
                            letterSpacing: '-0.31px',
                            fontWeight: '600'
                          }}>
                            {formatPrice(item.price)}
                          </span>
                        </div>

                        {/* Modifiers if available */}
                        {item.selectedModifiers && menuItem?.modifiers && (() => {
                          const modifierTexts: string[] = [];
                          
                          Object.entries(item.selectedModifiers).forEach(([groupId, optionIds]) => {
                            const group = menuItem.modifiers?.find(g => g.id === groupId);
                            if (group && optionIds && optionIds.length > 0) {
                              const selectedOptions = optionIds
                                .map(optId => group.options?.find(opt => opt.id === optId)?.name)
                                .filter(Boolean);
                              
                              if (selectedOptions.length > 0) {
                                modifierTexts.push(`${group.name}: ${selectedOptions.join(', ')}`);
                              }
                            }
                          });
                          
                          if (modifierTexts.length > 0) {
                            return (
                              <p style={{
                                fontSize: '13px',
                                color: '#6a7282',
                                margin: '4px 0 8px 0',
                                lineHeight: '1.4'
                              }}>
                                {modifierTexts.join(' • ')}
                              </p>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>

                    {/* Rating Section */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        color: '#6a7282'
                      }}>
                        Rate this dish:
                      </span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isSelected = (itemRatings[item.id] || 0) >= star;
                          const isHovered = (hoveredRating[item.id] || 0) >= star;
                          return (
                            <button
                              key={star}
                              onClick={() => handleRatingClick(item.id, star)}
                              onMouseEnter={() => setHoveredRating({ ...hoveredRating, [item.id]: star })}
                              onMouseLeave={() => setHoveredRating({ ...hoveredRating, [item.id]: 0 })}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              <Star
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  fill: isSelected || isHovered ? '#fbbf24' : 'transparent',
                                  stroke: isSelected || isHovered ? '#fbbf24' : '#d1d5db',
                                  transition: 'all 0.2s'
                                }}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div style={{
                borderTop: '1px solid #e5e7eb',
                paddingTop: '24px',
                marginTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '16px', color: '#364153', letterSpacing: '-0.31px' }}>
                    Subtotal
                  </span>
                  <span style={{ fontSize: '16px', color: '#364153', letterSpacing: '-0.31px' }}>
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '16px', color: '#364153', letterSpacing: '-0.31px' }}>
                    Tax (10%)
                  </span>
                  <span style={{ fontSize: '16px', color: '#364153', letterSpacing: '-0.31px' }}>
                    {formatPrice(order.tax)}
                  </span>
                </div>
                <div style={{
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#101828', letterSpacing: '-0.31px' }}>
                    Total
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#27ae60', letterSpacing: '-0.31px' }}>
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div style={{
              margin: '0 24px 24px',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{ fontSize: '14px', color: '#4a5565', margin: '0 0 4px 0' }}>
                  Payment Method
                </p>
                <p style={{ fontSize: '16px', color: '#101828', margin: 0 }}>
                  {order.paymentMethod}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '14px', color: '#4a5565', margin: '0 0 4px 0' }}>
                  Status
                </p>
                <p style={{ fontSize: '16px', color: getStatusColor(), margin: 0, fontWeight: '500' }}>
                  {order.status}
                </p>
              </div>
            </div>
          </div>

          {/* Feedback Banner */}
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bedbff',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <Star style={{ width: '20px', height: '20px', color: '#1c398e', flexShrink: 0 }} />
            <div>
              <p style={{
                fontSize: '16px',
                fontWeight: '400',
                color: '#1c398e',
                margin: '0 0 4px 0',
                letterSpacing: '-0.31px'
              }}>
                How was your meal?
              </p>
              <p style={{
                fontSize: '14px',
                color: '#1447e6',
                margin: 0,
                letterSpacing: '-0.15px',
                lineHeight: '1.4'
              }}>
                Your feedback helps us improve our service and menu!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        padding: '5px 16px',
        boxShadow: '0 -10px 15px -3px rgba(0,0,0,0.1)',
        zIndex: 10000
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {order.status !== 'Cancelled' && (
            <button
              onClick={() => {
                if (onReorder) onReorder();
                onClose();
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                letterSpacing: '-0.15px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#229954'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
            >
              Re-order All Items
            </button>
          )}
          <button
            onClick={() => {
              onClose();
              if (onReportIssue) onReportIssue();
            }}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#ffffff',
              color: '#364153',
              border: '1px solid #d1d5dc',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              letterSpacing: '-0.15px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
          >
            <AlertCircle style={{ width: '16px', height: '16px' }} />
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );
}
