import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Star, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import { Button } from '../../../components/ui/misc/button';
import { Badge } from '../../../components/ui/data-display/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/data-display/table';
import type { MenuItem } from '../types/menu.types';
import { formatPrice } from '../../../lib/utils';
interface MenuTableProps {
  items: MenuItem[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type ColumnId = 'item' | 'category' | 'price' | 'status' | 'lastUpdate' | 'actions';

interface Column {
  id: ColumnId;
  label: string;
  renderHeader?: () => React.ReactNode;
  renderCell: (item: MenuItem) => React.ReactNode;
}

const STORAGE_KEY = 'menu-table-column-order';
const DEFAULT_COLUMN_ORDER: ColumnId[] = ['item', 'category', 'price', 'status', 'lastUpdate', 'actions'];

export function MenuTable({
  items,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}: MenuTableProps) {
  // Load column order from localStorage or use default
  const [columnOrder, setColumnOrder] = useState<ColumnId[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate that all columns are present
        if (Array.isArray(parsed) && parsed.length === DEFAULT_COLUMN_ORDER.length) {
          const isValid = DEFAULT_COLUMN_ORDER.every(col => parsed.includes(col));
          if (isValid) return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load column order:', e);
    }
    return DEFAULT_COLUMN_ORDER;
  });

  const [draggedColumn, setDraggedColumn] = useState<ColumnId | null>(null);

  // Save column order to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(columnOrder));
    } catch (e) {
      console.error('Failed to save column order:', e);
    }
  }, [columnOrder]);

  const handleDragStart = (e: React.DragEvent, columnId: ColumnId) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', columnId);
  };

  const handleDragOver = (e: React.DragEvent, targetColumnId: ColumnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: ColumnId) => {
    e.preventDefault();

    if (draggedColumn === null || draggedColumn === targetColumnId) {
      setDraggedColumn(null);
      return;
    }

    const draggedIndex = columnOrder.indexOf(draggedColumn);
    const targetIndex = columnOrder.indexOf(targetColumnId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedColumn(null);
      return;
    }

    const newOrder = [...columnOrder];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);

    setColumnOrder(newOrder);
    setDraggedColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return {
          backgroundColor: '#dcfce7',
          color: '#15803d',
          borderColor: '#bbf7d0'
        };
      case 'Sold Out':
        return {
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          borderColor: '#fecaca'
        };
      case 'Unavailable':
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          borderColor: '#e5e7eb'
        };
      default:
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          borderColor: '#e5e7eb'
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Define column configurations
  const columns: Record<ColumnId, Column> = {
    item: {
      id: 'item',
      label: 'Item',
      renderCell: (item) => (
        <TableCell className="py-4">
          <div className="flex items-center gap-3">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex items-center gap-2">
              <span className="text-gray-900">{item.name}</span>
              {item.chefRecommended && (
                <Star className="w-4 h-4 fill-[#27ae60] text-[#27ae60]" />
              )}
            </div>
          </div>
        </TableCell>
      ),
    },
    category: {
      id: 'category',
      label: 'Category',
      renderCell: (item) => (
        <TableCell>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            {item.category}
          </Badge>
        </TableCell>
      ),
    },
    price: {
      id: 'price',
      label: 'Price',
      renderCell: (item) => (
        <TableCell>
          <span className="text-gray-900">{formatPrice(item.price)}</span>
        </TableCell>
      ),
    },
    status: {
      id: 'status',
      label: 'Status',
      renderCell: (item) => (
        <TableCell>
          <Badge variant="outline" style={getStatusColor(item.status)}>
            {item.status}
          </Badge>
        </TableCell>
      ),
    },
    lastUpdate: {
      id: 'lastUpdate',
      label: 'Last Update',
      renderCell: (item) => (
        <TableCell>
          <span className="text-gray-600">{formatDate(item.lastUpdate)}</span>
        </TableCell>
      ),
    },
    actions: {
      id: 'actions',
      label: 'Actions',
      renderCell: (item) => (
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(item.id)}
              className="hover:bg-[#27ae60]/10 hover:text-[#27ae60] text-gray-600"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item.id)}
              className="hover:bg-red-50 hover:text-red-600 text-gray-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </TableCell>
      ),
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              {columnOrder.map((columnId) => {
                const column = columns[columnId];
                return (
                  <TableHead
                    key={columnId}
                    draggable
                    onDragStart={(e) => handleDragStart(e, columnId)}
                    onDragOver={(e) => handleDragOver(e, columnId)}
                    onDrop={(e) => handleDrop(e, columnId)}
                    onDragEnd={handleDragEnd}
                    className={`text-gray-700 relative group ${draggedColumn === columnId ? 'opacity-50' : ''
                      }`}
                    style={{
                      cursor: 'move',
                      userSelect: 'none',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical
                        className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                      />
                      <span>{column.label}</span>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnOrder.length} className="text-center py-12 text-gray-500">
                  No menu items found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {columnOrder.map((columnId) => (
                    <React.Fragment key={columnId}>
                      {columns[columnId].renderCell(item)}
                    </React.Fragment>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 0 && (
        <div className="px-6 py-6 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className={
                      currentPage === pageNum
                        ? 'bg-[#27ae60] hover:bg-[#229954] text-white border-[#27ae60]'
                        : 'border-gray-300 hover:bg-gray-50'
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

