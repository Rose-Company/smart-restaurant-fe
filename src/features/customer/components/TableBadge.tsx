import React from 'react';

interface TableBadgeProps {
  tableNumber: string;
}

export function TableBadge({ tableNumber }: TableBadgeProps) {
  return (
    <div style={{ 
      backgroundColor: '#2c3e50',
      padding: '16px',
      textAlign: 'center'
    }}>
      <div style={{ 
        display: 'inline-block',
        backgroundColor: '#52b788',
        padding: '8px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#ffffff'
      }}>
        Table {tableNumber}
      </div>
    </div>
  );
}
