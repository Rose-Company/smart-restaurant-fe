import React, { useState, useMemo } from 'react';
import { Download, Calendar } from 'lucide-react';
import { DateRangeKey } from '../types/analytics.types';
import { MetricCards } from '../components/MetricCards';
import { RevenueChart } from '../components/RevenueChart';
import { BestSellingDishes } from '../components/BestSellingDishes';
import { SalesByCategory } from '../components/SalesByCategory';
import { getAnalyticsDataByRange } from '../data/mockData';

export function AnalyticsPage() {
  const [activeDateRange, setActiveDateRange] = useState<DateRangeKey>('yesterday');

  const dateRanges = [
    { key: 'today' as const, label: 'Today' },
    { key: 'yesterday' as const, label: 'Yesterday' },
    { key: 'last7Days' as const, label: 'Last 7 Days' },
    { key: 'last30Days' as const, label: 'Last 30 Days' }
  ];

  // Get data based on selected date range
  const currentData = useMemo(() => getAnalyticsDataByRange(activeDateRange), [activeDateRange]);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: '#f9fafb',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        background: '#2c3e50',
        padding: '24px 40px',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: '0 0 8px 0'
            }}>
              Business Reports
            </h1>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0
            }}>
              Track your restaurant's performance and revenue metrics
            </p>
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          >
            <Download size={16} />
            Export to Excel
          </button>
        </div>

        {/* Date Range Selector */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '24px'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {dateRanges.map((range) => (
              <button
                key={range.key}
                onClick={() => setActiveDateRange(range.key)}
                style={{
                  padding: '8px 16px',
                  background: activeDateRange === range.key ? '#00bc7d' : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (activeDateRange !== range.key) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeDateRange !== range.key) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                {range.label}
              </button>
            ))}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '14px'
          }}>
            <Calendar size={16} />
            This Month (Jan 1 - Jan 31)
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        padding: '32px 40px'
      }}>
        {/* Metrics Cards */}
        <MetricCards metrics={currentData.metrics} />

        {/* Revenue Overview Chart */}
        <RevenueChart revenueData={currentData.revenueData} dateRange={activeDateRange} />

        {/* Bottom Section: Best Selling Dishes & Sales by Category */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px'
        }}>
          <BestSellingDishes dishes={currentData.bestSellingDishes} />
          <SalesByCategory categories={currentData.categorySales} />
        </div>
      </div>
    </div>
  );
}
