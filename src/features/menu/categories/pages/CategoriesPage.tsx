import React, { useState } from 'react';
import { AddCategoryDialog, CategoryActionBar, CategoryStats, CategoriesTable } from '../components';
import { EditCategoryDialog } from '../components/dialogs/EditCategoryDialog';
import type { Category, CategoryFormData } from '../types/category.types';

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
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
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
    const category = categories.find(cat => cat.id === id);
    if (category) {
      setEditingCategory(category);
    }
  };

  const handleUpdateCategory = (id: number, updatedCategoryData: CategoryFormData) => {
    setCategories(categories.map(cat =>
      cat.id === id 
        ? { ...cat, ...updatedCategoryData }
        : cat
    ));
    setEditingCategory(null);
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
      <CategoryActionBar onAddCategory={() => setShowAddDialog(true)} />

      <CategoriesTable
        categories={categories}
        draggedItem={draggedItem}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onToggleStatus={handleToggleStatus}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoryStats categories={categories} />

      <AddCategoryDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddCategory={handleAddCategory}
      />

      {/* Edit Category Dialog */}
      {editingCategory && (
        <EditCategoryDialog
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          category={editingCategory}
          onUpdateCategory={handleUpdateCategory}
        />
      )}
    </div>
  );
}

