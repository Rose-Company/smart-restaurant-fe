import React, { useState } from 'react';
import { CategorySale } from '../types/analytics.types';

interface SalesByCategoryProps {
  categories: CategorySale[];
}

export function SalesByCategory({ categories }: SalesByCategoryProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

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
        Sales by Category
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px'
      }}>
        {/* Donut Chart */}
        <div style={{ position: 'relative', width: '250px', height: '250px' }}>
          <svg width="250" height="250" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="20"
            />

            {/* Category segments */}
            {(() => {
              let currentAngle = -90; // Start from top
              return categories.map((category, index) => {
                const percentage = category.percentage;
                const angle = (percentage / 100) * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;

                // Convert to radians
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;

                // Calculate arc path
                const radius = 40;
                const x1 = 50 + radius * Math.cos(startRad);
                const y1 = 50 + radius * Math.sin(startRad);
                const x2 = 50 + radius * Math.cos(endRad);
                const y2 = 50 + radius * Math.sin(endRad);

                const largeArcFlag = angle > 180 ? 1 : 0;

                const pathData = [
                  `M ${x1} ${y1}`,
                  `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
                ].join(' ');

                const isHovered = hoveredCategory === category.name;
                currentAngle += angle;

                return (
                  <path
                    key={index}
                    d={pathData}
                    fill="none"
                    stroke={category.color}
                    strokeWidth={isHovered ? "22" : "20"}
                    strokeLinecap="round"
                    style={{
                      cursor: 'pointer',
                      transition: 'stroke-width 0.2s',
                      opacity: hoveredCategory && !isHovered ? 0.6 : 1
                    }}
                    onMouseEnter={() => setHoveredCategory(category.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                );
              });
            })()}
          </svg>

          {/* Tooltip */}
          {hoveredCategory && (() => {
            const category = categories.find(c => c.name === hoveredCategory);
            if (!category) return null;
            
            return (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#ffffff',
                padding: '12px 16px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                border: '1px solid #e5e7eb',
                pointerEvents: 'none',
                zIndex: 10,
                minWidth: '120px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  marginBottom: '4px',
                  fontWeight: '500'
                }}>
                  {category.name}
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: category.color
                }}>
                  {category.percentage}%
                </div>
              </div>
            );
          })()}
        </div>

        {/* Legend */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {categories.map((category, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  background: category.color
                }} />
                <span style={{
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  {category.name}
                </span>
              </div>
              <span style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827'
              }}>
                {category.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
