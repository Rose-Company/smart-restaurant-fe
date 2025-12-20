import { LayoutGrid, CheckCircle, XCircle } from 'lucide-react';
import React from "react";

interface StatsBarProps {
  stats: {
    total: number;
    occupied: number;
    available: number;
  };
}

export function StatsBar({ stats }: StatsBarProps) {
  const statCards = [
    {
      label: 'Total Tables',
      value: stats.total,
      icon: LayoutGrid,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Occupied',
      value: stats.occupied,
      icon: XCircle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    {
      label: 'Available',
      value: stats.available,
      icon: CheckCircle,
      color: 'bg-[#27ae60]',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">{stat.label}</p>
              <p className={`${stat.textColor}`}>{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
