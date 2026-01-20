import React from 'react';
import { BestSellingDish } from '../types/analytics.types';

interface BestSellingDishesProps {
  dishes: BestSellingDish[];
}

export function BestSellingDishes({ dishes }: BestSellingDishesProps) {
  const maxRevenue = Math.max(...dishes.map(d => d.revenue));

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      padding: '32px'
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#111827',
        margin: '0 0 24px 0'
      }}>
        Best Selling Dishes
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {dishes.map((dish, index) => {
          const percentage = (dish.revenue / maxRevenue) * 100;

          return (
            <div key={dish.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Rank Badge */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: index === 0 ? '#fbbf24' : index === 1 ? '#d1d5db' : index === 2 ? '#fb923c' : '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                color: index < 3 ? '#ffffff' : '#6b7280',
                flexShrink: 0
              }}>
                {index + 1}
              </div>

              {/* Dish Image */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1px solid #e5e7eb'
              }}>
                <img 
                  src={dish.image} 
                  alt={dish.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Dish Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '4px'
                }}>
                  {dish.name}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#16a34a',
                  fontWeight: '500',
                  marginBottom: '6px'
                }}>
                  {dish.orders} orders • {dish.revenue.toLocaleString('vi-VN')}đ
                </div>
                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: '#e5e7eb',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: '#00bc7d',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
