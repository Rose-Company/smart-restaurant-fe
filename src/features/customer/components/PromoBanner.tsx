import React from 'react';
import { Gift, X } from 'lucide-react';

interface PromoBannerProps {
  message: string;
  onClose: () => void;
}

export function PromoBanner({ message, onClose }: PromoBannerProps) {
  return (
    <div style={{ 
      backgroundColor: '#52b788',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Gift style={{ width: '24px', height: '24px', color: '#ffffff' }} />
        <span style={{ fontSize: '15px', fontWeight: '500', color: '#ffffff' }}>
          {message}
        </span>
      </div>
      <button 
        onClick={onClose}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X style={{ width: '20px', height: '20px', color: '#ffffff' }} />
      </button>
    </div>
  );
}
