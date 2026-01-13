import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  orderNumber?: string;
  title?: string;
  message?: string;
  onClose: () => void;
}

export function OrderSuccessModal({ isOpen, orderNumber, title, message, onClose }: OrderSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'relative',
        width: '90%',
        maxWidth: '400px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '32px 24px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
        </button>

        {/* Success Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 24px',
          borderRadius: '50%',
          backgroundColor: '#dcfce7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CheckCircle style={{ width: '48px', height: '48px', color: '#52b788' }} />
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '12px'
        }}>
          {title || 'Order Confirmed!'}
        </h2>

        {/* Message */}
        <p style={{
          fontSize: '15px',
          color: '#6b7280',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          {message || (
            <>
              Your order has been successfully placed.{orderNumber && ` Order #${orderNumber}`}
              <br />
              We'll notify you when it's ready!
            </>
          )}
        </p>

        {/* OK Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            backgroundColor: '#52b788',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#40a574'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#52b788'}
        >
          OK
        </button>
      </div>
    </div>
  );
}
