import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui/misc/button';
import { Badge } from '../../../../components/ui/data-display/badge';
import type { ModifierGroup } from '../types/modifier.types';

const BRAND_COLOR = '#27ae60';

interface ModifierGroupCardProps {
  group: ModifierGroup;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ModifierGroupCard({ group, onEdit, onDelete }: ModifierGroupCardProps) {
  return (
    <div 
      key={group.id} 
      className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col" 
      style={{ overflow: 'hidden', minHeight: '350px' }}
    >
      {/* Card Header */}
      <div className="border-b border-gray-100" style={{ padding: '20px' }}>
        <h3 className="text-base font-medium text-gray-900" style={{ marginBottom: '8px' }}>
          {group.name}
        </h3>
        <p className="text-sm text-gray-600" style={{ marginBottom: '12px' }}>
          {group.description}
        </p>
        
        {/* Badges */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            style={
              group.selectionType === 'Single Select'
                ? { backgroundColor: '#dbeafe', color: '#1d4ed8', borderColor: '#93c5fd' }
                : { backgroundColor: '#f3e8ff', color: '#7c3aed', borderColor: '#d8b4fe' }
            }
          >
            {group.selectionType}
          </Badge>
          <Badge
            variant="outline"
            style={
              group.requirement === 'Required'
                ? { backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }
                : { backgroundColor: '#f3f4f6', color: '#4b5563', borderColor: '#d1d5db' }
            }
          >
            {group.requirement}
          </Badge>
        </div>
      </div>

      {/* Options Preview */}
      <div className="flex-1" style={{ padding: '20px' }}>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide" style={{ marginBottom: '12px' }}>
          Options Preview
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {group.options.slice(0, 3).map((option) => (
            <div 
              key={option.id} 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%',
                    backgroundColor: BRAND_COLOR 
                  }}
                />
                <span className="text-sm text-gray-700">{option.name}</span>
              </div>
              <span className="text-sm text-gray-500">
                {option.priceAdjustment === 0 ? '+$0' : `+$${option.priceAdjustment.toFixed(2)}`}
              </span>
            </div>
          ))}
          {group.hiddenOptionsCount && group.hiddenOptionsCount > 0 && (
            <p className="text-xs italic text-gray-400" style={{ marginTop: '8px' }}>
              +{group.hiddenOptionsCount} more option{group.hiddenOptionsCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-gray-100 flex items-center" style={{ padding: '16px', gap: '8px' }}>
        <Button
          variant="outline"
          className="flex-1 border-gray-300"
          onClick={() => onEdit(group.id)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f0fdf4';
            e.currentTarget.style.color = BRAND_COLOR;
            e.currentTarget.style.borderColor = BRAND_COLOR;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
            e.currentTarget.style.color = '';
            e.currentTarget.style.borderColor = '';
          }}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Group
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-300"
          onClick={() => onDelete(group.id)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
            e.currentTarget.style.color = '#dc2626';
            e.currentTarget.style.borderColor = '#fecaca';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
            e.currentTarget.style.color = '';
            e.currentTarget.style.borderColor = '';
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

