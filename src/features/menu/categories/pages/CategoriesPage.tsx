import React, { useState, useEffect } from 'react';
import { AddCategoryDialog, CategoryActionBar, CategoryStats, CategoriesTable } from '../components';
import { EditCategoryDialog } from '../components/dialogs/EditCategoryDialog';
import { categoryApi } from '../services/category.api';
import type { Category, CategoryFormData } from '../types/category.types';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await categoryApi.list();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = async (e: React.DragEvent, targetId: number) => {
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

    // Update order on backend
    try {
      await categoryApi.updateOrder(draggedItem, targetIndex + 1);
    } catch (err) {
      console.error('Error updating category order:', err);
      await loadCategories();
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleToggleStatus = async (id: number) => {
    const category = categories.find(cat => cat.id === id);
    if (!category) return;

    const newStatus = !category.isActive;

    try {
      const updated = await categoryApi.updateStatus(id, newStatus, category.displayOrder);
      setCategories(categories.map(cat => cat.id === id ? updated : cat));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update category status');
      console.error('Error updating category status:', err);
      await loadCategories();
    }
  };

  const handleAddCategory = async (newCategoryData: CategoryFormData) => {
    try {
      await categoryApi.create({
        name: newCategoryData.name,
        description: newCategoryData.description,
        is_active: newCategoryData.isActive,
        display_order: categories.length + 1,
      });
      await loadCategories();
      setShowAddDialog(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create category');
      console.error('Error creating category:', err);
    }
  };

  const handleEdit = (id: number) => {
    const category = categories.find(cat => cat.id === id);
    if (category) {
      setEditingCategory(category);
    }
  };

  const handleUpdateCategory = async (id: number, updatedCategoryData: CategoryFormData) => {
    try {
      const category = categories.find(cat => cat.id === id);
      await categoryApi.update(id, {
        name: updatedCategoryData.name,
        description: updatedCategoryData.description,
        is_active: updatedCategoryData.isActive,
        status: updatedCategoryData.isActive ? 'active' : 'inactive',
        display_order: category?.displayOrder || 0,
      });
      await loadCategories();
      setEditingCategory(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update category');
      console.error('Error updating category:', err);
    }
  };

  const handleDelete = async (id: number) => {
    const category = categories.find(cat => cat.id === id);
    if (category && category.itemCount > 0) {
      if (!confirm(`This category has ${category.itemCount} items. Are you sure you want to delete it?`)) {
        return;
      }
    }

    try {
      await categoryApi.delete(id);
      await loadCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete category');
      console.error('Error deleting category:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
        <p className="text-gray-500">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: '400px' }}>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadCategories}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

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

