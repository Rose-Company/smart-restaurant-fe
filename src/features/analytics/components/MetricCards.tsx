import React from 'react';
import { DollarSign, ShoppingCart, Coins } from 'lucide-react';

interface MetricCardData {
  iconType: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  bgColor: string;
}

interface MetricCardsProps {
  metrics: MetricCardData[];
}

const formatVND = (value: string) => {
  // Check if it's already a number with commas
  if (/^\d{1,3}(,\d{3})*$/.test(value)) {
    return `${value}đ`;
  }
  return value;
};

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'dollar':
      return <DollarSign size={24} />;
    case 'cart':
      return <ShoppingCart size={24} />;
    case 'coins':
      return <Coins size={24} />;
    default:
      return <DollarSign size={24} />;
  }
};

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
      marginBottom: '32px'
    }}>
      {metrics.map((metric, index) => (
        <div
          key={index}
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `${metric.bgColor}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: metric.bgColor
            }}>
              {getIcon(metric.iconType)}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              background: metric.isPositive ? '#dcfce7' : '#fee2e2',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              color: metric.isPositive ? '#16a34a' : '#dc2626'
            }}>
              <span>{metric.change}</span>
            </div>
          </div>
          <div style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '8px'
          }}>
            {metric.label}
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827'
          }}>
            {formatVND(metric.value)}
          </div>
          <div style={{
            fontSize: '13px',
            color: '#9ca3af',
            marginTop: '4px'
          }}>
            vs last month
          </div>
        </div>
      ))}
    </div>
  );
}
