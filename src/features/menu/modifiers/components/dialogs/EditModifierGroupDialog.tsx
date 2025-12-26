import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '../../../../../components/ui/misc/button';
import { Input } from '../../../../../components/ui/forms/input';
import { Textarea } from '../../../../../components/ui/forms/textarea';
import { Label } from '../../../../../components/ui/forms/label';
import type { 
  ModifierGroup, 
  ModifierSelectionType, 
  ModifierRequirement, 
  ModifierOption 
} from '../../types/modifier.types';

const BRAND_COLOR = '#27ae60';
const BRAND_COLOR_HOVER = '#229954';

interface EditModifierGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  group: ModifierGroup | null;
  onUpdateGroup: (id: number, groupData: {
    name: string;
    description: string;
    selectionType: ModifierSelectionType;
    requirement: ModifierRequirement;
    options: ModifierOption[];
  }) => void;
}

export function EditModifierGroupDialog({
  isOpen,
  onClose,
  group,
  onUpdateGroup,
}: EditModifierGroupDialogProps) {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectionType, setSelectionType] = useState<ModifierSelectionType>('Multi Select');
  const [requirement, setRequirement] = useState<ModifierRequirement>('Required');
  const [options, setOptions] = useState<ModifierOption[]>([
    { id: '1', name: '', priceAdjustment: 0 },
  ]);

  // Load group data when dialog opens or group changes
  useEffect(() => {
    if (isOpen && group) {
      setGroupName(group.name || '');
      setDescription(group.description || '');
      setSelectionType(group.selectionType || 'Multi Select');
      setRequirement(group.requirement || 'Required');
      setOptions(group.options && group.options.length > 0 
        ? group.options 
        : [{ id: '1', name: '', priceAdjustment: 0 }]
      );
    }
  }, [isOpen, group]);

  const handleAddOption = () => {
    const newOption: ModifierOption = {
      id: String(Date.now()),
      name: '',
      priceAdjustment: 0,
    };
    setOptions([...options, newOption]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length > 1) {
      setOptions(options.filter(opt => opt.id !== id));
    } else {
      alert('At least one option is required');
    }
  };

  const handleOptionChange = (id: string, field: 'name' | 'priceAdjustment', value: string | number) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, [field]: value } : option
      )
    );
  };

  const handleSubmit = () => {
    // Validate
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    const validOptions = options.filter((opt) => opt.name.trim() !== '');
    if (validOptions.length === 0) {
      alert('Please add at least one option');
      return;
    }

    if (!group) return;

    onUpdateGroup(group.id, {
      name: groupName,
      description,
      selectionType,
      requirement,
      options: validOptions,
    });

    onClose();
  };

  if (!isOpen || !group) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: '768px', maxHeight: '85vh' }}
      >
        {/* Header */}
        <div
          className="border-b border-gray-200 flex items-center justify-between flex-shrink-0"
          style={{ padding: '24px' }}
        >
          <div>
            <h2 className="text-base font-normal text-gray-900" style={{ marginBottom: '4px' }}>
              Edit Modifier Group
            </h2>
            <p className="text-sm text-gray-600">
              Update customization option for menu items
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
            style={{ width: '36px', height: '32px' }}
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ padding: '24px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Group Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label className="text-sm font-medium text-gray-700">
                Group Name <span className="text-red-600">*</span>
              </Label>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., Pizza Sizes, Drink Toppings, Steak Temperature"
                className="bg-gray-50 border-gray-300"
              />
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label className="text-sm font-medium text-gray-700">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this modifier group..."
                className="bg-gray-50 border-gray-300"
                rows={3}
              />
            </div>

            {/* Selection Type */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Label className="text-sm font-medium text-gray-700">Selection Type</Label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {/* Single Select */}
                <button
                  type="button"
                  onClick={() => setSelectionType('Single Select')}
                  className="flex items-center justify-between rounded-lg p-4 transition-all cursor-pointer"
                  style={{
                    border: selectionType === 'Single Select' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    backgroundColor: selectionType === 'Single Select' ? '#eff6ff' : 'white',
                  }}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-sm font-medium text-gray-900">Single Select</span>
                    <span className="text-xs text-gray-600">One option only</span>
                  </div>
                  <div
                    className="rounded px-2.5 py-1.5 text-xs font-medium"
                    style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                    }}
                  >
                    Single
                  </div>
                </button>

                {/* Multi Select */}
                <button
                  type="button"
                  onClick={() => setSelectionType('Multi Select')}
                  className="flex items-center justify-between rounded-lg p-4 transition-all cursor-pointer"
                  style={{
                    border: selectionType === 'Multi Select' ? '2px solid #a855f7' : '2px solid #e5e7eb',
                    backgroundColor: selectionType === 'Multi Select' ? '#faf5ff' : 'white',
                  }}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-sm font-medium text-gray-900">Multi Select</span>
                    <span className="text-xs text-gray-600">Multiple options</span>
                  </div>
                  <div
                    className="rounded px-2.5 py-1.5 text-xs font-medium"
                    style={{
                      backgroundColor: '#f3e8ff',
                      color: '#7c3aed',
                    }}
                  >
                    Multiple
                  </div>
                </button>
              </div>
            </div>

            {/* Requirement */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Label className="text-sm font-medium text-gray-700">Requirement</Label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {/* Required */}
                <button
                  type="button"
                  onClick={() => setRequirement('Required')}
                  className="flex items-center justify-between rounded-lg p-4 transition-all cursor-pointer"
                  style={{
                    border: requirement === 'Required' ? '2px solid #ef4444' : '2px solid #e5e7eb',
                    backgroundColor: requirement === 'Required' ? '#fef2f2' : 'white',
                  }}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-sm font-medium text-gray-900">Required</span>
                    <span className="text-xs text-gray-600">Must select</span>
                  </div>
                  <div
                    className="rounded px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                    }}
                  >
                    Required
                  </div>
                </button>

                {/* Optional */}
                <button
                  type="button"
                  onClick={() => setRequirement('Optional')}
                  className="flex items-center justify-between rounded-lg p-4 transition-all cursor-pointer"
                  style={{
                    border: requirement === 'Optional' ? '2px solid #6b7280' : '2px solid #e5e7eb',
                    backgroundColor: requirement === 'Optional' ? '#f9fafb' : 'white',
                  }}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-sm font-medium text-gray-900">Optional</span>
                    <span className="text-xs text-gray-600">Can skip</span>
                  </div>
                  <div
                    className="rounded px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: '#f3f4f6',
                      color: '#4b5563',
                    }}
                  >
                    Optional
                  </div>
                </button>
              </div>
            </div>

            {/* Modifier Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">
                  Modifier Options <span className="text-red-600">*</span>
                </Label>
                <Button
                  onClick={handleAddOption}
                  variant="outline"
                  size="sm"
                  className="text-sm"
                  style={{
                    borderColor: BRAND_COLOR,
                    color: BRAND_COLOR,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0fdf4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>

              {/* Options List */}
              <div
                className="border border-gray-200 rounded-lg"
                style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}
              >
                {options.map((option, index) => (
                  <div key={option.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Option Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-600">
                          Option {index + 1} Name
                        </Label>
                        {options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(option.id)}
                            className="text-red-600 hover:text-red-700 text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <Input
                        value={option.name}
                        onChange={(e) => handleOptionChange(option.id, 'name', e.target.value)}
                        placeholder="e.g., Small, Medium, Large"
                        className="bg-gray-50 border-gray-300"
                      />
                    </div>

                    {/* Price Adjustment */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <Label className="text-sm font-medium text-gray-600">Price Adjustment</Label>
                      <div className="relative">
                        <span
                          className="absolute left-3 text-gray-500"
                          style={{ top: '50%', transform: 'translateY(-50%)' }}
                        >
                          $
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          value={option.priceAdjustment}
                          onChange={(e) =>
                            handleOptionChange(option.id, 'priceAdjustment', parseFloat(e.target.value) || 0)
                          }
                          className="py-2 px-6 bg-gray-50 border-gray-300 pl-7"
                        />
                      </div>
                    </div>

                    {/* Divider */}
                    {index < options.length - 1 && (
                      <div className="border-t border-gray-100" style={{ marginTop: '4px' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Example Info Box */}
            <div
              className="rounded-lg border"
              style={{
                backgroundColor: '#eff6ff',
                borderColor: '#bedbff',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <p className="text-sm text-blue-900">💡 Example Modifier Groups:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p className="text-sm text-blue-700">
                  • <strong>Pizza Sizes:</strong> Small (+$0), Medium (+$4), Large (+$8) - Single Select, Required
                </p>
                <p className="text-sm text-blue-700">
                  • <strong>Toppings:</strong> Pepperoni (+$2), Mushrooms (+$1.5), Olives (+$1.5) - Multi Select, Optional
                </p>
                <p className="text-sm text-blue-700">
                  • <strong>Temperature:</strong> Rare, Medium, Well Done (all +$0) - Single Select, Required
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="border-t border-gray-200 flex items-center justify-end flex-shrink-0"
          style={{ padding: '16px 24px', gap: '12px' }}
        >
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-300 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="text-white"
            style={{ backgroundColor: BRAND_COLOR }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = BRAND_COLOR_HOVER;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = BRAND_COLOR;
            }}
          >
            Update Group
          </Button>
        </div>
      </div>
    </div>
  );
}

