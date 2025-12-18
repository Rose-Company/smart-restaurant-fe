import React from 'react';

export function DashboardPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            High-level overview of your restaurant performance (placeholder page).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Total Tables</p>
            <p className="text-2xl font-semibold text-gray-900">12</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Active Orders</p>
            <p className="text-2xl font-semibold text-gray-900">8</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-1">Today&apos;s Revenue</p>
            <p className="text-2xl font-semibold text-gray-900">$1,250.00</p>
          </div>
        </div>
      </div>
    </div>
  );
}


