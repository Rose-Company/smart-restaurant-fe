import React from 'react';
import { GripVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui/misc/button';
import { Switch } from '../../../../components/ui/forms/switch';
import { TableCell, TableRow } from '../../../../components/ui/data-display/table';
import type { Category } from '../types/category.types';

interface CategoryTableRowProps {
  category: Category;
  draggedItem: number | null;
  onDragStart: (e: React.DragEvent, id: number) => void;
  onDragOver: (e: React.DragEvent, id: number) => void;
  onDragEnd: () => void;
  onToggleStatus: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function CategoryTableRow({
  category,
  draggedItem,
  onDragStart,
  onDragOver,
  onDragEnd,
  onToggleStatus,
  onEdit,
  onDelete,
}: CategoryTableRowProps) {
  return (
    <TableRow
      draggable
      onDragStart={(e) => onDragStart(e, category.id)}
      onDragOver={(e) => onDragOver(e, category.id)}
      onDragEnd={onDragEnd}
      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-move ${
        draggedItem === category.id ? 'opacity-50' : ''
      }`}
    >
      {/* Order Column */}
      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <GripVertical className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing" />
          <span className="text-gray-500 text-sm font-medium">#{category.displayOrder}</span>
        </div>
      </TableCell>

      {/* Category Name Column */}
      <TableCell>
        <span className="text-gray-900 font-medium">{category.name}</span>
      </TableCell>

      {/* Description Column */}
      <TableCell>
        <span className="text-gray-600 text-sm">{category.description}</span>
      </TableCell>

      {/* Item Count Column */}
      <TableCell className="text-center">
        <span 
          className="inline-flex items-center justify-center h-8 rounded-full text-sm font-medium"
          style={{ 
            backgroundColor: '#eff6ff',
            color: '#1447e6',
            border: '1px solid #bedbff',
            padding: '5px 13px'
          }}
        >
          {category.itemCount}
        </span>
      </TableCell>

      {/* Status Column */}
      <TableCell>
        <div className="flex items-center justify-center gap-3">
          <Switch
            checked={category.isActive}
            onCheckedChange={() => onToggleStatus(category.id)}
          />
          <span 
            className="text-sm font-medium"
            style={{ color: category.isActive ? '#00a63e' : '#6a7282' }}
          >
            {category.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </TableCell>

      {/* Actions Column */}
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(category.id)}
            className="text-gray-600"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(category.id)}
            className="text-gray-600"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
              e.currentTarget.style.color = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.color = '';
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

