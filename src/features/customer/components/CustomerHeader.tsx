import React from 'react';
import { Search, User, Utensils } from 'lucide-react';

interface CustomerHeaderProps {
  onSearchClick?: () => void;
  onUserClick?: () => void;
}

export function CustomerHeader({ onSearchClick, onUserClick }: CustomerHeaderProps) {
  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '12px', 
          backgroundColor: '#52b788',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Utensils style={{ width: '24px', height: '24px', color: '#ffffff' }} />
        </div>
        <span style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>RestaurantOS</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={onSearchClick}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Search style={{ width: '24px', height: '24px', color: '#6b7280' }} />
        </button>
        <button 
          onClick={onUserClick}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <User style={{ width: '24px', height: '24px', color: '#6b7280' }} />
        </button>
      </div>
    </div>
  );
}
