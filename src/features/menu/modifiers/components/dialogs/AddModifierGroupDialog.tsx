import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '../../../../../components/ui/misc/button';
import { Input } from '../../../../../components/ui/forms/input';
import { Textarea } from '../../../../../components/ui/forms/textarea';
import { Label } from '../../../../../components/ui/forms/label';
import type { ModifierSelectionType, ModifierOption } from '../../types/modifier.types';

const BRAND_COLOR = '#27ae60';
const BRAND_COLOR_HOVER = '#229954';

interface AddModifierGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGroup: (groupData: {
    name: string;
    description: string;
    selectionType: ModifierSelectionType;
    is_required: boolean;
    options: ModifierOption[];
  }) => void;
}

export function AddModifierGroupDialog({
  isOpen,
  onClose,
  onAddGroup,
}: AddModifierGroupDialogProps) {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectionType, setSelectionType] = useState<ModifierSelectionType>('multiple');
  const [is_required, setIs_required] = useState(false);
  const [options, setOptions] = useState<ModifierOption[]>([
    { id: '1', name: '', priceAdjustment: 0, status: 'active' },
  ]);

  const handleAddOption = () => {
    const newOption: ModifierOption = {
      id: String(options.length + 1),
      name: '',
      priceAdjustment: 0,
      status: 'active',
    };
    setOptions([...options, newOption]);
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

    const validOptions = options
      .filter((opt) => opt.name && opt.name.trim() !== '')
      .map((opt) => ({
        ...opt,
        name: (opt.name || '').trim(),
        priceAdjustment: opt.priceAdjustment || 0,
        status: (opt.status === 'active' || opt.status === 'inactive') ? opt.status : 'active',
      }));
    if (validOptions.length === 0) {
      alert('Please add at least one option');
      return;
    }

    onAddGroup({
      name: groupName.trim(),
      description: description.trim(),
      selectionType,
      is_required,
      options: validOptions,
    });

    // Reset form
    setGroupName('');
    setDescription('');
    setSelectionType('multiple');
    setIs_required(false);
    setOptions([{ id: '1', name: '', priceAdjustment: 0, status: 'active' }]);
  };

  if (!isOpen) return null;

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
              Create New Modifier Group
            </h2>
            <p className="text-sm text-gray-600">
              Add a new customization option for menu items
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
                  onClick={() => setSelectionType('single')}
                  className="flex items-center justify-between rounded-lg p-4 transition-all cursor-pointer"
                  style={{
                    border: selectionType === 'single' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    backgroundColor: selectionType === 'single' ? '#eff6ff' : 'white',
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

                {/* multiple Select */}
                <button
                  type="button"
                  onClick={() => setSelectionType('multiple')}
                  className="flex items-center justify-between rounded-lg p-4 transition-all cursor-pointer"
                  style={{
                    border: selectionType === 'multiple' ? '2px solid #a855f7' : '2px solid #e5e7eb',
                    backgroundColor: selectionType === 'multiple' ? '#faf5ff' : 'white',
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
                  onClick={() => setIs_required(true)}
                  className="flex items-center justify-between rounded-lg p-4 transition-all cursor-pointer"
                  style={{
                    border: is_required ? '2px solid #ef4444' : '2px solid #e5e7eb',
                    backgroundColor: is_required ? '#fef2f2' : 'white',
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
                  onClick={() => setIs_required(false)}
                  className="flex items-center justify-between rounded-lg p-4 transition-all cursor-pointer"
                  style={{
                    border: !is_required ? '2px solid #6b7280' : '2px solid #e5e7eb',
                    backgroundColor: !is_required ? '#f9fafb' : 'white',
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
                      <Label className="text-sm font-medium text-gray-600">
                        Option {index + 1} Name
                      </Label>
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
            Create Group
          </Button>
        </div>
      </div>
    </div>
  );
}

