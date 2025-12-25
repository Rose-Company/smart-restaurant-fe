import React, { useState } from 'react';
import { GripVertical, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '../../../../components/ui/misc/button';
import { Switch } from '../../../../components/ui/forms/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/data-display/table';
import { AddCategoryDialog } from '../components/dialogs/AddCategoryDialog';
import type { Category, CategoryFormData } from '../types/category.types';

// Brand color constant
const BRAND_COLOR = '#27ae60';
const BRAND_COLOR_HOVER = '#229954';

const initialCategories: Category[] = [
  {
    id: 1,
    name: 'Appetizers',
    description: 'Start your meal with our delicious starters',
    itemCount: 8,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 2,
    name: 'Main Course',
    description: 'Hearty and satisfying main dishes',
    itemCount: 15,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 3,
    name: 'Desserts',
    description: 'Sweet treats to end your meal',
    itemCount: 6,
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 4,
    name: 'Beverages',
    description: 'Refreshing drinks and cocktails',
    itemCount: 12,
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 5,
    name: 'Side Dishes',
    description: 'Perfect complements to your main course',
    itemCount: 7,
    isActive: false,
    displayOrder: 5,
  },
];

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();

    if (draggedItem === null || draggedItem === targetId) return;

    const draggedIndex = categories.findIndex(cat => cat.id === draggedItem);
    const targetIndex = categories.findIndex(cat => cat.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newCategories = [...categories];
    const [removed] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(targetIndex, 0, removed);

    // Update display order
    newCategories.forEach((cat, index) => {
      cat.displayOrder = index + 1;
    });

    setCategories(newCategories);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleToggleStatus = (id: number) => {
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const handleAddCategory = (newCategoryData: CategoryFormData) => {
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    const newCategory: Category = {
      ...newCategoryData,
      id: newId,
      displayOrder: categories.length + 1,
    };
    setCategories([...categories, newCategory]);
    setShowAddDialog(false);
  };

  const handleEdit = (id: number) => {
    alert(`Edit category ${id} - Feature coming soon`);
  };

  const handleDelete = (id: number) => {
    const category = categories.find(cat => cat.id === id);
    if (category && category.itemCount > 0) {
      if (!confirm(`This category has ${category.itemCount} items. Are you sure you want to delete it?`)) {
        return;
      }
    }
    setCategories(categories.filter(cat => cat.id !== id));
  };

  return (
    <div>
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">Manage menu categories and their display order</p>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="text-white"
          style={{ backgroundColor: BRAND_COLOR }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = BRAND_COLOR_HOVER;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = BRAND_COLOR;
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories List */}
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
                  <TableRow
                    key={category.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, category.id)}
                    onDragOver={(e) => handleDragOver(e, category.id)}
                    onDragEnd={handleDragEnd}
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
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                        {category.itemCount}
                      </span>
                    </TableCell>

                    {/* Status Column */}
                    <TableCell>
                      <div className="flex items-center justify-center gap-3">
                        <Switch
                          checked={category.isActive}
                          onCheckedChange={() => handleToggleStatus(category.id)}
                        />
                        <span className={`text-sm font-medium ${category.isActive ? 'text-green-600' : 'text-gray-500'}`}>
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
                          onClick={() => handleEdit(category.id)}
                          className="hover:bg-gray-100 text-gray-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                          className="hover:bg-red-50 hover:text-red-600 text-gray-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Category Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="px-6 py-6 bg-white rounded-lg shadow-sm border border-gray-200 ">
          <p className="text-sm text-gray-500 mb-2">Total Categories</p>
          <p className="text-4xl font-semibold text-gray-900 leading-none">{categories.length}</p>
        </div>
        <div className="px-6 py-6 bg-white rounded-lg shadow-sm border border-gray-200 ">
          <p className="text-sm text-gray-600 mb-2">Active Categories</p>
          <p className="text-3xl font-bold text-gray-900">{categories.filter(c => c.isActive).length}</p>
        </div>
        <div className="px-6 py-6 bg-white rounded-lg shadow-sm border border-gray-200 ">
          <p className="text-sm text-gray-600 mb-2">Total Items</p>
          <p className="text-3xl font-bold text-gray-900">{categories.reduce((sum, c) => sum + c.itemCount, 0)}</p>
        </div>
      </div>

      {/* Add Category Dialog */}
      <AddCategoryDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddCategory={handleAddCategory}
      />
    </div>
  );
}

