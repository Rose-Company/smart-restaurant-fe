import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface BottomCartBarProps {
  itemCount: number;
  totalPrice: number;
  onViewCart: () => void;
}

export function BottomCartBar({ itemCount, totalPrice, onViewCart }: BottomCartBarProps) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#2c3e50',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: '#52b788',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ShoppingCart style={{ width: '24px', height: '24px', color: '#ffffff' }} />
        </div>
        <span style={{ 
          fontSize: '15px', 
          fontWeight: '500', 
          color: '#ffffff'
        }}>
          {itemCount === 0 ? 'Your cart is empty' : `${itemCount} items • $${totalPrice.toFixed(2)}`}
        </span>
      </div>
      <button
        onClick={onViewCart}
        disabled={itemCount === 0}
        style={{
          backgroundColor: '#52b788',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          padding: '12px 24px',
          fontSize: '15px',
          fontWeight: '600',
          cursor: itemCount === 0 ? 'not-allowed' : 'pointer',
          opacity: itemCount === 0 ? 0.5 : 1,
          transition: 'all 0.2s'
        }}
      >
        View Cart
      </button>
    </div>
  );
}
