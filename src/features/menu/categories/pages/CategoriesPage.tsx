import React, { useState } from "react";
import {
  AddCategoryDialog,
  CategoryActionBar,
  CategoryStats,
  CategoriesTable,
} from "../components";
import { EditCategoryDialog } from "../components/dialogs/EditCategoryDialog";
import type { Category, CategoryFormData } from "../types/category.types";

type CategoriesPageProps = {
  categories: Category[];
  onAddCategory: (data: CategoryFormData) => Promise<void>;
  onUpdateCategory: (id: number, data: CategoryFormData) => Promise<void>;
  onToggleStatus: (id: number) => Promise<void>;
  onUpdateOrder: (draggedId: number, targetIndex: number) => Promise<void>;
};

export function CategoriesPage({
  categories,
  onAddCategory,
  onUpdateCategory,
  onToggleStatus,
  onUpdateOrder,
}: CategoriesPageProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [newOrder, setNewOrder] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = async (e: React.DragEvent, targetId: number) => {
    e.preventDefault();

    if (draggedItem === null || draggedItem === targetId) return;

    const targetIndex = categories.findIndex((cat) => cat.id === targetId);
    if (targetIndex === -1) return;
    setNewOrder(targetIndex);
    //await onUpdateOrder(draggedItem, targetIndex);
  };

  const handleDragEnd = () => {
    if (draggedItem === null || newOrder === null) {
      setDraggedItem(null);
      return;
    }
    try {
      onUpdateOrder(
        draggedItem,
        newOrder,
      );
    } finally {
      setDraggedItem(null);
      setNewOrder(null);
    }
  };

  const handleAddCategory = async (data: CategoryFormData) => {
    await onAddCategory(data);
    setShowAddDialog(false);
  };

  const handleEdit = (id: number) => {
    const category = categories.find((cat) => cat.id === id);
    if (category) {
      setEditingCategory(category);
    }
  };

  const handleUpdateCategory = async (id: number, data: CategoryFormData) => {
    await onUpdateCategory(id, data);
    setEditingCategory(null);
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
        onToggleStatus={onToggleStatus}
        onEdit={handleEdit}
      />

      <CategoryStats categories={categories} />

      <AddCategoryDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddCategory={handleAddCategory}
      />

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
