import React from 'react';
import type { Category } from '../types/category.types';

interface CategoryStatsProps {
  categories: Category[];
}

export function CategoryStats({ categories }: CategoryStatsProps) {
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.isActive).length;
  const totalItems = categories.reduce((sum, c) => sum + c.itemCount, 0);

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ padding: '17px' }}>
        <p className="text-sm text-gray-600 mb-1">Total Categories</p>
        <p className="text-base text-gray-900">{totalCategories}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ padding: '17px' }}>
        <p className="text-sm text-gray-600 mb-1">Active Categories</p>
        <p className="text-base text-gray-900">{activeCategories}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ padding: '17px' }}>
        <p className="text-sm text-gray-600 mb-1">Total Items</p>
        <p className="text-base text-gray-900">{totalItems}</p>
      </div>
    </div>
  );
}

