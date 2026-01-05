import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/data-display/table';
import { CategoryTableRow } from './CategoryTableRow';
import type { Category } from '../types/category.types';

interface CategoriesTableProps {
  categories: Category[];
  draggedItem: number | null;
  onDragStart: (e: React.DragEvent, id: number) => void;
  onDragOver: (e: React.DragEvent, id: number) => void;
  onDragEnd: () => void;
  onToggleStatus: (id: number) => void;
  onEdit: (id: number) => void;
}

export function CategoriesTable({
  categories,
  draggedItem,
  onDragStart,
  onDragOver,
  onDragEnd,
  onToggleStatus,
  onEdit
}: CategoriesTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              <TableHead className="text-gray-700 py-4">Order</TableHead>
              <TableHead className="text-gray-700">Category Name</TableHead>
              <TableHead className="text-gray-700">Description</TableHead>
              <TableHead className="text-gray-700 text-center">Items</TableHead>
              <TableHead className="text-gray-700 text-center">Status</TableHead>
              <TableHead className="text-gray-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                  No categories found. Click "Add Category" to create your first category.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <CategoryTableRow
                  key={category.id}
                  category={category}
                  draggedItem={draggedItem}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDragEnd={onDragEnd}
                  onToggleStatus={onToggleStatus}
                  onEdit={onEdit}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

