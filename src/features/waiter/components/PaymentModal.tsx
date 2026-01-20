import React, { useState, useRef } from 'react';
import { X, CreditCard, Wallet, DollarSign, Printer, ChevronRight, CheckCircle } from 'lucide-react';
import { WaiterTask } from '../types/waiter.types';

interface OrderItemWithStatus {
  id: string;
  name: string;
  quantity: number;
  status: 'pending' | 'completed';
  modifiers?: string[];
  note?: string;
  price: number;
  modifierPrice?: number;
}

interface PaymentModalProps {
  task: WaiterTask;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
}

type PaymentMethod = 'cash' | 'card' | 'e-wallet';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  task,
  isOpen,
  onClose,
  onPaymentComplete
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('cash');
  const [printReceipt, setPrintReceipt] = useState(true);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number; type: 'percentage' | 'fixed' } | null>(null);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Mock order items - in real app, fetch from API
  const orderItems: OrderItemWithStatus[] = [
    {
      id: '1',
      name: 'Grilled Salmon',
      quantity: 1,
      status: 'completed',
      modifiers: ['No Butter', 'Extra Lemon'],
      price: 24.99,
      modifierPrice: 1.50
    },
    {
      id: '2',
      name: 'Burger',
      quantity: 2,
      status: 'completed',
      modifiers: ['Medium Rare', 'No Onions'],
      price: 16.50,
      modifierPrice: 2.00
    },
    {
      id: '3',
      name: 'Coke',
      quantity: 2,
      status: 'completed',
      price: 3.50
    },
    {
      id: '4',
      name: 'Caesar Salad',
      quantity: 1,
      status: 'completed',
      price: 10.50
    }
  ];

  if (!isOpen) return null;

  // Calculate totals
  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => {
      const itemPrice = item.price + (item.modifierPrice || 0);
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  
  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === 'percentage') {
      discount = subtotal * (appliedVoucher.discount / 100);
    } else {
      discount = appliedVoucher.discount;
    }
  }
  
  const total = subtotal - discount;

  const handleApplyVoucher = () => {
    const code = voucherCode.toUpperCase();
    if (code === 'SAVE20') {
      setAppliedVoucher({ code, discount: 20, type: 'percentage' });
      setShowVoucherModal(false);
    } else if (code === 'VIP50') {
      setAppliedVoucher({ code, discount: 50, type: 'fixed' });
      setShowVoucherModal(false);
    } else {
      alert('Invalid voucher code');
    }
  };

  const handleSliderStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
  };

  const handleSliderMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = Math.max(0, Math.min(clientX - rect.left, rect.width - 60));
    const percentage = (position / (rect.width - 60)) * 100;

    setSliderPosition(percentage);

    if (percentage >= 95) {
      handlePaymentConfirm();
    }
  };

  const handleSliderEnd = () => {
    setIsDragging(false);
    if (sliderPosition < 95) {
      setSliderPosition(0);
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleSliderMove);
      window.addEventListener('mouseup', handleSliderEnd);
      window.addEventListener('touchmove', handleSliderMove);
      window.addEventListener('touchend', handleSliderEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleSliderMove);
      window.removeEventListener('mouseup', handleSliderEnd);
      window.removeEventListener('touchmove', handleSliderMove);
      window.removeEventListener('touchend', handleSliderEnd);
    };
  }, [isDragging, sliderPosition]);

  const handlePaymentConfirm = () => {
    setIsDragging(false);
    setSliderPosition(0);
    onPaymentComplete();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '640px',
        maxHeight: '85vh',
        background: 'linear-gradient(to bottom, #1a3a2e, #1e2939)',
        borderRadius: '24px',
        boxShadow: '0px 30px 60px rgba(0, 0, 0, 0.6)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'scaleIn 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(to right, #00a63e, #008236)',
          padding: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start'
          }}>
            <div>
              <h2 style={{
                color: '#ffffff',
                fontSize: '24px',
                fontWeight: 'bold',
                lineHeight: '32px',
                margin: 0,
                marginBottom: '4px'
              }}>
                Table {task.tableNumber} - Payment
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                lineHeight: '20px',
                margin: 0
              }}>
                Complete transaction
              </p>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <X style={{ width: '24px', height: '24px', color: '#ffffff' }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px'
        }}>
          {/* Order Items List */}
          <div style={{
            background: '#2a3f4f',
            borderRadius: '14px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <h3 style={{
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 'bold',
              lineHeight: '28px',
              marginBottom: '16px'
            }}>
              Order Items
            </h3>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {orderItems.map((item, index) => {
                const itemTotal = (item.price + (item.modifierPrice || 0)) * item.quantity;
                return (
                  <div key={item.id}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '8px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <span style={{
                            color: '#ffffff',
                            fontSize: '18px',
                            fontWeight: 600,
                            lineHeight: '26px'
                          }}>
                            {item.quantity}x
                          </span>
                          <span style={{
                            color: '#ffffff',
                            fontSize: '18px',
                            fontWeight: 600,
                            lineHeight: '26px'
                          }}>
                            {item.name}
                          </span>
                          {item.status === 'pending' && (
                            <CheckCircle style={{ 
                              width: '18px', 
                              height: '18px', 
                              color: '#00c950' 
                            }} />
                          )}
                        </div>

                        {item.modifiers && item.modifiers.length > 0 && (
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            marginBottom: '8px'
                          }}>
                            {item.modifiers.map((modifier, idx) => (
                              <span
                                key={idx}
                                style={{
                                  color: '#99a1af',
                                  fontSize: '14px',
                                  lineHeight: '20px'
                                }}
                              >
                                • {modifier}
                              </span>
                            ))}
                          </div>
                        )}

                        <div style={{
                          color: '#6a7282',
                          fontSize: '14px',
                          lineHeight: '20px'
                        }}>
                          ${item.price.toFixed(2)}
                          {item.modifierPrice && item.modifierPrice > 0 && (
                            <> + ${item.modifierPrice.toFixed(2)}</>
                          )}
                        </div>
                      </div>

                      <div style={{
                        color: '#ffffff',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        lineHeight: '26px',
                        marginLeft: '16px'
                      }}>
                        ${itemTotal.toFixed(2)}
                      </div>
                    </div>

                    {index < orderItems.length - 1 && (
                      <div style={{
                        height: '1px',
                        background: '#1e2939',
                        marginTop: '20px'
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subtotal */}
          <div style={{
            background: '#2a3f4f',
            borderRadius: '14px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '24px'
            }}>
              Subtotal
            </span>
            <span style={{
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 'bold',
              lineHeight: '28px'
            }}>
              ${subtotal.toFixed(2)}
            </span>
          </div>

          {/* Discount/Voucher Section */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 'bold',
              lineHeight: '24px',
              marginBottom: '12px'
            }}>
              Discount / Voucher
            </h3>

            {appliedVoucher ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(0, 166, 62, 0.15), rgba(21, 93, 252, 0.15))',
                border: '1px solid #00a63e',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: '#00a63e',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <DollarSign style={{ width: '24px', height: '24px', color: '#ffffff' }} />
                  </div>
                  <div>
                    <div style={{
                      color: '#05df72',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      marginBottom: '2px'
                    }}>
                      {appliedVoucher.code}
                    </div>
                    <div style={{
                      color: '#99a1af',
                      fontSize: '13px'
                    }}>
                      {appliedVoucher.type === 'percentage' 
                        ? `${appliedVoucher.discount}% discount` 
                        : `$${appliedVoucher.discount} off`}
                    </div>
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
                    padding: '6px 12px',
                    color: '#ff4444',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowVoucherModal(true)}
                style={{
                  width: '100%',
                  background: '#2a3f4f',
                  border: '1px dashed #4a5565',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#354654';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#2a3f4f';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255, 137, 4, 0.2)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <DollarSign style={{ width: '24px', height: '24px', color: '#ff8904' }} />
                  </div>
                  <span style={{
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 500
                  }}>
                    Tap to apply discount
                  </span>
                </div>
                <ChevronRight style={{ width: '20px', height: '20px', color: '#99a1af' }} />
              </button>
            )}
          </div>

          {/* Payment Method */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 'bold',
              lineHeight: '24px',
              marginBottom: '12px'
            }}>
              Payment Method
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px'
            }}>
              <button
                onClick={() => setSelectedPaymentMethod('cash')}
                style={{
                  background: selectedPaymentMethod === 'cash' 
                    ? 'linear-gradient(135deg, #00a63e, #008236)' 
                    : '#2a3f4f',
                  border: selectedPaymentMethod === 'cash' 
                    ? 'none' 
                    : '1px solid #4a5565',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: selectedPaymentMethod === 'cash'
                    ? '0px 8px 20px rgba(0, 166, 62, 0.3)'
                    : 'none'
                }}
              >
                <DollarSign style={{
                  width: '32px',
                  height: '32px',
                  color: '#ffffff'
                }} />
                <span style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  CASH
                </span>
              </button>

              <button
                onClick={() => setSelectedPaymentMethod('card')}
                style={{
                  background: selectedPaymentMethod === 'card' 
                    ? 'linear-gradient(135deg, #00a63e, #008236)' 
                    : '#2a3f4f',
                  border: selectedPaymentMethod === 'card' 
                    ? 'none' 
                    : '1px solid #4a5565',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: selectedPaymentMethod === 'card'
                    ? '0px 8px 20px rgba(0, 166, 62, 0.3)'
                    : 'none'
                }}
              >
                <CreditCard style={{
                  width: '32px',
                  height: '32px',
                  color: '#ffffff'
                }} />
                <span style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  CARD
                </span>
              </button>

              <button
                onClick={() => setSelectedPaymentMethod('e-wallet')}
                style={{
                  background: selectedPaymentMethod === 'e-wallet' 
                    ? 'linear-gradient(135deg, #00a63e, #008236)' 
                    : '#2a3f4f',
                  border: selectedPaymentMethod === 'e-wallet' 
                    ? 'none' 
                    : '1px solid #4a5565',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: selectedPaymentMethod === 'e-wallet'
                    ? '0px 8px 20px rgba(0, 166, 62, 0.3)'
                    : 'none'
                }}
              >
                <Wallet style={{
                  width: '32px',
                  height: '32px',
                  color: '#ffffff'
                }} />
                <span style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  E-WALLET
                </span>
              </button>
            </div>
          </div>

          {/* Print Receipt Toggle */}
          <div style={{
            background: '#2a3f4f',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Printer style={{ width: '24px', height: '24px', color: '#99a1af' }} />
              <span style={{
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 500
              }}>
                Print Receipt
              </span>
            </div>

            <button
              onClick={() => setPrintReceipt(!printReceipt)}
              style={{
                position: 'relative',
                width: '52px',
                height: '32px',
                background: printReceipt ? '#00a63e' : '#4a5565',
                borderRadius: '16px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '4px',
                left: printReceipt ? '24px' : '4px',
                width: '24px',
                height: '24px',
                background: '#ffffff',
                borderRadius: '50%',
                transition: 'all 0.3s'
              }} />
            </button>
          </div>
        </div>

        {/* Footer with Total and Slider */}
        <div style={{
          background: '#1e2939',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px 24px'
        }}>
          {/* Total */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <span style={{
              color: '#99a1af',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '24px'
            }}>
              Total
            </span>
            <span style={{
              color: '#ffffff',
              fontSize: '32px',
              fontWeight: 'bold',
              lineHeight: '40px'
            }}>
              ${total.toFixed(2)}
            </span>
          </div>

          {/* Slide to Confirm */}
          <div
            ref={sliderRef}
            style={{
              position: 'relative',
              height: '64px',
              background: 'linear-gradient(135deg, #00a63e, #008236)',
              borderRadius: '32px',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
          >
            {/* Background Track */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}>
              <span style={{
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 'bold',
                opacity: 1 - sliderPosition / 100
              }}>
                Slide to Confirm Payment →
              </span>
            </div>

            {/* Slider Button */}
            <div
              onMouseDown={handleSliderStart}
              onTouchStart={handleSliderStart}
              style={{
                position: 'absolute',
                top: '8px',
                left: `${sliderPosition}%`,
                width: '56px',
                height: '48px',
                background: '#ffffff',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'grab',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
                transition: isDragging ? 'none' : 'left 0.3s ease-out',
                transform: 'translateX(0)'
              }}
            >
              <ChevronRight style={{ 
                width: '24px', 
                height: '24px', 
                color: '#00a63e' 
              }} />
            </div>
          </div>

          <p style={{
            textAlign: 'center',
            color: '#6a7282',
            fontSize: '12px',
            lineHeight: '18px',
            margin: '12px 0 0 0'
          }}>
            Slide the bar fully to the right to confirm
          </p>
        </div>
      </div>

      {/* Voucher Input Modal */}
      {showVoucherModal && (
        <>
          <div
            onClick={() => setShowVoucherModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1100
            }}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '400px',
            background: '#1e2939',
            borderRadius: '16px',
            padding: '24px',
            zIndex: 1101,
            boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.6)'
          }}>
            <h3 style={{
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '16px'
            }}>
              Enter Voucher Code
            </h3>

            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              placeholder="Enter code here"
              style={{
                width: '100%',
                height: '48px',
                background: '#2a3f4f',
                border: '1px solid #4a5565',
                borderRadius: '8px',
                padding: '0 16px',
                color: '#ffffff',
                fontSize: '16px',
                marginBottom: '16px',
                outline: 'none'
              }}
            />

            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowVoucherModal(false)}
                style={{
                  flex: 1,
                  height: '48px',
                  background: '#2a3f4f',
                  border: '1px solid #4a5565',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleApplyVoucher}
                disabled={!voucherCode}
                style={{
                  flex: 1,
                  height: '48px',
                  background: voucherCode ? '#00a63e' : '#4a5565',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: voucherCode ? 'pointer' : 'not-allowed'
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
        `}
      </style>
    </>
  );
};
