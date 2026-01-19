import React from 'react';
import { Star, Plus } from 'lucide-react';
import type { MenuItem } from '../../menu/types/menu.types';
import { formatPrice } from '../../../lib/currency';

interface MenuItemCardProps {
  item: MenuItem;
  onAddClick: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onAddClick }: MenuItemCardProps) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', position: 'relative' }}>
        {/* Content - Left Side */}
        <div style={{ 
          flex: 1,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minWidth: 0
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#1f2937',
                margin: 0,
                flex: 1
              }}>
                {item.name}
              </h3>
              {item.chefRecommended && (
                <Star style={{ 
                  width: '18px', 
                  height: '18px', 
                  fill: '#52b788', 
                  color: '#52b788',
                  flexShrink: 0
                }} />
              )}
            </div>
            {item.description && (
              <p style={{ 
                fontSize: '13px', 
                color: '#6b7280', 
                margin: '8px 0 0 0',
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {item.description}
              </p>
            )}
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginTop: '12px'
          }}>
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#52b788'
            }}>
              {formatPrice(item.price)}
            </span>
            <button
              onClick={() => onAddClick(item)}
              style={{
                backgroundColor: '#52b788',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#40a574'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#52b788'}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Add
            </button>
          </div>
        </div>

        {/* Image - Right Side */}
        <div style={{ 
          width: '140px',
          height: '140px',
          flexShrink: 0
        }}>
          <img
            src={item.imageUrl}
            alt={item.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>
    </div>
  );
}
