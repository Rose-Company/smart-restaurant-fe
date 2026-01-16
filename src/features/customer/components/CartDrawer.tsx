import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Phone, FileText, CheckCircle } from 'lucide-react';
import type { MenuItem } from '../../menu/types/menu.types';
import { OrderSuccessModal } from './OrderSuccessModal';
import { AVAILABLE_VOUCHERS, findVoucherByCode, type Voucher } from '../data/voucherData';
import { DEFAULT_ORDER_HISTORY, type OrderHistory, type OrderHistoryItem, type OrderRound } from '../data/orderData';

interface SelectedModifiers {
  [groupId: string]: string[];
}

interface CartItem {
  item: MenuItem;
  quantity: number;
  selectedModifiers?: SelectedModifiers;
  modifierPrice?: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  tableNumber?: string;
  onClose: () => void;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onCheckout: () => void;
  onAddNote?: (itemId: number) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  orderHistory?: OrderHistory;
  onConfirmOrder?: (cart: CartItem[], customerName?: string) => void;
}

export function CartDrawer({
  isOpen,
  cart,
  tableNumber,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onAddNote,
  getTotalPrice,
  getTotalItems,
  orderHistory: propOrderHistory,
  onConfirmOrder
}: CartDrawerProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [voucherError, setVoucherError] = useState('');

  const handleApplyVoucher = () => {
    const voucher = findVoucherByCode(voucherCode);
    
    if (!voucher) {
      setVoucherError('Invalid voucher code');
      return;
    }
    
    if (getTotalPrice() < voucher.minAmount) {
      setVoucherError(`Minimum order amount is $${voucher.minAmount}`);
      return;
    }
    
    setAppliedVoucher(voucher);
    setVoucherError('');
    setVoucherCode('');
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
    setVoucherError('');
  };

  const getDiscountAmount = () => {
    if (!appliedVoucher) return 0;
    if (appliedVoucher.type === 'percentage') {
      return getTotalPrice() * (appliedVoucher.discount / 100);
    }
    return appliedVoucher.discount;
  };

  const getFinalTotal = () => {
    const subtotal = getTotalPrice();
    const vat = subtotal * 0.08;
    const discount = getDiscountAmount();
    return subtotal + vat - discount;
  };

  const orderHistory = propOrderHistory || DEFAULT_ORDER_HISTORY;

  const handleConfirmOrder = () => {
    if (onConfirmOrder) {
      onConfirmOrder(cart, customerName);
    }
    setShowSuccessModal(true);
    setCustomerName('');
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setActiveTab('history');
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      />

      {/* Cart Panel */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              Your Order {tableNumber ? `(Table ${tableNumber})` : ''}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X style={{ width: '24px', height: '24px', color: '#6b7280' }} />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setActiveTab('current')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: activeTab === 'current' ? '#f0fdf4' : 'transparent',
                color: activeTab === 'current' ? '#52b788' : '#6b7280',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              <ShoppingCart style={{ width: '16px', height: '16px' }} />
              Current Order
              {getTotalItems() > 0 && (
                <span style={{
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '9px',
                  backgroundColor: '#52b788',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 5px'
                }}>
                  {getTotalItems()}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: activeTab === 'history' ? '#f0fdf4' : 'transparent',
                color: activeTab === 'history' ? '#52b788' : '#6b7280',
                transition: 'all 0.2s'
              }}
            >
              <FileText style={{ width: '16px', height: '16px' }} />
              My Orders
              {orderHistory.rounds.length > 0 && (
                <span style={{
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '9px',
                  backgroundColor: '#6b7280',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 5px'
                }}>
                  {orderHistory.rounds.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div style={{
          flex: 1,
          overflowY: 'auto'
        }}>
          <div style={{ padding: '16px' }}>
          {activeTab === 'current' ? (
            // Current Order Tab
            cart.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: '48px', paddingBottom: '48px' }}>
                <ShoppingCart style={{ 
                  width: '64px', 
                  height: '64px', 
                  color: '#d1d5db',
                  margin: '0 auto 16px auto'
                }} />
                <p style={{ color: '#6b7280', fontSize: '16px' }}>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cart.map((cartItem, index) => (
                    <div
                      key={`${cartItem.item.id}-${index}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '12px',
                        padding: '12px'
                      }}
                    >
                      <img
                        src={cartItem.item.imageUrl}
                        alt={cartItem.item.name}
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#1f2937',
                          margin: '0 0 4px 0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {cartItem.item.name}
                        </h4>
                        <p style={{
                          fontSize: '14px',
                          color: '#52b788',
                          margin: '0 0 4px 0',
                          fontWeight: '600'
                        }}>
                          ${(cartItem.item.price + (cartItem.modifierPrice || 0)).toFixed(2)}
                        </p>
                        {cartItem.selectedModifiers && Object.keys(cartItem.selectedModifiers).length > 0 && (
                          <div style={{ marginTop: '4px' }}>
                            {cartItem.item.modifiers?.map(group => {
                              const selectedOptions = cartItem.selectedModifiers?.[group.id] || [];
                              if (selectedOptions.length === 0) return null;
                              
                              const optionNames = selectedOptions
                                .map(optionId => group.options?.find(opt => opt.id === optionId)?.name)
                                .filter(Boolean)
                                .join(', ');
                              
                              return (
                                <p key={group.id} style={{
                                  fontSize: '12px',
                                  color: '#9ca3af',
                                  margin: '2px 0 0 0'
                                }}>
                                  {optionNames}
                                </p>
                              );
                            })}
                          </div>
                        )}
                        {onAddNote && (
                          <button
                            onClick={() => onAddNote(cartItem.item.id)}
                            style={{
                              marginTop: '4px',
                              fontSize: '13px',
                              color: '#52b788',
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              textAlign: 'left',
                              fontWeight: '500'
                            }}
                          >
                            📝 Add Note
                          </button>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '1px solid #d1d5db',
                            backgroundColor: '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                        >
                          <Minus style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                        </button>
                        <span style={{
                          width: '32px',
                          textAlign: 'center',
                          fontWeight: '600',
                          color: '#1f2937',
                          fontSize: '15px'
                        }}>
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '1px solid #d1d5db',
                            backgroundColor: '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                        >
                          <Plus style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveItem(cartItem.item.id)}
                        style={{
                          padding: '8px',
                          color: '#ef4444',
                          background: 'none',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <X style={{ width: '20px', height: '20px' }} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pair with these section */}
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '12px'
                  }}>
                    Pair with these:
                  </h3>
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    overflowX: 'auto',
                    paddingBottom: '8px'
                  }}>
                    {[
                      { name: 'Coca Cola', price: 3.50, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200' },
                      { name: 'Sparkling Water', price: 2.50, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=200' },
                      { name: 'Fresh Lemonade', price: 4.00, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200' }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          minWidth: '140px',
                          backgroundColor: '#ffffff',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid #e5e7eb'
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '100%',
                            height: '100px',
                            objectFit: 'cover'
                          }}
                        />
                        <div style={{ padding: '12px' }}>
                          <p style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#1f2937',
                            margin: '0 0 4px 0'
                          }}>
                            {item.name}
                          </p>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <span style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#52b788'
                            }}>
                              ${item.price.toFixed(2)}
                            </span>
                            <button
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: '#52b788',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Plus style={{ width: '16px', height: '16px', color: '#ffffff' }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )
          ) : (
            // Order History Tab
            <div>
              {orderHistory.rounds.map((round) => (
                <div
                  key={round.roundNumber}
                  style={{
                    marginBottom: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    padding: '16px'
                  }}
                >
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#6b7280',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    ROUND {round.roundNumber} - {round.time}
                  </div>
                  {round.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: '1px solid #e5e7eb'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontSize: '15px',
                          fontWeight: '500',
                          color: '#1f2937',
                          margin: 0
                        }}>
                          {item.quantity}x {item.name}
                        </p>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <span style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#1f2937'
                        }}>
                          ${item.price.toFixed(2)}
                        </span>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          backgroundColor: item.status === 'Served' ? '#d1fae5' : '#fed7aa',
                          color: item.status === 'Served' ? '#065f46' : '#9a3412'
                        }}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          </div>

          {/* Footer - Inside Scroll */}
          {activeTab === 'current' && cart.length > 0 && (
            <div style={{
              padding: '20px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#ffffff'
            }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '15px',
                fontWeight: '500',
                color: '#6b7280'
              }}>
                Subtotal
              </span>
              <span style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <span style={{
                fontSize: '15px',
                fontWeight: '500',
                color: '#6b7280'
              }}>
                VAT (8%)
              </span>
              <span style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                ${(getTotalPrice() * 0.08).toFixed(2)}
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <span style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                Total
              </span>
              <span style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#52b788'
              }}>
                ${(getTotalPrice() * 1.08).toFixed(2)}
              </span>
            </div>
            <input
              type="text"
              placeholder="Your Name (Optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                marginBottom: '12px',
                outline: 'none'
              }}
            />
            <button
              onClick={handleConfirmOrder}
              style={{
                width: '100%',
                backgroundColor: '#52b788',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#40a574'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#52b788'}
            >
              Confirm Order • ${(getTotalPrice() * 1.08).toFixed(2)}
            </button>
          </div>
          )}

          {activeTab === 'history' && orderHistory.rounds.length > 0 && (
            <div style={{
              padding: '20px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#ffffff'
            }}>
            {/* Voucher Section */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#1f2937',
                marginBottom: '8px',
                display: 'block'
              }}>
                Voucher Code
              </label>
              {appliedVoucher ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: '#d1fae5',
                  border: '1px solid #6ee7b7',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle style={{ width: '18px', height: '18px', color: '#059669' }} />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                      {appliedVoucher.code}
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveVoucher}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#059669',
                      fontSize: '13px',
                      fontWeight: '500',
                      textDecoration: 'underline'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => {
                        setVoucherCode(e.target.value.toUpperCase());
                        setVoucherError('');
                      }}
                      placeholder="Enter code"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: voucherError ? '1px solid #ef4444' : '1px solid #d1d5db',
                        borderRadius: '8px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => !voucherError && (e.target.style.borderColor = '#52b788')}
                      onBlur={(e) => !voucherError && (e.target.style.borderColor = '#d1d5db')}
                    />
                    <button
                      onClick={handleApplyVoucher}
                      disabled={!voucherCode.trim()}
                      style={{
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#ffffff',
                        backgroundColor: voucherCode.trim() ? '#52b788' : '#d1d5db',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: voucherCode.trim() ? 'pointer' : 'not-allowed',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => voucherCode.trim() && (e.currentTarget.style.backgroundColor = '#27ae60')}
                      onMouseLeave={(e) => voucherCode.trim() && (e.currentTarget.style.backgroundColor = '#52b788')}
                    >
                      Apply
                    </button>
                  </div>
                  {voucherError && (
                    <p style={{
                      fontSize: '12px',
                      color: '#ef4444',
                      margin: '6px 0 0 0'
                    }}>
                      {voucherError}
                    </p>
                  )}
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: '6px 0 0 0'
                  }}>
                    Try: WELCOME10, SAVE20, FREESHIP
                  </p>
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '15px',
                fontWeight: '500',
                color: '#6b7280'
              }}>
                Subtotal
              </span>
              <span style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                ${orderHistory.subtotal.toFixed(2)}
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <span style={{
                fontSize: '15px',
                fontWeight: '500',
                color: '#6b7280'
              }}>
                VAT (8%)
              </span>
              <span style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                ${orderHistory.vat.toFixed(2)}
              </span>
            </div>
            {appliedVoucher && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <span style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#059669'
                }}>
                  Discount ({appliedVoucher.code})
                </span>
                <span style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#059669'
                }}>
                  -${getDiscountAmount().toFixed(2)}
                </span>
              </div>
            )}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <span style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                Total
              </span>
              <span style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#52b788'
              }}>
                ${(orderHistory.total - getDiscountAmount()).toFixed(2)}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  color: '#52b788',
                  border: '2px solid #52b788',
                  borderRadius: '12px',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0fdf4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                <Phone style={{ width: '18px', height: '18px' }} />
                Call Staff
              </button>
              <button
                style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  color: '#52b788',
                  border: '2px solid #52b788',
                  borderRadius: '12px',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0fdf4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                <FileText style={{ width: '18px', height: '18px' }} />
                Request Bill
              </button>
            </div>
          </div>
          )}
        </div>
      </div>

      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
      />
    </div>
  );
}
