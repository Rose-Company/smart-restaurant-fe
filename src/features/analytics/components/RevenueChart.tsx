import React, { useState, useMemo, useEffect } from 'react';
import { RevenueDataPoint, DateRangeKey } from '../types/analytics.types';

interface RevenueChartProps {
  revenueData: RevenueDataPoint[];
  dateRange: DateRangeKey;
}

export function RevenueChart({ revenueData, dateRange }: RevenueChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; day: number; value: number } | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger animation when data changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [dateRange]);

  // Calculate dynamic max Y value (add 20% padding)
  const maxY = useMemo(() => {
    const max = Math.max(...revenueData.map(d => d.revenue));
    return Math.ceil(max * 1.2 / 100) * 100; // Round up to nearest 100
  }, [revenueData]);

  // Determine if we're showing hourly or daily data
  const isHourly = dateRange === 'today' || dateRange === 'yesterday';

  const chartWidth = 1200;
  const chartHeight = 300;

  // Create smooth curve using Catmull-Rom to Bezier conversion
  const createSmoothPath = (points: { x: number; y: number }[], close: boolean = false) => {
    if (points.length < 2) return '';

    const tension = 0.3;
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
      const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
      const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
      const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    if (close) {
      path += ` L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;
    }

    return path;
  };

  // Convert revenue data to chart coordinates
  const chartPoints = revenueData.map((data, index) => {
    const x = (index / (revenueData.length - 1)) * chartWidth;
    const y = chartHeight - (data.revenue / maxY) * chartHeight;
    return { x, y, day: data.day, revenue: data.revenue };
  });

  const smoothLinePath = createSmoothPath(chartPoints, false);
  const smoothAreaPath = createSmoothPath(chartPoints, true);

  // Generate Y-axis ticks based on maxY
  const yTicks = useMemo(() => {
    const tickCount = 5;
    const step = maxY / (tickCount - 1);
    return Array.from({ length: tickCount }, (_, i) => Math.round(i * step));
  }, [maxY]);

  // Format label based on data type
  const formatLabel = (day: number) => {
    if (isHourly) {
      return `${day}:00`;
    }
    return `Jan ${day}`;
  };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      padding: '32px',
      marginBottom: '32px'
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#111827',
        margin: '0 0 24px 0'
      }}>
        Revenue Overview
      </h2>

      {/* Chart Container */}
      <div style={{
        width: '100%',
        height: '360px',
        position: 'relative'
      }}>
        <style>
          {`
            @keyframes wipeIn {
              from {
                clip-path: inset(0 100% 0 0);
              }
              to {
                clip-path: inset(0 0 0 0);
              }
            }
            .chart-animated {
              animation: wipeIn 1.5s ease-out forwards;
            }
          `}
        </style>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${chartWidth + 60} ${chartHeight + 60}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: 'visible' }}
          onMouseMove={(e) => {
            const svg = e.currentTarget;
            const rect = svg.getBoundingClientRect();
            const scaleX = (chartWidth + 60) / rect.width;
            const mouseX = (e.clientX - rect.left) * scaleX - 40;

            if (mouseX >= 0 && mouseX <= chartWidth) {
              let nearestPoint = chartPoints[0];
              let minDistance = Math.abs(chartPoints[0].x - mouseX);

              chartPoints.forEach(point => {
                const distance = Math.abs(point.x - mouseX);
                if (distance < minDistance) {
                  minDistance = distance;
                  nearestPoint = point;
                }
              });

              setHoveredPoint({
                x: nearestPoint.x,
                y: nearestPoint.y,
                day: nearestPoint.day,
                value: nearestPoint.revenue
              });
            } else {
              setHoveredPoint(null);
            }
          }}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00bc7d" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00bc7d" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <g transform="translate(40, 10)">
            {yTicks.map((value) => {
              const y = chartHeight - (value / maxY) * chartHeight;
              return (
                <g key={value}>
                  <line
                    x1="0"
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x="-10"
                    y={y + 4}
                    fontSize="12"
                    fill="#9ca3af"
                    textAnchor="end"
                  >
                    {value >= 1000 ? `${(value / 1000).toFixed(0)}kđ` : `${value}đ`}
                  </text>
                </g>
              );
            })}

            {/* Animated Area fill */}
            <path
              key={`area-${animationKey}`}
              className="chart-animated"
              d={smoothAreaPath}
              fill="url(#areaGradient)"
            />

            {/* Animated Line */}
            <path
              key={`line-${animationKey}`}
              className="chart-animated"
              d={smoothLinePath}
              fill="none"
              stroke="#00bc7d"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Tooltip and hover point */}
            {hoveredPoint && (
              <g>
                {/* Vertical line */}
                <line
                  x1={hoveredPoint.x}
                  y1="0"
                  x2={hoveredPoint.x}
                  y2={chartHeight}
                  stroke="#00bc7d"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.5"
                />
                
                {/* Tooltip box */}
                <g transform={`translate(${hoveredPoint.x}, ${hoveredPoint.y - 60})`}>
                  <rect
                    x="-50"
                    y="0"
                    width="100"
                    height="50"
                    fill="#ffffff"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    rx="8"
                    filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                  />
                  <text
                    x="0"
                    y="20"
                    fontSize="13"
                    fill="#6b7280"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {formatLabel(hoveredPoint.day)}
                  </text>
                  <text
                    x="0"
                    y="38"
                    fontSize="14"
                    fill="#00bc7d"
                    textAnchor="middle"
                    fontWeight="700"
                  >
                    {(hoveredPoint.value * 1000).toLocaleString('vi-VN')}đ
                  </text>
                </g>

                {/* Highlight circle */}
                <circle
                  cx={hoveredPoint.x}
                  cy={hoveredPoint.y}
                  r="6"
                  fill="#00bc7d"
                  stroke="#ffffff"
                  strokeWidth="3"
                />
              </g>
            )}

            {/* X-axis labels */}
            {revenueData.map((data, index) => {
              // Show fewer labels for hourly data (every 3 hours), more for daily data
              const skipInterval = isHourly ? 3 : 2;
              if (index % skipInterval === 0 || index === revenueData.length - 1) {
                const x = (index / (revenueData.length - 1)) * chartWidth;
                return (
                  <text
                    key={index}
                    x={x}
                    y={chartHeight + 25}
                    fontSize="12"
                    fill="#9ca3af"
                    textAnchor="middle"
                  >
                    {formatLabel(data.day)}
                  </text>
                );
              }
              return null;
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
