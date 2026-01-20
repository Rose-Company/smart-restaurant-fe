import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, ShoppingCart, ArrowLeft } from 'lucide-react';

interface ReorderSuccessModalProps {
  isOpen: boolean;
  itemCount: number;
  onViewCart: () => void;
  onContinue: () => void;
}

export function ReorderSuccessModal({ isOpen, itemCount, onViewCart, onContinue }: ReorderSuccessModalProps) {
  const { t } = useTranslation('customer');
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '32px 24px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Success Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#dcfce7',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <CheckCircle style={{ width: '36px', height: '36px', color: '#27ae60' }} />
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#101828',
          textAlign: 'center',
          margin: '0 0 8px 0'
        }}>
          Added to Cart!
        </h2>

        {/* Message */}
        <p style={{
          fontSize: '15px',
          color: '#4a5565',
          textAlign: 'center',
          margin: '0 0 28px 0',
          lineHeight: '1.5'
        }}>
          {itemCount} item{itemCount > 1 ? 's' : ''} successfully added to your cart
        </p>

        {/* Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {/* View Cart Button */}
          <button
            onClick={onViewCart}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '14px 24px',
              backgroundColor: '#27ae60',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#229954'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
          >
            <ShoppingCart style={{ width: '20px', height: '20px' }} />
            View Cart
          </button>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '14px 24px',
              backgroundColor: 'transparent',
              color: '#4a5565',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ArrowLeft style={{ width: '20px', height: '20px' }} />
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
