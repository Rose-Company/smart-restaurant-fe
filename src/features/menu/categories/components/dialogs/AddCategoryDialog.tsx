import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../../../components/ui/misc/button';
import { Input } from '../../../../../components/ui/forms/input';
import { Label } from '../../../../../components/ui/forms/label';
import { Textarea } from '../../../../../components/ui/forms/textarea';
import { Switch } from '../../../../../components/ui/forms/switch';
import type { CategoryFormData } from '../../types/category.types';

// Brand color constant
const BRAND_COLOR = '#27ae60';
const BRAND_COLOR_HOVER = '#229954';

interface AddCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (categoryData: CategoryFormData) => void;
}

export function AddCategoryDialog({ isOpen, onClose, onAddCategory }: AddCategoryDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a category name');
      return;
    }

    onAddCategory({
      name: name.trim(),
      description: description.trim(),
      itemCount: 0,
      isActive,
    });

    // Reset form
    setName('');
    setDescription('');
    setIsActive(true);
    onClose();
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setIsActive(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Add New Category</h2>
            <p className="text-sm text-gray-600 mt-1">Create a new menu category</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="categoryName" className="text-gray-700">
              Category Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="categoryName"
              placeholder="e.g., Beverages, Appetizers, Desserts"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-300"
              style={{
                '--tw-ring-color': BRAND_COLOR,
              } as React.CSSProperties & { '--tw-ring-color': string }}
              onFocus={(e) => {
                e.target.style.borderColor = BRAND_COLOR;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '';
              }}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2 ">
            <Label htmlFor="categoryDescription" className="text-gray-700">
              Description
            </Label>
            <Textarea
              id="categoryDescription"
              placeholder="Brief description of this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-gray-300 min-h-[100px] resize-none"
              style={{
                '--tw-ring-color': BRAND_COLOR,
              } as React.CSSProperties & { '--tw-ring-color': string }}
              onFocus={(e) => {
                e.target.style.borderColor = BRAND_COLOR;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '';
              }}
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="categoryStatus" className="text-gray-900 cursor-pointer">
                Category Status
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                {isActive ? 'Category will be visible to customers' : 'Category will be hidden'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="categoryStatus"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <span className={`text-sm ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900 mb-1">💡 Tips</p>
            <ul className="text-sm text-blue-700 space-y-1 ml-4 list-disc">
              <li>Choose clear, descriptive names for your categories</li>
              <li>You can reorder categories using drag-and-drop after creation</li>
              <li>New categories start with 0 items until you add menu items to them</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-6 border-t border-gray-200 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-gray-300 hover:bg-gray-50 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="text-white"
            style={{ backgroundColor: BRAND_COLOR }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = BRAND_COLOR_HOVER;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = BRAND_COLOR;
            }}
          >
            Add Category
          </Button>
        </div>
      </div>
    </div>
  );
}

